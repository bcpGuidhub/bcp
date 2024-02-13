package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectEmployeeDao interface {
	EditProjectEmployee(pp *models.ProjectEmployee) (*models.ProjectEmployee, error)
	CreateProjectEmployee(pp *models.ProjectEmployee) error
	DeleteEmployee(p *models.ProjectEmployee) error
}

type ProjectEmployeeService struct {
	dao projectEmployeeDao
}

func NewProjectEmployeeService(dao projectEmployeeDao) *ProjectEmployeeService {
	return &ProjectEmployeeService{dao: dao}
}
func (svc *ProjectEmployeeService) CreateProjectEmployee(p *models.ProjectEmployee) (messages.CreateEmployee, error) {
	if err := svc.dao.CreateProjectEmployee(p); err != nil {
		return messages.CreateEmployee{}, err
	}
	return messages.CreateEmployee{
		Employee: p,
	}, nil
}

func (svc *ProjectEmployeeService) EditProjectEmployee(p *models.ProjectEmployee) (*models.ProjectEmployee, error) {
	p, err := svc.dao.EditProjectEmployee(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectEmployeeService) DeleteEmployee(p *models.ProjectEmployee) error {
	return svc.dao.DeleteEmployee(p)
}
