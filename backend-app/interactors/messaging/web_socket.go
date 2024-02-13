package messaging

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/messaging/contacts"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/messaging/conversations"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
)

const (
	errCode uint32 = iota
	errCodeJSONUnmarshal
	errCodeMissingMessageType
	errCodeWSRead
	errCodeWSWrite
	errCodeSignIn
	errCodeSignUp
	errCodeSignOut
	errCodeRedisChannelMessage
	errCodeRedisChannelUsers
	errCodeRedisGetSessionUUID
	errCodeRedisGetUserByUUID
	errCodeRedisChannelJoin
	errCodeUserSetOnline
)

var connectionsSync sync.RWMutex

type Connection struct {
	conn            *websocket.Conn
	userSessionUUID string
}

var connections = map[string]Connection{}

func WebSocketUser(c *gin.Context) {
	projectId := c.Param("id")
	_, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	dao := dao.NewProjectDAO()
	project, err := dao.GetProjectById(projectId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	conn, err := interactors.Upgrade(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	errChan := make(chan error, 1)
	go NewConversationShareConnection(conn, project.ActivitySector, errChan)
	if err = <-errChan; err != nil {
		log.Printf("Error in ConversationShareConnection [%v]", errChan)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func WebSocketStakeholder(c *gin.Context) {

	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	dao := dao.NewProjectDAO()
	project, err := dao.GetProjectById(stakeholder.ProjectId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	conn, err := interactors.Upgrade(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	errChan := make(chan error, 1)

	go NewConversationShareConnection(conn, project.ActivitySector, errChan)
	if err = <-errChan; err != nil {
		log.Printf("Error in ConversationShareConnection [%v]", errChan)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func connectionAdd(conn *websocket.Conn, userSessionUUID string) {
	connectionsSync.Lock()
	connections[userSessionUUID] = Connection{
		userSessionUUID: userSessionUUID,
		conn:            conn,
	}
	connectionsSync.Unlock()
}

func connectionDel(userSessionUUID string) {
	connectionsSync.Lock()
	delete(connections, userSessionUUID)
	connectionsSync.Unlock()
}

func write(conn *websocket.Conn, textMessageOp int, message *message.Message) error {
	connectionsSync.Lock()
	defer connectionsSync.Unlock()
	data, err := json.Marshal(message)
	if err != nil {
		return err
	}
	return conn.WriteMessage(textMessageOp, data)
}

func NewConversationShareConnection(conn *websocket.Conn, activitySector string, errChan chan error) {
	pubSubChannel := new(redis.ChannelPubSub)
	userSessionUUID := uuid.New().String()

	err := redis.MessageBrokerClient.AddConnection(userSessionUUID)
	if err != nil {
		errChan <- err
		return
	}

	defer func() {
		conn.Close()
		err := redis.MessageBrokerClient.DelConnection(userSessionUUID)
		if err != nil {
			log.Println(err)
		}
	}()

	err = write(conn, websocket.TextMessage, &message.Message{
		Type: message.MessageTypeReady,
		Ready: &message.Ready{
			SessionUUID: userSessionUUID,
		},
	})
	if err != nil {
		errChan <- err
		return
	}
	errChan <- nil
	for {
		msg := &message.Message{}
		messagePayload := make(map[string]interface{})

		msgType, data, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			} else {
				log.Printf("Had trouble reading message from socket [%v]", err)
			}
			break
		}

		err = json.Unmarshal(data, &messagePayload)
		if err != nil {
			errMessage := message.ErrorMessage(errCodeMissingMessageType, err, userSessionUUID, nil)
			write(conn, websocket.TextMessage, errMessage)
		}

		log.Printf("message blob :::: [[ %v ]]", messagePayload)

		payloadType, ok := messagePayload["type"]
		if !ok {
			errMessage := message.ErrorMessage(errCodeMissingMessageType, errors.New("missing message type"), userSessionUUID, nil)
			write(conn, websocket.TextMessage, errMessage)
			return
		}

		var receivedErr message.IErrorMessage

		if payloadType == string(message.MessageTypeConversationMessage) {
			channelMessage := messagePayload["channel_message"].(map[string]interface{})
			conversationId, ok := channelMessage["conversation_id"].(string)
			if ok {
				if pubSubChannel.NilPubSub() {
					pubSubChannel, _, err = redis.MessageBrokerClient.ChannelJoin(conversationId)
					go conversations.Receiver(conn, pubSubChannel, write)
					if err != nil {
						log.Printf("error trying to create pubsub [%v]", err)
					}
				}
			}

			receivedErr = conversations.Message(data, userSessionUUID, activitySector, conn, msgType, write, msg)
		} else {

			err = json.Unmarshal(data, msg)
			if err != nil {
				errMessage := message.ErrorMessage(errCodeJSONUnmarshal, err, userSessionUUID, msg)
				log.Printf("Error trying to ummarshal data [%v]", errMessage)
				write(conn, msgType, errMessage)
			}

			switch msg.Type {
			case message.MessageTypeGetConversations:
				receivedErr = conversations.Get(msg.SenderUUID, activitySector, conn, msgType, write, msg)
			case message.MessageTypeGetContacts:
				receivedErr = contacts.Get(msg.SenderUUID, activitySector, conn, msgType, write, msg)
			case message.MessageTypeSetContactOnline:
				receivedErr = contacts.Online(msg.SenderUUID, conn, msgType, write, msg)
			case message.MessageTypeSetContactOffline:
				receivedErr = contacts.Offline(msg.SenderUUID, conn, msgType, write, msg)
			case message.MessageTypeMarkConversationAsSeen:
				receivedErr = conversations.MarkAsSeen(msg.ActiveConversationId, conn, msgType, write, msg)
			case message.MessageTypeGetConversationByUUID:
				receivedErr = conversations.GetByUUID(conn, msgType, write, msg)
			case message.MessageTypeGetConversationByOtherParticipant:
				receivedErr = conversations.GetByOtherParticipant(msg.SenderUUID, msg.ParticipantUUID, conn, msgType, write, msg)
			case message.MessageTypeConversationJoin:
				pubSubChannel, receivedErr = conversations.Join(userSessionUUID, conn, msgType, write, msg)
				log.Printf("joined pubsub channel : %+v", pubSubChannel)
				if pubSubChannel != nil {
					go conversations.Receiver(conn, pubSubChannel, write)
				} else {
					log.Printf("error creating a pubsub :=== %v", receivedErr)
					if receivedErr.ErrorMessage() == "channel closed with timeout" {
						log.Printf("trying to create a pubsub channel again :=== %v", receivedErr)

						pubSubChannel, receivedErr = conversations.Join(userSessionUUID, conn, msgType, write, msg)
						if pubSubChannel != nil {
							go conversations.Receiver(conn, pubSubChannel, write)
						}
					} else {
						log.Printf("error failed againh trying to create a pubsub channel again :=== %v", receivedErr)
					}

				}
			case message.MessageTypeConversationMessages:
				receivedErr = conversations.Messages(userSessionUUID, conn, msgType, write, msg)
			case message.MessageTypeConversationLeave:
				receivedErr = conversations.Leave(userSessionUUID, write, msg)
			default:
				err := write(conn, msgType, message.ErrorMessage(errCode, fmt.Errorf("unknown request message type: %s", msg.Type), msg.SenderUUID, msg))
				if err != nil {
					log.Println(err)
					continue
				}
			}

		}
		if receivedErr != nil {
			log.Println(receivedErr)
			code, err := receivedErr.Error()
			write(conn, websocket.TextMessage, message.ErrorMessage(code, err, userSessionUUID, string(data)))
		}

	}

}
