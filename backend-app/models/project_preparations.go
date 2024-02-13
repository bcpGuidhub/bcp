package models

// ProjectPreparation data model representation of projects_preparations table.
type ProjectPreparation struct {
	Model
	ID                               string  `gorm:"primary_key;column:project_id" json:"id"`
	Project                          Project `gorm:"foreignkey:project_id"`
	NonCompeteClause                 string  `gorm:"column:non_compete_clause" json:"non_compete_clause"`
	DomainCompetence                 string  `gorm:"column:domain_competence" json:"domain_competence"`
	ProjectParticipants              string  `gorm:"column:project_participants" json:"project_participants"`
	VerifiedInterestInIdea           string  `gorm:"column:verified_interest_in_idea" json:"verified_interest_in_idea"`
	IsProjectInnovative              string  `gorm:"column:is_project_innovative" json:"is_project_innovative"`
	IsTrademarkProctectionRequired   string  `gorm:"column:is_trademark_proctection_required" json:"is_trademark_proctection_required"`
	ShortDescriptionIdea             string  `gorm:"column:short_description_idea" json:"short_description_idea"`
	WebsiteRequired                  string  `gorm:"column:website_required" json:"website_required"`
	TechnicalDomainCompetence        string  `gorm:"column:technical_domain_competence" json:"technical_domain_competence"`
	SalesDomainCompetence            string  `gorm:"column:sales_domain_competence" json:"sales_domain_competence"`
	ManagementDomainCompetence       string  `gorm:"column:management_domain_competence" json:"management_domain_competence"`
	CurrentEmploymentStatus          string  `gorm:"column:current_employment_status" json:"current_employment_status"`
	ContractType                     string  `gorm:"column:contract_type" json:"contract_type"`
	TypeContractRupture              string  `gorm:"column:type_contract_rupture" json:"type_contract_rupture"`
	ProfessionalReconversion         string  `gorm:"column:professional_reconversion" json:"professional_reconversion"`
	RequiresQuitingJob               string  `gorm:"column:requires_quiting_job" json:"requires_quiting_job"`
	InCompetitionWithCurrentEmployer string  `gorm:"column:in_competition_with_current_employer" json:"in_competition_with_current_employer"`
	ExclusivityClause                string  `gorm:"column:exclusivity_clause" json:"exclusivity_clause"`
}
