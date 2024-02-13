package conversations

import (
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func MarkAsSeen(conversationId string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	err := broker.MessageBrokerClient.ConversationMarkAsSeen(conversationId)
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}
	return nil
}
