package models

import "github.com/lib/pq"

type ProjectFinanceCapacity struct {
	Model
	ID           string         `gorm:"primary_key;column:project_id" json:"id"`
	Project      Project        `gorm:"foreignkey:project_id"`
	Declarations pq.StringArray `gorm:"column:declarations" json:"declarations"`
}

// Set ProjectFinanceCapacity table name to be `project_finance_capacity`
func (ProjectFinanceCapacity) TableName() string {
	return "project_finance_capacity"
}
