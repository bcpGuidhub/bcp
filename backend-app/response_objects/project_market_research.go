package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"

func OnEditProjectMarketResearch(pm *messages.EditProjectMarketResearch) *ProjectMarketResearchDto {
	return &ProjectMarketResearchDto{
		MarketCharacteristics:   pm.ProjectMarketResearch.MarketCharacteristics,
		TargetMarket:            pm.ProjectMarketResearch.TargetMarket,
		PrincipleCompetition:    pm.ProjectMarketResearch.PrincipleCompetition,
		ServiceDescription:      pm.ProjectMarketResearch.ServiceDescription,
		ProductStrongWeakPoints: pm.ProjectMarketResearch.ProductStrongWeakPoints,
		CommercialProcess:       pm.ProjectMarketResearch.CommercialProcess,
		TrademarkProtection:     pm.ProjectMarketResearch.TrademarkProtection,
		BusinessPlacement:       pm.ProjectMarketResearch.BusinessPlacement,
		SupplyChain:             pm.ProjectMarketResearch.SupplyChain,
		CommunicationStrategy:   pm.ProjectMarketResearch.CommunicationStrategy,
	}
}
