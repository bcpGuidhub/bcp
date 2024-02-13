package inquisite

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/models/inquisite"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbCollectionAnswersVotes = "answers.votes"
	dbCollectionFlagAnswers  = "flags.answers"
)

func GetAnswerVotes(c *gin.Context) {
	answerId := c.Param("id")
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": answerId}
	var answer inquisite.PostAnswer
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionAnswersVotes)
	err := collection.FindOne(cxt, filter).Decode(&answer)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(200, answer)
}

func GetAnswerFlag(c *gin.Context) {
	aggregateId := c.Param("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": aggregateId}
	postFlag := make(map[string]interface{})
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionFlagAnswers)
	err := collection.FindOne(cxt, filter).Decode(postFlag)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	userFlags := make([]map[string]interface{}, 0)
	if err == mongo.ErrNoDocuments {
		c.JSON(200, userFlags)
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	for _, flag := range postFlag["flags"].(primitive.A) {
		if flag.(map[string]interface{})["author"].(string) == user.ID {
			userFlags = append(userFlags, flag.(map[string]interface{}))
		}
	}
	c.JSON(200, userFlags)
}

func GetAnswerStakeholderFlag(c *gin.Context) {
	aggregateId := c.Param("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": aggregateId}
	postFlag := make(map[string]interface{})
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionFlagAnswers)
	err := collection.FindOne(cxt, filter).Decode(postFlag)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	userFlags := make([]map[string]interface{}, 0)
	if err == mongo.ErrNoDocuments {
		c.JSON(200, userFlags)
		return
	}
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	for _, flag := range postFlag["flags"].(primitive.A) {
		if flag.(map[string]interface{})["author"].(string) == stakeholder.ID {
			userFlags = append(userFlags, flag.(map[string]interface{}))
		}
	}
	c.JSON(200, userFlags)
}
