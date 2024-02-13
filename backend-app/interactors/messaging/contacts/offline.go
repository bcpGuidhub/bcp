package contacts

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Offline(contactUUId string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	broker.MessageBrokerClient.ContactSetOffline(contactUUId)

	err := write(conn, op, &message.Message{
		Type: message.MessageTypeSetContactOffline,
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
