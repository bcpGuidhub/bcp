package redis

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/go-redsync/redsync/v4"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/database"
)

const (
	ContactSessionKey = "contactSession"
)

var MessageBrokerClient *MessageBroker

type MessageBroker struct {
	client     *redis.Client
	pubSub     map[string]*ChannelPubSub
	pubSubSync *sync.RWMutex
	lockSync   *redsync.Mutex
}

type ChannelPubSub struct {
	close  chan struct{}
	closed chan struct{}
	pubSub *redis.PubSub
}

func (channel *ChannelPubSub) Channel() <-chan *redis.Message {
	return channel.pubSub.Channel()
}

func (channel *ChannelPubSub) Close() <-chan struct{} {
	return channel.close
}

func (channel *ChannelPubSub) Closed() <-chan struct{} {
	return channel.closed
}

func (channel *ChannelPubSub) NilPubSub() bool {
	return channel.pubSub == nil
}

func NewBroker() *MessageBroker {

	return &MessageBroker{
		client:     database.RedisClient.(*redis.Client),
		pubSub:     make(map[string]*ChannelPubSub, 0),
		pubSubSync: &sync.RWMutex{},
		lockSync:   database.RedisDL,
	}

}

func getContactSessionKey(contactSessionUUID string) string {
	return fmt.Sprintf("%s.%s", ContactSessionKey, contactSessionUUID)
}

func (broker *MessageBroker) AddConnection(contactSessionUUID string) (err error) {
	key := getContactSessionKey(contactSessionUUID)
	err = broker.client.Set(context.Background(), key, time.Now().String(), time.Hour).Err()
	return
}

func (broker *MessageBroker) DelConnection(userSessionUUID string) (err error) {
	key := getContactSessionKey(userSessionUUID)
	err = broker.client.Del(context.Background(), key).Err()
	return
}

func (broker *MessageBroker) GetClient() *redis.Client {
	return broker.client
}

func (broker *MessageBroker) Subscribe(channel string) *redis.PubSub {
	return broker.client.Subscribe(context.Background(), channel)
}
