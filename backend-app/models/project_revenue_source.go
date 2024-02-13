package models

type ProjectRevenueSource struct {
	Model
	ID                   string  `gorm:"primary_key;column:project_revenue_sources_id" json:"id"`
	ProjectId            string  `gorm:"column:project_id" json:"project_id"`
	Project              Project `gorm:"foreignkey:project_id"`
	Name                 string  `gorm:"column:name" json:"name"`
	SourceType           string  `gorm:"column:source_type" json:"source_type"`
	AmountExcludingTaxes string  `gorm:"column:amount_excluding_taxes" json:"amount_excluding_taxes"`
	Year                 string  `gorm:"column:year" json:"year"`
	Month                string  `gorm:"column:month" json:"month"`
	VatRate              string  `gorm:"column:vat_rate" json:"vat_rate"`
}

// Set table name to be `project_revenue_sources`
func (ProjectRevenueSource) TableName() string {
	return "project_revenue_sources"
}
