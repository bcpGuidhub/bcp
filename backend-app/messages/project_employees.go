package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateEmployee struct {
	Message  string
	Employee *models.ProjectEmployee
}
