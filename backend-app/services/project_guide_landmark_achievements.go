package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectGuideLandmarkAchievementDao interface {
	CreateProjectGuideLandmarkAchievement(pp *models.ProjectGuideLandmarkAchievement) error
	UpdateProjectGuideLandmarkAchievement(pp *models.ProjectGuideLandmarkAchievement) (*models.ProjectGuideLandmarkAchievement, error)
	GetByLabel(label, project_id string) (*models.ProjectGuideLandmarkAchievement, error)
	GetAchievementsByLandmark(landmarkId string) ([]models.ProjectGuideLandmarkAchievement, error)
}

type ProjectGuideLandmarkAchievementService struct {
	dao projectGuideLandmarkAchievementDao
}

func NewProjectGuideLandmarkAchievementService(dao projectGuideLandmarkAchievementDao) *ProjectGuideLandmarkAchievementService {
	return &ProjectGuideLandmarkAchievementService{dao: dao}
}
func (svc *ProjectGuideLandmarkAchievementService) GetByLabel(label, project_id string) (*models.ProjectGuideLandmarkAchievement, error) {
	return svc.dao.GetByLabel(label, project_id)
}
func (svc *ProjectGuideLandmarkAchievementService) CreateProjectGuideLandmarkAchievement(p *models.ProjectGuideLandmarkAchievement) (messages.CreateGuideLandmarkAchievement, error) {
	if err := svc.dao.CreateProjectGuideLandmarkAchievement(p); err != nil {
		return messages.CreateGuideLandmarkAchievement{}, err
	}
	return messages.CreateGuideLandmarkAchievement{
		GuideLandmarkAchievement: p,
	}, nil
}
func (svc *ProjectGuideLandmarkAchievementService) UpdateProjectGuideLandmarkAchievement(p *models.ProjectGuideLandmarkAchievement) (messages.CreateGuideLandmarkAchievement, error) {
	if _, err := svc.dao.UpdateProjectGuideLandmarkAchievement(p); err != nil {
		return messages.CreateGuideLandmarkAchievement{}, err
	}
	//check if all achievements under the landmark are finished.
	if err := svc.UpdateGuideStatus(p.ProjectGuideLandmarkId, p.ProjectGuideId); err != nil {
		return messages.CreateGuideLandmarkAchievement{}, err
	}
	return messages.CreateGuideLandmarkAchievement{
		GuideLandmarkAchievement: p,
	}, nil
}
func (svc *ProjectGuideLandmarkAchievementService) GetAchievementsByLandmark(landmarkId string) ([]models.ProjectGuideLandmarkAchievement, error) {
	return svc.dao.GetAchievementsByLandmark(landmarkId)
}
func (svc *ProjectGuideLandmarkAchievementService) UpdateGuideStatus(landmarkId, projectGuideId string) (err error) {
	achievements, err := svc.GetAchievementsByLandmark(landmarkId)
	if err != nil {
		return err
	}
	daoGuide := dao.NewProjectGuideDAO()
	guide := models.ProjectGuide{
		ID: projectGuideId,
	}
	if _, err := daoGuide.EditLastModificationDate(&guide); err != nil {
		return err
	}
	finished := true
	for _, achievement := range achievements {
		if achievement.Status == "running" {
			finished = false
			break
		}
	}
	if finished {
		daoLandmark := dao.NewProjectGuideLandmarkDAO()
		svcLandmark := NewProjectGuideLandmarkService(daoLandmark)
		landmark := models.ProjectGuideLandmark{
			ID:     landmarkId,
			Status: "finished",
		}
		if _, err := svcLandmark.UpdateProjectGuideLandmark(&landmark); err != nil {
			return err
		}
		landmarks, err := svcLandmark.GetLandmarksByGuide(projectGuideId)
		if err != nil {
			return err
		}
		finishedLandmark := true
		for _, landmark := range landmarks {
			if landmark.Status == "running" {
				finishedLandmark = false
				break
			}
		}
		if finishedLandmark {
			daoGuide := dao.NewProjectGuideDAO()
			guide := models.ProjectGuide{
				ID:     projectGuideId,
				Status: "finished",
			}
			if _, err := daoGuide.EditProjectGuide(&guide); err != nil {
				return err
			}
		}
	}
	return nil
}
