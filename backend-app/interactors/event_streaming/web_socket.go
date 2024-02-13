package eventstreaming

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/event_streaming/inquisite"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
)

const (
	errCode uint32 = iota
	errCodeJSONUnmarshal
)

func write(conn *websocket.Conn, op int, message *message.Message) error {
	data, err := json.Marshal(message)
	if err != nil {
		return err
	}
	return conn.WriteMessage(op, data)
}

func WebSocketUser(c *gin.Context) {

	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	conn, err := interactors.Upgrade(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	errChan := make(chan error, 1)
	go NewConnection(conn, user, errChan)
	if err = <-errChan; err != nil {
		fmt.Errorf("error from event socket in event streaming --- ERROR [%v]", errChan)

		//	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func WebSocketStakeholder(c *gin.Context) {

	user, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	conn, err := interactors.Upgrade(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	errChan := make(chan error, 1)
	go NewConnection(conn, user, errChan)
	if err = <-errChan; err != nil {
		fmt.Errorf("Error from event socket in event streaming --- ERROR [%v]", errChan)
		//	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func NewConnection(conn *websocket.Conn, aggregate inquisite.IEventAggregate, errChan chan error) {
	sessionUUID := uuid.New().String()

	for {
		var receivedErr message.IErrorMessage
		messagePayload := make(map[string]interface{})
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			errChan <- err
			return
		}
		err = json.Unmarshal(data, &messagePayload)
		if err != nil {
			log.Printf("error reading command: [%v]", err)
			errMessage := message.ErrorMessage(errCodeJSONUnmarshal, err, sessionUUID, messagePayload)
			write(conn, msgType, errMessage)
		}
		cmdType, _ := messagePayload["type"].(string)
		switch commands.CommandType(cmdType) {
		case commands.CommandTypeAddPost:
			receivedErr = inquisite.AddPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeAddAnswerToPost:
			receivedErr = inquisite.AddAnswerToPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeEditPost:
			receivedErr = inquisite.AddRevisionToPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeAddRevisionToAnswer:
			receivedErr = inquisite.AddRevisionToAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeCommentOnPost:
			receivedErr = inquisite.CommentOnPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeCommentOnAnswer:
			receivedErr = inquisite.CommentOnAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeFlagComment:
			receivedErr = inquisite.FlagComment(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractFlagComment:
			receivedErr = inquisite.RetractFlagComment(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeFlagAnswer:
			receivedErr = inquisite.FlagAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractFlagAnswer:
			receivedErr = inquisite.RetractFlagAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeFlagPost:
			receivedErr = inquisite.FlagPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractFlagPost:
			receivedErr = inquisite.RetractFlagPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeVoteUpAnswer:
			receivedErr = inquisite.VoteUpAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractVoteUpAnswer:
			receivedErr = inquisite.RetractVoteUpAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeVoteDownAnswer:
			receivedErr = inquisite.VoteDownAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractVoteDownAnswer:
			receivedErr = inquisite.RetractVoteDownAnswer(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeVoteUpPost:
			receivedErr = inquisite.VoteUpPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractVoteUpPost:
			receivedErr = inquisite.RetractVoteUpPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeVoteDownPost:
			receivedErr = inquisite.VoteDownPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractVoteDownPost:
			receivedErr = inquisite.RetractVoteDownPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeVoteUpComment:
			receivedErr = inquisite.VoteUpComment(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractVoteUpComment:
			receivedErr = inquisite.RetractVoteUpComment(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		case commands.CommandTypeAcceptAnswer:
			receivedErr = inquisite.AcceptAnswerToPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)
		case commands.CommandTypeRetractAcceptAnswer:
			receivedErr = inquisite.RetractAcceptAnswerToPost(sessionUUID, conn, msgType, write, messagePayload, aggregate)

		default:
			err := write(conn, msgType, message.ErrorMessage(errCode, fmt.Errorf("unknown request message type: %s", messagePayload["type"]), sessionUUID, messagePayload))
			if err != nil {
				log.Println(err)
				continue
			}
		}

		if receivedErr != nil {
			log.Println(receivedErr)
			code, err := receivedErr.Error()
			write(conn, websocket.TextMessage, message.ErrorMessage(code, err, sessionUUID, string(data)))
		}

	}
}
