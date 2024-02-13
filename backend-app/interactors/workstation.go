package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
)

func FetchFundingDetails(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(http.StatusOK, response.OnFetchFundingDetails(projectId))
}

func FetchEmployeeDetails(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(http.StatusOK, response.OnFetchEmployeeDetails(projectId))
}

func FetchRevenueDetails(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(http.StatusOK, response.OnFetchRevenueDetails(projectId))
}

func FetchFinancialDetails(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(http.StatusOK, response.OnFetchFinancialDetails(projectId))
}
