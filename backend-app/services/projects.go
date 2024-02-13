package services

import (
	"errors"
	"time"

	businessProjectTestSuite "gitlab.com/le-coin-des-entrepreneurs/backend-app/business_project_test_suite"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var (
	ErrUserNil             = errors.New("no user found")
	ErrProjectInvalidField = errors.New("invalid data or field missing")
)

type projectDao interface {
	CreateProject(project *models.Project) error
	GetUserByID(id string) (*models.User, error)
	UpdateProject(*models.Project) error
	UpdateProjectLaunchValidationRdv(*models.Project, bool) error
	GetProjectById(id string) (*models.Project, error)
	UpdateProjectLaunchValidationRdvDate(project *models.Project, value time.Time) error
}

type ProjectService struct {
	dao projectDao
}

func NewProjectService(dao projectDao) *ProjectService {
	return &ProjectService{dao}
}

func (svc *ProjectService) GetUserByID(id string) (*models.User, error) {
	return svc.dao.GetUserByID(id)
}

func (svc *ProjectService) CreateProject(project *models.Project) error {

	user, err := svc.GetUserByID(project.UserId)
	if err != nil {
		return ErrUserNil
	}

	if err = redis.MessageBrokerClient.ContactCreateFromGuidHub(user, map[string]interface{}{
		"by_sector":  true,
		"sector":     project.ActivitySector,
		"by_invite":  false,
		"contact_id": "",
		"address":    project.SearchableAddress,
	}); err != nil {
		return err
	}

	if err := svc.dao.CreateProject(project); err != nil {
		return err
	}

	return businessProjectTestSuite.BuildTestSuites(project.ID)

}
func (svc *ProjectService) EditProject(project *models.Project) (messages.EditProject, error) {
	err := svc.dao.UpdateProject(project)
	if err != nil {
		return messages.EditProject{}, err
	}
	//	if err := svc.updateLegalStatus(project); err != nil {
	//		return messages.EditProject{}, err
	//	}

	return messages.EditProject{
		Message: "project edited",
		Project: project,
	}, nil
}

func (svc *ProjectService) LaunchProject(id, message, destination string) error {
	project, err := svc.dao.GetProjectById(id)
	if err != nil {
		return err
	}
	dao := dao.NewProjectAddressDAO()
	svcAddress := NewProjectAddressService(dao)
	address, err := svcAddress.GetById(project.ID)
	if err != nil {
		return err
	}
	dataObj := map[string]string{
		"last_name":    project.User.LastName,
		"first_name":   project.User.FirstName,
		"telephone":    project.User.Telephone,
		"email":        project.User.Email,
		"postal_code":  address.PostalCode,
		"activity":     project.ActivitySector,
		"project_type": project.TypeProject,
		"destination":  destination,
		"message":      message,
	}
	if err := messages.SendProjectLaunchRdv(dataObj, EmailAdmin); err != nil {
		if err[0] != nil && err[1] != nil {
			return err[0]
		}
	}
	if err := svc.dao.UpdateProjectLaunchValidationRdv(project, true); err != nil {
		return err
	}
	return svc.dao.UpdateProjectLaunchValidationRdvDate(project, time.Now())
}
