package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type ProjectMarketResearch struct {
	MarketCharacteristics   string `form:"market_characteristics" json:"market_characteristics"`
	TargetMarket            string `form:"target_market" json:"target_market"`
	PrincipleCompetition    string `form:"principal_competition" json:"principal_competition"`
	ServiceDescription      string `form:"service_description" json:"service_description"`
	ProductStrongWeakPoints string `form:"product_strong_weak_points" json:"product_strong_weak_points"`
	CommercialProcess       string `form:"commercial_process" json:"commercial_process"`
	TrademarkProtection     string `form:"trademark_protection" json:"trademark_protection"`
	BusinessPlacement       string `form:"business_placement" json:"business_placement"`
	SupplyChain             string `form:"supply_chain" json:"supply_chain"`
	CommunicationStrategy   string `form:"communication_strategy" json:"communication_strategy"`
}

func EditProjectMarketResearch(c *gin.Context) {
	projectId := c.Param("id")

	var pm ProjectMarketResearch
	if err := c.ShouldBindJSON(&pm); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectMarketResearchDAO()
	svc := services.NewProjectMarketResearchService(dao)
	pmObject := models.ProjectMarketResearch{
		ID:                      projectId,
		MarketCharacteristics:   pm.MarketCharacteristics,
		TargetMarket:            pm.TargetMarket,
		PrincipleCompetition:    pm.PrincipleCompetition,
		ServiceDescription:      pm.ServiceDescription,
		ProductStrongWeakPoints: pm.ProductStrongWeakPoints,
		CommercialProcess:       pm.CommercialProcess,
		TrademarkProtection:     pm.TrademarkProtection,
		BusinessPlacement:       pm.BusinessPlacement,
		SupplyChain:             pm.SupplyChain,
		CommunicationStrategy:   pm.CommunicationStrategy,
	}
	m, err := svc.EditProjectMarketResearch(&pmObject)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, response.OnEditProjectMarketResearch(&m))
}
