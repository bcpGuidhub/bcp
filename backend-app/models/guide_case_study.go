package models

import "github.com/lib/pq"

type GuideCaseStudy struct {
	Model
	ID           string         `gorm:"primary_key;column:guide_id" json:"id"`
	ProjectId    string         `gorm:"column:project_id" json:"project_id"`
	ProjectGuide ProjectGuide   `gorm:"foreignkey:guide_id"`
	Project      Project        `gorm:"foreignkey:project_id"`
	Cases        pq.StringArray `gorm:"column:cases" json:"cases"`
}

// Set table name to be `guides_case_study`
func (GuideCaseStudy) TableName() string {
	return "guides_case_study"
}
