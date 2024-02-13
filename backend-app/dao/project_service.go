package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectServiceDAO struct {
}

func NewProjectServiceDAO() *ProjectServiceDAO {
	return &ProjectServiceDAO{}
}

func (dao *ProjectServiceDAO) GetUserByID(id string) (*models.User, error) {
	var user models.User
	err := config.Datastore.AppDatabase.
		Where("user_id = ?", id).
		First(&user).
		Error

	return &user, err
}

func (dao *ProjectServiceDAO) CreateProjectService(projectSvc *models.ProjectService) (err error) {
	err = config.Datastore.AppDatabase.Create(projectSvc).Error
	return
}
