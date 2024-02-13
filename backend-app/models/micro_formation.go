package models

type MicroFormation struct {
	Model
	ID       string `gorm:"primary_key;column:micro_formation_id" json:"id"`
	Title    string `gorm:"column:title" json:"title"`
	Category string `gorm:"column:category" json:"category"`
}

// Set table name to be `micro_formation`
func (MicroFormation) TableName() string {
	return "micro_formation"
}
