package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectRevenueSourceDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type projectRevenueSourceEditPayload struct {
	Id                   string `form:"id" json:"id" binding:"required"`
	Name                 string `form:"name" json:"name" binding:"required"`
	SourceType           string `form:"source_type" json:"source_type" binding:"required"`
	AmountExcludingTaxes string `form:"amount_excluding_taxes" json:"amount_excluding_taxes" binding:"required"`
	Year                 string `form:"year" json:"year" binding:"required"`
	Month                string `form:"month" json:"month" binding:"required"`
	VatRate              string `form:"vat_rate" json:"vat_rate" binding:"required"`
}

type projectRevenueSourceCreationPayload struct {
	Name                 string `form:"name" json:"name" binding:"required"`
	SourceType           string `form:"source_type" json:"source_type" binding:"required"`
	AmountExcludingTaxes string `form:"amount_excluding_taxes" json:"amount_excluding_taxes" binding:"required"`
	Year                 string `form:"year" json:"year" binding:"required"`
	Month                string `form:"month" json:"month" binding:"required"`
	VatRate              string `form:"vat_rate" json:"vat_rate" binding:"required"`
}

func CreateProjectRevenueSource(c *gin.Context) {
	projectId := c.Param("id")

	var p projectRevenueSourceCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectRevenueSource{
		ProjectId:            projectId,
		Name:                 p.Name,
		SourceType:           p.SourceType,
		AmountExcludingTaxes: p.AmountExcludingTaxes,
		Year:                 p.Year,
		Month:                p.Month,
		VatRate:              p.VatRate,
	}
	dao := dao.NewProjectRevenueSourceDAO()
	svc := services.NewProjectRevenueSourceService(dao)
	i, err := svc.CreateProjectRevenueSource(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateRevenueSource(&i))
}

func FetchProjectRevenueSources(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectRevenueSources(user.ID))
}

func EditProjectRevenueSource(c *gin.Context) {
	var p projectRevenueSourceEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectRevenueSourceDAO()
	svc := services.NewProjectRevenueSourceService(dao)
	pI := models.ProjectRevenueSource{
		ID:                   p.Id,
		Name:                 p.Name,
		SourceType:           p.SourceType,
		AmountExcludingTaxes: p.AmountExcludingTaxes,
		Year:                 p.Year,
		Month:                p.Month,
		VatRate:              p.VatRate,
	}
	i, err := svc.EditProjectRevenueSource(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditRevenueSource(i))
}

func DeleteProjectRevenueSource(c *gin.Context) {
	projectId := c.Param("id")

	var i projectRevenueSourceDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectRevenueSourceDAO()
	svc := services.NewProjectRevenueSourceService(dao)
	p := models.ProjectRevenueSource{
		ID: i.Id,
	}
	if err := svc.DeleteRevenueSource(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectRevenueSources(projectId))
}
