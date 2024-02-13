package services

import (
	"errors"

	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectGuideDao interface {
	EditProjectGuide(pp *models.ProjectGuide) (*models.ProjectGuide, error)
	CreateProjectGuide(pp *models.ProjectGuide) error
	GetByLabel(label, project_id string) (*models.ProjectGuide, error)
	PauseProjectGuides(p *models.ProjectGuide) error
	FindProjectGuide(*models.ProjectGuide) error
}

type ProjectGuideService struct {
	dao projectGuideDao
}

func NewProjectGuideService(dao projectGuideDao) *ProjectGuideService {
	return &ProjectGuideService{dao: dao}
}
func (svc *ProjectGuideService) PauseProjectGuides(p *models.ProjectGuide) error {
	return svc.dao.PauseProjectGuides(p)
}
func (svc *ProjectGuideService) CreateProjectGuide(p *models.ProjectGuide, landmarks []*models.ProjectGuideLandmark, achievements map[string][]*models.ProjectGuideLandmarkAchievement) (messages.CreateGuide, error) {
	guide, err := svc.dao.GetByLabel(p.Label, p.ProjectId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := svc.dao.CreateProjectGuide(p); err != nil {
				return messages.CreateGuide{}, err
			}
		} else {
			return messages.CreateGuide{}, err
		}
	}
	daoLandmarks := dao.NewProjectGuideLandmarkDAO()
	svcLandmarks := NewProjectGuideLandmarkService(daoLandmarks)
	daoAchievements := dao.NewProjectGuideLandmarkAchievementDAO()
	svcAchievements := NewProjectGuideLandmarkAchievementService(daoAchievements)
	var guideId string
	if guide.ID == "" {
		guideId = p.ID
	} else {
		guideId = guide.ID
	}
	for _, landmark := range landmarks {
		landmark.ProjectGuideId = guideId
		existingLandmark, err := svcLandmarks.GetByLabel(landmark.Label, p.ProjectId)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return messages.CreateGuide{}, err
		}
		if existingLandmark.Status != "" {
			landmark.Status = existingLandmark.Status
		}
		if _, err := svcLandmarks.CreateProjectGuideLandmark(landmark); err != nil {
			return messages.CreateGuide{}, err
		}
		for _, achievement := range achievements[landmark.Label] {
			achievement.ProjectGuideId = guideId
			achievement.ProjectGuideLandmarkId = landmark.ID
			existingAchievement, err := svcAchievements.GetByLabel(achievement.Label, p.ProjectId)
			if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
				return messages.CreateGuide{}, err
			}
			if existingAchievement.Status != "" {
				achievement.Status = existingAchievement.Status
			}
			if _, err := svcAchievements.CreateProjectGuideLandmarkAchievement(achievement); err != nil {
				return messages.CreateGuide{}, err
			}
		}
	}
	for _, landmark := range landmarks {
		if err := svcAchievements.UpdateGuideStatus(landmark.ID, landmark.ProjectGuideId); err != nil {
			return messages.CreateGuide{}, err
		}
	}
	if err := svc.PauseProjectGuides(p); err != nil {
		return messages.CreateGuide{}, err
	}
	return messages.CreateGuide{
		Guide:          p,
		GuideLandmarks: landmarks,
	}, nil
}

func (svc *ProjectGuideService) EditProjectGuide(p *models.ProjectGuide) (messages.EditGuide, error) {
	p, err := svc.dao.EditProjectGuide(p)
	if err != nil {
		return messages.EditGuide{}, err
	}
	daoLandmarks := dao.NewProjectGuideLandmarkDAO()
	svcLandmarks := NewProjectGuideLandmarkService(daoLandmarks)
	landmarks, err := svcLandmarks.GetLandmarksByGuide(p.ID)
	if err != nil {
		return messages.EditGuide{}, err
	}
	for _, landmark := range landmarks {
		existingLandmark, err := svcLandmarks.GetByLabel(landmark.Label, p.ProjectId)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return messages.EditGuide{}, err
		}
		if existingLandmark.ID != landmark.ID && existingLandmark.Status != "" {
			landmark.Status = existingLandmark.Status
			if _, err := svcLandmarks.UpdateProjectGuideLandmark(&landmark); err != nil {
				return messages.EditGuide{}, err
			}
		}
	}
	if err := svc.PauseProjectGuides(p); err != nil {
		return messages.EditGuide{}, err
	}
	return messages.EditGuide{
		Guide: p,
	}, nil
}
func (svc *ProjectGuideService) GetGuide(label, project_id string) (messages.GetGuide, error) {
	guide, err := svc.dao.GetByLabel(label, project_id)
	if err != nil {
		return messages.GetGuide{}, err
	}
	daoLandmarks := dao.NewProjectGuideLandmarkDAO()
	svcLandmarks := NewProjectGuideLandmarkService(daoLandmarks)
	landmarks, err := svcLandmarks.GetLandmarksByGuide(guide.ID)
	if err != nil {
		return messages.GetGuide{}, err
	}
	return messages.GetGuide{
		Guide:          guide,
		GuideLandmarks: landmarks,
	}, nil
}
func (svc *ProjectGuideService) GetGuideById(id string) (messages.GetGuide, error) {
	guide := &models.ProjectGuide{
		ID: id,
	}
	err := svc.dao.FindProjectGuide(guide)
	if err != nil {
		return messages.GetGuide{}, err
	}
	daoLandmarks := dao.NewProjectGuideLandmarkDAO()
	svcLandmarks := NewProjectGuideLandmarkService(daoLandmarks)
	landmarks, err := svcLandmarks.GetLandmarksByGuide(guide.ID)
	if err != nil {
		return messages.GetGuide{}, err
	}
	return messages.GetGuide{
		Guide:          guide,
		GuideLandmarks: landmarks,
	}, nil
}
