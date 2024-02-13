package redis

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
)

const (
	keyConversationChannel = "channelConversation"
	keyChannelContacts     = "channelContacts"
	keyChannelMessages     = "channelMessages"
)

var _ = message.IModel(&ChannelMessage{})

type ChannelMessage struct {
	UUID           string                   `json:"uuid"`
	ConversationId string                   `json:"conversation_id"`
	RecipientIds   []string                 `json:"recipient_ids"`
	Message        Message                  `json:"message"`
	Type           ConversationType         `json:"conversation_type"`
	Attachment     []map[string]interface{} `json:"attachments"`
}

func (m *ChannelMessage) GUUID() string {
	return m.UUID
}

func (broker *MessageBroker) ChannelLeave(conversationId string) (string, error) {
	channelUUID, err := broker.getChannelUUID(conversationId)
	if err != nil {
		return "", err
	}

	return broker.CloseChannel(channelUUID)
}

func (broker *MessageBroker) CloseChannel(channelUUID string) (string, error) {

	defer func() {
		broker.pubSubSync.Lock()
		delete(broker.pubSub, channelUUID)
		broker.pubSubSync.Unlock()
	}()

	broker.pubSubSync.RLock()
	channel, ok := broker.pubSub[channelUUID]
	broker.pubSubSync.RUnlock()

	if !ok {
		return "", errors.New("channel not found")
	}

	select {
	case <-channel.Close():
	default:
		close(channel.close)
	}
	timeout := time.NewTimer(time.Second * 3)
	select {
	case <-channel.closed:
		return channelUUID, nil
	case <-timeout.C:
		return "", errors.New("channel closed with timeout")
	}
}

func (broker *MessageBroker) getChannelUUID(conversationId string) (string, error) {

	if conversationId == "" {
		return "", errors.New("empty sender uuid")
	}
	keyConversation := broker.getKeyConversationChannel(conversationId)
	channelUUID, err := broker.client.Get(context.Background(), keyConversation).Result()
	if err == redis.Nil {
		channelUUID = uuid.New().String()
		if err := broker.client.Set(context.Background(), keyConversation, channelUUID, 0).Err(); err != nil {
			return "", err
		}
		return channelUUID, nil
	} else if err != nil {
		return "", err
	}
	return channelUUID, nil
}

func (broker *MessageBroker) getKeyConversationChannel(conversationId string) string {
	return fmt.Sprintf("%s.%s", keyConversationChannel, conversationId)
}

func (broker *MessageBroker) ChannelJoin(conversationId string) (*ChannelPubSub, string, error) {
	channelUUID, err := broker.getChannelUUID(conversationId)
	if err != nil {
		return nil, "", err
	}
	// get conversation by id
	conversation, err := broker.ConversationGetByUUID(conversationId)
	if err != nil {
		return nil, "", err
	}

	for i := range conversation.Participants {

		go func(i int) {
			broker.channelJoin(channelUUID, conversation.Participants[i].UUID)
		}(i)

	}

	channel := broker.ChannelSubscribe(channelUUID)
	log.Printf("joining channel[%v] with channelUUID[%s] ", channel, channelUUID)
	return channel, channelUUID, nil
}

func (broker *MessageBroker) ChannelSubscribe(channel string) *ChannelPubSub {
	pubSub := broker.Subscribe(channel)
	return broker.addChannelPubSub(channel, pubSub)
}

func (broker *MessageBroker) channelJoin(channelUUID, contactUUID string) error {

	key := broker.getKeyChannelContacts(channelUUID)
	if err := broker.client.HSet(context.Background(), key, contactUUID, time.Now().String()).Err(); err != nil {
		return err
	}
	return nil
}

func (broker *MessageBroker) getKeyChannelContacts(channelUUID string) string {
	return fmt.Sprintf("%s.%s", keyChannelContacts, channelUUID)
}

func (broker *MessageBroker) addChannelPubSub(channelUUID string, pubSub *redis.PubSub) *ChannelPubSub {

	channelPubSub := &ChannelPubSub{
		close:  make(chan struct{}, 1),
		closed: make(chan struct{}, 1),
		pubSub: pubSub,
	}
	broker.pubSubSync.Lock()
	if _, ok := broker.pubSub[channelUUID]; !ok {
		broker.pubSub[channelUUID] = channelPubSub
	}
	broker.pubSubSync.Unlock()
	return channelPubSub
}

func (broker *MessageBroker) ChannelMessagesCount(channelUUID string) (int64, error) {
	key := broker.getKeyChannelMessages(channelUUID)
	return broker.client.LLen(context.Background(), key).Result()
}

func (broker *MessageBroker) getKeyChannelMessages(channelUUID string) string {
	return fmt.Sprintf("%s.%s", keyChannelMessages, channelUUID)
}

func (broker *MessageBroker) ChannelContacts(channelUUID string) ([]message.IModel, error) {

	key := broker.getKeyChannelContacts(channelUUID)

	values, err := broker.client.HGetAll(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	contacts := make([]message.IModel, 0, len(values))

	for contactUUID := range values {
		contact, err := broker.getContactFromListByUUID(contactUUID)
		if err != nil {
			log.Println(err)
			continue
		}
		contacts = append(contacts, contact)
	}
	return contacts, nil
}
