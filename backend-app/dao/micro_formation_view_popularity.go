package dao

import (
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type MicroFormationViewPopularityDAO struct{}

func NewMicroFormationViewPopularityDAO() *MicroFormationViewPopularityDAO {
	return &MicroFormationViewPopularityDAO{}
}

func (dao *MicroFormationViewPopularityDAO) GetById(id string) (*models.MicroFormationViewPopularity, error) {
	var pl models.MicroFormationViewPopularity
	err := config.Datastore.AppDatabase.
		Where("micro_formation_view_popularity_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *MicroFormationViewPopularityDAO) GetByUser(formationId, userId string) (*models.MicroFormationViewPopularity, error) {
	var pl models.MicroFormationViewPopularity
	err := config.Datastore.AppDatabase.
		Where("micro_formation_id = ? AND user_id = ?", formationId, userId).
		First(&pl).
		Error
	return &pl, err
}

func (dao *MicroFormationViewPopularityDAO) AssignMicroFormationViewPopularity(formationId, userId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Error; err != nil {
		return err
	}
	m := models.MicroFormationViewPopularity{
		UserId:           userId,
		MicroFormationId: formationId,
	}
	_, err = dao.GetByUser(formationId, userId)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		tx.Rollback()
		return err
	}
	if gorm.IsRecordNotFoundError(err) {
		if err := tx.Create(&m).Error; err != nil {
			tx.Rollback()
			return err
		}
		return tx.Commit().Error
	}
	return nil
}
func (dao *MicroFormationViewPopularityDAO) RemoveMicroFormationViewPopularity(formationId, userId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Error; err != nil {
		return err
	}
	if err := tx.Unscoped().Delete(models.MicroFormationViewPopularity{}, "micro_formation_id = ? AND user_id = ? ", formationId, userId).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}
func (dao *MicroFormationViewPopularityDAO) FetchMicroFormationViewPopularity(formationId string) int {
	var i int
	config.Datastore.AppDatabase.Model(&models.MicroFormationViewPopularity{}).Where("micro_formation_id = ? ", formationId).Order("created_at asc").Count(&i)
	return i
}
