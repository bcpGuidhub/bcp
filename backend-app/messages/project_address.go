package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditProjectAddress struct {
	Message        string
	ProjectAddress *models.ProjectAddress
}
