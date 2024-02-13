package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateStakeholder struct {
	Message     string
	Stakeholder *models.ProjectStakeholder
}
