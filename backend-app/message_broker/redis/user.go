package redis

import (
	"context"
	"fmt"
	"time"
)

const (
	keyUserStatus = "userStatus"
)

func (broker *MessageBroker) getKeyUserStatus(userUUID string) string {
	return fmt.Sprintf("%s.%s", keyUserStatus, userUUID)
}

func (broker *MessageBroker) UserSetOnline(userUUID string) error {
	key := broker.getKeyUserStatus(userUUID)
	return broker.client.Set(context.Background(), key, time.Now().String(), time.Minute).Err()
}

func (broker *MessageBroker) UserSetOffline(userUUID string) {
	key := broker.getKeyUserStatus(userUUID)
	broker.client.Del(context.Background(), key)
}

func (broker *MessageBroker) UserIsOnline(userUUID string) bool {
	key := broker.getKeyUserStatus(userUUID)
	err := broker.client.Get(context.Background(), key).Err()
	return err == nil
}
