package dao

import (
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type MicroFormationViewPopularityStakeholderDAO struct{}

func NewMicroFormationViewPopularityStakeholderDAO() *MicroFormationViewPopularityStakeholderDAO {
	return &MicroFormationViewPopularityStakeholderDAO{}
}

func (dao *MicroFormationViewPopularityStakeholderDAO) GetById(id string) (*models.MicroFormationViewPopularityStakeholder, error) {
	var pl models.MicroFormationViewPopularityStakeholder
	err := config.Datastore.AppDatabase.
		Where("micro_formation_view_popularity_stakeholder_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *MicroFormationViewPopularityStakeholderDAO) GetByUser(formationId, stakeholderId string) (*models.MicroFormationViewPopularityStakeholder, error) {
	var pl models.MicroFormationViewPopularityStakeholder
	err := config.Datastore.AppDatabase.
		Where("micro_formation_id = ? AND stakeholder_id = ?", formationId, stakeholderId).
		First(&pl).
		Error
	return &pl, err
}

func (dao *MicroFormationViewPopularityStakeholderDAO) AssignMicroFormationViewPopularity(formationId, stakeholderId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Error; err != nil {
		return err
	}
	m := models.MicroFormationViewPopularityStakeholder{
		StakeholderId:    stakeholderId,
		MicroFormationId: formationId,
	}
	_, err = dao.GetByUser(formationId, stakeholderId)
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
func (dao *MicroFormationViewPopularityStakeholderDAO) RemoveMicroFormationViewPopularity(formationId, stakeholderId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Error; err != nil {
		return err
	}
	if err := tx.Unscoped().Delete(models.MicroFormationViewPopularityStakeholder{}, "micro_formation_id = ? AND stakeholder_id = ? ", formationId, stakeholderId).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}
func (dao *MicroFormationViewPopularityStakeholderDAO) FetchMicroFormationViewPopularity(formationId string) int {
	var i int
	config.Datastore.AppDatabase.Model(&models.MicroFormationViewPopularityStakeholder{}).Where("micro_formation_id = ? ", formationId).Order("created_at asc").Count(&i)
	return i
}
