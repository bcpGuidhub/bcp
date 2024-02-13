package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectPreparationDao interface {
	GetById(id string) (*models.ProjectPreparation, error)
	PreloadProject(id string) (*models.ProjectPreparation, error)
	EditProjectPreparation(pp *models.ProjectPreparation) (*models.ProjectPreparation, error)
}

type ProjectPreparationService struct {
	dao projectPreparationDao
}

// NewUserService creates a new UserService with the given user DAO.
func NewProjectPreparationService(dao projectPreparationDao) *ProjectPreparationService {
	return &ProjectPreparationService{dao: dao}
}

func (svc *ProjectPreparationService) GetById(id string) (*models.ProjectPreparation, error) {
	return svc.dao.GetById(id)
}

func (svc *ProjectPreparationService) PreloadProject(id string) (*models.ProjectPreparation, error) {
	return svc.dao.PreloadProject(id)
}

func (svc *ProjectPreparationService) EditProjectPreparation(pp *models.ProjectPreparation) (messages.EditProjectPreparation, error) {
	projectP, err := svc.dao.EditProjectPreparation(pp)
	if err != nil {
		return messages.EditProjectPreparation{
			Message: "failed to edit project preparation",
		}, err
	}
	return messages.EditProjectPreparation{
		Message:            "edited",
		ProjectPreparation: projectP,
	}, nil
}
