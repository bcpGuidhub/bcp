package webrtc

import (
	// "net/http"

	"net/http"

	"github.com/gin-gonic/gin"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/webrtc/collider"
)

func NewSignalingWebRtc(projectId string) *collider.Collider {
	return collider.NewCollider(projectId)
}

func WebSocketHandler(c *gin.Context) {
	_, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	projectId := c.Param("id")
	signaling := NewSignalingWebRtc(projectId)

	signaling.Run(c, projectId)
}

func WebSocketStakeholder(c *gin.Context) {
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	signaling := NewSignalingWebRtc(stakeholder.ProjectId)

	signaling.Run(c, stakeholder.ProjectId)
}
