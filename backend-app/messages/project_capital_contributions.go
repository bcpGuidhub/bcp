package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateCapitalContribution struct {
	Message             string
	CapitalContribution *models.ProjectCapitalContribution
}
