package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

func GetToken(c *gin.Context) {
	t := c.Param("token")
	s := services.NewUserService(dao.NewUserDAO())
	if token, err := s.GetToken(t); err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	} else {
		valid := token.Valid()
		if valid {
			metaType := "user"
			err = middlewares.SetClientPasswordAuth(c, token.ID, metaType)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"status": valid,
				"id":     token.ID,
				"email":  token.User.Email,
			})
			return
		} else {
			middlewares.ClearAuthMeta(c, "user")
			c.JSON(http.StatusBadRequest, gin.H{"error": "token invalid"})
		}
	}
}

func GetStakeholderToken(c *gin.Context) {
	t := c.Param("token")
	s := services.NewProjectStakeholderService(dao.NewProjectStakeholderDAO())
	if token, err := s.GetToken(t); err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	} else {
		valid := token.Valid()
		if valid {
			metaType := "stakeholder"
			err = middlewares.SetClientPasswordAuth(c, token.ID, metaType)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			stakeholder, err := s.GetById(token.ID)
			if err != nil {
				c.AbortWithStatus(http.StatusNotFound)
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status": valid,
				"id":     token.ID,
				"email":  stakeholder.Email,
			})
			return
		} else {
			middlewares.ClearAuthMeta(c, "stakeholder")
			c.JSON(http.StatusBadRequest, gin.H{"error": "token invalid"})
		}
	}
}
