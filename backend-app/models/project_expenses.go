package models

type ProjectExpense struct {
	Model
	ID                   string  `gorm:"primary_key;column:project_expenses_id" json:"id"`
	ProjectId            string  `gorm:"column:project_id" json:"project_id"`
	Project              Project `gorm:"foreignkey:project_id"`
	ExpenseLabel         string  `gorm:"column:expense_label" json:"expense_label"`
	AnnualAmountTaxInc1  string  `gorm:"column:annual_amount_tax_inc_1" json:"annual_amount_tax_inc_1"`
	AnnualAmountTaxInc2  string  `gorm:"column:annual_amount_tax_inc_2" json:"annual_amount_tax_inc_2"`
	AnnualAmountTaxInc3  string  `gorm:"column:annual_amount_tax_inc_3" json:"annual_amount_tax_inc_3"`
	ExpenditurePartition string  `gorm:"column:expenditure_partition" json:"expenditure_partition"`
	VatRateExpenditure   string  `gorm:"column:vat_rate_expenditure" json:"vat_rate_expenditure"`
	OneTimePaymentYear   string  `gorm:"column:one_time_payment_year" json:"one_time_payment_year"`
	OneTimePaymentMonth  string  `gorm:"column:one_time_payment_month" json:"one_time_payment_month"`
	ExpenseCategory      string  `gorm:"column:expense_category" json:"expense_category"`
}

// Set table name to be `project_expenses`
func (ProjectExpense) TableName() string {
	return "project_expenses"
}
