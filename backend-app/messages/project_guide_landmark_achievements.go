package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateGuideLandmarkAchievement struct {
	Message                  string
	GuideLandmarkAchievement *models.ProjectGuideLandmarkAchievement
}
