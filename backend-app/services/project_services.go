package services

import (
	"errors"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var (
	ErrInvalidProjectServiceCreated = errors.New("invalid data or field missing")
	ErrMissingProject               = errors.New("user missing project")
)

type projectServiceDao interface {
	CreateProjectService(projectSvc *models.ProjectService) error
	GetUserByID(id string) (*models.User, error)
}

type ProjectSvcService struct {
	dao projectServiceDao
}

func NewProjectSvcService(dao projectServiceDao) *ProjectSvcService {
	return &ProjectSvcService{dao}
}

func (svc *ProjectSvcService) GetUserByID(id string) (*models.User, error) {
	return svc.dao.GetUserByID(id)
}

func (svc *ProjectSvcService) CreateProjectService(projectSvc *models.ProjectService) (messages.CreateProjectService, error) {
	//check user status.
	user, err := svc.GetUserByID(projectSvc.ID)
	if user.Email != "" && err == nil {
		if !user.ValidUser() {
			return messages.CreateProjectService{
				Message: "user is not valid",
			}, nil
		}
		if user.Pending() {
			return messages.CreateProjectService{
				Message: "user requires otp action",
			}, nil
		}
		if user.Live() {
			err = svc.dao.CreateProjectService(projectSvc)
			if err != nil {
				return messages.CreateProjectService{}, ErrInvalidProjectServiceCreated
			}
		} else {
			return messages.CreateProjectService{}, ErrMissingProject
		}
		return messages.CreateProjectService{
			Message: "project services created",
		}, nil
	}

	return messages.CreateProjectService{}, err
}
