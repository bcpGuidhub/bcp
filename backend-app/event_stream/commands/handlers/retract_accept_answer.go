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
	RETRACT_ANSWER_ACCEPT_VOTE int64 = -15
)

// RetractAcceptAnswerHandler is a command handler, which handles RetractAcceptAnswer command and emits AnswerAccepted.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type RetractAcceptAnswerHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b RetractAcceptAnswerHandler) HandlerName() string {
	return "RetractAcceptAnswerHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b RetractAcceptAnswerHandler) NewCommand() interface{} {
	return &cmdSchema.RetractAcceptAnswer{}
}

func (b RetractAcceptAnswerHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler RetractAcceptAnswerHandler ---------------")

	cmd := c.(*cmdSchema.RetractAcceptAnswer)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionActivePosts)
	post := make(map[string]interface{})

	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.AggregateId.Value}).Decode(post)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	revisions := post["revisions"].(primitive.A)
	var author string
	for _, v := range revisions {
		//revisions are an ordered set.
		// first revision represent initial author
		author = v.(map[string]interface{})["author"].(string)
		break
	}

	if author == cmd.VoterId {
		alreadyVoted, err := constraints.AlreadyVoted(dbCollectionAnswersVotes, cmd.AnswerId.Value, cmd.VoterId, "aggregate_id", ANSWER_ACCEPT_VOTE)
		if err != nil {
			return err
		}
		if alreadyVoted {
			filter := bson.M{"aggregate_id": cmd.AnswerId.Value}
			update := bson.M{"$pull": bson.M{"votes": bson.M{"voter_id": cmd.VoterId, "weight": ANSWER_ACCEPT_VOTE}}}
			opts := options.Update().SetUpsert(true)
			_, err := db.Collection(dbCollectionAnswersVotes).UpdateOne(ctx, filter, update, opts)
			if err != nil {
				return err
			}

			retractEventAnswerAcceptedId, _ := uuid.NewUUID()
			retractedEventAnswerAccepted := &evtSchema.RetractedAnswerAccepted{
				Id:          &cmdSchema.UUID{Value: retractEventAnswerAcceptedId.String()},
				AggregateId: &cmdSchema.UUID{Value: cmd.AggregateId.Value},
				VoterId:     &cmdSchema.UUID{Value: cmd.VoterId},
				Cast:        timestamppb.New(time.Now()),
				Weight:      RETRACT_ANSWER_ACCEPT_VOTE,
				AnswerId:    &cmdSchema.UUID{Value: cmd.AnswerId.Value},
			}
			retractedEvent := &events.RetractedAnswerAccepted{
				Event: &events.Event{
					Payload: retractedEventAnswerAccepted,
					Type:    events.EventTypeRetractedAnswerAccepted,
				},
			}

			err = b.EventBus.Send(ctx, retractedEvent)

			if err != nil {
				return err
			}
			log.Printf("event {%s} sent to   ---- > bus  \n", retractedEvent.Type)

		}

	}

	return nil
}
