package dao

import (
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type MicroFormationViewCountStakeholderDAO struct{}

func NewMicroFormationViewCountStakeholderDAO() *MicroFormationViewCountStakeholderDAO {
	return &MicroFormationViewCountStakeholderDAO{}
}

func (dao *MicroFormationViewCountStakeholderDAO) GetById(id string) (*models.MicroFormationViewCountStakeholder, error) {
	var pl models.MicroFormationViewCountStakeholder
	err := config.Datastore.AppDatabase.
		Where("micro_formation_view_count_stakeholder_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *MicroFormationViewCountStakeholderDAO) GetByUser(formationId, stakeholderId string) (*models.MicroFormationViewCountStakeholder, error) {
	var pl models.MicroFormationViewCountStakeholder
	err := config.Datastore.AppDatabase.
		Where("micro_formation_id = ? AND stakeholder_id = ?", formationId, stakeholderId).
		First(&pl).
		Error
	return &pl, err
}

func (dao *MicroFormationViewCountStakeholderDAO) AssignMicroFormationViewCount(formationId, stakeholderId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}
	viewCount, err := dao.GetByUser(formationId, stakeholderId)
	if gorm.IsRecordNotFoundError(err) {
		m := models.MicroFormationViewCountStakeholder{
			ViewCount:        1,
			StakeholderId:    stakeholderId,
			MicroFormationId: formationId,
		}
		if err := tx.Create(&m).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	count := viewCount.ViewCount + 1
	if err := dao.UpdateField(viewCount, "view_count", count); err != nil {
		return err
	}
	return tx.Commit().Error
}
func (dao *MicroFormationViewCountStakeholderDAO) UpdateField(pl *models.MicroFormationViewCountStakeholder, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(pl).Update(field, value).Error
	return
}
func (dao *MicroFormationViewCountStakeholderDAO) FetchMicroFormationViewCounts(formationId string) int {
	var i int
	config.Datastore.AppDatabase.Model(&models.MicroFormationViewCountStakeholder{}).Where("micro_formation_id = ? ", formationId).Order("created_at asc").Count(&i)
	return i
}
