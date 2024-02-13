package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateExpense struct {
	Message string
	Expense *models.ProjectExpense
}
