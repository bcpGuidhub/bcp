package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectAssociatesCapitalContributionDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}
type projectAssociatesCapitalContributionEditPayload struct {
	Id                                 string `form:"id" json:"id" binding:"required"`
	TypeOfOperation                    string `form:"type_of_operation" json:"type_of_operation"`
	YearOfContributionRepayment        string `form:"year_of_contribution_repayment" json:"year_of_contribution_repayment"`
	MonthOfContributionRepayment       string `form:"month_of_contribution_repayment" json:"month_of_contribution_repayment"`
	AssociateCapitalContributionAmount string `form:"associate_capital_contribution_amount" json:"associate_capital_contribution_amount"`
}
type projectAssociatesCapitalContributionCreationPayload struct {
	TypeOfOperation                    string `form:"type_of_operation" json:"type_of_operation" binding:"required"`
	YearOfContributionRepayment        string `form:"year_of_contribution_repayment" json:"year_of_contribution_repayment" binding:"required"`
	MonthOfContributionRepayment       string `form:"month_of_contribution_repayment" json:"month_of_contribution_repayment" binding:"required"`
	AssociateCapitalContributionAmount string `form:"associate_capital_contribution_amount" json:"associate_capital_contribution_amount" binding:"required"`
}

func CreateProjectAssociatesCapitalContribution(c *gin.Context) {
	projectId := c.Param("id")

	var p projectAssociatesCapitalContributionCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectAssociatesCapitalContribution{
		ProjectId:                          projectId,
		TypeOfOperation:                    p.TypeOfOperation,
		YearOfContributionRepayment:        p.YearOfContributionRepayment,
		MonthOfContributionRepayment:       p.MonthOfContributionRepayment,
		AssociateCapitalContributionAmount: p.AssociateCapitalContributionAmount,
	}
	dao := dao.NewProjectAssociatesCapitalContributionDAO()
	svc := services.NewProjectAssociatesCapitalContributionService(dao)
	i, err := svc.CreateProjectAssociatesCapitalContribution(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateAssociatesCapitalContribution(&i))
}

func FetchProjectAssociatesCapitalContributions(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectAssociatesCapitalContributions(projectId))
}

func EditProjectAssociatesCapitalContribution(c *gin.Context) {
	var p projectAssociatesCapitalContributionEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectAssociatesCapitalContributionDAO()
	svc := services.NewProjectAssociatesCapitalContributionService(dao)
	pI := models.ProjectAssociatesCapitalContribution{
		ID:                                 p.Id,
		TypeOfOperation:                    p.TypeOfOperation,
		YearOfContributionRepayment:        p.YearOfContributionRepayment,
		MonthOfContributionRepayment:       p.MonthOfContributionRepayment,
		AssociateCapitalContributionAmount: p.AssociateCapitalContributionAmount,
	}
	i, err := svc.EditProjectAssociatesCapitalContribution(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditAssociatesCapitalContribution(i))
}

func DeleteProjectAssociatesCapitalContribution(c *gin.Context) {
	projectId := c.Param("id")

	var i projectAssociatesCapitalContributionDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectAssociatesCapitalContributionDAO()
	svc := services.NewProjectAssociatesCapitalContributionService(dao)
	p := models.ProjectAssociatesCapitalContribution{
		ID: i.Id,
	}
	if err := svc.DeleteAssociatesCapitalContribution(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectAssociatesCapitalContributions(projectId))
}
