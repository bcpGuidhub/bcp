package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectFinanceCapacityDao interface {
	GetById(id string) (*models.ProjectFinanceCapacity, error)
	PreloadProject(id string) (*models.ProjectFinanceCapacity, error)
	EditProjectFinanceCapacity(pp *models.ProjectFinanceCapacity) (*models.ProjectFinanceCapacity, error)
}

type ProjectFinanceCapacityService struct {
	dao projectFinanceCapacityDao
}

// NewUserService creates a new UserService with the given user DAO.
func NewProjectFinanceCapacityService(dao projectFinanceCapacityDao) *ProjectFinanceCapacityService {
	return &ProjectFinanceCapacityService{dao: dao}
}

func (svc *ProjectFinanceCapacityService) GetById(id string) (*models.ProjectFinanceCapacity, error) {
	return svc.dao.GetById(id)
}

func (svc *ProjectFinanceCapacityService) PreloadProject(id string) (*models.ProjectFinanceCapacity, error) {
	return svc.dao.PreloadProject(id)
}
func (svc *ProjectFinanceCapacityService) EditProjectFinanceCapacity(pl *models.ProjectFinanceCapacity) (messages.EditProjectFinanceCapacity, error) {
	pLp, err := svc.dao.EditProjectFinanceCapacity(pl)
	if err != nil {
		return messages.EditProjectFinanceCapacity{}, err
	}
	return messages.EditProjectFinanceCapacity{
		FinanceCapacity: pLp,
	}, err
}
