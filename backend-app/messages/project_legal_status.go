package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditProjectLegalStatus struct {
	Path               string
	Message            string
	ProjectLegalStatus *models.ProjectLegalStatus
}
