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

type ProjectFinanceCapacity struct {
	ID           string   `form:"id" json:"id" binding:"required"`
	Declarations []string `form:"declarations" json:"declarations" binding:"required"`
}

func EditProjectFinanceCapacity(c *gin.Context) {
	var pl ProjectFinanceCapacity
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectFinanceCapacityDAO()
	svc := services.NewProjectFinanceCapacityService(dao)
	plObject := models.ProjectFinanceCapacity{
		ID:           pl.ID,
		Declarations: pl.Declarations,
	}
	m, err := svc.EditProjectFinanceCapacity(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectFinanceCapacity(&m))
}
func FetchProjectFinanceCapacity(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	c.JSON(http.StatusOK, response.OnFetchProjectFinanceCapacity(user.ID))
}
