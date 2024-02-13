package models

type MicroFormationViewPopularityStakeholder struct {
	Model
	ID                 string             `gorm:"primary_key;column:micro_formation_view_popularity_stakeholder_id" json:"id"`
	StakeholderId      string             `gorm:"column:stakeholder_id" json:"stakeholder_id"`
	ProjectStakeholder ProjectStakeholder `gorm:"foreignkey:stakeholder_id"`
	MicroFormationId   string             `gorm:"column:micro_formation_id" json:"micro_formation_id"`
	MicroFormation     MicroFormation     `gorm:"foreignkey:micro_formation_id"`
}

// Set table name to be `micro_formation_view_popularity_stakeholder`
func (MicroFormationViewPopularityStakeholder) TableName() string {
	return "micro_formation_view_popularity_stakeholder"
}
