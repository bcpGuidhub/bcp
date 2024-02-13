package models

type ProjectLoan struct {
	Model
	ID                      string  `gorm:"primary_key;column:project_loans_id" json:"id"`
	ProjectId               string  `gorm:"column:project_id" json:"project_id"`
	Project                 Project `gorm:"foreignkey:project_id"`
	LoanName                string  `gorm:"column:bank_loan_name" json:"bank_loan_name"`
	YearOfLoanDisbursement  string  `gorm:"column:year_of_loan_disbursement" json:"year_of_loan_disbursement"`
	MonthOfLoanDisbursement string  `gorm:"column:month_of_loan_disbursement" json:"month_of_loan_disbursement"`
	LoanRate                string  `gorm:"column:loan_rate" json:"loan_rate"`
	LoanDuration            string  `gorm:"column:loan_duration" json:"loan_duration"`
	AmountMonthlyPayments   string  `gorm:"column:amount_monthly_payments" json:"amount_monthly_payments"`
	TypeOfExternalFund      string  `gorm:"column:type_of_external_fund" json:"type_of_external_fund"`
	AmountLoan              string  `gorm:"column:amount_loan" json:"amount_loan"`
}

// Set table name to be `project_loans`
func (ProjectLoan) TableName() string {
	return "project_loans"
}
