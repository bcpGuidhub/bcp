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
	// DOWN_VOTE_PRIVILEGE int64 = 125
	DOWN_VOTE_PRIVILEGE int64 = 0
	POST_DOWN_VOTE      int64 = -2
)

// VoteDownPostHandler is a command handler, which handles VoteDownPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type VoteDownPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b VoteDownPostHandler) HandlerName() string {
	return "VoteDownPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b VoteDownPostHandler) NewCommand() interface{} {
	return &cmdSchema.VoteDownPost{}
}

func (b VoteDownPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler VoteDownPostHandler ---------------")

	cmd := c.(*cmdSchema.VoteDownPost)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionActivePosts)
	post := make(map[string]interface{})
	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.AggregateId.Value}).Decode(post)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	author := post["author"].(string)

	log.Printf("author == %s", author)
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

		if reps >= DOWN_VOTE_PRIVILEGE {
			alreadyVoted, err := constraints.AlreadyVoted(dbCollectionPostsVotes, cmd.AggregateId.Value, cmd.VoterId, "aggregate_id", POST_DOWN_VOTE)
			if err != nil {
				return err
			}
			if !alreadyVoted {
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

				voteId := primitive.NewObjectIDFromTimestamp(cmd.Cast.AsTime())
				filter := bson.M{"aggregate_id": cmd.AggregateId.Value}
				update := bson.M{
					"$set": bson.M{"aggregate_id": cmd.AggregateId.Value},
					"$addToSet": bson.M{"votes": bson.M{"vote_id": primitive.NewObjectID(),
						"voter_id": cmd.VoterId,
						"cast":     cmd.Cast.AsTime(),
						"weight":   POST_DOWN_VOTE,
					}},
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
					eventPostDownVoteId, _ := uuid.NewUUID()
					eventPostDownVoted := &evtSchema.PostDownVoted{
						Id:          &cmdSchema.UUID{Value: eventPostDownVoteId.String()},
						AggregateId: &cmdSchema.UUID{Value: author},
						VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
						Cast:        timestamppb.New(time.Now()),
						Weight:      POST_DOWN_VOTE,
						VoteId:      &cmdSchema.UUID{Value: voteId.Hex()},
						PostId:      &cmdSchema.UUID{Value: cmd.AggregateId.Value},
					}
					event := &events.PostDownVoted{
						Event: &events.Event{
							Payload: eventPostDownVoted,
							Type:    events.EventTypePostDownVoted,
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
	// TODO ADD NOTIFICATION TO REPLY.
	return nil
}
