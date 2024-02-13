package contacts

import (
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Get(contactUUId, sector string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	contactsByBusinessSector, err := broker.MessageBrokerClient.ContactsByBusinessSector(sector)
	contactsByInvite, err := broker.MessageBrokerClient.ContactsByInvite(contactUUId)

	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	contacts := make([]message.IModel, 0, len(contactsByInvite))

	for i := range contactsByInvite {
		contacts = append(contacts, contactsByInvite[i])
	}

	c := make([]message.IModel, 0, len(contactsByBusinessSector))

	for i := range contactsByBusinessSector {

		c = append(c, contactsByBusinessSector[i])
	}

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeGetContacts,
		Contacts: &message.Contacts{
			Sector: c,
			Invite: contacts,
		},
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
