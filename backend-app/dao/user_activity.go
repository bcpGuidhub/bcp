package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type UserActivityDAO struct {
}

// NewUserActivityDAO creates a new UserDAO
func NewUserActivityDAO() *UserActivityDAO {
	return &UserActivityDAO{}
}

func (dao *UserActivityDAO) GetUserActivityById(id string) (*models.UserActivity, error) {
	var userActivity models.UserActivity
	err := config.Datastore.AppDatabase.Preload("User").
		Where("user_id = ?", id).
		First(&userActivity).
		Error
	return &userActivity, err
}

func (dao *UserActivityDAO) CreateUserActivity(userActivity *models.UserActivity) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}

	if err := tx.Create(userActivity).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func (dao *UserActivityDAO) UpdateField(p *models.UserActivity, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(p).Update(field, value).Error
	return
}
