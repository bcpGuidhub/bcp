package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateRevenuesYear struct {
	Message      string
	RevenuesYear *models.ProjectRevenuesYear
}
