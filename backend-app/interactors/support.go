package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type supportMessagePayload struct {
	Email      string `json:"email" binding:"required"`
	FirstName  string `json:"first_name" binding:"required"`
	LastName   string `json:"last_name" binding:"required"`
	Telephone  string `json:"phone" binding:"required"`
	City       string `json:"city" binding:"required"`
	Profession string `json:"profession" binding:"required"`
	Message    string `json:"message" binding:"required"`
}

func SendContactMessage(c *gin.Context) {
	var payload supportMessagePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	obj := map[string]string{
		"email":      payload.Email,
		"first_name": payload.FirstName,
		"last_name":  payload.LastName,
		"telephone":  payload.Telephone,
		"city":       payload.City,
		"profession": payload.Profession,
		"message":    payload.Message,
	}
	_, err := messages.SendSupportEmail(obj, services.EmailAdmin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, "email sent")
}
