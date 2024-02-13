package handlers

import (
	"context"
	"log"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	evtSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

type AnswerUpVotedHandler struct {
	CommandBus *kafka.CommandBusWriteStream
}

func (o AnswerUpVotedHandler) HandlerName() string {
	return "AnswerUpVotedHandler"
}

func (AnswerUpVotedHandler) NewEvent() interface{} {
	return &evtSchema.AnswerUpVoted{}
}

func (o AnswerUpVotedHandler) Handle(ctx context.Context, e interface{}) error {
	log.Println("---------- Running EVENT Handler AnswerUpVotedHandler ---------------")
	event := e.(*evtSchema.AnswerUpVoted)
	if event == nil {
		return ErrNilEvent
	}

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": event.AggregateId.Value}
	update := bson.M{
		"$set": bson.M{"aggregate_id": event.AggregateId.Value},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": event.VoteId.Value,
			"voter_id":  event.VoterId.Value,
			"cast":      event.Cast.AsTime(),
			"weight":    event.Weight,
			"answer_id": event.AnswerId.Value,
		}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}
