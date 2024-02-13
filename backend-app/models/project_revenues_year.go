package models

type ProjectRevenuesYear struct {
	Model
	ID               string         `gorm:"primary_key;column:project_revenues_year_id" json:"id"`
	ProjectRevenueId string         `gorm:"column:project_revenues_id" json:"project_revenues_id"`
	ProjectRevenue   ProjectRevenue `gorm:"foreignkey:project_revenues_id"`
	Year             string         `gorm:"column:year" json:"year"`
	Month1Amount     string         `gorm:"column:month_1_amount" json:"month_1_amount"`
	Month2Amount     string         `gorm:"column:month_2_amount" json:"month_2_amount"`
	Month3Amount     string         `gorm:"column:month_3_amount" json:"month_3_amount"`
	Month4Amount     string         `gorm:"column:month_4_amount" json:"month_4_amount"`
	Month5Amount     string         `gorm:"column:month_5_amount" json:"month_5_amount"`
	Month6Amount     string         `gorm:"column:month_6_amount" json:"month_6_amount"`
	Month7Amount     string         `gorm:"column:month_7_amount" json:"month_7_amount"`
	Month8Amount     string         `gorm:"column:month_8_amount" json:"month_8_amount"`
	Month9Amount     string         `gorm:"column:month_9_amount" json:"month_9_amount"`
	Month10Amount    string         `gorm:"column:month_10_amount" json:"month_10_amount"`
	Month11Amount    string         `gorm:"column:month_11_amount" json:"month_11_amount"`
	Month12Amount    string         `gorm:"column:month_12_amount" json:"month_12_amount"`
}

// Set table name to be `project_revenues_year`
func (ProjectRevenuesYear) TableName() string {
	return "project_revenues_year"
}
