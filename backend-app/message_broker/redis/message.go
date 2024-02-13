package redis

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
)

const (
	keyConversationMessages = "conversationMessages"
)

func (broker *MessageBroker) getKeyConversationMessages(conversationId string) string {
	return fmt.Sprintf("%s.%s", keyConversationMessages, conversationId)
}

func (broker *MessageBroker) ConversationGetMessages(conversationId string) ([]message.IModel, error) {

	channelUUID, err := broker.getChannelUUID(conversationId)
	log.Printf("getting messages from channelUUID %s", channelUUID)
	if err != nil {
		return nil, err
	}

	key := broker.getKeyChannelMessages(channelUUID)
	values, err := broker.client.ZRange(context.Background(), key, 0, -1).Result()
	if err != nil {
		return nil, err
	}

	messages := make([]message.IModel, 0, len(values))

	for i := range values {
		message := &Message{}
		dec := json.NewDecoder(strings.NewReader(values[i]))
		err := dec.Decode(message)
		if err != nil {
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, nil
}

func (broker *MessageBroker) ConversationAppendMessage(conversationId string, msg Message) (string, error) {

	channelUUID, err := broker.getChannelUUID(conversationId)
	log.Printf("appending to channelUUID %s", channelUUID)
	if err != nil {
		return "", err
	}

	buff := bytes.NewBufferString("")
	enc := json.NewEncoder(buff)
	err = enc.Encode(msg)
	if err != nil {
		return "", err
	}

	err = broker.client.Publish(context.Background(), channelUUID, buff.String()).Err()
	if err != nil {
		return "", err
	}

	key := broker.getKeyChannelMessages(channelUUID)
	err = broker.client.ZAdd(context.Background(), key, redis.Z{Score: float64(msg.CreatedAt.Unix()), Member: buff.String()}).Err()
	if err != nil {
		return "", err
	}

	return channelUUID, nil
}
