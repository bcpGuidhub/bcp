package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectDirectorRenumerationYearDAO struct{}

func NewProjectDirectorRenumerationYearDAO() *ProjectDirectorRenumerationYearDAO {
	return &ProjectDirectorRenumerationYearDAO{}
}
func (dao *ProjectDirectorRenumerationYearDAO) CreateProjectDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectDirectorRenumerationYearDAO) EditProjectDirectorRenumerationYear(pl *models.ProjectDirectorRenumerationYear) (*models.ProjectDirectorRenumerationYear, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectDirectorRenumerationYear{
		Month1Amount:  pl.Month1Amount,
		Month2Amount:  pl.Month2Amount,
		Month3Amount:  pl.Month3Amount,
		Month4Amount:  pl.Month4Amount,
		Month5Amount:  pl.Month5Amount,
		Month6Amount:  pl.Month6Amount,
		Month7Amount:  pl.Month7Amount,
		Month8Amount:  pl.Month8Amount,
		Month9Amount:  pl.Month9Amount,
		Month10Amount: pl.Month10Amount,
		Month11Amount: pl.Month11Amount,
		Month12Amount: pl.Month12Amount,
	}).Error
	return pl, err
}
func (dao *ProjectDirectorRenumerationYearDAO) FetchDirectorRenumerationYear(id string) []models.ProjectDirectorRenumerationYear {
	var i []models.ProjectDirectorRenumerationYear
	config.Datastore.AppDatabase.Where("project_directors_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectDirectorRenumerationYearDAO) DeleteDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
