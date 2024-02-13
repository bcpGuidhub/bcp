package models

type UserFeedbackQuestionAnswer struct {
	Model
	ID       string `gorm:"primary_key;column:user_feedback_question_answer_id" json:"id"`
	UserId   string `gorm:"column:user_id" json:"user_id"`
	User     User   `gorm:"foreignkey:user_id"`
	MetaType string `gorm:"column:type" json:"type"`
	Label    string `gorm:"column:label" json:"label"`
	Question string `gorm:"column:question" json:"question"`
	Answer   string `gorm:"column:answer" json:"answer"`
}

// Set table name to be `user_feedback_question_answer`
func (UserFeedbackQuestionAnswer) TableName() string {
	return "user_feedback_question_answer"
}
