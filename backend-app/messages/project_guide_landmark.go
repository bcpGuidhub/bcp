package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateGuideLandmark struct {
	Message       string
	GuideLandmark *models.ProjectGuideLandmark
}
