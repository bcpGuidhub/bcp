package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateProject struct {
	Message string
}
type EditProject struct {
	Message string
	Project *models.Project
}
