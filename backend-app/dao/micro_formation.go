package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type MicroFormationDAO struct{}

func NewMicroFormationDAO() *MicroFormationDAO {
	return &MicroFormationDAO{}
}

func (dao *MicroFormationDAO) GetFormation(title, category string) (*models.MicroFormation, error) {
	var pl models.MicroFormation
	err := config.Datastore.AppDatabase.
		Where("title = ? AND category = ?", title, category).
		First(&pl).
		Error
	return &pl, err
}

func (dao *MicroFormationDAO) CreateMicroFormation(pl *models.MicroFormation) (err error) {
	err = config.Datastore.AppDatabase.Create(pl).Error
	return
}
func (dao *MicroFormationDAO) FetchMicroFormations() []models.MicroFormation {
	var i []models.MicroFormation
	config.Datastore.AppDatabase.Order("category").Find(&i)
	return i
}
