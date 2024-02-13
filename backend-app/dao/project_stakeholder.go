package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectStakeholderDAO struct{}

func NewProjectStakeholderDAO() *ProjectStakeholderDAO {
	return &ProjectStakeholderDAO{}
}

func (dao *ProjectStakeholderDAO) GetByEmail(email string) (*models.ProjectStakeholder, error) {
	var stakeholder models.ProjectStakeholder
	err := config.Datastore.AppDatabase.
		Where("email = ?", email).
		First(&stakeholder).
		Error

	return &stakeholder, err
}

func (dao *ProjectStakeholderDAO) GetById(id string) (*models.ProjectStakeholder, error) {
	var stakeholder models.ProjectStakeholder
	err := config.Datastore.AppDatabase.
		Where("project_stakeholder_id = ?", id).
		First(&stakeholder).
		Error

	return &stakeholder, err
}

func (dao *ProjectStakeholderDAO) UpdateStakeholder(stakeholder *models.ProjectStakeholder, field string, value interface{}) (err error) {

	if field == "log_in_count" {
		v, _ := value.(int)
		err = config.Datastore.AppDatabase.Model(stakeholder).Update(field, v).Error
		return
	}
	if field == "status" {
		v, _ := value.(models.StakeholderAccountStatus)
		err = config.Datastore.AppDatabase.Model(stakeholder).Update(field, v).Error
		return
	}
	v, _ := value.(string)
	err = config.Datastore.AppDatabase.Model(stakeholder).Update(field, v).Error
	return
}

func (dao *ProjectStakeholderDAO) CreateProjectStakeholder(p *models.ProjectStakeholder) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}

func (dao *ProjectStakeholderDAO) FindProjectStakeholder(pI *models.ProjectStakeholder) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}

func (dao *ProjectStakeholderDAO) EditProjectStakeholder(pl *models.ProjectStakeholder) (*models.ProjectStakeholder, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectStakeholder{
		FirstName:   pl.FirstName,
		LastName:    pl.LastName,
		Role:        pl.Role,
		RoleDetails: pl.RoleDetails,
		Email:       pl.Email,
	}).Error
	return pl, err
}

func (dao *ProjectStakeholderDAO) FetchStakeholders(id string) []models.ProjectStakeholder {
	var i []models.ProjectStakeholder
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}

func (dao *ProjectStakeholderDAO) DeleteStakeholder(p *models.ProjectStakeholder) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}

func (dao *ProjectStakeholderDAO) CreateToken(token *models.TokenStakeholder) (err error) {
	err = config.Datastore.AppDatabase.Create(token).Error
	if err != nil {
		err = config.Datastore.AppDatabase.Model(&token).Update("content", token.Content).Error
	}
	return
}

func (dao *ProjectStakeholderDAO) GetToken(content string) (*models.TokenStakeholder, error) {
	var token models.TokenStakeholder
	err := config.Datastore.AppDatabase.Where("content = ?", content).
		First(&token).
		Error
	return &token, err
}
