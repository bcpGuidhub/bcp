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
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/mgo.v2/bson"
)

const (
	POST_EDIT_QUEUE_SIZE int64 = 3
	// EDITOR_PRIVILEGE     int64 = 2000
	EDITOR_PRIVILEGE int64 = 0
)

// edit status string mapping
const (
	PendingWaitingEnqueue string = "pending_waiting_enqueue"
	PendingReview         string = "pending_review"
	DeclinedAfterReview   string = "declined_after_review"
	Validated             string = "validated"
	Published             string = "published"
)

var (
	dbCollectionRevisionsQueue = "revisions.queue"
)

// AddRevisionToPostHandler is a command handler, which handles AddRevisionToPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type AddRevisionToPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b AddRevisionToPostHandler) HandlerName() string {
	return "AddRevisionToPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b AddRevisionToPostHandler) NewCommand() interface{} {
	return &cmdSchema.AddRevisionToPost{}
}

func (b AddRevisionToPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler AddRevisionToPostHandler ---------------")

	cmd := c.(*cmdSchema.AddRevisionToPost)
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

	if reps >= EDITOR_PRIVILEGE {
		post := bson.M{
			"aggregate_id":  cmd.AggregateId.Value,
			"title":         cmd.Title,
			"description":   cmd.Description,
			"edit_summary":  cmd.EditSummary,
			"posted":        cmd.PostDate.AsTime(),
			"author":        cmd.Author,
			"tags":          cmd.PostTag,
			"status":        PendingWaitingEnqueue,
			"resource_type": "post",
			"updated_at":    nil,
		}
		col := db.Collection(dbCollectionRevisionsQueue)

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
		result, err := col.InsertOne(context.TODO(), post)
		if err != nil {
			return err
		}
		// Unlock all locks that have our lockId.
		_, err = lockClient.Unlock(ctx, lockId)
		if err != nil {
			log.Fatal(err)
		}
		if result.InsertedID != nil {
			eventPostEditAddedId, _ := uuid.NewUUID()
			eventPostEditAdded := &evtSchema.PostRevisionAdded{
				Id:          &cmdSchema.UUID{Value: eventPostEditAddedId.String()},
				AggregateId: cmd.AggregateId,
				PostDate:    timestamppb.New(time.Now()),
			}
			event := &events.PostRevisionAdded{
				Event: &events.Event{
					Payload: eventPostEditAdded,
					Type:    events.EventTypePostEditAdded,
				},
			}

			err = b.EventBus.Send(ctx, event)

			if err != nil {
				return err
			}
			log.Printf("event {%s} sent to   ---- > bus  \n", event.Type)
		}

	}

	return nil
}
