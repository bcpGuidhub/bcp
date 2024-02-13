package interactors

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectVerificationEditPayload struct {
	Id                           string                                    `form:"id" json:"id" binding:"required"`
	Visible                      bool                                      `form:"visible" json:"visible"`
	Label                        string                                    `form:"label" json:"label" binding:"required"`
	ProjectVerificationQuestions []projectVerificationQuestionsEditPayload `form:"project_verification_questions" json:"project_verification_questions"`
}
type projectVerificationQuestionsEditPayload struct {
	Id       string `form:"id" json:"id" binding:"required"`
	Label    string `form:"label" json:"label" binding:"required"`
	Response string `form:"response" json:"response" binding:"required"`
}
type projectVerificationsQuestionCreationPayload struct {
	Label    string `form:"label" json:"label" binding:"required"`
	Response string `form:"response" json:"response" binding:"required"`
}
type projectVerificationCreationPayload struct {
	Label                        string                                        `form:"label" json:"label" binding:"required"`
	Visible                      bool                                          `form:"visible" json:"visible" binding:"required"`
	ProjectVerificationQuestions []projectVerificationsQuestionCreationPayload `form:"project_verification_questions" json:"project_verification_questions" binding:"required"`
}
type verificationVisibile struct {
	Label   string `form:"label" json:"label" binding:"required"`
	Visible bool   `form:"visible" json:"visible" binding:"required"`
}
type projectVerificationVisibilityEditPayload struct {
	ProjectId  string                 `form:"project_id" json:"project_id" binding:"required"`
	Visibility []verificationVisibile `form:"visibility" json:"visibility" binding:"required"`
}

func CreateProjectVerification(c *gin.Context) {
	projectId := c.Param("id")

	var p projectVerificationCreationPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectVerification{
		ProjectId: projectId,
		Label:     p.Label,
		Visible:   p.Visible,
	}
	dao := dao.NewProjectVerificationDAO()
	svc := services.NewProjectVerificationService(dao)
	questions := []*models.ProjectVerificationQuestion{}
	for _, v := range p.ProjectVerificationQuestions {
		verificationQuestion := models.ProjectVerificationQuestion{
			Label:    v.Label,
			Response: v.Response,
		}
		questions = append(questions, &verificationQuestion)
	}
	_, err := svc.CreateProjectVerification(&pI, questions)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectVerifications(projectId))
}
func EditProjectVerification(c *gin.Context) {
	projectId := c.Param("id")

	var p projectVerificationEditPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectVerificationDAO()
	svc := services.NewProjectVerificationService(dao)
	pI := models.ProjectVerification{
		ID:      p.Id,
		Label:   p.Label,
		Visible: p.Visible,
	}
	questions := []*models.ProjectVerificationQuestion{}
	for _, v := range p.ProjectVerificationQuestions {
		verificationQuestion := models.ProjectVerificationQuestion{
			ID:       v.Id,
			Label:    v.Label,
			Response: v.Response,
		}
		questions = append(questions, &verificationQuestion)
	}
	_, err := svc.EditProjectVerification(&pI, questions)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectVerifications(projectId))
}
func EditProjectVerificationVisibility(c *gin.Context) {
	projectId := c.Param("id")

	var p projectVerificationVisibilityEditPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectVerificationDAO()
	svc := services.NewProjectVerificationService(dao)
	verifications := []*models.ProjectVerification{}
	for _, v := range p.Visibility {
		verification := models.ProjectVerification{
			ProjectId: projectId,
			Label:     v.Label,
			Visible:   v.Visible,
		}
		verifications = append(verifications, &verification)
	}
	err := svc.EditProjectVerificationVisibility(verifications)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectVerifications(projectId))
}
func FetchProjectVerifications(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectVerifications(user.ID))
}
func FetchProjectVerification(c *gin.Context) {
	projectId := c.Param("id")

	label := c.Param("label")

	dao := dao.NewProjectVerificationDAO()
	m, err := dao.GetByLabel(label, projectId)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(200, "doesn't exist")
		return
	}
	c.JSON(200, response.FetchProjectVerification(m))
}
func FetchProjectVerificatioAggregate(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(http.StatusOK, response.ProjectVerificationAggregatedWorkFlow(projectId))
}
