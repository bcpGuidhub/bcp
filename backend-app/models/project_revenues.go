package models

type ProjectRevenue struct {
	Model
	ID                           string  `gorm:"primary_key;column:project_revenues_id" json:"id"`
	ProjectId                    string  `gorm:"column:project_id" json:"project_id"`
	Project                      Project `gorm:"foreignkey:project_id"`
	RevenueLabel                 string  `gorm:"column:revenue_label" json:"revenue_label"`
	RevenuePartition             string  `gorm:"column:revenue_partition" json:"revenue_partition"`
	AnnualAmountTaxExcludedYear1 string  `gorm:"column:annual_amount_tax_excluded_year_1" json:"annual_amount_tax_excluded_year_1"`
	AnnualAmountTaxExcludedYear2 string  `gorm:"column:annual_amount_tax_excluded_year_2" json:"annual_amount_tax_excluded_year_2"`
	AnnualAmountTaxExcludedYear3 string  `gorm:"column:annual_amount_tax_excluded_year_3" json:"annual_amount_tax_excluded_year_3"`
	InventoryLinkedRevenue       string  `gorm:"column:inventory_linked_revenue" json:"inventory_linked_revenue"`
	PercentageMargin             string  `gorm:"column:percentage_margin" json:"percentage_margin"`
	ValuationOfStartingStock     string  `gorm:"column:valuation_of_starting_stock" json:"valuation_of_starting_stock"`
	MeanValuationOfStock         string  `gorm:"column:mean_valuation_of_stock" json:"mean_valuation_of_stock"`
	VatRateRevenue               string  `gorm:"column:vat_rate_revenue" json:"vat_rate_revenue"`
	CustomerPaymentDeadline      string  `gorm:"column:customer_payment_deadline" json:"customer_payment_deadline"`
	SupplierPaymentDeadline      string  `gorm:"column:supplier_payment_deadline" json:"supplier_payment_deadline"`
	VatRateOnPurchases           string  `gorm:"column:vat_rate_on_purchases" json:"vat_rate_on_purchases"`
}

// Set table name to be `project_revenues`
func (ProjectRevenue) TableName() string {
	return "project_revenues"
}
