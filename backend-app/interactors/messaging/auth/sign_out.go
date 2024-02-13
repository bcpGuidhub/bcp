package auth

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func SignOut(sessionUUID string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {

	_, err := redis.MessageBrokerClient.ContactGet(msg.SenderUUID)
	if err != nil {
		return message.NewErrorMessage(errCodeSignOut, err)
	}

	redis.MessageBrokerClient.ContactSignOut(msg.SenderUUID)

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeSignOut,
		Auth: &message.Auth{
			SignOut: &message.SignOut{
				UUID: msg.Auth.SignOut.UUID,
			},
		},
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
