package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectDirectorCotisationYearDAO struct{}

func NewProjectDirectorCotisationYearDAO() *ProjectDirectorCotisationYearDAO {
	return &ProjectDirectorCotisationYearDAO{}
}
func (dao *ProjectDirectorCotisationYearDAO) CreateProjectDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectDirectorCotisationYearDAO) EditProjectDirectorCotisationYear(pl *models.ProjectDirectorCotisationYear) (*models.ProjectDirectorCotisationYear, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectDirectorCotisationYear{
		Month1Cotisation:  pl.Month1Cotisation,
		Month2Cotisation:  pl.Month2Cotisation,
		Month3Cotisation:  pl.Month3Cotisation,
		Month4Cotisation:  pl.Month4Cotisation,
		Month5Cotisation:  pl.Month5Cotisation,
		Month6Cotisation:  pl.Month6Cotisation,
		Month7Cotisation:  pl.Month7Cotisation,
		Month8Cotisation:  pl.Month8Cotisation,
		Month9Cotisation:  pl.Month9Cotisation,
		Month10Cotisation: pl.Month10Cotisation,
		Month11Cotisation: pl.Month11Cotisation,
		Month12Cotisation: pl.Month12Cotisation,
	}).Error
	return pl, err
}
func (dao *ProjectDirectorCotisationYearDAO) FetchDirectorCotisationYears(id string) []models.ProjectDirectorCotisationYear {
	var i []models.ProjectDirectorCotisationYear
	config.Datastore.AppDatabase.Where("project_directors_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectDirectorCotisationYearDAO) DeleteDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
func (dao *ProjectDirectorCotisationYearDAO) DeleteDirectorCotisationYears(id string) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Where("project_directors_id = ?", id).Delete(&models.ProjectDirectorCotisationYear{}).Error
	return
}
