package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateVerificationQuestion struct {
	Message              string
	VerificationQuestion *models.ProjectVerificationQuestion
}
