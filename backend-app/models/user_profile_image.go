package models

type UserProfileImage struct {
	Model
	ID string `gorm:"primary_key;column:user_id" json:"id"`
	// UserId      string `gorm:"column:user_id" json:"user_id"`
	PublicUrl   string `gorm:"column:public_url" json:"public_url"`
	ContentType string `gorm:"column:content_type" json:"content_type"`
	Bucket      string `gorm:"column:bucket" json:"bucket"`
}

func (UserProfileImage) TableName() string {
	return "user_profile_image"
}
