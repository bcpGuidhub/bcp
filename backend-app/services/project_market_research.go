package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectMarketResearchDao interface {
	GetById(id string) (*models.ProjectMarketResearch, error)
	PreloadProject(id string) (*models.ProjectMarketResearch, error)
	EditProjectMarketResearch(pp *models.ProjectMarketResearch) (*models.ProjectMarketResearch, error)
}

type ProjectMarketResearchService struct {
	dao projectMarketResearchDao
}

// NewUserService creates a new UserService with the given user DAO.
func NewProjectMarketResearchService(dao projectMarketResearchDao) *ProjectMarketResearchService {
	return &ProjectMarketResearchService{dao: dao}
}

func (svc *ProjectMarketResearchService) GetById(id string) (*models.ProjectMarketResearch, error) {
	return svc.dao.GetById(id)
}

func (svc *ProjectMarketResearchService) PreloadProject(id string) (*models.ProjectMarketResearch, error) {
	return svc.dao.PreloadProject(id)
}
func (svc *ProjectMarketResearchService) EditProjectMarketResearch(pm *models.ProjectMarketResearch) (messages.EditProjectMarketResearch, error) {
	pM, err := svc.dao.EditProjectMarketResearch(pm)
	if err != nil {
		return messages.EditProjectMarketResearch{
			Message: "failed to edit project market research",
		}, err
	}
	return messages.EditProjectMarketResearch{
		Message:               "edited",
		ProjectMarketResearch: pM,
	}, nil
}
