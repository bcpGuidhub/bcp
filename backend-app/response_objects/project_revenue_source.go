package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateRevenueSource(pl *messages.CreateRevenueSource) *RevenueSourceDto {
	return &RevenueSourceDto{
		ID:                   pl.RevenueSource.ID,
		Name:                 pl.RevenueSource.Name,
		SourceType:           pl.RevenueSource.SourceType,
		AmountExcludingTaxes: pl.RevenueSource.AmountExcludingTaxes,
		Year:                 pl.RevenueSource.Year,
		Month:                pl.RevenueSource.Month,
		VatRate:              pl.RevenueSource.VatRate,
	}
}

func FetchProjectRevenueSources(id string) []RevenueSourceDto {
	return fetchProjectRevenueSources(id)
}

func OnEditRevenueSource(pl *models.ProjectRevenueSource) *RevenueSourceDto {
	return &RevenueSourceDto{
		ID:                   pl.ID,
		Name:                 pl.Name,
		SourceType:           pl.SourceType,
		AmountExcludingTaxes: pl.AmountExcludingTaxes,
		Year:                 pl.Year,
		Month:                pl.Month,
		VatRate:              pl.VatRate,
	}
}
