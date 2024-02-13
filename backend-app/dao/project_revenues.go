package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectRevenueDAO struct{}

func NewProjectRevenueDAO() *ProjectRevenueDAO {
	return &ProjectRevenueDAO{}
}
func (dao *ProjectRevenueDAO) CreateProjectRevenue(p *models.ProjectRevenue) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectRevenueDAO) FindProjectRevenue(pI *models.ProjectRevenue) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}

func (dao *ProjectRevenueDAO) EditProjectRevenue(pl *models.ProjectRevenue) (*models.ProjectRevenue, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectRevenue{
		RevenueLabel:                 pl.RevenueLabel,
		RevenuePartition:             pl.RevenuePartition,
		AnnualAmountTaxExcludedYear1: pl.AnnualAmountTaxExcludedYear1,
		AnnualAmountTaxExcludedYear2: pl.AnnualAmountTaxExcludedYear2,
		AnnualAmountTaxExcludedYear3: pl.AnnualAmountTaxExcludedYear3,
		InventoryLinkedRevenue:       pl.InventoryLinkedRevenue,
		PercentageMargin:             pl.PercentageMargin,
		ValuationOfStartingStock:     pl.ValuationOfStartingStock,
		MeanValuationOfStock:         pl.MeanValuationOfStock,
		VatRateRevenue:               pl.VatRateRevenue,
		CustomerPaymentDeadline:      pl.CustomerPaymentDeadline,
		SupplierPaymentDeadline:      pl.SupplierPaymentDeadline,
		VatRateOnPurchases:           pl.VatRateOnPurchases,
	}).Error
	return pl, err
}
func (dao *ProjectRevenueDAO) FetchRevenues(id string) []models.ProjectRevenue {
	var i []models.ProjectRevenue
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectRevenueDAO) DeleteRevenue(p *models.ProjectRevenue) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
func (dao *ProjectRevenueDAO) ResetVat(projectId string) (err error) {
	err = config.Datastore.AppDatabase.Model(models.ProjectRevenue{}).Where("project_id= ?", projectId).Updates(models.ProjectRevenue{VatRateRevenue: "0%", VatRateOnPurchases: "0%"}).Error
	return
}
