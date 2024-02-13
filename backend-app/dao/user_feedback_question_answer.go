package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type UserFeedbackQuestionAnswerDAO struct{}

func NewUserFeedbackQuestionAnswerDAO() *UserFeedbackQuestionAnswerDAO {
	return &UserFeedbackQuestionAnswerDAO{}
}

func (dao *UserFeedbackQuestionAnswerDAO) GetById(id string) (*models.UserFeedbackQuestionAnswer, error) {
	var pl models.UserFeedbackQuestionAnswer
	err := config.Datastore.AppDatabase.
		Where("user_feedback_question_answer_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}

func (dao *UserFeedbackQuestionAnswerDAO) CreateUserFeedbackQuestionAnswer(pl *models.UserFeedbackQuestionAnswer) (err error) {
	err = config.Datastore.AppDatabase.Create(pl).Error
	return
}
func (dao *UserFeedbackQuestionAnswerDAO) UpdateField(pl *models.UserFeedbackQuestionAnswer, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(pl).Update(field, value).Error
	return
}
func (dao *UserFeedbackQuestionAnswerDAO) FetchUserFeedbackQuestionAnswers(ty, label, user_id string) []models.UserFeedbackQuestionAnswer {
	var i []models.UserFeedbackQuestionAnswer
	config.Datastore.AppDatabase.Where("type = ? AND label = ? AND user_id = ?", ty, label, user_id).Order("created_at asc").Find(&i)
	return i
}
