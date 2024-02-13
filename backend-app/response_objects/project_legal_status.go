package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"

func OnEditProjectLegalStatus(pl *messages.EditProjectLegalStatus) *ProjectLegalStatusDto {
	return &ProjectLegalStatusDto{
		StakeHolders:                         pl.ProjectLegalStatus.StakeHolders,
		LegalStatusIdea:                      pl.ProjectLegalStatus.LegalStatusIdea,
		RecommendedLegalStatusIdea:           pl.ProjectLegalStatus.RecommendedLegalStatusIdea,
		ManagementStake:                      pl.ProjectLegalStatus.ManagementStake,
		PersonalWealthSecurityRequired:       pl.ProjectLegalStatus.PersonalWealthSecurityRequired,
		CompanyTaxPolicy:                     pl.ProjectLegalStatus.CompanyTaxPolicy,
		TaxSystem:                            pl.ProjectLegalStatus.TaxSystem,
		SocialSecurityScheme:                 pl.ProjectLegalStatus.SocialSecurityScheme,
		SituationPoleEmploi:                  pl.ProjectLegalStatus.SituationPoleEmploi,
		LocaleOfChoice:                       pl.ProjectLegalStatus.LocaleOfChoice,
		PropertyOwner:                        pl.ProjectLegalStatus.PropertyOwner,
		PropertyAdministration:               pl.ProjectLegalStatus.PropertyAdministration,
		DomiciliationCompany:                 pl.ProjectLegalStatus.DomiciliationCompany,
		ProfessionalLocale:                   pl.ProjectLegalStatus.ProfessionalLocale,
		LocalisationFinancialAid:             pl.ProjectLegalStatus.LocalisationFinancialAid,
		LeaseLocale:                          pl.ProjectLegalStatus.LeaseLocale,
		VerifiedContractCommercialLeases:     pl.ProjectLegalStatus.VerifiedContractCommercialLeases,
		LocaleActivityCompatability:          pl.ProjectLegalStatus.LocaleActivityCompatability,
		LeaseContractDuration:                pl.ProjectLegalStatus.LeaseContractDuration,
		LeaseRentalPriceFairness:             pl.ProjectLegalStatus.LeaseRentalPriceFairness,
		VerifiedLeasePriceRenegiations:       pl.ProjectLegalStatus.VerifiedLeasePriceRenegiations,
		VerifiedPayableTentantFees:           pl.ProjectLegalStatus.VerifiedPayableTentantFees,
		VerifiedInventory:                    pl.ProjectLegalStatus.VerifiedInventory,
		CompanyVatRegime:                     pl.ProjectLegalStatus.CompanyVatRegime,
		CriteriaBasedLegalStatusIdea:         pl.ProjectLegalStatus.CriteriaBasedLegalStatusIdea,
		UserLegalCriteria:                    pl.ProjectLegalStatus.UserLegalCriteria,
		Associates:                           pl.ProjectLegalStatus.Associates,
		UserTaxCriteria:                      pl.ProjectLegalStatus.UserTaxCriteria,
		UserTvaCriteria:                      pl.ProjectLegalStatus.UserTvaCriteria,
		MicroEntrepriseAccreExemption:        pl.ProjectLegalStatus.MicroEntrepriseAccreExemption,
		MicroEntrepriseDeclarePayCotisations: pl.ProjectLegalStatus.MicroEntrepriseDeclarePayCotisations,
		MicroEntrepriseActivityCategory:      pl.ProjectLegalStatus.MicroEntrepriseActivityCategory,
	}
}
