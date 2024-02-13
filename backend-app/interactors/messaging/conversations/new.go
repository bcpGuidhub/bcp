package conversations

import (
	"errors"

	"github.com/google/uuid"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func New(channelMsg *redis.ChannelMessage, sector string) error {

	if channelMsg.Type == redis.OneToOne {
		if len(channelMsg.RecipientIds) != 1 {
			return errors.New("receipts count error")
		}
	}
	if channelMsg.Type == redis.Group {
		if len(channelMsg.RecipientIds) <= 1 {
			return errors.New("receipts count error")
		}
	}
	conversation := redis.Conversation{
		UUID:        uuid.New().String(),
		Type:        channelMsg.Type,
		UnreadCount: 1,
		CreatedAt:   channelMsg.Message.CreatedAt,
	}

	channelMsg.ConversationId = conversation.UUID

	if conversation.Type == "ACTIVITY" {
		conversation.Sector = sector
		conversation.Participants = make([]redis.Contact, 0)
	} else {
		participants, err := addParticipants(channelMsg)
		if err != nil {
			return err
		}
		conversation.Participants = participants
	}

	return redis.MessageBrokerClient.AddConversation(&conversation)
}

func addParticipants(channelMsg *redis.ChannelMessage) ([]redis.Contact, error) {
	//participants => receipents plus sender
	participants := make([]redis.Contact, 0, len(channelMsg.RecipientIds)+1)
	if channelMsg.Type != "ACTIVITY" {
		contact, err := redis.MessageBrokerClient.ContactGet(channelMsg.Message.SenderId)
		if err != nil {
			return nil, err
		}
		participants = append(participants, *contact)

		for i := range channelMsg.RecipientIds {

			contact, err := redis.MessageBrokerClient.ContactGet(channelMsg.RecipientIds[i])
			if err != nil {
				return nil, err
			}
			participants = append(participants, *contact)
		}
	}

	return participants, nil
}
