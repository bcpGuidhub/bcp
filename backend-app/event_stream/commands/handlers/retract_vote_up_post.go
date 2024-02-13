package handlers

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/handlers/constraints"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events"
	evtSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/mgo.v2/bson"
)

const (
	RETRACT_POST_UP_VOTE int64 = -10
)

// RetractVoteUpPostHandler is a command handler, which handles RetractVoteUpPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type RetractVoteUpPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b RetractVoteUpPostHandler) HandlerName() string {
	return "RetractVoteUpPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b RetractVoteUpPostHandler) NewCommand() interface{} {
	return &cmdSchema.RetractVoteUpPost{}
}

func (b RetractVoteUpPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler RetractVoteUpPostHandler ---------------")

	cmd := c.(*cmdSchema.RetractVoteUpPost)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionActivePosts)
	post := make(map[string]interface{})
	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.AggregateId.Value}).Decode(post)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	author := post["author"].(string)

	if author != cmd.VoterId {
		reputation := make(map[string]interface{})
		collection = db.Collection(dbCollectionCommunityReputations)
		err = collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.VoterId}).Decode(reputation)
		if err != nil && err != mongo.ErrNoDocuments {
			return err
		}

		var reps int64
		reputations := reputation["votes"].(primitive.A)
		for _, v := range reputations {
			reps = reps + v.(map[string]interface{})["weight"].(int64)
		}

		if reps >= UP_VOTE_PRIVILEGE {
			alreadyVoted, err := constraints.AlreadyVoted(dbCollectionPostsVotes, cmd.AggregateId.Value, cmd.VoterId, "aggregate_id", POST_UP_VOTE)
			if err != nil {
				return err
			}
			if alreadyVoted {
				col := db.Collection(dbCollectionPostsVotes)

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
				update := bson.M{"$pull": bson.M{"votes": bson.M{"voter_id": cmd.VoterId, "weight": POST_UP_VOTE}}}
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
					retractedEventPostUpVoteId, _ := uuid.NewUUID()
					retractedEventPostUpVoted := &evtSchema.RetractedPostUpVoted{
						Id:          &cmdSchema.UUID{Value: retractedEventPostUpVoteId.String()},
						AggregateId: &cmdSchema.UUID{Value: author},
						VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
						Cast:        timestamppb.New(time.Now()),
						Weight:      RETRACT_POST_UP_VOTE,
						PostId:      &cmdSchema.UUID{Value: cmd.AggregateId.Value},
					}
					event := &events.RetractedPostUpVoted{
						Event: &events.Event{
							Payload: retractedEventPostUpVoted,
							Type:    events.EventTypeRetractedPostUpVoted,
						},
					}

					err = b.EventBus.Send(ctx, event)

					if err != nil {
						return err
					}
					log.Printf("event {%s} sent to   ---- > bus  \n", event.Type)
				}
			}
		}
	}

	return nil
}
