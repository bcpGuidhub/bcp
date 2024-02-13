package models

type ProjectGuide struct {
	Model
	ID        string  `gorm:"primary_key;column:project_guide_id" json:"id"`
	ProjectId string  `gorm:"column:project_id" json:"project_id"`
	Project   Project `gorm:"foreignkey:project_id"`
	Label     string  `gorm:"column:label" json:"label"`
	Status    string  `gorm:"column:status" json:"status"`
}

// Set table name to be `project_guides`
func (ProjectGuide) TableName() string {
	return "project_guides"
}
