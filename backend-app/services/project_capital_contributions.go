package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectCapitalContributionDao interface {
	EditProjectCapitalContribution(pp *models.ProjectCapitalContribution) (*models.ProjectCapitalContribution, error)
	CreateProjectCapitalContribution(pp *models.ProjectCapitalContribution) error
	DeleteCapitalContribution(p *models.ProjectCapitalContribution) error
}

type ProjectCapitalContributionService struct {
	dao projectCapitalContributionDao
}

func NewProjectCapitalContributionService(dao projectCapitalContributionDao) *ProjectCapitalContributionService {
	return &ProjectCapitalContributionService{dao: dao}
}
func (svc *ProjectCapitalContributionService) CreateProjectCapitalContribution(p *models.ProjectCapitalContribution) (messages.CreateCapitalContribution, error) {
	if err := svc.dao.CreateProjectCapitalContribution(p); err != nil {
		return messages.CreateCapitalContribution{}, err
	}
	return messages.CreateCapitalContribution{
		CapitalContribution: p,
	}, nil
}

func (svc *ProjectCapitalContributionService) EditProjectCapitalContribution(p *models.ProjectCapitalContribution) (*models.ProjectCapitalContribution, error) {
	p, err := svc.dao.EditProjectCapitalContribution(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectCapitalContributionService) DeleteCapitalContribution(p *models.ProjectCapitalContribution) error {
	return svc.dao.DeleteCapitalContribution(p)
}
