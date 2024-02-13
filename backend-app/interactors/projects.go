package interactors

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
	"istio.io/pkg/log"
)

type ProjectFinancePayload struct {
	Message          string `form:"message" json:"message"`
	LastName         string `form:"last_name" json:"last_name"  binding:"required"`
	FirstName        string `form:"first_name" json:"first_name" binding:"required"`
	Telephone        string `form:"telephone" json:"telephone" binding:"required"`
	Email            string `form:"email" json:"email" binding:"required"`
	City             string `form:"city" json:"city" binding:"required"`
	TypeProject      string `form:"type_project" json:"type_project" binding:"required"`
	Sector           string `form:"sector" json:"sector" binding:"required"`
	Legal            string `form:"legal" json:"legal" binding:"required"`
	ApportsPersonnel string `form:"apports_personnel" json:"apports_personnel" binding:"required"`
	Loan             string `form:"loan" json:"loan" binding:"required"`
	BusinessPlan     string `form:"business_plan" json:"business_plan" binding:"required"`
	ExpertStatus     string `form:"expert_status" json:"expert_status" binding:"required"`
}

type projectLaunchPayload struct {
	Message       string `form:"message" json:"message"`
	AgencyAddress string `form:"agency_destination" json:"agency_destination"`
}

type ProjectCreationPayload struct {
	NameProject             string `form:"project_name" json:"project_name" binding:"required"`
	TypeProject             string `form:"type_project" json:"type_project" binding:"required"`
	SearchableAddress       string `form:"searchable_address" json:"searchable_address" binding:"required"`
	ActivitySector          string `form:"activity_sector" json:"activity_sector" binding:"required"`
	ProjectAdvancementStage string `form:"project_advancement_stage" json:"project_advancement_stage" binding:"required"`
}

type ProjectServiceCreationPayload struct {
	TypeServiceMetaLabel       []string `form:"type_service_meta_label" binding:"required"`
	TypeServiceMetaDescription string   `form:"type_service_meta_description"`
}

type ProjectUpdatePayload struct {
	TypeProject                 string `form:"type_project" json:"type_project"`
	SearchableAddress           string `form:"searchable_address" json:"searchable_address"`
	ActivitySector              string `form:"activity_sector" json:"activity_sector"`
	ProjectAdvancementStage     string `form:"project_advancement_stage" json:"project_advancement_stage"`
	ExpectedTurnover            string `form:"expected_turnover" json:"expected_turnover"`
	Hiring                      string `form:"hiring" json:"hiring"`
	ProjectBudget               string `form:"project_budget" json:"project_budget"`
	PersonalContributionsBudget string `form:"personal_contributions_budget" json:"personal_contributions_budget"`
}

type ExpertStatus struct {
	Status string `form:"expert_status" json:"expert_status" binding:"required"`
}

type ActivitySector struct {
	ActivitySector    string                `form:"activity_sector" binding:"required"`
	ProfileImage      *multipart.FileHeader `form:"profile_image"`
	ImageExt          string                `form:"content_type_ext"`
	SearchableAddress string                `form:"searchable_address"`
}

func ProjectCreate(c *gin.Context) {
	var payload ProjectCreationPayload

	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectDAO()
	svc := services.NewProjectService(dao)
	project := models.Project{
		UserId:                  user.ID,
		Name:                    payload.NameProject,
		TypeProject:             payload.TypeProject,
		SearchableAddress:       payload.SearchableAddress,
		ActivitySector:          payload.ActivitySector,
		ProjectAdvancementStage: payload.ProjectAdvancementStage,
		Status:                  "registered",
	}
	err = svc.CreateProject(&project)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}

	c.JSON(200, response.Project(project.ID))
}

func ActivityCreate(c *gin.Context) {
	var activity ActivitySector

	if err := c.ShouldBind(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	daoProject := dao.NewProjectDAO()
	svc := services.NewProjectService(daoProject)
	project := models.Project{
		UserId:            user.ID,
		ActivitySector:    activity.ActivitySector,
		SearchableAddress: activity.SearchableAddress,
		Status:            "registered",
	}
	err = svc.CreateProject(&project)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}
	// image upload is a long running process
	go func(activity ActivitySector, user *models.User) {
		if activity.ProfileImage != nil {
			log.Info(fmt.Sprintf("Begin loading profile pic %s", user.ID))
			file, err := activity.ProfileImage.Open()
			if err != nil {
				log.Errorf("error uploading profile image %v", err)
				return
			}
			if err = UserUploadProfileImage(user.ID, activity.ImageExt, file); err != nil {
				log.Errorf("error uploading profile image %v", err)
				return
			}
			contact, err := redis.MessageBrokerClient.ContactGet(user.ID)
			if err != nil {
				log.Errorf("error retrieving contact[uploading profile image] %v", err)
				return
			}
			daoPic := dao.NewUserProfileImageDAO()
			pic, err := daoPic.GetByField(user.ID, "user_id")
			if err != nil && !gorm.IsRecordNotFoundError(err) {
				log.Errorf("error retrieving [uploading profile image] %v", err)
				return
			}
			if err == nil && pic.PublicUrl != "" {
				contact.Avatar = pic.PublicUrl
				if err = redis.MessageBrokerClient.ContactUpdate(contact); err != nil {
					log.Errorf("failed to update contact profile pic %v", err)
					return
				}
				log.Info(fmt.Sprintf("Done adding profile pic to contact %s", contact.GUUID()))
			}
		}
	}(activity, user)

	c.JSON(200, response.Project(project.ID))
}

func EditProject(c *gin.Context) {
	projectId := c.Param("id")

	var payload ProjectUpdatePayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	hiring := false
	if payload.Hiring == "Oui" {
		hiring = true
	}
	dao := dao.NewProjectDAO()
	svc := services.NewProjectService(dao)
	project := models.Project{
		ID:                          projectId,
		TypeProject:                 payload.TypeProject,
		SearchableAddress:           payload.SearchableAddress,
		ActivitySector:              payload.ActivitySector,
		ProjectAdvancementStage:     payload.ProjectAdvancementStage,
		ExpectedTurnover:            payload.ExpectedTurnover,
		Hiring:                      hiring,
		ProjectBudget:               payload.ProjectBudget,
		PersonalContributionsBudget: payload.PersonalContributionsBudget,
	}
	m, err := svc.EditProject(&project)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}

	c.JSON(200, response.OnEditProject(&m))
}
func ProjectLaunch(c *gin.Context) {
	projectId := c.Param("id")

	var p projectLaunchPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	dao := dao.NewProjectDAO()
	svc := services.NewProjectService(dao)
	err := svc.LaunchProject(projectId, p.Message, p.AgencyAddress)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{
			"error": err.Error()})
		return
	}
	c.JSON(200, "rdv email sent")
}
func ProjectFinanceLaunch(c *gin.Context) {
	projectId := c.Param("id")

	var p ProjectFinancePayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	dao := dao.NewProjectDAO()
	m := map[string]string{
		"Message":          p.Message,
		"LastName":         p.LastName,
		"FirstName":        p.FirstName,
		"Telephone":        p.Telephone,
		"Email":            p.Email,
		"City":             p.City,
		"TypeProject":      p.TypeProject,
		"Sector":           p.Sector,
		"Legal":            p.Legal,
		"ApportsPersonnel": p.ApportsPersonnel,
		"Loan":             p.Loan,
		"BusinessPlan":     p.BusinessPlan,
		"ExpertStatus":     p.ExpertStatus,
	}
	if err := messages.SendProjectFinanceRdv(m, services.EmailAdmin); err != nil {
		if err[0] != nil && err[1] != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err[0].Error()})
			return
		}
	}
	project, err := dao.GetProjectById(projectId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	if err := dao.UpdateProjectFinanceValidationRdv(project, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	if err := dao.UpdateProjectFinanceValidationRdvDate(project, time.Now()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	c.JSON(200, "rdv email sent")
}
func ProjectServiceCreate(c *gin.Context) {
	var payload ProjectServiceCreationPayload

	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	dao := dao.NewProjectServiceDAO()
	svc := services.NewProjectSvcService(dao)
	projectService := models.ProjectService{
		MetaLabel:       payload.TypeServiceMetaLabel,
		MetaDescription: payload.TypeServiceMetaDescription,
	}
	m, err := svc.CreateProjectService(&projectService)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}
	c.JSON(200, gin.H{
		"message": m,
	})
}
func ProjectExpertStatus(c *gin.Context) {
	var p ExpertStatus
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectDAO()
	svc := services.NewProjectService(dao)
	m, err := svc.EditProject(&models.Project{
		UserId:       user.ID,
		ExpertStatus: p.Status,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}
	c.JSON(200, gin.H{
		"message": m,
	})

}
