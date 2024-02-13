package models

type ProjectMarketResearch struct {
	Model
	ID                      string  `gorm:"primary_key;column:project_id" json:"id"`
	Project                 Project `gorm:"foreignkey:project_id"`
	MarketCharacteristics   string  `gorm:"column:market_characteristics" json:"market_characteristics"`
	TargetMarket            string  `gorm:"column:target_market" json:"target_market"`
	PrincipleCompetition    string  `gorm:"column:principal_competition" json:"principal_competition"`
	ServiceDescription      string  `gorm:"column:service_description" json:"service_description"`
	ProductStrongWeakPoints string  `gorm:"column:product_strong_weak_points" json:"product_strong_weak_points"`
	CommercialProcess       string  `gorm:"column:commercial_process" json:"commercial_process"`
	TrademarkProtection     string  `gorm:"column:trademark_protection" json:"trademark_protection"`
	BusinessPlacement       string  `gorm:"column:business_placement" json:"business_placement"`
	SupplyChain             string  `gorm:"column:supply_chain" json:"supply_chain"`
	CommunicationStrategy   string  `gorm:"column:communication_strategy" json:"communication_strategy"`
}
