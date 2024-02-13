package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateRevenueSource struct {
	Message       string
	RevenueSource *models.ProjectRevenueSource
}
