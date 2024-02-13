package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type ProjectLegalStatus struct {
	StakeHolders                         string `form:"stake_holders" json:"stake_holders"`
	LegalStatusIdea                      string `form:"legal_status_idea" json:"legal_status_idea"`
	RecommendedLegalStatusIdea           string `form:"recommended_legal_status_idea" json:"recommended_legal_status_idea"`
	PersonalWealthSecurityRequired       string `form:"personal_wealth_security_required" json:"personal_wealth_security_required"`
	CompanyTaxPolicy                     string `form:"company_tax_policy" json:"company_tax_policy"`
	TaxSystem                            string `form:"tax_system" json:"tax_system"`
	SocialSecurityScheme                 string `form:"social_security_scheme" json:"social_security_scheme"`
	ManagementStake                      string `form:"management_stake" json:"management_stake"`
	SituationPoleEmploi                  string `form:"situation_pole_emploi" json:"situation_pole_emploi"`
	LocaleOfChoice                       string `form:"locale_of_choice" json:"locale_of_choice"`
	PropertyOwner                        string `form:"property_owner" json:"property_owner"`
	PropertyAdministration               string `form:"property_administration" json:"property_administration"`
	DomiciliationCompany                 string `form:"domiciliation_company" json:"domiciliation_company"`
	ProfessionalLocale                   string `form:"professional_locale" json:"professional_locale"`
	LocalisationFinancialAid             string `form:"localisation_financial_aid" json:"localisation_financial_aid"`
	LeaseLocale                          string `form:"lease_locale" json:"lease_locale"`
	VerifiedContractCommercialLeases     string `form:"verified_contract_commercial_leases" json:"verified_contract_commercial_leases"`
	LocaleActivityCompatability          string `form:"locale_activity_compatability" json:"locale_activity_compatability"`
	LeaseContractDuration                string `form:"lease_contract_duration" json:"lease_contract_duration"`
	LeaseRentalPriceFairness             string `form:"lease_rental_price_fairness" json:"lease_rental_price_fairness"`
	VerifiedLeasePriceRenegiations       string `form:"verified_lease_price_renegiations" json:"verified_lease_price_renegiations"`
	VerifiedPayableTentantFees           string `form:"verified_payable_tentant_fees" json:"verified_payable_tentant_fees"`
	VerifiedInventory                    string `form:"verified_inventory" json:"verified_inventory"`
	CompanyVatRegime                     string `form:"company_vat_regime" json:"company_vat_regime"`
	MicroEntrepriseAccreExemption        string `form:"micro_entreprise_accre_exemption" json:"micro_entreprise_accre_exemption"`
	MicroEntrepriseDeclarePayCotisations string `form:"micro_entreprise_declare_pay_cotisations" json:"micro_entreprise_declare_pay_cotisations"`
	MicroEntrepriseActivityCategory      string `form:"micro_entreprise_activity_category" json:"micro_entreprise_activity_category"`
}
type ProjectCriteriaBasedLegalStatus struct {
	LegalStatusIdea              string   `form:"legal_status_idea" json:"legal_status_idea" binding:"required"`
	TaxSystem                    string   `form:"tax_system" json:"tax_system"`
	SocialSecurityScheme         string   `form:"social_security_scheme" json:"social_security_scheme"`
	ManagementStake              string   `form:"management_stake" json:"management_stake"`
	CompanyVatRegime             string   `form:"company_vat_regime" json:"company_vat_regime"`
	CriteriaBasedLegalStatusIdea string   `form:"criteria_based_legal_status_idea" json:"criteria_based_legal_status_idea" binding:"required"`
	UserLegalCriteria            []string `form:"user_legal_criteria" json:"user_legal_criteria" binding:"required"`
	Associates                   string   `form:"associates" json:"associates" binding:"required"`
}
type ProjectCriteriaBasedTaxConfiguration struct {
	UserTaxCriteria []string `form:"user_tax_criteria" json:"user_tax_criteria" binding:"required"`
}

type ProjectCriteriaBasedTvaConfiguration struct {
	UserTvaCriteria []string `form:"user_tva_criteria" json:"user_tva_criteria" binding:"required"`
}

func GetProjectLegalStatus(c *gin.Context) {
	projectId := c.Param("id")
	c.JSON(200, response.ProjectLegalStatus(projectId))
}

func EditProjectLegalStatus(c *gin.Context) {
	projectId := c.Param("id")

	var pl ProjectLegalStatus
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLegalStatusDAO()
	svc := services.NewProjectLegalStatusService(dao)
	plObject := models.ProjectLegalStatus{
		ID:                                   projectId,
		StakeHolders:                         pl.StakeHolders,
		LegalStatusIdea:                      pl.LegalStatusIdea,
		RecommendedLegalStatusIdea:           pl.RecommendedLegalStatusIdea,
		TaxSystem:                            pl.TaxSystem,
		ManagementStake:                      pl.ManagementStake,
		PersonalWealthSecurityRequired:       pl.PersonalWealthSecurityRequired,
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
	}
	m, err := svc.EditProjectLegalStatus(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectLegalStatus(&m))
}

func EditProjectCriteriaBasedLegalStatus(c *gin.Context) {
	projectId := c.Param("id")

	var pl ProjectCriteriaBasedLegalStatus
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLegalStatusDAO()
	svc := services.NewProjectLegalStatusService(dao)
	plObject := models.ProjectLegalStatus{
		ID:                           projectId,
		LegalStatusIdea:              pl.LegalStatusIdea,
		ManagementStake:              pl.ManagementStake,
		TaxSystem:                    pl.TaxSystem,
		SocialSecurityScheme:         pl.SocialSecurityScheme,
		CompanyVatRegime:             pl.CompanyVatRegime,
		CriteriaBasedLegalStatusIdea: pl.CriteriaBasedLegalStatusIdea,
		UserLegalCriteria:            pl.UserLegalCriteria,
		Associates:                   pl.Associates,
	}
	m, err := svc.EditProjectCriteriaBasedLegalStatus(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectLegalStatus(&m))
}

func EditProjectCriteriaBasedTax(c *gin.Context) {
	projectId := c.Param("id")

	var pl ProjectCriteriaBasedTaxConfiguration
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLegalStatusDAO()
	svc := services.NewProjectLegalStatusService(dao)
	plObject := models.ProjectLegalStatus{
		ID:              projectId,
		UserTaxCriteria: pl.UserTaxCriteria,
	}
	m, err := svc.EditProjectCriteriaBasedLegalStatus(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectLegalStatus(&m))
}

func EditProjectCriteriaBasedTva(c *gin.Context) {
	projectId := c.Param("id")

	var pl ProjectCriteriaBasedTvaConfiguration
	if err := c.ShouldBindJSON(&pl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLegalStatusDAO()
	svc := services.NewProjectLegalStatusService(dao)
	plObject := models.ProjectLegalStatus{
		ID:              projectId,
		UserTvaCriteria: pl.UserTvaCriteria,
	}
	m, err := svc.EditProjectCriteriaBasedLegalStatus(&plObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectLegalStatus(&m))
}
