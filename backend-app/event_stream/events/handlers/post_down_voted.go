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

type PostDownVotedHandler struct {
	CommandBus *kafka.CommandBusWriteStream
}

func (o PostDownVotedHandler) HandlerName() string {
	return "PostDownVotedHandler"
}

func (PostDownVotedHandler) NewEvent() interface{} {
	return &evtSchema.PostDownVoted{}
}

func (o PostDownVotedHandler) Handle(ctx context.Context, e interface{}) error {
	log.Println("---------- Running EVENT Handler PostDownVotedHandler ---------------")
	event := e.(*evtSchema.PostDownVoted)
	if event == nil {
		return ErrNilEvent
	}

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": event.AggregateId.Value}
	update := bson.M{
		"$set": bson.M{"aggregate_id": event.AggregateId.Value},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": event.VoteId.Value,
			"voter_id": event.VoterId.Value,
			"cast":     event.Cast.AsTime(),
			"weight":   event.Weight,
			"post_id":  event.PostId.Value,
		}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}
