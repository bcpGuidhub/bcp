package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectFinanceCapacityDAO struct{}

func NewProjectFinanceCapacityDAO() *ProjectFinanceCapacityDAO {
	return &ProjectFinanceCapacityDAO{}
}

func (dao *ProjectFinanceCapacityDAO) GetById(id string) (*models.ProjectFinanceCapacity, error) {
	var pl models.ProjectFinanceCapacity
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *ProjectFinanceCapacityDAO) PreloadProject(id string) (*models.ProjectFinanceCapacity, error) {
	var pl models.ProjectFinanceCapacity
	err := config.Datastore.AppDatabase.Preload("Project").
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}

func (dao *ProjectFinanceCapacityDAO) EditProjectFinanceCapacity(pl *models.ProjectFinanceCapacity) (*models.ProjectFinanceCapacity, error) {
	var pL models.ProjectFinanceCapacity
	err := config.Datastore.AppDatabase.Where(models.ProjectFinanceCapacity{ID: pl.ID}).Assign(models.ProjectFinanceCapacity{
		Declarations: pl.Declarations,
	}).FirstOrCreate(&pL).Error
	return &pL, err
}
func (dao *ProjectFinanceCapacityDAO) UpdateField(pl *models.ProjectFinanceCapacity, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(pl).Update(field, value).Error
	return
}
