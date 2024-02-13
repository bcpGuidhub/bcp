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

// AddRevisionToPostAnswerHandler is a command handler, which handles AddRevisionToPostAnswer command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type AddRevisionToPostAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b AddRevisionToPostAnswerHandler) HandlerName() string {
	return "AddRevisionToPostAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b AddRevisionToPostAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.AddRevisionToAnswer{}
}

func (b AddRevisionToPostAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler AddRevisionToPostAnswerHandler ---------------")

	cmd := c.(*cmdSchema.AddRevisionToAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	col := db.Collection(dbCollectionCommunityReputations)
	reputation := make(map[string]interface{})

	err := col.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.Author}).Decode(reputation)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	var reps int64
	reputations := reputation["votes"].(primitive.A)
	for _, v := range reputations {
		reps = reps + v.(map[string]interface{})["weight"].(int64)
	}

	if reps >= EDITOR_PRIVILEGE {
		revision := bson.M{"aggregate_id": cmd.AggregateId.Value,
			"body":          cmd.Body,
			"updated_at":    nil,
			"posted":        cmd.PostDate.AsTime(),
			"author":        cmd.Author,
			"edit_summary":  cmd.EditSummary,
			"answer_id":     cmd.AnswerId,
			"resource_type": "answer",
			"status":        PendingWaitingEnqueue,
		}
		col = db.Collection(dbCollectionRevisionsQueue)
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
		result, err := col.InsertOne(context.TODO(), revision)
		if err != nil {
			return err
		}
		// Unlock all locks that have our lockId.
		_, err = lockClient.Unlock(ctx, lockId)
		if err != nil {
			log.Fatal(err)
		}
		if result.InsertedID != nil {
			eventPostAnwserEditedId, _ := uuid.NewUUID()
			eventPostAnswerAdded := &evtSchema.AnswerRevisionAdded{
				Id:          &cmdSchema.UUID{Value: eventPostAnwserEditedId.String()},
				AggregateId: cmd.AggregateId,
				AnswerId:    cmd.AnswerId,
				Updated:     timestamppb.New(time.Now()),
			}
			event := &events.AnswerRevisionAdded{
				Event: &events.Event{
					Payload: eventPostAnswerAdded,
					Type:    events.EventTypePostAnswerEditAdded,
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
