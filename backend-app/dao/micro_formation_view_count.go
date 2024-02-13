package dao

import (
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type MicroFormationViewCountDAO struct{}

func NewMicroFormationViewCountDAO() *MicroFormationViewCountDAO {
	return &MicroFormationViewCountDAO{}
}

func (dao *MicroFormationViewCountDAO) GetById(id string) (*models.MicroFormationViewCount, error) {
	var pl models.MicroFormationViewCount
	err := config.Datastore.AppDatabase.
		Where("micro_formation_view_count_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *MicroFormationViewCountDAO) GetByUser(formationId, userId string) (*models.MicroFormationViewCount, error) {
	var pl models.MicroFormationViewCount
	err := config.Datastore.AppDatabase.
		Where("micro_formation_id = ? AND user_id = ?", formationId, userId).
		First(&pl).
		Error
	return &pl, err
}

func (dao *MicroFormationViewCountDAO) AssignMicroFormationViewCount(formationId, userId string) (err error) {
	tx := config.Datastore.AppDatabase.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}
	viewCount, err := dao.GetByUser(formationId, userId)
	if gorm.IsRecordNotFoundError(err) {
		m := models.MicroFormationViewCount{
			ViewCount:        1,
			UserId:           userId,
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
func (dao *MicroFormationViewCountDAO) UpdateField(pl *models.MicroFormationViewCount, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(pl).Update(field, value).Error
	return
}
func (dao *MicroFormationViewCountDAO) FetchMicroFormationViewCounts(formationId string) int {
	var i int
	config.Datastore.AppDatabase.Model(&models.MicroFormationViewCount{}).Where("micro_formation_id = ? ", formationId).Order("created_at asc").Count(&i)
	return i
}
