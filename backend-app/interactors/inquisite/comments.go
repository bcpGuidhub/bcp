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
	dbCollectionCommentsVotes  = "comments.votes"
	dbCollectionPostsComments  = "posts.comments"
	dbCollectionAnswerComments = "answer.comments"
	dbCollectionFlagComments   = "flags.comments"
)

func GetPostComments(c *gin.Context) {
	aggregateId := c.Param("id")
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": aggregateId}
	var comments inquisite.PostComment
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionPostsComments)
	err := collection.FindOne(cxt, filter).Decode(&comments)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	for i, comment := range comments.Comments {
		var votes inquisite.CommentVote
		filter := bson.M{"comment_id": comment.Id}
		collection := dbClient.Collection(dbCollectionCommentsVotes)
		err := collection.FindOne(cxt, filter).Decode(&votes)
		if err != nil && err != mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		comments.Comments[i].Votes = votes
	}
	c.JSON(200, comments)
}

func GetAnswerComments(c *gin.Context) {
	aggregateId := c.Param("id")
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": aggregateId}
	var comments inquisite.PostComment
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionAnswerComments)
	err := collection.FindOne(cxt, filter).Decode(&comments)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	for _, comment := range comments.Comments {

		filter := bson.M{"comment_id": comment.Id}
		collection := dbClient.Collection(dbCollectionCommentsVotes)
		err := collection.FindOne(cxt, filter).Decode(comment.Votes)
		if err != nil && err != mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}
	c.JSON(200, comments)
}

func GetCommentFlag(c *gin.Context) {
	aggregateId := c.Param("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": aggregateId}
	commentFlag := make(map[string]interface{})
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionFlagComments)
	err := collection.FindOne(cxt, filter).Decode(commentFlag)
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
	for _, flag := range commentFlag["flags"].(primitive.A) {
		if flag.(map[string]interface{})["author"].(string) == user.ID {
			userFlags = append(userFlags, flag.(map[string]interface{}))
		}
	}
	c.JSON(200, userFlags)
}

func GetCommentStakeholderFlag(c *gin.Context) {
	aggregateId := c.Param("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": aggregateId}
	commentFlag := make(map[string]interface{})
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionFlagComments)
	err := collection.FindOne(cxt, filter).Decode(commentFlag)
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
	for _, flag := range commentFlag["flags"].(primitive.A) {
		if flag.(map[string]interface{})["author"].(string) == stakeholder.ID {
			userFlags = append(userFlags, flag.(map[string]interface{}))
		}
	}
	c.JSON(200, userFlags)
}
