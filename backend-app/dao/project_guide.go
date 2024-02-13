package dao

import (
	"time"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectGuideDAO struct{}

func NewProjectGuideDAO() *ProjectGuideDAO {
	return &ProjectGuideDAO{}
}
func (dao *ProjectGuideDAO) CreateProjectGuide(p *models.ProjectGuide) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectGuideDAO) GetByLabel(label, project_id string) (*models.ProjectGuide, error) {
	var guide models.ProjectGuide
	err := config.Datastore.AppDatabase.
		Where("label = ? AND project_id = ?", label, project_id).
		First(&guide).
		Error

	return &guide, err
}
func (dao *ProjectGuideDAO) FindProjectGuide(pI *models.ProjectGuide) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}
func (dao *ProjectGuideDAO) EditProjectGuide(pl *models.ProjectGuide) (*models.ProjectGuide, error) {
	err := config.Datastore.AppDatabase.Model(pl).Update("status", pl.Status).Error
	return pl, err
}
func (dao *ProjectGuideDAO) EditLastModificationDate(pl *models.ProjectGuide) (*models.ProjectGuide, error) {
	err := config.Datastore.AppDatabase.Model(pl).Update("updated_at", time.Now()).Error
	return pl, err
}
func (dao *ProjectGuideDAO) FetchProjectGuides(id string) []models.ProjectGuide {
	var i []models.ProjectGuide
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectGuideDAO) PauseProjectGuides(pl *models.ProjectGuide) (err error) {
	var guides []models.ProjectGuide
	if err = config.Datastore.AppDatabase.Where("project_id = ?", pl.ProjectId).Find(&guides).Error; err != nil {
		return
	}
	for _, guide := range guides {
		if guide.ID != pl.ID && guide.Status != "finished" {
			err = config.Datastore.AppDatabase.
				Model(&models.ProjectGuide{}).
				Where("project_guide_id = ?", guide.ID).
				Update("status", "paused").
				Error
		}
	}
	return
}
func (dao *ProjectGuideDAO) DeleteProjectGuide(p *models.ProjectGuide) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
