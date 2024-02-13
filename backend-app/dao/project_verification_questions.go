package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectVerificationQuestionDAO struct{}

func NewProjectVerificationQuestionDAO() *ProjectVerificationQuestionDAO {
	return &ProjectVerificationQuestionDAO{}
}
func (dao *ProjectVerificationQuestionDAO) AssignProjectVerificationQuestion(pl *models.ProjectVerificationQuestion) (*models.ProjectVerificationQuestion, error) {
	err := config.Datastore.AppDatabase.Where(models.ProjectVerificationQuestion{Label: pl.Label, ProjectVerificationId: pl.ProjectVerificationId}).Assign(models.ProjectVerificationQuestion{
		Label:                 pl.Label,
		Response:              pl.Response,
		ProjectVerificationId: pl.ProjectVerificationId,
	}).FirstOrCreate(pl).Error
	return pl, err
}
func (dao *ProjectVerificationQuestionDAO) CreateProjectVerificationQuestion(p *models.ProjectVerificationQuestion) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectVerificationQuestionDAO) FindProjectVerificationQuestion(pI *models.ProjectVerificationQuestion) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectVerificationQuestionDAO) EditProjectVerificationQuestion(pl *models.ProjectVerificationQuestion) (*models.ProjectVerificationQuestion, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectVerificationQuestion{
		Label:    pl.Label,
		Response: pl.Response,
	}).Error
	return pl, err
}
func (dao *ProjectVerificationQuestionDAO) FetchProjectVerificationQuestions(id string) []models.ProjectVerificationQuestion {
	var i []models.ProjectVerificationQuestion
	config.Datastore.AppDatabase.Where("project_verification_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectVerificationQuestionDAO) DeleteProjectVerificationQuestion(p *models.ProjectVerificationQuestion) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
