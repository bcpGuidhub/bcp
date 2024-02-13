package dao

import (
	"fmt"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type UserProfileImageDAO struct{}

// NewUserDAO creates a new UserDAO
func NewUserProfileImageDAO() *UserProfileImageDAO {
	return &UserProfileImageDAO{}
}

func (dao *UserProfileImageDAO) GetByField(value, field string) (*models.UserProfileImage, error) {
	var user models.UserProfileImage
	queryField := fmt.Sprintf("%s = ? ", field)
	err := config.Datastore.AppDatabase.
		Where(queryField, value).
		First(&user).
		Error

	return &user, err
}

func (dao *UserProfileImageDAO) CreateUserProfileImage(user *models.UserProfileImage) (err error) {
	err = config.Datastore.AppDatabase.Create(user).Error
	return
}
func (dao *UserProfileImageDAO) ModifyUserProfileImage(user *models.UserProfileImage, field string, value interface{}) (err error) {
	v, _ := value.(string)
	err = config.Datastore.AppDatabase.Model(user).Update(field, v).Error
	return
}
