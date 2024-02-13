package handlers

import (
	"context"
	"log"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	evtSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

const (
	ANSWER_ACCEPTANCE_REPUTATION int64 = 2
)

var (
	dbCollectionPostAnswers = "posts.answers"
)

type AnswerAcceptedHandler struct {
	CommandBus *kafka.CommandBusWriteStream
}

func (o AnswerAcceptedHandler) HandlerName() string {
	return "AnswerAcceptedHandler"
}

func (AnswerAcceptedHandler) NewEvent() interface{} {
	return &evtSchema.AnswerAccepted{}
}

func (o AnswerAcceptedHandler) Handle(ctx context.Context, e interface{}) error {
	log.Println("---------- Running EVENT Handler AnswerAcceptedHandler ---------------")
	event := e.(*evtSchema.AnswerAccepted)
	if event == nil {
		return ErrNilEvent
	}

	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionPostAnswers)
	answer := make(map[string]interface{})
	_id, err := primitive.ObjectIDFromHex(event.AnswerId.Value)
	if err != nil {
		return err
	}

	err = collection.FindOne(context.TODO(), bson.M{"_id": _id}).Decode(answer)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	author := answer["author"].(string)

	filter := bson.M{"aggregate_id": author}
	update := bson.M{
		"$set": bson.M{"aggregate_id": author},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": event.VoteId.Value,
			"voter_id":  event.VoterId.Value,
			"cast":      event.Cast.AsTime(),
			"weight":    event.Weight,
			"answer_id": event.AnswerId.Value,
		}},
	}
	opts := options.Update().SetUpsert(true)
	result, err := db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	if result.UpsertedID != nil {
		filter = bson.M{"aggregate_id": event.VoterId.Value}
		update = bson.M{
			"$set": bson.M{"aggregate_id": event.VoterId.Value},
			"$addToSet": bson.M{"votes": bson.M{"vote_id": event.VoteId.Value,
				"voter_id": event.VoterId.Value,
				"cast":     event.Cast.AsTime(),
				"weight":   ANSWER_ACCEPTANCE_REPUTATION,
				"post_id":  event.AggregateId.Value,
			}},
		}
		opts = options.Update().SetUpsert(true)
		_, err = db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
		if err != nil {
			return err
		}
	}

	return nil
}
