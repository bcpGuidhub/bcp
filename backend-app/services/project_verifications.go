package services

import (
	"errors"

	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectVerificationDao interface {
	EditProjectVerification(pp *models.ProjectVerification) (*models.ProjectVerification, error)
	CreateProjectVerification(pp *models.ProjectVerification) error
	GetByLabel(label, project_id string) (*models.ProjectVerification, error)
}

type ProjectVerificationService struct {
	dao projectVerificationDao
}

func NewProjectVerificationService(dao projectVerificationDao) *ProjectVerificationService {
	return &ProjectVerificationService{dao: dao}
}
func (svc *ProjectVerificationService) CreateProjectVerification(p *models.ProjectVerification, questions []*models.ProjectVerificationQuestion) (messages.CreateVerification, error) {
	verification, err := svc.dao.GetByLabel(p.Label, p.ProjectId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := svc.dao.CreateProjectVerification(p); err != nil {
				return messages.CreateVerification{}, err
			}
		} else {
			return messages.CreateVerification{}, err
		}
	}
	daoQuestions := dao.NewProjectVerificationQuestionDAO()
	svcQuestions := NewProjectVerificationQuestionService(daoQuestions)
	var verificationId string
	if verification.ID == "" {
		verificationId = p.ID
	} else {
		verificationId = verification.ID
	}
	for _, question := range questions {
		question.ProjectVerificationId = verificationId
		if _, err := svcQuestions.AssignProjectVerificationQuestion(question); err != nil {
			return messages.CreateVerification{}, err
		}
	}
	return messages.CreateVerification{
		Verification: p,
		Questions:    questions,
	}, nil
}

func (svc *ProjectVerificationService) EditProjectVerification(p *models.ProjectVerification, questions []*models.ProjectVerificationQuestion) (messages.EditVerification, error) {
	p, err := svc.dao.EditProjectVerification(p)
	if err != nil {
		return messages.EditVerification{}, err
	}
	daoQuestions := dao.NewProjectVerificationQuestionDAO()
	svcQuestions := NewProjectVerificationQuestionService(daoQuestions)
	for _, question := range questions {
		if _, err := svcQuestions.EditProjectVerificationQuestion(question); err != nil {
			return messages.EditVerification{}, err
		}
	}
	return messages.EditVerification{
		Verification: p,
		Questions:    questions,
	}, nil
}
func (svc *ProjectVerificationService) EditProjectVerificationVisibility(verifications []*models.ProjectVerification) error {
	for _, verification := range verifications {
		verificationExists, err := svc.dao.GetByLabel(verification.Label, verification.ProjectId)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				if _, err := svc.CreateProjectVerification(verification, []*models.ProjectVerificationQuestion{}); err != nil {
					return err
				} else {
					return nil
				}
			} else {
				return err
			}
		}
		verification.ID = verificationExists.ID
		if _, err := svc.EditProjectVerification(verification, []*models.ProjectVerificationQuestion{}); err != nil {
			return err
		}
	}
	return nil
}
