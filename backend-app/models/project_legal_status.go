package models

import "github.com/lib/pq"

type ProjectLegalStatus struct {
	Model
	ID                                   string         `gorm:"primary_key;column:project_id" json:"id"`
	Project                              Project        `gorm:"foreignkey:project_id"`
	StakeHolders                         string         `gorm:"column:stake_holders" json:"stake_holders"`
	LegalStatusIdea                      string         `gorm:"column:legal_status_idea" json:"legal_status_idea"`
	RecommendedLegalStatusIdea           string         `gorm:"column:recommended_legal_status_idea" json:"recommended_legal_status_idea"`
	ManagementStake                      string         `gorm:"column:management_stake" json:"management_stake"`
	PersonalWealthSecurityRequired       string         `gorm:"column:personal_wealth_security_required" json:"personal_wealth_security_required"`
	CompanyTaxPolicy                     string         `gorm:"column:company_tax_policy" json:"company_tax_policy"`
	TaxSystem                            string         `gorm:"column:tax_system" json:"tax_system"`
	SocialSecurityScheme                 string         `gorm:"column:social_security_scheme" json:"social_security_scheme"`
	SituationPoleEmploi                  string         `gorm:"column:situation_pole_emploi" json:"situation_pole_emploi"`
	LocaleOfChoice                       string         `gorm:"column:locale_of_choice" json:"locale_of_choice"`
	PropertyOwner                        string         `gorm:"column:property_owner" json:"property_owner"`
	PropertyAdministration               string         `gorm:"column:property_administration" json:"property_administration"`
	DomiciliationCompany                 string         `gorm:"column:domiciliation_company" json:"domiciliation_company"`
	ProfessionalLocale                   string         `gorm:"column:professional_locale" json:"professional_locale"`
	LocalisationFinancialAid             string         `gorm:"column:localisation_financial_aid" json:"localisation_financial_aid"`
	LeaseLocale                          string         `gorm:"column:lease_locale" json:"lease_locale"`
	VerifiedContractCommercialLeases     string         `gorm:"column:verified_contract_commercial_leases" json:"verified_contract_commercial_leases"`
	LocaleActivityCompatability          string         `gorm:"column:locale_activity_compatability" json:"locale_activity_compatability"`
	LeaseContractDuration                string         `gorm:"column:lease_contract_duration" json:"lease_contract_duration"`
	LeaseRentalPriceFairness             string         `gorm:"column:lease_rental_price_fairness" json:"lease_rental_price_fairness"`
	VerifiedLeasePriceRenegiations       string         `gorm:"column:verified_lease_price_renegiations" json:"verified_lease_price_renegiations"`
	VerifiedPayableTentantFees           string         `gorm:"column:verified_payable_tentant_fees" json:"verified_payable_tentant_fees"`
	VerifiedInventory                    string         `gorm:"column:verified_inventory" json:"verified_inventory"`
	CompanyVatRegime                     string         `gorm:"column:company_vat_regime" json:"company_vat_regime"`
	CriteriaBasedLegalStatusIdea         string         `gorm:"column:criteria_based_legal_status_idea" json:"criteria_based_legal_status_idea"`
	UserLegalCriteria                    pq.StringArray `gorm:"column:user_legal_criteria" json:"user_legal_criteria"`
	UserTaxCriteria                      pq.StringArray `gorm:"column:user_tax_criteria" json:"user_tax_criteria"`
	UserTvaCriteria                      pq.StringArray `gorm:"column:user_tva_criteria" json:"user_tva_criteria"`
	Associates                           string         `gorm:"column:associates" json:"associates"`
	MicroEntrepriseAccreExemption        string         `gorm:"column:micro_entreprise_accre_exemption" json:"micro_entreprise_accre_exemption"`
	MicroEntrepriseDeclarePayCotisations string         `gorm:"column:micro_entreprise_declare_pay_cotisations" json:"micro_entreprise_declare_pay_cotisations"`
	MicroEntrepriseActivityCategory      string         `gorm:"column:micro_entreprise_activity_category" json:"micro_entreprise_activity_category"`
}

// Set ProjectLegalStatus's table name to be `project_legal_status`
func (ProjectLegalStatus) TableName() string {
	return "project_legal_status"
}
