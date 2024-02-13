package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectVerificationDAO struct{}

func NewProjectVerificationDAO() *ProjectVerificationDAO {
	return &ProjectVerificationDAO{}
}
func (dao *ProjectVerificationDAO) CreateProjectVerification(p *models.ProjectVerification) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectVerificationDAO) GetByLabel(label, project_id string) (*models.ProjectVerification, error) {
	var verification models.ProjectVerification
	err := config.Datastore.AppDatabase.
		Where("label = ? AND project_id = ?", label, project_id).
		First(&verification).
		Error

	return &verification, err
}
func (dao *ProjectVerificationDAO) FindProjectVerification(pI *models.ProjectVerification) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectVerificationDAO) EditProjectVerification(pl *models.ProjectVerification) (*models.ProjectVerification, error) {
	err := config.Datastore.AppDatabase.Model(pl).Update("visible", pl.Visible).Error
	return pl, err
}
func (dao *ProjectVerificationDAO) FetchProjectVerifications(id string) []models.ProjectVerification {
	var i []models.ProjectVerification
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectVerificationDAO) DeleteProjectVerification(p *models.ProjectVerification) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
