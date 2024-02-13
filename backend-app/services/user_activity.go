package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type userActivityDao interface {
	CreateUserActivity(userActivity *models.UserActivity) error
	UpdateField(userActivity *models.UserActivity, field string, value interface{}) error
	GetUserActivityById(id string) (*models.UserActivity, error)
}

type UserActivityService struct {
	dao userActivityDao
}

func NewUserActivityService(dao userActivityDao) *UserActivityService {
	return &UserActivityService{dao}
}

func (svc *UserActivityService) CreateUserActivity(userActivity *models.UserActivity) (err error) {
	err = svc.dao.CreateUserActivity(userActivity)
	return
}

func (svc *UserActivityService) UpdateField(userActivity *models.UserActivity, field string, value interface{}) (err error) {
	err = svc.dao.UpdateField(userActivity, field, value)
	return
}
func (svc *UserActivityService) GetUserActivityById(id string) (*models.UserActivity, error) {
	return svc.dao.GetUserActivityById(id)
}
