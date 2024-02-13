package jobs

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/handlers"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

const (
	MODERATOR_QUEUE_SIZE = 10
)

var (
	dbCollectionActivePosts              = "posts.active"
	dbCollectionPostAnswers              = "posts.answers"
	dbCollectionRevisionsQueue           = "revisions.queue"
	dbCollectionModeratorEditReviewQueue = "moderators.review.queue"
	dbname                               = "DB_INQUIST"
	DB                                   = os.Getenv(dbname)
)

func ModeratorRevisionsReview() {
	log.Println("Running ---- ModeratorRevisionsReview job -------")
	db := config.Datastore.ReadDatabase.Database(DB)

	session, err := db.Client().StartSession()
	if err != nil {
		panic(err)
	}

	if err = session.StartTransaction(); err != nil {
		panic(err)
	}

	ctx := context.Background()
	if err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {

		col := db.Collection(dbCollectionModeratorEditReviewQueue)
		// Create a MongoDB lock client.
		lockClient := lock.NewClient(col)

		// Create the required and recommended indexes.
		lockClient.CreateIndexes(ctx)

		lockId := uuid.New().String()

		// Create an exclusive lock on resource1.
		err := lockClient.XLock(ctx, "resource1", lockId, lock.LockDetails{})
		if err != nil {
			_ = fmt.Errorf("err ModeratorRevisionsReview: %v", err)
			return err
		}

		defer func() { // Unlock all locks that have our lockId.
			_, err = lockClient.Unlock(ctx, lockId)
			if err != nil {
				log.Fatal(err)
			}
		}()

		count, err := col.CountDocuments(context.TODO(), bson.M{})
		if err != nil {
			return err
		}
		if count < MODERATOR_QUEUE_SIZE {
			slots := MODERATOR_QUEUE_SIZE - count

			filter := bson.M{"status": handlers.PendingWaitingEnqueue}
			sort := bson.M{"posted": 1}
			opts := options.Find().SetSort(sort).SetLimit(slots)
			cursor, err := db.Collection(dbCollectionRevisionsQueue).Find(ctx, filter, opts)
			if err != nil {
				return err
			}

			for cursor.Next(ctx) {
				var revision bson.M
				if err := cursor.Decode(&revision); err != nil {
					return err
				}
				log.Printf("revision  %v", revision)
				copyRevision := make(bson.M)
				for k, v := range revision {
					copyRevision[k] = v
				}
				copyRevision["status"] = handlers.PendingReview
				copyRevision["updated_at"] = time.Now()

				revisionInserted, err := db.Collection(dbCollectionModeratorEditReviewQueue).InsertOne(ctx, &copyRevision)
				if err != nil {
					return err
				}

				log.Printf("revision added for moderator review %s", revisionInserted.InsertedID.(primitive.ObjectID).Hex())
				dr, err := db.Collection(dbCollectionRevisionsQueue).DeleteOne(ctx, revision)
				if err != nil {
					return err
				}

				log.Printf("revision removed from pending queue %v", dr)
			}
			defer cursor.Close(ctx)
		}
		if err != nil {
			return err
		}
		if err = session.CommitTransaction(sc); err != nil {
			return err
		}
		return nil
	}); err != nil {
		// panic(err)
		log.Printf("ERROR in ------- ModeratorRevisionsReview -----  %v", err)
	}
	session.EndSession(ctx)
}

func ModeratorRevisionsReviewed() {
	log.Println("Running ---- ModeratorRevisionsReviewed job -------")
	db := config.Datastore.ReadDatabase.Database(DB)

	session, err := db.Client().StartSession()
	if err != nil {
		panic(err)
	}

	if err = session.StartTransaction(); err != nil {
		panic(err)
	}

	ctx := context.Background()
	if err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {

		col := db.Collection(dbCollectionModeratorEditReviewQueue)
		// Create a MongoDB lock client.
		lockClient := lock.NewClient(col)

		// Create the required and recommended indexes.
		lockClient.CreateIndexes(ctx)

		lockId := uuid.New().String()

		// Create an exclusive lock on resource1.
		err := lockClient.XLock(ctx, "resource1", lockId, lock.LockDetails{})
		if err != nil {
			_ = fmt.Errorf("err ModeratorRevisionsReviewed: %v", err)
			return err
		}

		defer func() { // Unlock all locks that have our lockId.
			_, err = lockClient.Unlock(ctx, lockId)
			if err != nil {
				log.Fatal(err)
			}
		}()
		filter := bson.M{"status": handlers.Validated}
		cursor, err := col.Find(ctx, filter)
		if err != nil {
			return err
		}

		for cursor.Next(ctx) {
			var revision bson.M
			if err := cursor.Decode(&revision); err != nil {
				return err
			}
			log.Printf("revision  %v", revision)
			copyRevision := make(bson.M)
			for k, v := range revision {
				copyRevision[k] = v
			}

			if copyRevision["resource_type"] == "answer" {
				copyRevision["revision_id"] = copyRevision["_id"]
				aggregate := copyRevision["aggregate_id"]
				delete(copyRevision, "resource_type")
				delete(copyRevision, "answer_id")
				delete(copyRevision, "_id")
				delete(copyRevision, "aggregate_id")
				filter := bson.M{"aggregate_id": aggregate, "author": copyRevision["author"]}
				update := bson.M{
					"$addToSet": bson.M{"revisions": copyRevision},
				}

				_, err := db.Collection(dbCollectionPostAnswers).UpdateOne(ctx, filter, update)
				if err != nil {
					return err
				}
			}

			if copyRevision["resource_type"] == "post" {
				copyRevision["revision_id"] = copyRevision["_id"]
				aggregate := copyRevision["aggregate_id"]
				delete(copyRevision, "resource_type")
				delete(copyRevision, "post_id")
				delete(copyRevision, "_id")
				delete(copyRevision, "aggregate_id")
				// delete(copyRevision, "tags")
				filter := bson.M{"aggregate_id": aggregate}
				update := bson.M{
					"$addToSet": bson.M{"revisions": copyRevision},
				}
				opts := options.Update().SetUpsert(true)
				_, err := db.Collection(dbCollectionActivePosts).UpdateOne(ctx, filter, update, opts)
				if err != nil {
					return err
				}
			}

			dr, err := db.Collection(dbCollectionModeratorEditReviewQueue).DeleteOne(ctx, bson.M{"_id": copyRevision["revision_id"]})
			if err != nil {
				return err
			}

			log.Printf("revision removed from moderation queue %v", dr)
		}
		defer cursor.Close(ctx)

		if err != nil {
			return err
		}
		if err = session.CommitTransaction(sc); err != nil {
			return err
		}
		return nil
	}); err != nil {
		// panic(err)
		log.Printf("ERROR in ------- ModeratorRevisionsReviewed -----  %v", err)
	}
	session.EndSession(ctx)
}
