package services

import (
	"time"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type userActivityDateDao interface {
	CreateUserActivityDate(userActivityDate *models.UserActivityDate) error
	UpdateAccessCount(userActivityDate *models.UserActivityDate, value int) error
	GetUserActivityDateByAtDate(id string, date time.Time) (*models.UserActivityDate, error)
}

type UserActivityDateService struct {
	dao userActivityDateDao
}

func NewUserActivityDateService(dao userActivityDateDao) *UserActivityDateService {
	return &UserActivityDateService{dao}
}

func (svc *UserActivityDateService) CreateUserActivityDate(userActivityDate *models.UserActivityDate) (err error) {
	err = svc.dao.CreateUserActivityDate(userActivityDate)
	return
}

func (svc *UserActivityDateService) UpdateAccessCount(userActivityDate *models.UserActivityDate, value int) (err error) {
	err = svc.dao.UpdateAccessCount(userActivityDate, value)
	return
}
func (svc *UserActivityDateService) GetUserActivityDateByAtDate(id string, date time.Time) (*models.UserActivityDate, error) {
	return svc.dao.GetUserActivityDateByAtDate(id, date)
}
