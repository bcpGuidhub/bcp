package inquisite

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbCollectionCommunityReputations = "community.reputations"
)

func GetCommunityReputation(c *gin.Context) {
	communityId := c.Request.URL.Query().Get("id")
	db := config.Datastore.ReadDatabase.Database(DB)

	reputation := make(map[string]interface{})
	collection := db.Collection(dbCollectionCommunityReputations)
	err := collection.FindOne(context.TODO(), bson.M{"aggregate_id": communityId}).Decode(reputation)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	var reps int64
	reputations := reputation["votes"].(primitive.A)
	for _, v := range reputations {
		reps = reps + v.(map[string]interface{})["weight"].(int64)
	}
	c.JSON(200, reps)
}

func GetAuthor(c *gin.Context) {
	authorId := c.Request.URL.Query().Get("id")
	var responseDto interface{}

	var stakeholder *models.ProjectStakeholder
	var user *models.User

	daoUser := dao.NewUserDAO()
	user, err := daoUser.GetById(authorId)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	if gorm.IsRecordNotFoundError(err) {
		daoStakeholder := dao.NewProjectStakeholderDAO()
		stakeholder, err = daoStakeholder.GetById(authorId)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}
	if user.ID != "" {
		daoPic := dao.NewUserProfileImageDAO()
		pic, err := daoPic.GetByField(authorId, "user_id")
		if err != nil && err.Error() != "record not found" {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		responseDto = response.UserDto{
			Email:            user.Email,
			ID:               user.ID,
			FirstName:        user.FirstName,
			LastName:         user.LastName,
			Telephone:        user.Telephone,
			ProfileImage:     pic.PublicUrl,
			ReachableByPhone: user.ReachableByPhone,
		}

	} else {
		daoPic := dao.NewStakeholderProfileImageDAO()
		pic, err := daoPic.GetByField(authorId, "user_id")
		if err != nil && err.Error() != "record not found" {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		responseDto = response.UserDto{
			Email:            stakeholder.Email,
			ID:               stakeholder.ID,
			FirstName:        stakeholder.FirstName,
			LastName:         stakeholder.LastName,
			Telephone:        "",
			ProfileImage:     pic.PublicUrl,
			ReachableByPhone: false,
		}
	}

	c.JSON(200, responseDto)
}
