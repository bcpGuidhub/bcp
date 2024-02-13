package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectInvestmentDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type projectInvestmentEditPayload struct {
	Id                          string `form:"id" json:"id" binding:"required"`
	InvestmentType              string `form:"investment_type" json:"investment_type"`
	InvestmentName              string `form:"investment_name" json:"investment_name"`
	InvestmentAmountTaxIncluded string `form:"investment_amount_tax_included" json:"investment_amount_tax_included"`
	YearOfPurchase              string `form:"year_of_purchase" json:"year_of_purchase"`
	MonthOfPurchase             string `form:"month_of_purchase" json:"month_of_purchase"`
	Duration                    string `form:"duration" json:"duration"`
	VatRateOnInvestment         string `form:"vat_rate_on_investment" json:"vat_rate_on_investment"`
	Contribution                string `form:"contribution" json:"contribution"`
}

type projectInvestmentCreationPayload struct {
	ProjectId                   string `form:"project_id" json:"project_id" binding:"required"`
	InvestmentType              string `form:"investment_type" json:"investment_type" binding:"required"`
	InvestmentName              string `form:"investment_name" json:"investment_name" binding:"required"`
	InvestmentAmountTaxIncluded string `form:"investment_amount_tax_included" json:"investment_amount_tax_included" binding:"required"`
	YearOfPurchase              string `form:"year_of_purchase" json:"year_of_purchase" binding:"required"`
	MonthOfPurchase             string `form:"month_of_purchase" json:"month_of_purchase" binding:"required"`
	Duration                    string `form:"duration" json:"duration" binding:"required"`
	VatRateOnInvestment         string `form:"vat_rate_on_investment" json:"vat_rate_on_investment" binding:"required"`
	Contribution                string `form:"contribution" json:"contribution" binding:"required"`
}

func CreateProjectInvestment(c *gin.Context) {
	projectId := c.Param("id")

	var p projectInvestmentCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectInvestment{
		ProjectId:                   projectId,
		InvestmentType:              p.InvestmentType,
		InvestmentName:              p.InvestmentName,
		InvestmentAmountTaxIncluded: p.InvestmentAmountTaxIncluded,
		YearOfPurchase:              p.YearOfPurchase,
		MonthOfPurchase:             p.MonthOfPurchase,
		Duration:                    p.Duration,
		VatRateOnInvestment:         p.VatRateOnInvestment,
		Contribution:                p.Contribution,
	}
	dao := dao.NewProjectInvestmentDAO()
	svc := services.NewProjectInvestmentService(dao)
	i, err := svc.CreateProjectInvestment(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateInvestment(&i))
}

func FetchProjectInvestments(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectInvestments(projectId))
}

func EditProjectInvestment(c *gin.Context) {
	projectId := c.Param("id")

	var p projectInvestmentEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectInvestmentDAO()
	svc := services.NewProjectInvestmentService(dao)
	pI := models.ProjectInvestment{
		ID:                          p.Id,
		InvestmentType:              p.InvestmentType,
		InvestmentName:              p.InvestmentName,
		InvestmentAmountTaxIncluded: p.InvestmentAmountTaxIncluded,
		YearOfPurchase:              p.YearOfPurchase,
		MonthOfPurchase:             p.MonthOfPurchase,
		Duration:                    p.Duration,
		VatRateOnInvestment:         p.VatRateOnInvestment,
		Contribution:                p.Contribution,
	}
	err := svc.EditProjectInvestment(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectInvestments(projectId))
}

func DeleteProjectInvestment(c *gin.Context) {
	projectId := c.Param("id")

	var i projectInvestmentDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectInvestmentDAO()
	svc := services.NewProjectInvestmentService(dao)
	p := models.ProjectInvestment{
		ID: i.Id,
	}
	if err := svc.DeleteInvestment(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectInvestments(projectId))
}
