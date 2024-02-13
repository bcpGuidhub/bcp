package conversations

import (
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Get(contactUUId, sector string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	conversationByActivity, err := broker.MessageBrokerClient.ConversationByBusinessSector(sector)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}
	values, err := broker.MessageBrokerClient.ConversationsByParticipantId(contactUUId)

	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	conversations := make([]message.IModel, 0, len(values))

	for i := range values {

		conversations = append(conversations, values[i])
	}
	conversations = append([]message.IModel{conversationByActivity}, conversations...)

	err = write(conn, op, &message.Message{
		Type:          message.MessageTypeGetConversations,
		Conversations: conversations,
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
