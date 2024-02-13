package models

import "time"

type TokenStakeholder struct {
	Model
	ID          string `gorm:"primary_key;column:project_stakeholder_id" json:"id"`
	Stakeholder User   `gorm:"foreignkey:project_stakeholder_id"`
	Content     string `gorm:"column:content" json:"content"`
}

func (t *TokenStakeholder) Valid() bool {
	tenAhead := t.UpdatedAt.Add(time.Minute * 10)
	return time.Now().Before(tenAhead)
}

// Set table name to be `stakeholder_tokens`
func (TokenStakeholder) TableName() string {
	return "stakeholder_tokens"
}
