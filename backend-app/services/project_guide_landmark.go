package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectGuideLandmarkDao interface {
	CreateProjectGuideLandmark(pp *models.ProjectGuideLandmark) error
	UpdateProjectGuideLandmark(pp *models.ProjectGuideLandmark) (*models.ProjectGuideLandmark, error)
	GetByLabel(label, project_id string) (*models.ProjectGuideLandmark, error)
	GetLandmarksByGuide(guideId string) ([]models.ProjectGuideLandmark, error)
}

type ProjectGuideLandmarkService struct {
	dao projectGuideLandmarkDao
}

func NewProjectGuideLandmarkService(dao projectGuideLandmarkDao) *ProjectGuideLandmarkService {
	return &ProjectGuideLandmarkService{dao: dao}
}
func (svc *ProjectGuideLandmarkService) GetByLabel(label, project_id string) (*models.ProjectGuideLandmark, error) {
	return svc.dao.GetByLabel(label, project_id)
}
func (svc *ProjectGuideLandmarkService) CreateProjectGuideLandmark(p *models.ProjectGuideLandmark) (messages.CreateGuideLandmark, error) {
	if err := svc.dao.CreateProjectGuideLandmark(p); err != nil {
		return messages.CreateGuideLandmark{}, err
	}
	return messages.CreateGuideLandmark{
		GuideLandmark: p,
	}, nil
}
func (svc *ProjectGuideLandmarkService) UpdateProjectGuideLandmark(p *models.ProjectGuideLandmark) (messages.CreateGuideLandmark, error) {
	if _, err := svc.dao.UpdateProjectGuideLandmark(p); err != nil {
		return messages.CreateGuideLandmark{}, err
	}
	return messages.CreateGuideLandmark{
		GuideLandmark: p,
	}, nil
}
func (svc *ProjectGuideLandmarkService) GetLandmarksByGuide(guideId string) ([]models.ProjectGuideLandmark, error) {
	return svc.dao.GetLandmarksByGuide(guideId)
}
