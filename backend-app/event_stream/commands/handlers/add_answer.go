package handlers

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events"
	evtSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbCollectionPostAnswers = "posts.answers"
)

// AddPostAnswerHandler is a command handler, which handles AddPostAnswerHandler command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type AddPostAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b AddPostAnswerHandler) HandlerName() string {
	return "AddPostAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b AddPostAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.PostAnswer{}
}

func (b AddPostAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler AddPostAnswerHandler ---------------")

	cmd := c.(*cmdSchema.PostAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	col := db.Collection(dbCollectionPostAnswers)

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

	filter := bson.M{"aggregate_id": cmd.AggregateId.Value, "author": cmd.Author}
	update := bson.M{
		"$set": bson.M{"aggregate_id": cmd.AggregateId.Value, "author": cmd.Author},
		"$addToSet": bson.M{"revisions": bson.M{"revision_id": primitive.NewObjectID(),
			"body":         cmd.Body,
			"author":       cmd.Author,
			"posted":       cmd.PostDate.AsTime(),
			"status":       Published,
			"edit_summary": nil,
			"updated_at":   nil}},
	}
	opts := options.Update().SetUpsert(true)
	answer, err := col.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return err
	}
	// Unlock all locks that have our lockId.
	_, err = lockClient.Unlock(ctx, lockId)
	if err != nil {
		log.Fatal(err)
	}
	if answer.UpsertedID != nil {
		eventPostAnwserAddedId, _ := uuid.NewUUID()
		eventPostAnswerAdded := &evtSchema.PostAnswerAdded{
			Id:          &cmdSchema.UUID{Value: eventPostAnwserAddedId.String()},
			AggregateId: cmd.AggregateId,
			AnswerId:    answer.UpsertedID.(primitive.ObjectID).Hex(), // bson _id ObjectId("")
			PostDate:    timestamppb.New(time.Now()),
		}
		event := &events.PostAnswerAdded{
			Event: &events.Event{
				Payload: eventPostAnswerAdded,
				Type:    events.EventTypePostAnswerAdded,
			},
		}

		err = b.EventBus.Send(ctx, event)

		if err != nil {
			return err
		}
		log.Printf("event {%s} sent to   ---- > bus  \n", event.Type)
	}

	return nil
}
