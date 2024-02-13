package contacts

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Online(contactUUId string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	err := broker.MessageBrokerClient.ContactSetOnline(contactUUId)

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeSetContactOnline,
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
