package handlers

import (
	"context"
	"log"

	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbCollectionAnswerComments = "answer.comments"
)

// CommentOnAnswerHandler is a command handler, which handles CommentOnAnswer command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type CommentOnAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b CommentOnAnswerHandler) HandlerName() string {
	return "CommentOnAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b CommentOnAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.CommentOnAnswer{}
}

func (b CommentOnAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler CommentOnAnswerHandler ---------------")

	cmd := c.(*cmdSchema.CommentOnAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	col := db.Collection(dbCollectionAnswerComments)

	// Create a MongoDB lock client.
	lockClient := lock.NewClient(col)

	// Create the required and recommended indexes.
	lockClient.CreateIndexes(ctx)

	lockId := cmd.AggregateId.Value
	filter := bson.M{"aggregate_id": cmd.AggregateId.Value}
	update := bson.M{
		"$set":      bson.M{"aggregate_id": cmd.AggregateId.Value},
		"$addToSet": bson.M{"comments": bson.M{"comment_id": primitive.NewObjectIDFromTimestamp(cmd.PostDate.AsTime()), "reply": cmd.Reply, "body": cmd.Body, "posted": cmd.PostDate.AsTime(), "author": cmd.Author}}}
	opts := options.Update().SetUpsert(true)
	_, err := col.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return err
	}

	// Unlock all locks that have our lockId.
	_, err = lockClient.Unlock(ctx, lockId)
	if err != nil {
		log.Fatal(err)
	}

	// TODO ADD NOTIFICATION TO REPLY.
	return nil
}
