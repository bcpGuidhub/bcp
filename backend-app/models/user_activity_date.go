package models

import "time"

type UserActivityDate struct {
	Model
	ID          string    `gorm:"primary_key;column:user_activity_date_id" json:"id"`
	User        User      `gorm:"foreignkey:user_id"`
	UserId      string    `gorm:"column:user_id" json:"user_id"`
	AccessCount int       `gorm:"column:access_count" json:"access_count"`
	AccessDate  time.Time `gorm:"column:access_date" json:"access_date"`
}

// Set table name to be `user_activity_date`
func (UserActivityDate) TableName() string {
	return "user_activity_date"
}
