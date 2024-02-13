package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectLegalStatusDAO struct{}

func NewProjectLegalStatusDAO() *ProjectLegalStatusDAO {
	return &ProjectLegalStatusDAO{}
}

func (dao *ProjectLegalStatusDAO) GetById(id string) (*models.ProjectLegalStatus, error) {
	var pl models.ProjectLegalStatus
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}

func (dao *ProjectLegalStatusDAO) PreloadProject(id string) (*models.ProjectLegalStatus, error) {
	var pl models.ProjectLegalStatus
	err := config.Datastore.AppDatabase.Preload("Project").
		Where("project_id = ?", id).
		First(&pl).
		Error
	return &pl, err
}

func (dao *ProjectLegalStatusDAO) EditProjectLegalStatus(pl *models.ProjectLegalStatus) (*models.ProjectLegalStatus, error) {
	var pL models.ProjectLegalStatus
	err := config.Datastore.AppDatabase.Where(models.ProjectLegalStatus{ID: pl.ID}).Assign(models.ProjectLegalStatus{
		StakeHolders:                         pl.StakeHolders,
		LegalStatusIdea:                      pl.LegalStatusIdea,
		RecommendedLegalStatusIdea:           pl.RecommendedLegalStatusIdea,
		PersonalWealthSecurityRequired:       pl.PersonalWealthSecurityRequired,
		ManagementStake:                      pl.ManagementStake,
		TaxSystem:                            pl.TaxSystem,
		CompanyTaxPolicy:                     pl.CompanyTaxPolicy,
		SocialSecurityScheme:                 pl.SocialSecurityScheme,
		SituationPoleEmploi:                  pl.SituationPoleEmploi,
		LocaleOfChoice:                       pl.LocaleOfChoice,
		PropertyOwner:                        pl.PropertyOwner,
		PropertyAdministration:               pl.PropertyAdministration,
		DomiciliationCompany:                 pl.DomiciliationCompany,
		ProfessionalLocale:                   pl.ProfessionalLocale,
		LocalisationFinancialAid:             pl.LocalisationFinancialAid,
		LeaseLocale:                          pl.LeaseLocale,
		VerifiedContractCommercialLeases:     pl.VerifiedContractCommercialLeases,
		LocaleActivityCompatability:          pl.LocaleActivityCompatability,
		LeaseContractDuration:                pl.LeaseContractDuration,
		LeaseRentalPriceFairness:             pl.LeaseRentalPriceFairness,
		VerifiedLeasePriceRenegiations:       pl.VerifiedLeasePriceRenegiations,
		VerifiedPayableTentantFees:           pl.VerifiedPayableTentantFees,
		VerifiedInventory:                    pl.VerifiedInventory,
		CompanyVatRegime:                     pl.CompanyVatRegime,
		MicroEntrepriseAccreExemption:        pl.MicroEntrepriseAccreExemption,
		MicroEntrepriseDeclarePayCotisations: pl.MicroEntrepriseDeclarePayCotisations,
		MicroEntrepriseActivityCategory:      pl.MicroEntrepriseActivityCategory,
	}).FirstOrCreate(&pL).Error
	return &pL, err
}

func (dao *ProjectLegalStatusDAO) EditProjectCriteriaBasedLegalStatus(pl *models.ProjectLegalStatus) (*models.ProjectLegalStatus, error) {
	var pL models.ProjectLegalStatus
	err := config.Datastore.AppDatabase.Where(models.ProjectLegalStatus{ID: pl.ID}).Assign(models.ProjectLegalStatus{
		LegalStatusIdea:              pl.LegalStatusIdea,
		ManagementStake:              pl.ManagementStake,
		TaxSystem:                    pl.TaxSystem,
		SocialSecurityScheme:         pl.SocialSecurityScheme,
		CompanyVatRegime:             pl.CompanyVatRegime,
		CriteriaBasedLegalStatusIdea: pl.CriteriaBasedLegalStatusIdea,
		UserLegalCriteria:            pl.UserLegalCriteria,
		UserTaxCriteria:              pl.UserTaxCriteria,
		UserTvaCriteria:              pl.UserTvaCriteria,
		Associates:                   pl.Associates,
	}).FirstOrCreate(&pL).Error
	return &pL, err
}

func (dao *ProjectLegalStatusDAO) UpdateField(pl *models.ProjectLegalStatus, field string, value interface{}) (err error) {
	err = config.Datastore.AppDatabase.Model(pl).Update(field, value).Error
	return
}
