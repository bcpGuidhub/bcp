package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectAddressDAO struct{}

func NewProjectAddressDAO() *ProjectAddressDAO {
	return &ProjectAddressDAO{}
}

func (dao *ProjectAddressDAO) GetById(id string) (*models.ProjectAddress, error) {
	var pl models.ProjectAddress
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *ProjectAddressDAO) EditProjectAddress(pl *models.ProjectAddress) (*models.ProjectAddress, error) {
	var pL models.ProjectAddress
	err := config.Datastore.AppDatabase.Where(models.ProjectAddress{ID: pl.ID}).Assign(models.ProjectAddress{
		PostalCode:       pl.PostalCode,
		City:             pl.City,
		Address:          pl.Address,
		GeographicalArea: pl.GeographicalArea,
	}).FirstOrCreate(&pL).Error
	return &pL, err
}
