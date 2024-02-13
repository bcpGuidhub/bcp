package interactors

import (
	"github.com/gin-gonic/gin"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
)

func GetBusinessPlan(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.GetBusinessPlan(projectId))
}
