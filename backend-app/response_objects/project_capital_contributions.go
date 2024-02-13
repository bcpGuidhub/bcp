package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateCapitalContribution(pl *messages.CreateCapitalContribution) *CapitalContributionDto {
	return &CapitalContributionDto{
		ID:                        pl.CapitalContribution.ID,
		CapitalContributionType:   pl.CapitalContribution.CapitalContributionType,
		CapitalContributionAmount: pl.CapitalContribution.CapitalContributionAmount,
		YearOfContribution:        pl.CapitalContribution.YearOfContribution,
		MonthOfContribution:       pl.CapitalContribution.MonthOfContribution,
	}
}

func FetchProjectCapitalContributions(id string) []CapitalContributionDto {
	return fetchProjectCapitalContributions(id)
}

func OnEditCapitalContribution(pl *models.ProjectCapitalContribution) *CapitalContributionDto {
	return &CapitalContributionDto{
		ID:                        pl.ID,
		CapitalContributionType:   pl.CapitalContributionType,
		CapitalContributionAmount: pl.CapitalContributionAmount,
		YearOfContribution:        pl.YearOfContribution,
		MonthOfContribution:       pl.MonthOfContribution,
	}
}
