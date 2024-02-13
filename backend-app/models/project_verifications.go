package models

type ProjectVerification struct {
	Model
	ID        string  `gorm:"primary_key;column:project_verifications_id" json:"id"`
	ProjectId string  `gorm:"column:project_id" json:"project_id"`
	Project   Project `gorm:"foreignkey:project_id"`
	Label     string  `gorm:"column:label" json:"label"`
	Visible   bool    `gorm:"column:visible" json:"visible"`
}

// Set table name to be `project_verifications`
func (ProjectVerification) TableName() string {
	return "project_verifications"
}
