package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateAssociatesCapitalContribution struct {
	Message                       string
	AssociatesCapitalContribution *models.ProjectAssociatesCapitalContribution
}
