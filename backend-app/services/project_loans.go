package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectLoanDao interface {
	EditProjectLoan(pp *models.ProjectLoan) (*models.ProjectLoan, error)
	CreateProjectLoan(pp *models.ProjectLoan) error
	DeleteLoan(p *models.ProjectLoan) error
}

type ProjectLoanService struct {
	dao projectLoanDao
}

func NewProjectLoanService(dao projectLoanDao) *ProjectLoanService {
	return &ProjectLoanService{dao: dao}
}
func (svc *ProjectLoanService) CreateProjectLoan(p *models.ProjectLoan) (messages.CreateLoan, error) {
	if err := svc.dao.CreateProjectLoan(p); err != nil {
		return messages.CreateLoan{}, err
	}
	return messages.CreateLoan{
		Loan: p,
	}, nil
}

func (svc *ProjectLoanService) EditProjectLoan(p *models.ProjectLoan) (*models.ProjectLoan, error) {
	p, err := svc.dao.EditProjectLoan(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectLoanService) DeleteLoan(p *models.ProjectLoan) error {
	return svc.dao.DeleteLoan(p)
}
