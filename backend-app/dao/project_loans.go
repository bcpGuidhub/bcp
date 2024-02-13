package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectLoanDAO struct{}

func NewProjectLoanDAO() *ProjectLoanDAO {
	return &ProjectLoanDAO{}
}
func (dao *ProjectLoanDAO) CreateProjectLoan(p *models.ProjectLoan) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectLoanDAO) EditProjectLoan(pl *models.ProjectLoan) (*models.ProjectLoan, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectLoan{
		LoanName:                pl.LoanName,
		YearOfLoanDisbursement:  pl.YearOfLoanDisbursement,
		MonthOfLoanDisbursement: pl.MonthOfLoanDisbursement,
		LoanRate:                pl.LoanRate,
		LoanDuration:            pl.LoanDuration,
		AmountMonthlyPayments:   pl.AmountMonthlyPayments,
		TypeOfExternalFund:      pl.TypeOfExternalFund,
		AmountLoan:              pl.AmountLoan,
	}).Error
	return pl, err
}
func (dao *ProjectLoanDAO) FetchLoans(id string) []models.ProjectLoan {
	var loans []models.ProjectLoan
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&loans)
	return loans
}
func (dao *ProjectLoanDAO) DeleteLoan(p *models.ProjectLoan) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
