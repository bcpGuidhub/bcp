package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"

func OnEditProjectPreparation(pp *messages.EditProjectPreparation) *ProjectPreparationDto {
	return &ProjectPreparationDto{
		NonCompeteClause:                 pp.ProjectPreparation.NonCompeteClause,
		DomainCompetence:                 pp.ProjectPreparation.DomainCompetence,
		ProjectParticipants:              pp.ProjectPreparation.ProjectParticipants,
		VerifiedInterestInIdea:           pp.ProjectPreparation.VerifiedInterestInIdea,
		IsProjectInnovative:              pp.ProjectPreparation.IsProjectInnovative,
		IsTrademarkProctectionRequired:   pp.ProjectPreparation.IsTrademarkProctectionRequired,
		ShortDescriptionIdea:             pp.ProjectPreparation.ShortDescriptionIdea,
		WebsiteRequired:                  pp.ProjectPreparation.WebsiteRequired,
		TechnicalDomainCompetence:        pp.ProjectPreparation.TechnicalDomainCompetence,
		SalesDomainCompetence:            pp.ProjectPreparation.SalesDomainCompetence,
		ManagementDomainCompetence:       pp.ProjectPreparation.ManagementDomainCompetence,
		CurrentEmploymentStatus:          pp.ProjectPreparation.CurrentEmploymentStatus,
		ContractType:                     pp.ProjectPreparation.ContractType,
		TypeContractRupture:              pp.ProjectPreparation.TypeContractRupture,
		ProfessionalReconversion:         pp.ProjectPreparation.ProfessionalReconversion,
		RequiresQuitingJob:               pp.ProjectPreparation.RequiresQuitingJob,
		InCompetitionWithCurrentEmployer: pp.ProjectPreparation.InCompetitionWithCurrentEmployer,
		ExclusivityClause:                pp.ProjectPreparation.ExclusivityClause,
	}
}
