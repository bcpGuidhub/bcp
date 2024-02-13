package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateInvestment struct {
	Message    string
	Investment *models.ProjectInvestment
}
