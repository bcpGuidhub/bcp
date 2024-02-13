package models

type ProjectVerificationQuestion struct {
	Model
	ID                    string              `gorm:"primary_key;column:project_verification_questions_id" json:"id"`
	ProjectVerificationId string              `gorm:"column:project_verification_id" json:"project_verification_id"`
	ProjectVerification   ProjectVerification `gorm:"foreignkey:project_verification_id"`
	Label                 string              `gorm:"column:label" json:"label"`
	Response              string              `gorm:"column:response" json:"response"`
}

// Set table name to be `project_verification_questions`
func (ProjectVerificationQuestion) TableName() string {
	return "project_verification_questions"
}
