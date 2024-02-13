package conversations

import (
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Join(sessionUUID string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) (*redis.ChannelPubSub, message.IErrorMessage) {

	errI := Leave(sessionUUID, write, &message.Message{
		SUUID:      msg.SUUID,
		Type:       message.MessageTypeConversationLeave,
		SenderUUID: msg.SenderUUID,
		Channel: &message.Channel{
			Leave: &message.ChannelLeave{
				ConversationUUID: msg.Channel.Join.ConversationUUID,
			},
		},
	})

	if errI != nil && errI.ErrorMessage() != "channel not found" {
		return nil, errI
	}

	channelPubSub, _, err := redis.MessageBrokerClient.ChannelJoin(msg.Channel.Join.ConversationUUID)
	if err != nil {
		return nil, message.NewErrorMessage(101, err)
	}

	if err != nil {
		return nil, message.NewErrorMessage(111, err)
	}

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeConversationJoin,
		Channel: &message.Channel{
			Join: &message.ChannelJoin{
				ConversationUUID: msg.Channel.Join.ConversationUUID,
			},
		},
	})
	if err != nil {
		return nil, message.NewErrorMessage(104, err)
	}

	return channelPubSub, nil
}
