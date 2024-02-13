package models

import "time"

type UserActivity struct {
	Model
	ID             string    `gorm:"primary_key;column:user_id" json:"id"`
	User           User      `gorm:"foreignkey:user_id"`
	FirstLoginDate time.Time `gorm:"column:first_login_date" json:"first_login_date"`
	LastAccessDate time.Time `gorm:"column:last_access_date" json:"last_access_date"`
}

// Set table name to be `user_activity`
func (UserActivity) TableName() string {
	return "user_activity"
}
