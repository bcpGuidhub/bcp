package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type guideCaseStudy struct {
	GuideId   string   `form:"id" json:"id" binding:"required"`
	ProjectId string   `form:"project_id" json:"project_id" binding:"required"`
	Cases     []string `form:"cases" json:"cases" binding:"required"`
}

func EditGuideCaseStudy(c *gin.Context) {
	var pl guideCaseStudy
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewGuideCaseStudyDAO()
	svc := services.NewGuideCaseStudyService(dao)
	plObject := models.GuideCaseStudy{
		ID:        pl.GuideId,
		ProjectId: pl.ProjectId,
		Cases:     pl.Cases,
	}
	m, err := svc.EditGuideCaseStudy(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, m.GuideCaseStudy)
}
func FetchGuideCaseStudy(c *gin.Context) {
	id := c.Param("guide")
	dao := dao.NewGuideCaseStudyDAO()
	svc := services.NewGuideCaseStudyService(dao)
	guideCs, err := svc.GetById(id)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, guideCs)
}
