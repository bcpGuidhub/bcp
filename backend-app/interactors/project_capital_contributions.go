package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectCapitalContributionDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type projectCapitalContributionEditPayload struct {
	Id                        string `form:"id" json:"id" binding:"required"`
	CapitalContributionType   string `form:"type_capital_contribution" json:"type_capital_contribution"`
	CapitalContributionAmount string `form:"contribution_amount" json:"contribution_amount"`
	YearOfContribution        string `form:"year_of_contribution" json:"year_of_contribution"`
	MonthOfContribution       string `form:"month_of_contribution" json:"month_of_contribution"`
}

type projectCapitalContributionCreationPayload struct {
	CapitalContributionType   string `form:"type_capital_contribution" json:"type_capital_contribution" binding:"required"`
	CapitalContributionAmount string `form:"contribution_amount" json:"contribution_amount" binding:"required"`
	YearOfContribution        string `form:"year_of_contribution" json:"year_of_contribution" binding:"required"`
	MonthOfContribution       string `form:"month_of_contribution" json:"month_of_contribution" binding:"required"`
}

func CreateProjectCapitalContribution(c *gin.Context) {
	projectId := c.Param("id")

	var p projectCapitalContributionCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectCapitalContribution{
		ProjectId:                 projectId,
		CapitalContributionType:   p.CapitalContributionType,
		CapitalContributionAmount: p.CapitalContributionAmount,
		YearOfContribution:        p.YearOfContribution,
		MonthOfContribution:       p.MonthOfContribution,
	}
	dao := dao.NewProjectCapitalContributionDAO()
	svc := services.NewProjectCapitalContributionService(dao)
	i, err := svc.CreateProjectCapitalContribution(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateCapitalContribution(&i))
}

func FetchProjectCapitalContributions(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectCapitalContributions(projectId))
}

func EditProjectCapitalContribution(c *gin.Context) {
	var p projectCapitalContributionEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectCapitalContributionDAO()
	svc := services.NewProjectCapitalContributionService(dao)
	pI := models.ProjectCapitalContribution{
		ID:                        p.Id,
		CapitalContributionType:   p.CapitalContributionType,
		CapitalContributionAmount: p.CapitalContributionAmount,
		YearOfContribution:        p.YearOfContribution,
		MonthOfContribution:       p.MonthOfContribution,
	}
	i, err := svc.EditProjectCapitalContribution(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditCapitalContribution(i))
}

func DeleteProjectCapitalContribution(c *gin.Context) {
	projectId := c.Param("id")

	var i projectCapitalContributionDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectCapitalContributionDAO()
	svc := services.NewProjectCapitalContributionService(dao)
	p := models.ProjectCapitalContribution{
		ID: i.Id,
	}
	if err := svc.DeleteCapitalContribution(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectCapitalContributions(projectId))
}
