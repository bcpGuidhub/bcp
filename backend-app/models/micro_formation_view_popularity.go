package models

type MicroFormationViewPopularity struct {
	Model
	ID               string         `gorm:"primary_key;column:micro_formation_view_popularity_id" json:"id"`
	UserId           string         `gorm:"column:user_id" json:"user_id"`
	User             User           `gorm:"foreignkey:user_id"`
	MicroFormationId string         `gorm:"column:micro_formation_id" json:"micro_formation_id"`
	MicroFormation   MicroFormation `gorm:"foreignkey:micro_formation_id"`
}

// Set table name to be `micro_formation_view_popularity`
func (MicroFormationViewPopularity) TableName() string {
	return "micro_formation_view_popularity"
}
