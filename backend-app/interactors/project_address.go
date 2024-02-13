package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectAddress struct {
	ProjectId  string `form:"project_id" json:"project_id" binding:"required"`
	City       string `form:"city" json:"city" binding:"required"`
	Address    string `form:"address" json:"address" binding:"required"`
	PostalCode string `form:"postal_code" json:"postal_code" binding:"required"`
}

func EditProjectAddress(c *gin.Context) {
	var pl projectAddress
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectAddressDAO()
	svc := services.NewProjectAddressService(dao)
	plObject := models.ProjectAddress{
		ID:         pl.ProjectId,
		City:       pl.City,
		Address:    pl.Address,
		PostalCode: pl.PostalCode,
	}
	m, err := svc.EditProjectAddress(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error -- ": err})
		return
	}
	c.JSON(http.StatusOK, m.ProjectAddress)
}
func FetchProjectAddress(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewProjectAddressDAO()
	svc := services.NewProjectAddressService(dao)
	pAddress, err := svc.GetById(user.ID)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, pAddress)
}
