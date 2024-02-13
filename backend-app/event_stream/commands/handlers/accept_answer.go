package handlers

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
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
	ANSWER_ACCEPT_VOTE int64 = 15
)

// AcceptAnswerHandler is a command handler, which handles AcceptAnswer command and emits AnswerAccepted.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type AcceptAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b AcceptAnswerHandler) HandlerName() string {
	return "AcceptAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b AcceptAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.AcceptAnswer{}
}

func (b AcceptAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler AcceptAnswerHandler ---------------")

	cmd := c.(*cmdSchema.AcceptAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionActivePosts)
	post := make(map[string]interface{})

	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.AggregateId.Value}).Decode(post)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	author := post["author"].(string)

	if author != cmd.VoterId {
		alreadyVoted, err := constraints.AlreadyVoted(dbCollectionAnswersVotes, cmd.AnswerId.Value, cmd.VoterId, "aggregate_id", ANSWER_ACCEPT_VOTE)
		if err != nil {
			return err
		}
		if !alreadyVoted {
			voteId := primitive.NewObjectIDFromTimestamp(cmd.Cast.AsTime())
			filter := bson.M{"aggregate_id": cmd.AnswerId.Value}
			update := bson.M{
				"$set": bson.M{"aggregate_id": cmd.AnswerId.Value},
				"$addToSet": bson.M{"votes": bson.M{"vote_id": voteId,
					"voter_id": cmd.VoterId,
					"cast":     cmd.Cast.AsTime(),
					"weight":   ANSWER_ACCEPT_VOTE,
				}},
			}
			opts := options.Update().SetUpsert(true)
			result, err := db.Collection(dbCollectionAnswersVotes).UpdateOne(ctx, filter, update, opts)
			if err != nil {
				return err
			}

			if result.UpsertedID != nil {
				eventAnswerAcceptedId, _ := uuid.NewUUID()
				eventAnswerAccepted := &evtSchema.AnswerAccepted{
					Id:          &cmdSchema.UUID{Value: eventAnswerAcceptedId.String()},
					AggregateId: &cmdSchema.UUID{Value: cmd.AggregateId.Value},
					VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
					Cast:        timestamppb.New(time.Now()),
					Weight:      ANSWER_ACCEPT_VOTE,
					VoteId:      &cmdSchema.UUID{Value: voteId.Hex()},
					AnswerId:    &cmdSchema.UUID{Value: cmd.AnswerId.Value},
				}
				event := &events.AnswerAccepted{
					Event: &events.Event{
						Payload: eventAnswerAccepted,
						Type:    events.EventTypeAnswerAccepted,
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

	return nil
}
