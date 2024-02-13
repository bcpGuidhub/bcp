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
	ANSWER_UP_VOTE int64 = 10
)

var (
	dbCollectionAnswersVotes = "answers.votes"
)

// VoteUpAnswerHandler is a command handler, which handles VoteUpAnswer command and emits AnswerUpVoted.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type VoteUpAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b VoteUpAnswerHandler) HandlerName() string {
	return "VoteUpAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b VoteUpAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.VoteUpAnswer{}
}

func (b VoteUpAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler VoteUpAnswerHandler ---------------")

	cmd := c.(*cmdSchema.VoteUpAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionPostAnswers)
	answer := make(map[string]interface{})
	_id, err := primitive.ObjectIDFromHex(cmd.AnswerId.Value)
	if err != nil {
		return err
	}

	err = collection.FindOne(context.TODO(), bson.M{"_id": _id}).Decode(answer)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	author := answer["author"].(string)

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
			alreadyVoted, err := constraints.AlreadyVoted(dbCollectionAnswersVotes, cmd.AnswerId.Value, cmd.VoterId, "aggregate_id", ANSWER_UP_VOTE)
			if err != nil {
				return err
			}
			if !alreadyVoted {
				col := db.Collection(dbCollectionAnswersVotes)

				// Create a MongoDB lock client.
				lockClient := lock.NewClient(col)

				// Create the required and recommended indexes.
				lockClient.CreateIndexes(ctx)

				lockId := cmd.AnswerId.Value

				// Create an exclusive lock on resource1.
				err := lockClient.XLock(ctx, "resource1", lockId, lock.LockDetails{})
				if err != nil {
					log.Fatal(err)
				}

				voteId := primitive.NewObjectIDFromTimestamp(cmd.Cast.AsTime())
				filter := bson.M{"aggregate_id": cmd.AnswerId.Value}
				update := bson.M{
					"$set": bson.M{"aggregate_id": cmd.AnswerId.Value},
					"$addToSet": bson.M{"votes": bson.M{"vote_id": voteId,
						"voter_id": cmd.VoterId,
						"cast":     cmd.Cast.AsTime(),
						"weight":   ANSWER_UP_VOTE,
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
					eventAnswerUpVoteId, _ := uuid.NewUUID()
					eventAnswerUpVoted := &evtSchema.AnswerUpVoted{
						Id:          &cmdSchema.UUID{Value: eventAnswerUpVoteId.String()},
						AggregateId: &cmdSchema.UUID{Value: author},
						VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
						Cast:        timestamppb.New(time.Now()),
						Weight:      ANSWER_UP_VOTE,
						VoteId:      &cmdSchema.UUID{Value: voteId.Hex()},
						AnswerId:    &cmdSchema.UUID{Value: cmd.AnswerId.Value},
					}
					event := &events.AnswerUpVoted{
						Event: &events.Event{
							Payload: eventAnswerUpVoted,
							Type:    events.EventTypeAnswerUpVoted,
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
