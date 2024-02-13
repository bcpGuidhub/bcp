package models

import "github.com/lib/pq"

type ProjectService struct {
	Model
	ID              string         `gorm:"primary_key;column:project_services_id" json:"id"`
	ProjectId       string         `gorm:"column:project_id" json:"project_id"`
	Project         Project        `gorm:"foreignkey:project_id"`
	MetaLabel       pq.StringArray `gorm:"column:meta_label" json:"meta_label"`
	MetaDescription string         `gorm:"column:meta_description" json:"meta_description"`
}

// Set table name to be `project_services`
func (ProjectService) TableName() string {
	return "project_services"
}
