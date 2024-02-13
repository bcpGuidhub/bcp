package dao

import (
	"time"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectDAO struct {
}

// NewProjectDAO creates a new UserDAO
func NewProjectDAO() *ProjectDAO {
	return &ProjectDAO{}
}

// GetByUserID returns a user.
func (dao *ProjectDAO) GetUserByID(id string) (*models.User, error) {
	var user models.User
	err := config.Datastore.AppDatabase.
		Where("user_id = ?", id).
		First(&user).
		Error

	return &user, err
}
func (dao *ProjectDAO) UpdateProjectLaunchValidationRdv(project *models.Project, value bool) (err error) {
	err = config.Datastore.AppDatabase.Model(project).Update("project_launch_validation_rdv", value).Error
	return
}
func (dao *ProjectDAO) UpdateProjectLaunchValidationRdvDate(project *models.Project, value time.Time) (err error) {
	err = config.Datastore.AppDatabase.Model(project).Update("project_launch_validation_rdv_date", value).Error
	return
}
func (dao *ProjectDAO) UpdateProjectFinanceValidationRdv(project *models.Project, value bool) (err error) {
	err = config.Datastore.AppDatabase.Model(project).Update("project_finance_validation_rdv", value).Error
	return
}
func (dao *ProjectDAO) UpdateProjectFinanceValidationRdvDate(project *models.Project, value time.Time) (err error) {
	err = config.Datastore.AppDatabase.Model(project).Update("project_finance_validation_rdv_date", value).Error
	return
}
func (dao *ProjectDAO) GetProjectById(id string) (*models.Project, error) {
	var project models.Project
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&project).
		Error
	return &project, err
}

func (dao *ProjectDAO) CreateProject(project *models.Project) (err error) {
	err = config.Datastore.AppDatabase.Create(project).Error
	return
}

func (dao *ProjectDAO) UpdateProject(project *models.Project) (err error) {
	err = config.Datastore.AppDatabase.Model(project).Updates(
		models.Project{
			TypeProject:                 project.TypeProject,
			SearchableAddress:           project.SearchableAddress,
			ActivitySector:              project.ActivitySector,
			ProjectAdvancementStage:     project.ProjectAdvancementStage,
			ExpectedTurnover:            project.ExpectedTurnover,
			Hiring:                      project.Hiring,
			ProjectBudget:               project.ProjectBudget,
			PersonalContributionsBudget: project.PersonalContributionsBudget,
			ExpertStatus:                project.ExpertStatus,
		},
	).Error
	return
}
func (dao *ProjectDAO) UpdateField(p *models.Project, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(p).Update(field, value).Error
	return
}
