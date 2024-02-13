// Package collider implements a signaling server based on WebSocket.
package collider

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

var mutex sync.RWMutex

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return conn, nil
}

// This is a temporary solution to avoid holding a zombie connection forever, by
// setting a 1 day timeout on reading from the WebSocket connection.
const wsReadTimeoutSec = 60 * 60 * 24

type Collider struct {
	IBoardRoom
}

func NewCollider(projectId string) *Collider {
	b := newRedisBoardRoom(projectId)
	return &Collider{
		b,
	}
}

// Run starts the collider server and blocks the thread until the program exits.
func (c *Collider) Run(cGin *gin.Context, projectId string) {
	conn, err := upgrade(cGin.Writer, cGin.Request)
	if err != nil {
		log.Fatalf("error starting the webrtc websocket error: %s", err.Error())
	}
	errChan := make(chan error, 1)
	c.wsHandler(conn, projectId, errChan)
	if err = <-errChan; err != nil {
		log.Println(err)
	}
}

func (c *Collider) wsHandler(conn *websocket.Conn, projectId string, initErr chan error) {
	var clientId string
	pubSubChannel := new(redis.ChannelPubSub)
	sessionUUID, err := c.initBoardRoom()
	if err != nil {
		initErr <- err
		return
	}

	err = c.Write(conn, websocket.TextMessage, c.Ready(sessionUUID))
	if err != nil {
		initErr <- err
		return
	}

	initErr <- nil

	var msg wsClientMsg
loop:
	for {
		err := conn.SetReadDeadline(time.Now().Add(time.Duration(wsReadTimeoutSec) * time.Second))
		if err != nil {
			err := c.Write(conn, websocket.TextMessage, c.Error(errReadDeadline, fmt.Errorf("conn.SetReadDeadline error: %s", err.Error()), sessionUUID, msg))
			if err != nil {
				log.Println(err)
			}
			break loop
		}
		op, data, err := conn.ReadMessage()

		if err != nil {
			err := c.Write(conn, op, c.Error(errwebRTCReadMessage, fmt.Errorf("webRTC:conn.ReadMessage error: %s", err.Error()), sessionUUID, msg))
			if err != nil {
				log.Println(err)
			}
			break loop
		}
		err = json.Unmarshal(data, &msg)

		if err != nil {
			if err.Error() != "EOF" {
				err := c.Write(conn, op, c.Error(errwebsocketJSONReceive, fmt.Errorf("websocket.JSON.Receive error: %s", err.Error()), sessionUUID, msg))
				if err != nil {
					log.Println(err)
				}
			}
			break loop
		}

		var receivedErr IError
		if msg.SessionUUID == "" {
			err := c.Write(conn, op, c.Error(errMissingSessionId, errors.New("missing session uuid"), msg.SessionUUID, msg))
			if err != nil {
				log.Println(err)
			}
			break loop
		}
		log.Println("Received message:", string(data))
		switch MessageType(msg.Cmd) {
		case MessageTypeBoardRoomJoin:
			clientId = msg.ClientID
			pubSubChannel, receivedErr = c.joinBoardRoom(msg.ClientID)
			if pubSubChannel != nil && receivedErr == nil {
				go c.broadCast(conn, pubSubChannel, c.Write)
				receivedErr = c.JoinBoardRoom(sessionUUID, msg.ClientID)
			} else {
				if receivedErr.ErrorMessage() == "channel closed with timeout" {
					log.Printf("collider::: trying to create a pubsub channel again :=== %v", receivedErr)

					pubSubChannel, receivedErr = c.joinBoardRoom(msg.ClientID)
					if pubSubChannel != nil {
						go c.broadCast(conn, pubSubChannel, c.Write)
					}
				} else {
					log.Printf("collider::: error failed againh trying to create a pubsub channel again :=== %v", receivedErr)
				}
			}
			defer c.leaveBoardRoom(msg)
		case MessageTypeBoardRoomMessages:
			var messages []BoardRoomMessage
			messages, receivedErr = c.boardRoomGetMessages()
			c.Write(conn, op, c.BoardRoomMessages(sessionUUID, msg.ClientID, messages))
		case MessageTypePeerOfferSignaling, MessageTypePeerAnswerSignaling, MessageTypePeerIceCandidateSignaling:
			c.Signaling(msg)
		case MessageTypeConversationMessage:
			if pubSubChannel.NilPubSub() {
				pubSubChannel, receivedErr = c.joinBoardRoom(clientId)
				if pubSubChannel != nil && receivedErr == nil {
					go c.broadCast(conn, pubSubChannel, c.Write)
				}
			}
			receivedErr = c.boardRoomConversations(msg, data)
		case MessageTypeBoardRoomLeave:
			receivedErr = c.leaveBoardRoom(msg)
		default:
			err := c.Write(conn, op, c.Error(errUnknownCommandType, fmt.Errorf("unknow request message command: %s", msg.Cmd), sessionUUID, msg))
			if err != nil {
				log.Println(err)
				continue
			}
		}

		if receivedErr != nil {
			log.Println(receivedErr)
			code, err := receivedErr.Error()
			err = c.Write(conn, op, c.Error(code, err, sessionUUID, string(data)))
			log.Println(err)
		}
	}
	conn.Close()
}

func (c *Collider) Error(code uint32, err error, sessionUID string, payload interface{}) *Message {
	return &Message{
		SessionUUID: sessionUID,
		Type:        MessageTypeError,
		Error: &DataError{
			Code:    code,
			Error:   err.Error(),
			Payload: payload,
		},
	}
}

func (c *Collider) Write(conn *websocket.Conn, msgOp int, message interface{}) error {
	data, err := json.Marshal(message)
	if err != nil {
		return err
	}
	mutex.Lock()
	err = conn.WriteMessage(msgOp, data)
	defer mutex.Unlock()
	return err
}

func (c *Collider) Ready(sessionUUID string) *Message {
	return &Message{
		Type: MessageTypeReady,
		Ready: &DataReady{
			SessionUUID: sessionUUID,
		},
	}
}

func (c *Collider) JoinBoardRoom(sessionUUID, clientId string) IError {
	seats, receivedErr := c.onlineBoardRoomPeers()
	if receivedErr != nil {
		return receivedErr
	}

	seatedPeersJson, err := json.Marshal(DataJoinBoardRoom{
		SessionUUID:    sessionUUID,
		BoardRoomId:    c.guuid(),
		ClientId:       clientId,
		BoardRoomSeats: seats,
		HasSeat:        true,
		Status:         c.getBoardRoomStatus() == online,
	})
	if err != nil {
		return newError(errCodeJSONMarshal, err)
	}

	data, err := json.Marshal(map[string]string{
		"type":  "peer_joined_board_room",
		"peer":  clientId,
		"seats": string(seatedPeersJson),
	})
	if err != nil {
		return newError(errCodeJSONMarshal, err)
	}

	return c.Signaling(wsClientMsg{
		Cmd:         MessageTypeBoardRoomPeerJoined,
		BoardRoomID: c.guuid(),
		ClientID:    clientId,
		Msg:         string(data),
		SessionUUID: sessionUUID,
	})
}

func (c *Collider) BoardRoomMessages(sessionUUID, clientId string, messages []BoardRoomMessage) *Message {
	return &Message{
		Type: MessageTypeBoardRoomMessages,
		BoardRoomMessages: &DataBoardRoomMessages{
			SessionUUID: sessionUUID,
			BoardRoomId: c.guuid(),
			ClientId:    clientId,
			Messages:    messages,
		},
	}
}

func (c *Collider) Signaling(message wsClientMsg) IError {
	return c.publishMessageToBoardRoom(message)
}

func (c *Collider) broadCast(conn *websocket.Conn, channel *redis.ChannelPubSub, write Write) {
	defer channel.Closed()
	for {
		select {
		case data := <-channel.Channel():
			msg := &BoardRoomMessage{}
			dec := json.NewDecoder(strings.NewReader(data.Payload))
			err := dec.Decode(msg)
			if err != nil {
				log.Println(err)
			} else {
				err := write(conn, websocket.TextMessage, &Message{
					Type:             MessageTypeBoardRoomMessage,
					BoardRoomMessage: msg,
				})
				if err != nil {
					log.Println(err)
				}
			}
		case <-channel.Close():
			log.Println("Close channel")
			return
		}
	}
}
