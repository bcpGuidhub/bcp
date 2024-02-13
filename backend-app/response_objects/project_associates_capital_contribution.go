package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateAssociatesCapitalContribution(pl *messages.CreateAssociatesCapitalContribution) *AssociatesCapitalContributionDto {
	return &AssociatesCapitalContributionDto{
		ID:                                 pl.AssociatesCapitalContribution.ID,
		TypeOfOperation:                    pl.AssociatesCapitalContribution.TypeOfOperation,
		YearOfContributionRepayment:        pl.AssociatesCapitalContribution.YearOfContributionRepayment,
		MonthOfContributionRepayment:       pl.AssociatesCapitalContribution.MonthOfContributionRepayment,
		AssociateCapitalContributionAmount: pl.AssociatesCapitalContribution.AssociateCapitalContributionAmount,
	}
}

func FetchProjectAssociatesCapitalContributions(id string) []AssociatesCapitalContributionDto {
	return fetchProjectAssociatesCapitalContributions(id)
}

func OnEditAssociatesCapitalContribution(pl *models.ProjectAssociatesCapitalContribution) *AssociatesCapitalContributionDto {
	return &AssociatesCapitalContributionDto{
		ID:                                 pl.ID,
		TypeOfOperation:                    pl.TypeOfOperation,
		YearOfContributionRepayment:        pl.YearOfContributionRepayment,
		MonthOfContributionRepayment:       pl.MonthOfContributionRepayment,
		AssociateCapitalContributionAmount: pl.AssociateCapitalContributionAmount,
	}
}
