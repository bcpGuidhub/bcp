package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectDirectorDAO struct{}

func NewProjectDirectorDAO() *ProjectDirectorDAO {
	return &ProjectDirectorDAO{}
}
func (dao *ProjectDirectorDAO) CreateProjectDirector(p *models.ProjectDirector) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectDirectorDAO) GetProjectDirector(id string) (*models.ProjectDirector, error) {
	var pl models.ProjectDirector
	err := config.Datastore.AppDatabase.
		Where("project_directors_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *ProjectDirectorDAO) UpdateAll(id, field, value string) (err error) {
	obj := make(map[string]interface{})
	obj[field] = value
	err = config.Datastore.AppDatabase.Model(models.ProjectDirector{}).Where("project_id = ?", id).Updates(obj).Error
	return
}
func (dao *ProjectDirectorDAO) GetProjectLegalStatus(id string) (*models.ProjectLegalStatus, error) {
	var pl models.ProjectLegalStatus
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *ProjectDirectorDAO) FindProjectDirector(pI *models.ProjectDirector) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}

func (dao *ProjectDirectorDAO) EditProjectDirector(pl *models.ProjectDirector) (*models.ProjectDirector, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectDirector{
		FirstName:                pl.FirstName,
		LastName:                 pl.LastName,
		PercentageEquityCapital:  pl.PercentageEquityCapital,
		DirectorAcre:             pl.DirectorAcre,
		CompensationPartition:    pl.CompensationPartition,
		NetCompensationYear1:     pl.NetCompensationYear1,
		NetCompensationYear2:     pl.NetCompensationYear2,
		NetCompensationYear3:     pl.NetCompensationYear3,
		CotisationsSocialesYear1: pl.CotisationsSocialesYear1,
		CotisationsSocialesYear2: pl.CotisationsSocialesYear2,
		CotisationsSocialesYear3: pl.CotisationsSocialesYear3,
		ProcessingCotisations:    pl.ProcessingCotisations,
	}).Error
	return pl, err
}
func (dao *ProjectDirectorDAO) FetchDirectors(id string) []models.ProjectDirector {
	var i []models.ProjectDirector
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectDirectorDAO) DeleteDirector(p *models.ProjectDirector) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
func (dao *ProjectDirectorDAO) DeleteDirectors(id string) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Where("project_id = ?", id).Delete(&models.ProjectDirector{}).Error
	return
}
