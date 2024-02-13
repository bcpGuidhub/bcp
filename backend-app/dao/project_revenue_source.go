package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectRevenueSourceDAO struct{}

func NewProjectRevenueSourceDAO() *ProjectRevenueSourceDAO {
	return &ProjectRevenueSourceDAO{}
}
func (dao *ProjectRevenueSourceDAO) CreateProjectRevenueSource(p *models.ProjectRevenueSource) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectRevenueSourceDAO) FindProjectRevenueSource(pI *models.ProjectRevenueSource) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}

func (dao *ProjectRevenueSourceDAO) EditProjectRevenueSource(pl *models.ProjectRevenueSource) (*models.ProjectRevenueSource, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectRevenueSource{
		Name:                 pl.Name,
		SourceType:           pl.SourceType,
		AmountExcludingTaxes: pl.AmountExcludingTaxes,
		Year:                 pl.Year,
		Month:                pl.Month,
		VatRate:              pl.VatRate,
	}).Error
	return pl, err
}
func (dao *ProjectRevenueSourceDAO) FetchRevenueSources(id string) []models.ProjectRevenueSource {
	var i []models.ProjectRevenueSource
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectRevenueSourceDAO) DeleteRevenueSource(p *models.ProjectRevenueSource) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
func (dao *ProjectRevenueSourceDAO) ResetVat(projectId string) (err error) {
	err = config.Datastore.AppDatabase.Model(models.ProjectRevenueSource{}).Where("project_id= ?", projectId).Updates(models.ProjectRevenueSource{VatRate: "0%"}).Error
	return
}
