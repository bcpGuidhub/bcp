package dao

import (
	"time"

	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type UserActivityDateDAO struct {
}

func NewUserActivityDateDAO() *UserActivityDateDAO {
	return &UserActivityDateDAO{}
}

func (dao *UserActivityDateDAO) GetUserActivityDateByAtDate(id string, date time.Time) (*models.UserActivityDate, error) {
	var activityDate models.UserActivityDate
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return &activityDate, err
	}

	if err := tx.Where("user_id = ? AND access_date = ?", id, date).
		First(&activityDate).
		Error; err != nil {
		tx.Rollback()
		return &activityDate, err
	}
	return &activityDate, tx.Commit().Error
}

func (dao *UserActivityDateDAO) UpdateAccessCount(activityDate *models.UserActivityDate, value int) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}

	if err := tx.Model(activityDate).Update("access_count", value).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func (dao *UserActivityDateDAO) CreateUserActivityDate(activityDate *models.UserActivityDate) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}
	_, err = dao.GetUserActivityDateByAtDate(activityDate.UserId, activityDate.AccessDate)
	if gorm.IsRecordNotFoundError(err) {
		if err := tx.Create(activityDate).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
