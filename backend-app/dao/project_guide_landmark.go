package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectGuideLandmarkDAO struct{}

func NewProjectGuideLandmarkDAO() *ProjectGuideLandmarkDAO {
	return &ProjectGuideLandmarkDAO{}
}
func (dao *ProjectGuideLandmarkDAO) GetByLabel(label, project_id string) (*models.ProjectGuideLandmark, error) {
	var guideLandmark models.ProjectGuideLandmark
	err := config.Datastore.AppDatabase.
		Where(&models.ProjectGuideLandmark{Label: label, ProjectId: project_id}).
		First(&guideLandmark).
		Error

	return &guideLandmark, err
}
func (dao *ProjectGuideLandmarkDAO) GetLandmarksByGuide(guideId string) ([]models.ProjectGuideLandmark, error) {
	var guideLandmarks []models.ProjectGuideLandmark
	err := config.Datastore.AppDatabase.
		Where("project_guide_id = ?", guideId).
		Find(&guideLandmarks).
		Error
	return guideLandmarks, err
}
func (dao *ProjectGuideLandmarkDAO) UpdateProjectGuideLandmark(guideLandmark *models.ProjectGuideLandmark) (*models.ProjectGuideLandmark, error) {
	err := config.Datastore.AppDatabase.Model(guideLandmark).Update("status", guideLandmark.Status).Error
	return guideLandmark, err
}
func (dao *ProjectGuideLandmarkDAO) CreateProjectGuideLandmark(p *models.ProjectGuideLandmark) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectGuideLandmarkDAO) FindProjectGuideLandmark(pI *models.ProjectGuideLandmark) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectGuideLandmarkDAO) FetchProjectGuideLandmarks(id string) []models.ProjectGuideLandmark {
	var i []models.ProjectGuideLandmark
	config.Datastore.AppDatabase.Where("project_guide_id = ?", id).Order("created_at asc").Find(&i)
	return i
}
func (dao *ProjectGuideLandmarkDAO) DeleteProjectGuideLandmark(p *models.ProjectGuideLandmark) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
