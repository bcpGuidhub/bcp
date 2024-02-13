package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateLoan struct {
	Message string
	Loan    *models.ProjectLoan
}
