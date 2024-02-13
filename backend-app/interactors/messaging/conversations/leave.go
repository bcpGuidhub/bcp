package conversations

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Leave(sessionUUID string, write message.Write, msg *message.Message) message.IErrorMessage {

	_, err := redis.MessageBrokerClient.ChannelLeave(msg.Channel.Leave.ConversationUUID)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}
	return nil
}
