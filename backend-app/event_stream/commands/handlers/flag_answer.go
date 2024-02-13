package handlers

import (
	"context"
	"log"

	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbCollectionFlagAnswers = "flags.answers"
)

// FlagAnswerHandler is a command handler, which handles FlagAnswer command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type FlagAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b FlagAnswerHandler) HandlerName() string {
	return "FlagAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b FlagAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.FlagAnswer{}
}

func (b FlagAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler FlagAnswerHandler ---------------")

	cmd := c.(*cmdSchema.FlagAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	reputation := make(map[string]interface{})
	collection := db.Collection(dbCollectionCommunityReputations)
	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.Author}).Decode(reputation)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	var reps int64
	reputations := reputation["votes"].(primitive.A)
	for _, v := range reputations {
		reps = reps + v.(map[string]interface{})["weight"].(int64)
	}

	if reps >= FLAG_POST_PRIVILEGE {
		col := db.Collection(dbCollectionFlagAnswers)

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
		flagId := primitive.NewObjectIDFromTimestamp(cmd.PostDate.AsTime())
		filter := bson.M{"aggregate_id": cmd.AggregateId.Value}
		update := bson.M{
			"$set":      bson.M{"aggregate_id": cmd.AggregateId.Value},
			"$addToSet": bson.M{"flags": bson.M{"flag_id": flagId, "details": cmd.Details, "reason": cmd.Reason, "posted": cmd.PostDate.AsTime(), "author": cmd.Author}}}
		opts := options.Update().SetUpsert(true)
		_, err = col.UpdateOne(ctx, filter, update, opts)
		if err != nil {
			return err
		}

		// Unlock all locks that have our lockId.
		_, err = lockClient.Unlock(ctx, lockId)
		if err != nil {
			log.Fatal(err)
		}
	}

	return nil
}
