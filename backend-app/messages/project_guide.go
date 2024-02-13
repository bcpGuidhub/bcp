package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateGuide struct {
	Message        string
	Guide          *models.ProjectGuide
	GuideLandmarks []*models.ProjectGuideLandmark
}
type GetGuide struct {
	Message        string
	Guide          *models.ProjectGuide
	GuideLandmarks []models.ProjectGuideLandmark
}
type EditGuide struct {
	Message string
	Guide   *models.ProjectGuide
}
