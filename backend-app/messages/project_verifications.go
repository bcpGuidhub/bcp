package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateVerification struct {
	Message      string
	Verification *models.ProjectVerification
	Questions    []*models.ProjectVerificationQuestion
}
type EditVerification struct {
	Message      string
	Verification *models.ProjectVerification
	Questions    []*models.ProjectVerificationQuestion
}
