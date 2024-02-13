package models

type ProjectGuideLandmark struct {
	Model
	ID             string       `gorm:"primary_key;column:project_guide_landmarks_id" json:"id"`
	ProjectGuideId string       `gorm:"column:project_guide_id" json:"project_guide_id"`
	ProjectId      string       `gorm:"column:project_id" json:"project_id"`
	ProjectGuide   ProjectGuide `gorm:"foreignkey:project_guide_id"`
	Project        Project      `gorm:"foreignkey:project_id"`
	Label          string       `gorm:"column:label" json:"label"`
	Status         string       `gorm:"column:status" json:"status"`
}

// Set table name to be `project_guide_landmarks`
func (ProjectGuideLandmark) TableName() string {
	return "project_guide_landmarks"
}
