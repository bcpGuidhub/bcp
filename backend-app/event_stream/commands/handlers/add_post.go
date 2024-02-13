package handlers

import (
	"context"
	"log"
	"os"
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
	dbname                  = "DB_INQUIST"
	DB                      = os.Getenv(dbname)
	dbCollectionActivePosts = "posts.active"
)

// AddPostHandler is a command handler, which handles AddPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type AddPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b AddPostHandler) HandlerName() string {
	return "AddPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b AddPostHandler) NewCommand() interface{} {
	return &cmdSchema.AddPost{}
}

func (b AddPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler AddPostHandler ---------------")

	cmd := c.(*cmdSchema.AddPost)
	db := config.Datastore.ReadDatabase.Database(DB)
	col := db.Collection(dbCollectionActivePosts)

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
	update := bson.M{
		"$set": bson.M{"aggregate_id": cmd.AggregateId.Value, "author": cmd.UserId},
		"$addToSet": bson.M{
			"revisions": bson.M{
				"revision_id":  primitive.NewObjectIDFromTimestamp(cmd.PostDate.AsTime()),
				"title":        cmd.Title,
				"description":  cmd.Description,
				"posted":       cmd.PostDate.AsTime(),
				"author":       cmd.UserId,
				"status":       Published,
				"edit_summary": nil,
				"updated_at":   nil,
			},
		},
	}

	opts := options.Update().SetUpsert(true)
	result, err := col.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return err
	}
	// Unlock all locks that have our lockId.
	_, err = lockClient.Unlock(ctx, lockId)
	if err != nil {
		log.Fatal(err)
	}
	if result.UpsertedID != nil {
		eventPostAddedId, _ := uuid.NewUUID()
		eventPostAdded := &evtSchema.PostAdded{
			Id:          &cmdSchema.UUID{Value: eventPostAddedId.String()},
			AggregateId: cmd.AggregateId,
			PostTag:     cmd.PostTag,
			PostDate:    timestamppb.New(time.Now()),
		}
		event := &events.PostAdded{
			Event: &events.Event{
				Payload: eventPostAdded,
				Type:    events.EventTypePostAdded,
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
