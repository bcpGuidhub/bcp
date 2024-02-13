package handlers

import (
	"context"
	"log"

	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"gopkg.in/mgo.v2/bson"
)

// RetractFlagPostHandler is a command handler, which handles RetractFlagPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type RetractFlagPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b RetractFlagPostHandler) HandlerName() string {
	return "RetractFlagPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b RetractFlagPostHandler) NewCommand() interface{} {
	return &cmdSchema.RetractFlagPost{}
}

func (b RetractFlagPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler RetractFlagPostHandler ---------------")

	cmd := c.(*cmdSchema.RetractFlagPost)
	db := config.Datastore.ReadDatabase.Database(DB)
	col := db.Collection(dbCollectionFlagPosts)

	// Create a MongoDB lock client.
	lockClient := lock.NewClient(col)

	// Create the required and recommended indexes.
	lockClient.CreateIndexes(ctx)

	lockId := cmd.AggregateId.Value

	// Create an exclusive lock on resource1.
	err := lockClient.XLock(ctx, "resource1", lockId, lock.LockDetails{})
	if err != nil {
		log.Fatal(err)
	}

	filter := bson.M{"aggregate_id": cmd.AggregateId.Value}
	update := bson.M{"$pull": bson.M{"flags": bson.M{"author": cmd.Author}}}
	_, err = col.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	// Unlock all locks that have our lockId.
	_, err = lockClient.Unlock(ctx, lockId)
	if err != nil {
		log.Fatal(err)
	}
	return nil
}
