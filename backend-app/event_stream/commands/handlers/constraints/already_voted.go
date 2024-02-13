package constraints

import (
	"context"
	"os"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbname = "DB_INQUIST"
	DB     = os.Getenv(dbname)
)

func AlreadyVoted(collection, aggregate, voterId, aggregateKey string, weight int64) (bool, error) {

	db := config.Datastore.ReadDatabase.Database(DB)
	postVotes := make(map[string]interface{})
	err := db.Collection(collection).FindOne(context.TODO(), bson.M{aggregateKey: aggregate}).Decode(postVotes)
	if err != nil && err != mongo.ErrNoDocuments {
		return false, err
	}
	if err == mongo.ErrNoDocuments {
		return false, nil
	}

	var voted bool
	if postVotes["votes"] != nil {
		votes := postVotes["votes"].(primitive.A)

		for _, vote := range votes {
			if vote.(map[string]interface{})["voter_id"].(string) == voterId && vote.(map[string]interface{})["weight"].(int64) == weight {
				voted = true
				break
			}
		}
	}
	return voted, nil
}
