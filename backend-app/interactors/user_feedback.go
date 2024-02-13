package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type createFeedbackPayload struct {
	Answer   string `json:"answer" binding:"required"`
	Question string `json:"question" binding:"required"`
	MetaType string `json:"meta_type" binding:"required"`
	Label    string `json:"label" binding:"required"`
}

// type createFeedback struct {
// 	Answer   string `json:"answer" binding:"required"`
// 	Question string `json:"question" binding:"required"`
// }

type editUserFeedback struct {
	Answer     string `json:"answer" binding:"required"`
	FeedbackId string `json:"feedback_id" binding:"required"`
}

func CreateUserFeedback(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var cf createFeedbackPayload
	if err := c.ShouldBindJSON(&cf); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	feedbackDao := dao.NewUserFeedbackQuestionAnswerDAO()
	feedback := models.UserFeedbackQuestionAnswer{
		MetaType: cf.MetaType,
		Label:    cf.Label,
		Answer:   cf.Answer,
		Question: cf.Question,
		UserId:   user.ID,
	}
	if err := feedbackDao.CreateUserFeedbackQuestionAnswer(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(200, feedback)
}

func GetUserFeedback(c *gin.Context) {
	mType := c.Param("type")
	userId := c.Param("user_id")
	label := c.Param("label")
	feedbackDao := dao.NewUserFeedbackQuestionAnswerDAO()
	feedback := feedbackDao.FetchUserFeedbackQuestionAnswers(mType, label, userId)
	c.JSON(200, feedback)
}

func EditUserFeedback(c *gin.Context) {
	var cf editUserFeedback
	if err := c.ShouldBindJSON(&cf); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	feedbackDao := dao.NewUserFeedbackQuestionAnswerDAO()
	if err := feedbackDao.UpdateField(&models.UserFeedbackQuestionAnswer{ID: cf.FeedbackId}, "answer", cf.Answer); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	feedback, err := feedbackDao.GetById(cf.FeedbackId)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(200, feedback)
}
