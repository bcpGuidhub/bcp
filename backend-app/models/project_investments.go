package models

type ProjectInvestment struct {
	Model
	ID                          string  `gorm:"primary_key;column:project_investment_id" json:"id"`
	ProjectId                   string  `gorm:"column:project_id" json:"project_id"`
	Project                     Project `gorm:"foreignkey:project_id"`
	InvestmentType              string  `gorm:"column:investment_type" json:"investment_type"`
	InvestmentName              string  `gorm:"column:investment_name" json:"investment_name"`
	InvestmentAmountTaxIncluded string  `gorm:"column:investment_amount_tax_included" json:"investment_amount_tax_included"`
	YearOfPurchase              string  `gorm:"column:year_of_purchase" json:"year_of_purchase"`
	MonthOfPurchase             string  `gorm:"column:month_of_purchase" json:"month_of_purchase"`
	Duration                    string  `gorm:"column:duration" json:"duration"`
	VatRateOnInvestment         string  `gorm:"column:vat_rate_on_investment" json:"vat_rate_on_investment"`
	Contribution                string  `gorm:"column:contribution" json:"contribution"`
}

// Set table name to be `project_legal_status`
func (ProjectInvestment) TableName() string {
	return "project_investments"
}
