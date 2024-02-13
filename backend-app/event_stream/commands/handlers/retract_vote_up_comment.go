package handlers

import (
	"context"
	"log"

	lock "github.com/square/mongo-lock"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	cmdSchema "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

//	RetractVoteUpCommentHandler is a command handler, which handles   RetractVoteUpComment command and emits AnswerUpVoted.
//
// In CQRS, one command must be handled by only one handler.
// When another handler with this command is added to command processor, error will be retuerned.
type RetractVoteUpCommentHandler struct {
	EventBus *kafka.EventBusWriteStream
}

func (b RetractVoteUpCommentHandler) HandlerName() string {
	return "RetractVoteUpCommentHandler"
}

// NewCommand returns type of command which this handle should handle. It must be a pointer.
func (b RetractVoteUpCommentHandler) NewCommand() interface{} {
	return &cmdSchema.RetractVoteUpComment{}
}

func (b RetractVoteUpCommentHandler) Handle(ctx context.Context, c interface{}) error {
	// c is always the type returned by `NewCommand`, so casting is always safe
	log.Println("---------- Running Command Handler   RetractVoteUpCommentHandler ---------------")

	cmd := c.(*cmdSchema.RetractVoteUpComment)
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionPostsComments)
	document := make(map[string]interface{})
	commentBsonId, err := primitive.ObjectIDFromHex(cmd.CommentId.Value)
	if err != nil {
		return err
	}

	err = collection.FindOne(context.TODO(), bson.M{"aggregate_id": cmd.AggregateId.Value}).Decode(document)
	if err != nil {
		return err
	}

	comments := document["comments"].(primitive.A)
	var comment map[string]interface{}
	for _, v := range comments {
		if v.(map[string]interface{})["comment_id"] == commentBsonId {
			comment = v.(map[string]interface{})
		}
	}
	if comment["author"].(string) != cmd.VoterId {
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

		if reps >= UP_VOTE_COMMENT_PRIVILEGE {
			col := db.Collection(dbCollectionCommentsVotes)

			// Create a MongoDB lock client.
			lockClient := lock.NewClient(col)

			// Create the required and recommended indexes.
			lockClient.CreateIndexes(ctx)

			lockId := cmd.CommentId.Value

			// Create an exclusive lock on resource1.
			err := lockClient.XLock(ctx, "resource1", lockId, lock.LockDetails{})
			if err != nil {
				log.Fatal(err)
			}
			filter := bson.M{"comment_id": cmd.CommentId.Value}
			update := bson.M{"$pull": bson.M{"votes": bson.M{"voter_id": cmd.VoterId}}}
			opts := options.Update().SetUpsert(true)
			_, err = col.UpdateOne(ctx, filter, update, opts)
			if err != nil {
				return err
			}
			// Unlock all locks that have our lockId.
			_, err = lockClient.Unlock(ctx, lockId)
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	return nil
}
