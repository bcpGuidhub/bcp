package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectExpenseDao interface {
	EditProjectExpense(pp *models.ProjectExpense) (*models.ProjectExpense, error)
	CreateProjectExpense(pp *models.ProjectExpense) error
	DeleteExpense(p *models.ProjectExpense) error
	ResetVat(projectId string) error
}

type ProjectExpenseService struct {
	dao projectExpenseDao
}

func NewProjectExpenseService(dao projectExpenseDao) *ProjectExpenseService {
	return &ProjectExpenseService{dao: dao}
}
func (svc *ProjectExpenseService) CreateProjectExpense(p *models.ProjectExpense) (messages.CreateExpense, error) {
	if err := svc.dao.CreateProjectExpense(p); err != nil {
		return messages.CreateExpense{}, err
	}
	return messages.CreateExpense{
		Expense: p,
	}, nil
}

func (svc *ProjectExpenseService) ResetVat(projectId string) (err error) {
	return svc.dao.ResetVat(projectId)
}
func (svc *ProjectExpenseService) EditProjectExpense(p *models.ProjectExpense) (*models.ProjectExpense, error) {
	p, err := svc.dao.EditProjectExpense(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectExpenseService) DeleteExpense(p *models.ProjectExpense) error {
	return svc.dao.DeleteExpense(p)
}
