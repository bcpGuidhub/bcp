package conversations

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Messages(sessionUUID string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {

	messages, err := broker.MessageBrokerClient.ConversationGetMessages(msg.ActiveConversationId)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:                 message.MessageTypeConversationMessages,
		ActiveConversationId: msg.ActiveConversationId,
		Messages:             messages,
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
