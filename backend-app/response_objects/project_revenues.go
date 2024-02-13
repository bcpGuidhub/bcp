package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
)

func OnCreateRevenue(pl *messages.CreateRevenue) *RevenueDto {
	s := []RevenueYearDto{}
	for _, v := range pl.RevenueYears {
		ry := RevenueYearDto{
			ID:            v.ID,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		s = append(s, ry)
	}
	return &RevenueDto{
		ID:                           pl.Revenue.ID,
		RevenueLabel:                 pl.Revenue.RevenueLabel,
		RevenuePartition:             pl.Revenue.RevenuePartition,
		AnnualAmountTaxExcludedYear1: pl.Revenue.AnnualAmountTaxExcludedYear1,
		AnnualAmountTaxExcludedYear2: pl.Revenue.AnnualAmountTaxExcludedYear2,
		AnnualAmountTaxExcludedYear3: pl.Revenue.AnnualAmountTaxExcludedYear3,
		InventoryLinkedRevenue:       pl.Revenue.InventoryLinkedRevenue,
		PercentageMargin:             pl.Revenue.PercentageMargin,
		ValuationOfStartingStock:     pl.Revenue.ValuationOfStartingStock,
		MeanValuationOfStock:         pl.Revenue.MeanValuationOfStock,
		VatRateRevenue:               pl.Revenue.VatRateRevenue,
		CustomerPaymentDeadline:      pl.Revenue.CustomerPaymentDeadline,
		SupplierPaymentDeadline:      pl.Revenue.SupplierPaymentDeadline,
		VatRateOnPurchases:           pl.Revenue.VatRateOnPurchases,
		RevenueYears:                 s,
	}
}

func FetchProjectRevenues(id string) []RevenueDto {
	return fetchProjectRevenues(id)
}

func OnEditRevenue(pl *messages.EditRevenue) *RevenueDto {
	s := []RevenueYearDto{}
	for _, v := range pl.RevenueYears {
		ry := RevenueYearDto{
			ID:            v.ID,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		s = append(s, ry)
	}
	return &RevenueDto{
		ID:                           pl.Revenue.ID,
		RevenueLabel:                 pl.Revenue.RevenueLabel,
		RevenuePartition:             pl.Revenue.RevenuePartition,
		AnnualAmountTaxExcludedYear1: pl.Revenue.AnnualAmountTaxExcludedYear1,
		AnnualAmountTaxExcludedYear2: pl.Revenue.AnnualAmountTaxExcludedYear2,
		AnnualAmountTaxExcludedYear3: pl.Revenue.AnnualAmountTaxExcludedYear3,
		InventoryLinkedRevenue:       pl.Revenue.InventoryLinkedRevenue,
		PercentageMargin:             pl.Revenue.PercentageMargin,
		ValuationOfStartingStock:     pl.Revenue.ValuationOfStartingStock,
		MeanValuationOfStock:         pl.Revenue.MeanValuationOfStock,
		VatRateRevenue:               pl.Revenue.VatRateRevenue,
		CustomerPaymentDeadline:      pl.Revenue.CustomerPaymentDeadline,
		SupplierPaymentDeadline:      pl.Revenue.SupplierPaymentDeadline,
		VatRateOnPurchases:           pl.Revenue.VatRateOnPurchases,
		RevenueYears:                 s,
	}
}
