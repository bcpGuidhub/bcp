package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectExpenseDAO struct{}

func NewProjectExpenseDAO() *ProjectExpenseDAO {
	return &ProjectExpenseDAO{}
}
func (dao *ProjectExpenseDAO) CreateProjectExpense(p *models.ProjectExpense) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectExpenseDAO) EditProjectExpense(pl *models.ProjectExpense) (*models.ProjectExpense, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectExpense{
		ExpenseLabel:         pl.ExpenseLabel,
		AnnualAmountTaxInc1:  pl.AnnualAmountTaxInc1,
		AnnualAmountTaxInc2:  pl.AnnualAmountTaxInc2,
		AnnualAmountTaxInc3:  pl.AnnualAmountTaxInc3,
		ExpenditurePartition: pl.ExpenditurePartition,
		VatRateExpenditure:   pl.VatRateExpenditure,
		OneTimePaymentYear:   pl.OneTimePaymentYear,
		OneTimePaymentMonth:  pl.OneTimePaymentMonth,
		ExpenseCategory:      pl.ExpenseCategory,
	}).Error
	return pl, err
}
func (dao *ProjectExpenseDAO) FetchExpenses(id string) []models.ProjectExpense {
	var i []models.ProjectExpense
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectExpenseDAO) DeleteExpense(p *models.ProjectExpense) (err error) {
	err = config.Datastore.AppDatabase.Delete(p).Error
	return
}
func (dao *ProjectExpenseDAO) ResetVat(projectId string) (err error) {
	err = config.Datastore.AppDatabase.Model(models.ProjectExpense{}).Where("project_id= ?", projectId).Updates(models.ProjectExpense{VatRateExpenditure: "0%"}).Error
	return
}
