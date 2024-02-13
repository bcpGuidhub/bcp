package dao

import (
	"errors"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var (
	// ErrorNoUser is returned when a user isn't
	// found.
	ErrorNoUser = errors.New("no user with this email")
)

// UserDAO persists user data in database
type UserDAO struct{}

// NewUserDAO creates a new UserDAO
func NewUserDAO() *UserDAO {
	return &UserDAO{}
}

func (dao *UserDAO) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := config.Datastore.AppDatabase.
		Where("email = ?", email).
		First(&user).
		Error

	return &user, err
}

func (dao *UserDAO) GetById(id string) (*models.User, error) {
	var user models.User
	err := config.Datastore.AppDatabase.
		Where("user_id = ?", id).
		First(&user).
		Error

	return &user, err
}

func (dao *UserDAO) CreateUser(user *models.User) (err error) {
	err = config.Datastore.AppDatabase.Create(user).Error
	return
}

func (dao *UserDAO) FetchProjects(id string) []models.Project {
	var projects []models.Project
	config.Datastore.AppDatabase.Where("user_id = ?", id).Order("created_at desc").Find(&projects)
	return projects
}

// UpdateUser will update the given field
// and the updated_at of a user.
func (dao *UserDAO) UpdateUser(user *models.User, field string, value interface{}) (err error) {
	if field == "reachable_by_phone" || field == "reachable_by_phone_for_rdv_validation" {
		v, _ := value.(bool)
		err = config.Datastore.AppDatabase.Model(user).Update(field, v).Error
		return
	}
	if field == "log_in_count" {
		v, _ := value.(int)
		err = config.Datastore.AppDatabase.Model(user).Update(field, v).Error
		return
	}
	v, _ := value.(string)
	err = config.Datastore.AppDatabase.Model(user).Update(field, v).Error
	return
}

func (dao *UserDAO) DeleteUser(user *models.User) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(user).Error
	return
}

func (dao *UserDAO) Updates(user *models.User) error {
	return config.Datastore.AppDatabase.Model(user).Updates(models.User{
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}).Error
}
