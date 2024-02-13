package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectPreparationDAO struct{}

func NewProjectPreparationDAO() *ProjectPreparationDAO {
	return &ProjectPreparationDAO{}
}

func (dao *ProjectPreparationDAO) GetById(id string) (*models.ProjectPreparation, error) {
	var pp models.ProjectPreparation
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pp).
		Error
	return &pp, err
}

func (dao *ProjectPreparationDAO) CreateProjectPreparation(pp *models.ProjectPreparation) (err error) {
	err = config.Datastore.AppDatabase.Create(pp).Error
	return
}

func (dao *ProjectPreparationDAO) PreloadProject(id string) (*models.ProjectPreparation, error) {
	var pp models.ProjectPreparation
	err := config.Datastore.AppDatabase.Preload("Project").
		Where("project_id = ?", id).
		First(&pp).
		Error
	return &pp, err
}

func (dao *ProjectPreparationDAO) EditProjectPreparation(pp *models.ProjectPreparation) (*models.ProjectPreparation, error) {
	var projectP models.ProjectPreparation
	err := config.Datastore.AppDatabase.Where(models.ProjectPreparation{ID: pp.ID}).Assign(models.ProjectPreparation{
		NonCompeteClause:                 pp.NonCompeteClause,
		DomainCompetence:                 pp.DomainCompetence,
		ProjectParticipants:              pp.ProjectParticipants,
		VerifiedInterestInIdea:           pp.VerifiedInterestInIdea,
		IsProjectInnovative:              pp.IsProjectInnovative,
		IsTrademarkProctectionRequired:   pp.IsTrademarkProctectionRequired,
		ShortDescriptionIdea:             pp.ShortDescriptionIdea,
		WebsiteRequired:                  pp.WebsiteRequired,
		TechnicalDomainCompetence:        pp.TechnicalDomainCompetence,
		SalesDomainCompetence:            pp.SalesDomainCompetence,
		ManagementDomainCompetence:       pp.ManagementDomainCompetence,
		CurrentEmploymentStatus:          pp.CurrentEmploymentStatus,
		ContractType:                     pp.ContractType,
		TypeContractRupture:              pp.TypeContractRupture,
		ProfessionalReconversion:         pp.ProfessionalReconversion,
		RequiresQuitingJob:               pp.RequiresQuitingJob,
		InCompetitionWithCurrentEmployer: pp.InCompetitionWithCurrentEmployer,
		ExclusivityClause:                pp.ExclusivityClause,
	}).FirstOrCreate(&projectP).Error
	return &projectP, err

}

func (dao *ProjectPreparationDAO) UpdateProjectPreparation(pp *models.ProjectPreparation, field string, value string) (err error) {
	err = config.Datastore.AppDatabase.Model(pp).Update(field, value).Error
	return
}
