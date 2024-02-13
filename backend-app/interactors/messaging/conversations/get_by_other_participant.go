package conversations

import (
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func GetByOtherParticipant(userUUID, participant string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {

	conversation, err := broker.MessageBrokerClient.GetByOtherParticipant(userUUID, participant)
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:         message.MessageTypeGetConversationByOtherParticipant,
		Conversation: conversation,
	})
	return nil
}
