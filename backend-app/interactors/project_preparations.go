package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type ProjectPreparation struct {
	NonCompeteClause                 string `form:"non_compete_clause" json:"non_compete_clause"`
	DomainCompetence                 string `form:"domain_competence" json:"domain_competence"`
	ProjectParticipants              string `form:"project_participants" json:"project_participants"`
	VerifiedInterestInIdea           string `form:"verified_interest_in_idea" json:"verified_interest_in_idea"`
	IsProjectInnovative              string `form:"is_project_innovative" json:"is_project_innovative"`
	IsTrademarkProctectionRequired   string `form:"is_trademark_proctection_required" json:"is_trademark_proctection_required"`
	ShortDescriptionIdea             string `form:"short_description_idea" json:"short_description_idea"`
	WebsiteRequired                  string `form:"website_required" json:"website_required"`
	TechnicalDomainCompetence        string `form:"technical_domain_competence" json:"technical_domain_competence"`
	SalesDomainCompetence            string `form:"sales_domain_competence" json:"sales_domain_competence"`
	ManagementDomainCompetence       string `form:"management_domain_competence" json:"management_domain_competence"`
	CurrentEmploymentStatus          string `form:"current_employment_status" json:"current_employment_status"`
	ContractType                     string `form:"contract_type" json:"contract_type"`
	TypeContractRupture              string `form:"type_contract_rupture" json:"type_contract_rupture"`
	ProfessionalReconversion         string `form:"professional_reconversion" json:"professional_reconversion"`
	RequiresQuitingJob               string `form:"requires_quiting_job" json:"requires_quiting_job"`
	InCompetitionWithCurrentEmployer string `form:"in_competition_with_current_employer" json:"in_competition_with_current_employer"`
	ExclusivityClause                string `form:"exclusivity_clause" json:"exclusivity_clause"`
}

func EditProjectPreparation(c *gin.Context) {
	projectId := c.Param("id")
	var pp ProjectPreparation
	if err := c.ShouldBindJSON(&pp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectPreparationDAO()
	svc := services.NewProjectPreparationService(dao)
	ppObject := models.ProjectPreparation{
		ID:                               projectId,
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
	}
	m, err := svc.EditProjectPreparation(&ppObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectPreparation(&m))
}
