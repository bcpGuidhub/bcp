package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectVerificationQuestionDao interface {
	EditProjectVerificationQuestion(pp *models.ProjectVerificationQuestion) (*models.ProjectVerificationQuestion, error)
	CreateProjectVerificationQuestion(pp *models.ProjectVerificationQuestion) error
	AssignProjectVerificationQuestion(pp *models.ProjectVerificationQuestion) (*models.ProjectVerificationQuestion, error)
}

type ProjectVerificationQuestionService struct {
	dao projectVerificationQuestionDao
}

func NewProjectVerificationQuestionService(dao projectVerificationQuestionDao) *ProjectVerificationQuestionService {
	return &ProjectVerificationQuestionService{dao: dao}
}
func (svc *ProjectVerificationQuestionService) CreateProjectVerificationQuestion(p *models.ProjectVerificationQuestion) (messages.CreateVerificationQuestion, error) {
	if err := svc.dao.CreateProjectVerificationQuestion(p); err != nil {
		return messages.CreateVerificationQuestion{}, err
	}
	return messages.CreateVerificationQuestion{
		VerificationQuestion: p,
	}, nil
}
func (svc *ProjectVerificationQuestionService) AssignProjectVerificationQuestion(p *models.ProjectVerificationQuestion) (messages.CreateVerificationQuestion, error) {
	if _, err := svc.dao.AssignProjectVerificationQuestion(p); err != nil {
		return messages.CreateVerificationQuestion{}, err
	}
	return messages.CreateVerificationQuestion{
		VerificationQuestion: p,
	}, nil
}

func (svc *ProjectVerificationQuestionService) EditProjectVerificationQuestion(p *models.ProjectVerificationQuestion) (*models.ProjectVerificationQuestion, error) {
	p, err := svc.dao.EditProjectVerificationQuestion(p)
	if err != nil {
		return p, err
	}
	return p, nil
}
