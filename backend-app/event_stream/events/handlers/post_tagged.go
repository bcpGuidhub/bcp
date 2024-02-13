package handlers

import (
	"context"
	"errors"
	"log"
	"os"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	evtSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbname                       = "DB_INQUIST"
	DB                           = os.Getenv(dbname)
	dbCollectionPostsTags        = "posts.tags"
	dbCollectionTagsLabels       = "tags.labels"
	dbCollectionTagsDescriptions = "tags.descriptions"
)

type PostTaggedHandler struct {
	CommandBus *kafka.CommandBusWriteStream
}

var (
	ErrNilEvent = errors.New("event is nil")
)

func (o PostTaggedHandler) HandlerName() string {
	return "PostTaggedHandler"
}

func (PostTaggedHandler) NewEvent() interface{} {
	return &evtSchema.PostAdded{}
}

// Handle will create tags to a post, if not yet created.
// Ref between these datastructures currently:
// Tag Label => {U_id, Label}
// Tag Description => {U_id, Tag Label_id, history_of_modifications}
// Tag Description are written to db by Moderators<Privilege> required
// Tags on a Post are mostly a UI concept:
// such that Tag {U_id, Aggregate_id, Tag Label_id}.
func (o PostTaggedHandler) Handle(ctx context.Context, e interface{}) error {
	log.Println("---------- Running EVENT Handler PostTaggedHandler ---------------")
	event := e.(*evtSchema.PostAdded)
	if event == nil {
		return ErrNilEvent
	}
	db := config.Datastore.ReadDatabase.Database(DB)
	session, err := db.Client().StartSession()
	if err != nil {
		return err
	}

	if err = session.StartTransaction(); err != nil {
		return err
	}
	if err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		for _, tag := range event.PostTag {
			if tag.Field != "" {
				filter := bson.M{"label": tag.Field}
				result := db.Collection(dbCollectionTagsLabels).FindOne(ctx, filter)
				if result.Err() == mongo.ErrNoDocuments {
					labelFilter := bson.M{"label": tag.Field}
					update := bson.M{"$set": bson.M{"label": tag.Field}}
					opts := options.Update().SetUpsert(true)
					// Begin by creating the tag label document.
					tagLabel, err := db.Collection(dbCollectionTagsLabels).UpdateOne(ctx, labelFilter, update, opts)
					if err != nil {
						return err
					}
					if tagLabel.UpsertedID != nil {
						// Add a reference of the created tag label to post tags.
						tagFilter := bson.M{"aggregate_id": event.AggregateId.Value, "tag_label_id": tagLabel.UpsertedID}
						setTagOp := bson.M{"$set": tagFilter}
						tagOpts := options.Update().SetUpsert(true)
						_, err = db.Collection(dbCollectionPostsTags).UpdateOne(ctx, tagFilter, setTagOp, tagOpts)
						if err != nil {
							return err
						}

						// Debbugging purposes. should not be run in production.
						// Empty descriptions are not allowed.
						// Add a reference of the created tag label to the tag descriptions.
						// tagFilter = bson.M{"tag_label_id": tagLabel.UpsertedID}
						// setTagOp = bson.M{"$set": tagFilter}
						// tagOpts = options.Update().SetUpsert(true)
						// _, err = db.Collection(dbCollectionTagsDescriptions).UpdateOne(ctx, tagFilter, setTagOp, tagOpts)
						// if err != nil {
						// 	return err
						// }
					}

				}

			}
		}

		if err = session.CommitTransaction(sc); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	session.EndSession(ctx)

	if err != nil {
		return err
	}

	return nil
}
