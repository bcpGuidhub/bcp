package dao

import (
	"fmt"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type StakeholderProfileImageDAO struct{}

// NewUserDAO creates a new UserDAO
func NewStakeholderProfileImageDAO() *StakeholderProfileImageDAO {
	return &StakeholderProfileImageDAO{}
}

func (dao *StakeholderProfileImageDAO) GetByField(value, field string) (*models.StakeholderProfileImage, error) {
	var user models.StakeholderProfileImage
	queryField := fmt.Sprintf("%s = ? ", field)
	err := config.Datastore.AppDatabase.
		Where(queryField, value).
		First(&user).
		Error

	return &user, err
}

func (dao *StakeholderProfileImageDAO) CreateStakeholderProfileImage(user *models.StakeholderProfileImage) (err error) {
	err = config.Datastore.AppDatabase.Create(user).Error
	return
}
func (dao *StakeholderProfileImageDAO) ModifyStakeholderProfileImage(user *models.StakeholderProfileImage, field string, value interface{}) (err error) {
	v, _ := value.(string)
	err = config.Datastore.AppDatabase.Model(user).Update(field, v).Error
	return
}
