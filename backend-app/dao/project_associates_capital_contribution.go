package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectAssociatesCapitalContributionDAO struct{}

func NewProjectAssociatesCapitalContributionDAO() *ProjectAssociatesCapitalContributionDAO {
	return &ProjectAssociatesCapitalContributionDAO{}
}
func (dao *ProjectAssociatesCapitalContributionDAO) CreateProjectAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectAssociatesCapitalContributionDAO) EditProjectAssociatesCapitalContribution(pl *models.ProjectAssociatesCapitalContribution) (*models.ProjectAssociatesCapitalContribution, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectAssociatesCapitalContribution{
		TypeOfOperation:                    pl.TypeOfOperation,
		YearOfContributionRepayment:        pl.YearOfContributionRepayment,
		MonthOfContributionRepayment:       pl.MonthOfContributionRepayment,
		AssociateCapitalContributionAmount: pl.AssociateCapitalContributionAmount,
	}).Error
	return pl, err
}
func (dao *ProjectAssociatesCapitalContributionDAO) FetchAssociatesCapitalContributions(id string) []models.ProjectAssociatesCapitalContribution {
	var acc []models.ProjectAssociatesCapitalContribution
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&acc)
	return acc
}
func (dao *ProjectAssociatesCapitalContributionDAO) DeleteAssociatesCapitalContribution(p *models.ProjectAssociatesCapitalContribution) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
