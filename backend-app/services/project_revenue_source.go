package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectRevenueSourceDao interface {
	EditProjectRevenueSource(pp *models.ProjectRevenueSource) (*models.ProjectRevenueSource, error)
	CreateProjectRevenueSource(pp *models.ProjectRevenueSource) error
	DeleteRevenueSource(p *models.ProjectRevenueSource) error
	ResetVat(projectId string) error
}

type ProjectRevenueSourceService struct {
	dao projectRevenueSourceDao
}

func NewProjectRevenueSourceService(dao projectRevenueSourceDao) *ProjectRevenueSourceService {
	return &ProjectRevenueSourceService{dao: dao}
}
func (svc *ProjectRevenueSourceService) CreateProjectRevenueSource(p *models.ProjectRevenueSource) (messages.CreateRevenueSource, error) {
	if err := svc.dao.CreateProjectRevenueSource(p); err != nil {
		return messages.CreateRevenueSource{}, err
	}
	return messages.CreateRevenueSource{
		RevenueSource: p,
	}, nil
}
func (svc *ProjectRevenueSourceService) ResetVat(projectId string) (err error) {
	return svc.dao.ResetVat(projectId)
}

func (svc *ProjectRevenueSourceService) EditProjectRevenueSource(p *models.ProjectRevenueSource) (*models.ProjectRevenueSource, error) {
	p, err := svc.dao.EditProjectRevenueSource(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectRevenueSourceService) DeleteRevenueSource(p *models.ProjectRevenueSource) error {
	return svc.dao.DeleteRevenueSource(p)
}
