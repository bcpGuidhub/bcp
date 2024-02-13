package inquisite

import (
	"context"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/models/inquisite"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbname                       = "DB_INQUIST"
	DB                           = os.Getenv(dbname)
	getActivePostDbCollection    = "posts.active"
	dbCollectionPostsTags        = "posts.tags"
	dbCollectionTagsLabels       = "tags.labels"
	dbCollectionTagsDescriptions = "tags.descriptions"
	dbCollectionPostAnswers      = "posts.answers"
	dbCollectionPostsVotes       = "posts.votes"
	dbCollectionFlagPosts        = "flags.posts"
)

func GetPosts(c *gin.Context) {
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	var posts []inquisite.ActivePost
	postsResponse := make([]inquisite.ActivePost, 0)
	collection := dbClient.Collection(getActivePostDbCollection)
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err = cursor.All(context.TODO(), &posts); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	for _, post := range posts {
		if post.Revisions != nil && len(post.Revisions) > 0 {
			var postResponse inquisite.ActivePost = post
			revisionAuthors := make([]inquisite.RevisionAuthor, 0)
			for _, revision := range post.Revisions {
				var stakeholder *models.ProjectStakeholder
				var user *models.User

				daoUser := dao.NewUserDAO()
				user, err := daoUser.GetById(revision.AuthorId)
				if err != nil && !gorm.IsRecordNotFoundError(err) {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}

				if gorm.IsRecordNotFoundError(err) {
					daoStakeholder := dao.NewProjectStakeholderDAO()
					stakeholder, err = daoStakeholder.GetById(revision.AuthorId)
					if err != nil && !gorm.IsRecordNotFoundError(err) {
						c.JSON(http.StatusBadRequest, err.Error())
						return
					}
				}
				if user.ID != "" {
					daoPic := dao.NewUserProfileImageDAO()
					pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
					if err != nil && err.Error() != "record not found" {
						c.JSON(http.StatusBadRequest, err.Error())
						return
					}
					revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
						Email:        user.Email,
						ID:           user.ID,
						FirstName:    user.FirstName,
						LastName:     user.LastName,
						ProfileImage: pic.PublicUrl,
					})
				} else {
					daoPic := dao.NewStakeholderProfileImageDAO()
					pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
					if err != nil && err.Error() != "record not found" {
						c.JSON(http.StatusBadRequest, err.Error())
						return
					}
					revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
						Email:        stakeholder.Email,
						ID:           stakeholder.ID,
						FirstName:    stakeholder.FirstName,
						LastName:     stakeholder.LastName,
						ProfileImage: pic.PublicUrl,
					})
				}
			}
			postResponse.RevisionAuthors = revisionAuthors
			postsResponse = append(postsResponse, postResponse)
		}
	}

	c.JSON(200, postsResponse)
}

func GetPostsBy(c *gin.Context) {
	query := c.Request.URL.Query().Get("title")
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	var posts []inquisite.ActivePost
	collection := dbClient.Collection(getActivePostDbCollection)
	// cursor, err := collection.Find(context.TODO(), primitive.D{
	// 	{Key: "revisions.title", Value: query},
	// })
	filter := bson.M{
		"revisions.title": bson.M{
			"$regex": primitive.Regex{
				Pattern: "^" + query + "*",
				Options: "i",
			},
		},
	}
	cursor, err := collection.Find(context.TODO(), filter)

	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err = cursor.All(context.TODO(), &posts); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	for i, post := range posts {
		if post.Revisions != nil && len(post.Revisions) > 0 {
			revisionAuthors := make([]inquisite.RevisionAuthor, 0)
			for _, revision := range post.Revisions {
				daoUser := dao.NewUserDAO()
				u, err := daoUser.GetById(revision.AuthorId)
				if err != nil {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}
				daoPic := dao.NewUserProfileImageDAO()
				pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
				if err != nil && err.Error() != "record not found" {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}
				revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
					Email:        u.Email,
					ID:           u.ID,
					FirstName:    u.FirstName,
					LastName:     u.LastName,
					ProfileImage: pic.PublicUrl,
				})
			}
			posts[i].RevisionAuthors = revisionAuthors
		}
	}

	c.JSON(200, posts)
}

func GetPostById(c *gin.Context) {
	id := c.Request.URL.Query().Get("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": id}
	var post inquisite.ActivePost
	cxt := context.Background()
	collection := dbClient.Collection(getActivePostDbCollection)
	err := collection.FindOne(cxt, filter).Decode(&post)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	revisionAuthors := make([]inquisite.RevisionAuthor, 0)

	for _, revision := range post.Revisions {
		var stakeholder *models.ProjectStakeholder
		var user *models.User

		daoUser := dao.NewUserDAO()
		user, err := daoUser.GetById(revision.AuthorId)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		if gorm.IsRecordNotFoundError(err) {
			daoStakeholder := dao.NewProjectStakeholderDAO()
			stakeholder, err = daoStakeholder.GetById(revision.AuthorId)
			if err != nil && !gorm.IsRecordNotFoundError(err) {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
		}

		if user.ID != "" {
			daoPic := dao.NewUserProfileImageDAO()
			pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
			if err != nil && err.Error() != "record not found" {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
				Email:        user.Email,
				ID:           user.ID,
				FirstName:    user.FirstName,
				LastName:     user.LastName,
				ProfileImage: pic.PublicUrl,
			})
		} else {
			daoPic := dao.NewStakeholderProfileImageDAO()
			pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
			if err != nil && err.Error() != "record not found" {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
				Email:        stakeholder.Email,
				ID:           stakeholder.ID,
				FirstName:    stakeholder.FirstName,
				LastName:     stakeholder.LastName,
				ProfileImage: pic.PublicUrl,
			})
		}

	}
	post.RevisionAuthors = revisionAuthors
	c.JSON(200, post)
}

func GetPostAnswer(c *gin.Context) {
	id := c.Request.URL.Query().Get("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	answerId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	filter := bson.M{"_id": answerId}
	var answer inquisite.PostAnswer
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionPostAnswers)
	err = collection.FindOne(cxt, filter).Decode(&answer)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	revisionAuthors := make([]inquisite.RevisionAuthor, 0)

	for _, revision := range answer.Revisions {
		var stakeholder *models.ProjectStakeholder
		var user *models.User

		daoUser := dao.NewUserDAO()
		user, err := daoUser.GetById(revision.AuthorId)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		if gorm.IsRecordNotFoundError(err) {
			daoStakeholder := dao.NewProjectStakeholderDAO()
			stakeholder, err = daoStakeholder.GetById(revision.AuthorId)
			if err != nil && !gorm.IsRecordNotFoundError(err) {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
		}

		if user.ID != "" {
			daoPic := dao.NewUserProfileImageDAO()
			pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
			if err != nil && err.Error() != "record not found" {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
				Email:        user.Email,
				ID:           user.ID,
				FirstName:    user.FirstName,
				LastName:     user.LastName,
				ProfileImage: pic.PublicUrl,
			})
		} else {
			daoPic := dao.NewStakeholderProfileImageDAO()
			pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
			if err != nil && err.Error() != "record not found" {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
				Email:        stakeholder.Email,
				ID:           stakeholder.ID,
				FirstName:    stakeholder.FirstName,
				LastName:     stakeholder.LastName,
				ProfileImage: pic.PublicUrl,
			})
		}

	}
	answer.RevisionAuthors = revisionAuthors

	c.JSON(200, answer)
}

func GetPostTags(c *gin.Context) {
	id := c.Request.URL.Query().Get("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": id}

	ctx := context.Background()
	collection := dbClient.Collection(dbCollectionPostsTags)

	// Begin by finding all post tags,
	// with reference to this aggregate as stated
	// in  the filter.
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var tags []inquisite.PostTags
	if err = cursor.All(ctx, &tags); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var tagsUIbound []inquisite.PostUITags
	for _, t := range tags {

		var tagUIbound inquisite.PostUITags
		var tagLabel inquisite.TagLabel
		var tagDescription inquisite.TagDescription

		// get the tag label referenced in the post tag
		// through LabelId.
		collection = dbClient.Collection(dbCollectionTagsLabels)
		// labelId, err := primitive.ObjectIDFromHex(t.LabelId)
		// if err != nil {
		// 	c.JSON(http.StatusBadRequest, err.Error())
		// 	return
		// }
		filter = bson.M{"_id": t.LabelId}
		err = collection.FindOne(ctx, filter).Decode(&tagLabel)
		if err != nil && err != mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		// get the tag description
		// referencing the tag label through tag_label_id
		collection = dbClient.Collection(dbCollectionTagsDescriptions)
		filter = bson.M{"tag_label_id": t.LabelId}
		err = collection.FindOne(ctx, filter).Decode(&tagDescription)
		if err != nil && err != mongo.ErrNilDocument && err.Error() != "mongo: no documents in result" {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		// get the count ref to this tag.
		filter = bson.M{"tag_label_id": t.LabelId}
		count, err := dbClient.Collection(dbCollectionPostsTags).CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		tagUIbound = inquisite.PostUITags{
			Id:          t.Id.Hex(), //PostTag id
			AggregateId: t.AggregateId,
			Label:       tagLabel.Label,
			Description: tagDescription,
			Count:       count,
		}
		tagsUIbound = append(tagsUIbound, tagUIbound)
	}

	c.JSON(200, tagsUIbound)
}

func GetPostAnswers(c *gin.Context) {
	id := c.Request.URL.Query().Get("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": id}

	ctx := context.Background()
	collection := dbClient.Collection(dbCollectionPostAnswers)

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var answers []inquisite.PostAnswer
	if err = cursor.All(ctx, &answers); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	for i, answer := range answers {
		revisionAuthors := make([]inquisite.RevisionAuthor, 0)

		for _, revision := range answer.Revisions {
			var stakeholder *models.ProjectStakeholder
			var user *models.User

			daoUser := dao.NewUserDAO()
			user, err := daoUser.GetById(revision.AuthorId)
			if err != nil && !gorm.IsRecordNotFoundError(err) {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}

			if gorm.IsRecordNotFoundError(err) {
				daoStakeholder := dao.NewProjectStakeholderDAO()
				stakeholder, err = daoStakeholder.GetById(revision.AuthorId)
				if err != nil && !gorm.IsRecordNotFoundError(err) {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}
			}

			if user.ID != "" {
				daoPic := dao.NewUserProfileImageDAO()
				pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
				if err != nil && err.Error() != "record not found" {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}
				revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
					Email:        user.Email,
					ID:           user.ID,
					FirstName:    user.FirstName,
					LastName:     user.LastName,
					ProfileImage: pic.PublicUrl,
				})
			} else {
				daoPic := dao.NewStakeholderProfileImageDAO()
				pic, err := daoPic.GetByField(revision.AuthorId, "user_id")
				if err != nil && err.Error() != "record not found" {
					c.JSON(http.StatusBadRequest, err.Error())
					return
				}
				revisionAuthors = append(revisionAuthors, inquisite.RevisionAuthor{
					Email:        stakeholder.Email,
					ID:           stakeholder.ID,
					FirstName:    stakeholder.FirstName,
					LastName:     stakeholder.LastName,
					ProfileImage: pic.PublicUrl,
				})
			}

		}
		answers[i].RevisionAuthors = revisionAuthors
	}
	c.JSON(200, answers)
}

func GetPostVotes(c *gin.Context) {
	postId := c.Param("id")
	dbClient := config.Datastore.ReadDatabase.Database(DB)

	filter := bson.M{"aggregate_id": postId}
	var post inquisite.ActivePost
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionPostsVotes)
	err := collection.FindOne(cxt, filter).Decode(&post)
	if err != nil && err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(200, post)
}

func GetPostFlag(c *gin.Context) {
	aggregateId := c.Param("id")

	dbClient := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": aggregateId}
	postFlag := make(map[string]interface{})
	cxt := context.Background()
	collection := dbClient.Collection(dbCollectionFlagPosts)
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
