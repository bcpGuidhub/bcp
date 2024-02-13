package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditProjectFinanceCapacity struct {
	Message         string
	FinanceCapacity *models.ProjectFinanceCapacity
}
