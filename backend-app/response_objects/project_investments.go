package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateInvestment(pl *messages.CreateInvestment) *InvestmentDto {
	return &InvestmentDto{
		ID:                          pl.Investment.ID,
		InvestmentType:              pl.Investment.InvestmentType,
		InvestmentName:              pl.Investment.InvestmentName,
		InvestmentAmountTaxIncluded: pl.Investment.InvestmentAmountTaxIncluded,
		YearOfPurchase:              pl.Investment.YearOfPurchase,
		MonthOfPurchase:             pl.Investment.MonthOfPurchase,
		Duration:                    pl.Investment.Duration,
		VatRateOnInvestment:         pl.Investment.VatRateOnInvestment,
		Contribution:                pl.Investment.Contribution,
	}
}

func FetchProjectInvestments(id string) []InvestmentDto {
	return fetchProjectInvestments(id)
}

func OnEditInvestment(pl *models.ProjectInvestment) *InvestmentDto {
	return &InvestmentDto{
		ID:                          pl.ID,
		InvestmentType:              pl.InvestmentType,
		InvestmentName:              pl.InvestmentName,
		InvestmentAmountTaxIncluded: pl.InvestmentAmountTaxIncluded,
		YearOfPurchase:              pl.YearOfPurchase,
		MonthOfPurchase:             pl.MonthOfPurchase,
		Duration:                    pl.Duration,
		VatRateOnInvestment:         pl.VatRateOnInvestment,
		Contribution:                pl.Contribution,
	}
}
