package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectCapitalContributionDAO struct{}

func NewProjectCapitalContributionDAO() *ProjectCapitalContributionDAO {
	return &ProjectCapitalContributionDAO{}
}
func (dao *ProjectCapitalContributionDAO) CreateProjectCapitalContribution(p *models.ProjectCapitalContribution) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectCapitalContributionDAO) EditProjectCapitalContribution(pl *models.ProjectCapitalContribution) (*models.ProjectCapitalContribution, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectCapitalContribution{
		CapitalContributionType:   pl.CapitalContributionType,
		CapitalContributionAmount: pl.CapitalContributionAmount,
		YearOfContribution:        pl.YearOfContribution,
		MonthOfContribution:       pl.MonthOfContribution,
	}).Error
	return pl, err
}
func (dao *ProjectCapitalContributionDAO) FetchCapitalContributions(id string) []models.ProjectCapitalContribution {
	var i []models.ProjectCapitalContribution
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectCapitalContributionDAO) DeleteCapitalContribution(p *models.ProjectCapitalContribution) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
