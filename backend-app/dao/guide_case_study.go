package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type GuideCaseStudyDAO struct{}

func NewGuideCaseStudyDAO() *GuideCaseStudyDAO {
	return &GuideCaseStudyDAO{}
}

func (dao *GuideCaseStudyDAO) GetById(id string) (*models.GuideCaseStudy, error) {
	var pl models.GuideCaseStudy
	err := config.Datastore.AppDatabase.
		Where("guide_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}
func (dao *GuideCaseStudyDAO) EditGuideCaseStudy(pl *models.GuideCaseStudy) (*models.GuideCaseStudy, error) {
	var pL models.GuideCaseStudy
	err := config.Datastore.AppDatabase.Where(models.GuideCaseStudy{ID: pl.ID, ProjectId: pl.ProjectId}).Assign(models.GuideCaseStudy{
		Cases: pl.Cases,
	}).FirstOrCreate(&pL).Error
	return &pL, err
}
