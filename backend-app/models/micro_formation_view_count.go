package models

type MicroFormationViewCount struct {
	Model
	ID               string         `gorm:"primary_key;column:micro_formation_view_count_id" json:"id"`
	UserId           string         `gorm:"column:user_id" json:"user_id"`
	User             User           `gorm:"foreignkey:user_id"`
	MicroFormationId string         `gorm:"column:micro_formation_id" json:"micro_formation_id"`
	MicroFormation   MicroFormation `gorm:"foreignkey:micro_formation_id"`
	ViewCount        int            `gorm:"column:view_count" json:"view_count"`
}

// Set table name to be `micro_formation_view_count`
func (MicroFormationViewCount) TableName() string {
	return "micro_formation_view_count"
}
