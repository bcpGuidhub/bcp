package messaging

import (
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Contacts(sessionUUID string, conn *websocket.Conn, op int, write message.Write) message.IErrorMessage {
	values, err := broker.MessageBrokerClient.ContactAll()
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	contacts := make([]message.IModel, len(values))
	for i := range contacts {

		contact := &broker.Contact{
			UUID:   values[i].UUID,
			Email:  values[i].Email,
			Online: broker.MessageBrokerClient.ContactIsOnline(values[i].UUID),
		}
		contacts = append(contacts, contact)
	}

	err = write(conn, op, &message.Message{
		Type:     message.MessageTypeContacts,
		Contacts: &message.Contacts{
			// Total:    len(contacts),
			// Received: len(contacts),
			// Contacts: contacts,
		},
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
