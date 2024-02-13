package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectRevenuesYearDAO struct{}

func NewProjectRevenuesYearDAO() *ProjectRevenuesYearDAO {
	return &ProjectRevenuesYearDAO{}
}
func (dao *ProjectRevenuesYearDAO) CreateProjectRevenuesYear(p *models.ProjectRevenuesYear) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectRevenuesYearDAO) EditProjectRevenuesYear(pl *models.ProjectRevenuesYear) (*models.ProjectRevenuesYear, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectRevenuesYear{
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
func (dao *ProjectRevenuesYearDAO) FetchRevenuesYears(id string) []models.ProjectRevenuesYear {
	var i []models.ProjectRevenuesYear
	config.Datastore.AppDatabase.Where("project_revenues_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectRevenuesYearDAO) DeleteRevenuesYear(p *models.ProjectRevenuesYear) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
