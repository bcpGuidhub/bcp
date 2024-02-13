package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectAssociatesCapitalContributionDao interface {
	EditProjectAssociatesCapitalContribution(pp *models.ProjectAssociatesCapitalContribution) (*models.ProjectAssociatesCapitalContribution, error)
	CreateProjectAssociatesCapitalContribution(pp *models.ProjectAssociatesCapitalContribution) error
	DeleteAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) error
}

type ProjectAssociatesCapitalContributionService struct {
	dao projectAssociatesCapitalContributionDao
}

func NewProjectAssociatesCapitalContributionService(dao projectAssociatesCapitalContributionDao) *ProjectAssociatesCapitalContributionService {
	return &ProjectAssociatesCapitalContributionService{dao: dao}
}
func (svc *ProjectAssociatesCapitalContributionService) CreateProjectAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) (messages.CreateAssociatesCapitalContribution, error) {
	if err := svc.dao.CreateProjectAssociatesCapitalContribution(p); err != nil {
		return messages.CreateAssociatesCapitalContribution{}, err
	}
	return messages.CreateAssociatesCapitalContribution{
		AssociatesCapitalContribution: p,
	}, nil
}

func (svc *ProjectAssociatesCapitalContributionService) EditProjectAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) (*models.ProjectAssociatesCapitalContribution, error) {
	p, err := svc.dao.EditProjectAssociatesCapitalContribution(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectAssociatesCapitalContributionService) DeleteAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) error {
	return svc.dao.DeleteAssociatesCapitalContribution(p)
}
