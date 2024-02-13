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

const (
	VOTER_ANSWER_DOWN int64 = -1
)

type AnswerDownVotedHandler struct {
	CommandBus *kafka.CommandBusWriteStream
}

func (o AnswerDownVotedHandler) HandlerName() string {
	return "AnswerDownVotedHandler"
}

func (AnswerDownVotedHandler) NewEvent() interface{} {
	return &evtSchema.AnswerDownVoted{}
}

func (o AnswerDownVotedHandler) Handle(ctx context.Context, e interface{}) error {
	log.Println("---------- Running EVENT Handler AnswerDownVotedHandler ---------------")
	event := e.(*evtSchema.AnswerDownVoted)
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

	filter = bson.M{"aggregate_id": event.AggregateId.Value}
	update = bson.M{
		"$set": bson.M{"aggregate_id": event.VoterId.Value},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": event.VoteId.Value,
			"voter_id":  event.VoterId.Value,
			"cast":      event.Cast.AsTime(),
			"weight":    VOTER_ANSWER_DOWN,
			"answer_id": event.AnswerId.Value,
		}},
	}
	opts = options.Update().SetUpsert(true)
	_, err = db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}
