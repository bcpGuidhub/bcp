package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectRevenuesYearDao interface {
	EditProjectRevenuesYear(pp *models.ProjectRevenuesYear) (*models.ProjectRevenuesYear, error)
	CreateProjectRevenuesYear(pp *models.ProjectRevenuesYear) error
	DeleteRevenuesYear(p *models.ProjectRevenuesYear) error
}

type ProjectRevenuesYearService struct {
	dao projectRevenuesYearDao
}

func NewProjectRevenuesYearService(dao projectRevenuesYearDao) *ProjectRevenuesYearService {
	return &ProjectRevenuesYearService{dao: dao}
}
func (svc *ProjectRevenuesYearService) CreateProjectRevenuesYear(p *models.ProjectRevenuesYear) (messages.CreateRevenuesYear, error) {
	if err := svc.dao.CreateProjectRevenuesYear(p); err != nil {
		return messages.CreateRevenuesYear{}, err
	}
	return messages.CreateRevenuesYear{
		RevenuesYear: p,
	}, nil
}

func (svc *ProjectRevenuesYearService) EditProjectRevenuesYear(p *models.ProjectRevenuesYear) (*models.ProjectRevenuesYear, error) {
	return svc.dao.EditProjectRevenuesYear(p)
}

func (svc *ProjectRevenuesYearService) DeleteRevenuesYear(p *models.ProjectRevenuesYear) error {
	return svc.dao.DeleteRevenuesYear(p)
}
