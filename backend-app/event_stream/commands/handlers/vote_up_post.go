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
	// UP_VOTE_PRIVILEGE int64 = 15
	UP_VOTE_PRIVILEGE int64 = 0
	POST_UP_VOTE      int64 = 10
)

var (
	dbCollectionPostsVotes           = "posts.votes"
	dbCollectionCommunityReputations = "community.reputations"
)

type PostVote struct {
	Id      string    `bson:"vote_id" json:"id"`
	VoterId string    `bson:"voter_id" json:"voter_id"`
	Cast    time.Time `bson:"cast" json:"cast"`
	Weight  int64     `bson:"weight" json:"weight"`
}

type Post struct {
	AggregateId string     `bson:"aggregate_id" json:"id"`
	Votes       []PostVote `bson:"votes" json:"votes"`
}

// VoteUpPostHandler is a command handler, which handles VoteUpPost command and emits PostAdded.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type VoteUpPostHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b VoteUpPostHandler) HandlerName() string {
	return "VoteUpPostHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b VoteUpPostHandler) NewCommand() interface{} {
	return &cmdSchema.VoteUpPost{}
}

func (b VoteUpPostHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler VoteUpPostHandler ---------------")

	cmd := c.(*cmdSchema.VoteUpPost)
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
					"$addToSet": bson.M{"votes": bson.M{"vote_id": voteId,
						"voter_id": cmd.VoterId,
						"cast":     cmd.Cast.AsTime(),
						"weight":   POST_UP_VOTE,
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
					eventPostUpVoteId, _ := uuid.NewUUID()
					eventPostUpVoted := &evtSchema.PostUpVoted{
						Id:          &cmdSchema.UUID{Value: eventPostUpVoteId.String()},
						AggregateId: &cmdSchema.UUID{Value: author},
						VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
						Cast:        timestamppb.New(time.Now()),
						Weight:      POST_UP_VOTE,
						VoteId:      &cmdSchema.UUID{Value: voteId.Hex()},
						PostId:      &cmdSchema.UUID{Value: cmd.AggregateId.Value},
					}
					event := &events.PostUpVoted{
						Event: &events.Event{
							Payload: eventPostUpVoted,
							Type:    events.EventTypePostUpVoted,
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
