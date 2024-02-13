package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

// CreateUser is return message to the calling client.
// When user resource are created.
type CreateUser struct {
	Path    string
	Message string
	User    *models.User
	Project *models.Project
}

type CreateProjectStakeholder struct {
	Path    string
	Message string
	User    *models.ProjectStakeholder
	Project *models.Project
}

type AuthUser struct {
	Path    string
	Message string
	User    *models.User
	Project *models.Project
}
