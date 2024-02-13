package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectInvestmentDAO struct{}

func NewProjectInvestmentDAO() *ProjectInvestmentDAO {
	return &ProjectInvestmentDAO{}
}
func (dao *ProjectInvestmentDAO) FindProjectInvestment(pI *models.ProjectInvestment) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectInvestmentDAO) CreateProjectInvestment(p *models.ProjectInvestment) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectInvestmentDAO) EditProjectInvestment(pl *models.ProjectInvestment) (*models.ProjectInvestment, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectInvestment{
		InvestmentType:              pl.InvestmentType,
		InvestmentName:              pl.InvestmentName,
		InvestmentAmountTaxIncluded: pl.InvestmentAmountTaxIncluded,
		YearOfPurchase:              pl.YearOfPurchase,
		MonthOfPurchase:             pl.MonthOfPurchase,
		Duration:                    pl.Duration,
		VatRateOnInvestment:         pl.VatRateOnInvestment,
		Contribution:                pl.Contribution,
	}).Error
	return pl, err
}
func (dao *ProjectInvestmentDAO) FetchInvestments(id string) []models.ProjectInvestment {
	var investments []models.ProjectInvestment
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&investments)
	return investments
}
func (dao *ProjectInvestmentDAO) DeleteInvestment(p *models.ProjectInvestment) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
func (dao *ProjectInvestmentDAO) ResetVat(projectId string) (err error) {
	err = config.Datastore.AppDatabase.Model(models.ProjectInvestment{}).Where("project_id= ?", projectId).Updates(models.ProjectInvestment{VatRateOnInvestment: "0%"}).Error
	return
}
