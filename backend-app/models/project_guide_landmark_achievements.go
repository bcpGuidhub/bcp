package models

type ProjectGuideLandmarkAchievement struct {
	Model
	ID                     string               `gorm:"primary_key;column:project_guide_landmark_achievements_id" json:"id"`
	ProjectGuideId         string               `gorm:"column:project_guide_id" json:"project_guide_id"`
	ProjectId              string               `gorm:"column:project_id" json:"project_id"`
	ProjectGuideLandmarkId string               `gorm:"column:project_guide_landmarks_id" json:"project_guide_landmarks_id"`
	ProjectGuide           ProjectGuide         `gorm:"foreignkey:project_guide_id"`
	Project                Project              `gorm:"foreignkey:project_id"`
	ProjectGuideLandmark   ProjectGuideLandmark `gorm:"foreignkey:project_guide_landmarks_id"`
	Label                  string               `gorm:"column:label" json:"label"`
	Status                 string               `gorm:"column:status" json:"status"`
}

// Set table name to be `project_guide_landmark_achievements`
func (ProjectGuideLandmarkAchievement) TableName() string {
	return "project_guide_landmark_achievements"
}
