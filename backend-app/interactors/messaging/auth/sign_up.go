package auth

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func SignUp(sessionUUID string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	contact, err := redis.MessageBrokerClient.ContactCreate(msg.Auth.SignUp.Email, msg.Auth.SignUp.Password)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeAuthorized,
		Auth: &message.Auth{
			Authorized: &message.Authorized{
				SenderUUID: contact.UUID,
				AccessKey:  contact.AccessKey,
			},
		},
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
