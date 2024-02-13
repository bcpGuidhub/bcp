package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectMarketResearchDAO struct{}

func NewProjectMarketResearchDAO() *ProjectMarketResearchDAO {
	return &ProjectMarketResearchDAO{}
}

func (dao *ProjectMarketResearchDAO) GetById(id string) (*models.ProjectMarketResearch, error) {
	var pm models.ProjectMarketResearch
	err := config.Datastore.AppDatabase.
		Where("project_id = ?", id).
		First(&pm).
		Error
	return &pm, err
}
func (dao *ProjectMarketResearchDAO) PreloadProject(id string) (*models.ProjectMarketResearch, error) {
	var pm models.ProjectMarketResearch
	err := config.Datastore.AppDatabase.Preload("Project").
		Where("project_id = ?", id).
		First(&pm).
		Error
	return &pm, err
}

func (dao *ProjectMarketResearchDAO) EditProjectMarketResearch(pm *models.ProjectMarketResearch) (*models.ProjectMarketResearch, error) {
	var pM models.ProjectMarketResearch
	err := config.Datastore.AppDatabase.Where(models.ProjectMarketResearch{ID: pm.ID}).Assign(models.ProjectMarketResearch{
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
	}).FirstOrCreate(&pM).Error
	return &pM, err

}
