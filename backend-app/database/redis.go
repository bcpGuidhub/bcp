package database

import (
	"context"
	"os"

	"github.com/go-redsync/redsync/v4"
	"github.com/redis/go-redis/v9"
)

var (
	RedisClient redis.UniversalClient
	RedisDL     *redsync.Mutex
)

func RedisConn(dsn, env string) error {
	//Initializing redis
	if len(dsn) == 0 {
		// dsn = "localhost:6379"
		dsn = "redis:6379"
	}
	opt := redis.UniversalOptions{
		Addrs: []string{dsn},
	}
	if env != "dev" {
		opt.Password = os.Getenv("REDIS_PASS")
	}
	RedisClient = redis.NewUniversalClient(&opt)
	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		return err
	}
	return nil
}
