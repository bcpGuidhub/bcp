package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type guideCaseStudyDao interface {
	GetById(id string) (*models.GuideCaseStudy, error)
	EditGuideCaseStudy(pp *models.GuideCaseStudy) (*models.GuideCaseStudy, error)
}

type GuideCaseStudyService struct {
	dao guideCaseStudyDao
}

// NewUserService creates a new UserService with the given user DAO.
func NewGuideCaseStudyService(dao guideCaseStudyDao) *GuideCaseStudyService {
	return &GuideCaseStudyService{dao: dao}
}

func (svc *GuideCaseStudyService) GetById(id string) (*models.GuideCaseStudy, error) {
	return svc.dao.GetById(id)
}
func (svc *GuideCaseStudyService) EditGuideCaseStudy(pl *models.GuideCaseStudy) (messages.EditGuideCaseStudy, error) {
	pLp, err := svc.dao.EditGuideCaseStudy(pl)
	if err != nil {
		return messages.EditGuideCaseStudy{}, err
	}
	return messages.EditGuideCaseStudy{
		GuideCaseStudy: pLp,
	}, err
}
