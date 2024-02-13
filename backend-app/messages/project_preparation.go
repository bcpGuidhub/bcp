package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditProjectPreparation struct {
	Path               string
	Message            string
	ProjectPreparation *models.ProjectPreparation
}
