package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectGuideLandmarkAchievementDAO struct{}

func NewProjectGuideLandmarkAchievementDAO() *ProjectGuideLandmarkAchievementDAO {
	return &ProjectGuideLandmarkAchievementDAO{}
}
func (dao *ProjectGuideLandmarkAchievementDAO) GetByLabel(label, project_id string) (*models.ProjectGuideLandmarkAchievement, error) {
	var guideLandmark models.ProjectGuideLandmarkAchievement
	err := config.Datastore.AppDatabase.
		Where(&models.ProjectGuideLandmarkAchievement{Label: label, ProjectId: project_id}).
		First(&guideLandmark).
		Error

	return &guideLandmark, err
}
func (dao *ProjectGuideLandmarkAchievementDAO) GetAchievementsByLandmark(landmarkId string) ([]models.ProjectGuideLandmarkAchievement, error) {
	var guideLandmarks []models.ProjectGuideLandmarkAchievement
	err := config.Datastore.AppDatabase.
		Where("project_guide_landmarks_id = ?", landmarkId).
		Find(&guideLandmarks).
		Error
	return guideLandmarks, err
}
func (dao *ProjectGuideLandmarkAchievementDAO) UpdateProjectGuideLandmarkAchievement(achievement *models.ProjectGuideLandmarkAchievement) (*models.ProjectGuideLandmarkAchievement, error) {
	err := config.Datastore.AppDatabase.Model(achievement).Update("status", achievement.Status).Error
	return achievement, err
}
func (dao *ProjectGuideLandmarkAchievementDAO) CreateProjectGuideLandmarkAchievement(p *models.ProjectGuideLandmarkAchievement) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectGuideLandmarkAchievementDAO) FindProjectGuideLandmarkAchievement(pI *models.ProjectGuideLandmarkAchievement) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectGuideLandmarkAchievementDAO) FetchProjectGuideLandmarkAchievements(id string) []models.ProjectGuideLandmarkAchievement {
	var i []models.ProjectGuideLandmarkAchievement
	config.Datastore.AppDatabase.Where("project_guide_landmarks_id = ?", id).Order("created_at asc").Find(&i)
	return i
}
func (dao *ProjectGuideLandmarkAchievementDAO) DeleteProjectGuideLandmarkAchievement(p *models.ProjectGuideLandmarkAchievement) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
