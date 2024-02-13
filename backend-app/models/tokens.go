package models

import "time"

type Token struct {
	Model
	ID      string `gorm:"primary_key;column:user_id" json:"id"`
	User    User   `gorm:"foreignkey:user_id"`
	Content string `gorm:"column:content" json:"content"`
}

func (t *Token) Valid() bool {
	tenAhead := t.UpdatedAt.Add(time.Minute * 10)
	return time.Now().Before(tenAhead)
}
