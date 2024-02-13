package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateRevenue struct {
	Message      string
	Revenue      *models.ProjectRevenue
	RevenueYears []*models.ProjectRevenuesYear
}

type EditRevenue struct {
	Message      string
	Revenue      *models.ProjectRevenue
	RevenueYears []*models.ProjectRevenuesYear
}
