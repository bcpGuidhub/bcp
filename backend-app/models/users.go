package models

import (
	"errors"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
)

// User data model representation of user table.
type User struct {
	Model
	ID                            string `gorm:"primary_key;column:user_id" json:"id"`
	Email                         string `gorm:"column:email" json:"email"`
	FirstName                     string `gorm:"column:first_name" json:"first_name"`
	LastName                      string `gorm:"column:last_name" json:"last_name"`
	Telephone                     string `gorm:"column:telephone" json:"telephone"`
	Status                        string `gorm:"column:status" json:"status"`
	Password                      string `gorm:"column:password" json:"password"`
	OTP                           string `gorm:"column:otp" json:"otp"`
	RgdpConsent                   bool   `gorm:"column:rgdp_consent" json:"rgdp"`
	CguConsent                    bool   `gorm:"column:cgu_consent" json:"cgu_consent"`
	ReachableByPhone              bool   `gorm:"column:reachable_by_phone" json:"reachable_by_phone"`
	PhoneValidationOtp            string `gorm:"column:phone_validation_otp" json:"phone_validation_otp"`
	LogInCount                    int    `gorm:"column:log_in_count" json:"log_in_count"`
	ReachableByPhoneRdvValidation bool   `gorm:"column:reachable_by_phone_for_rdv_validation" json:"reachable_by_phone_for_rdv_validation"`
}

// ValidUser returns true if user is valid.
func (user *User) ValidUser() bool {
	return user.Status != "closed" && user.DeletedAt == nil
}

// Live returns true if user
// has a validated account.
func (user *User) Live() bool {
	return user.Status == "live"
}

func (user *User) Pending() bool {
	return user.Status == "pending_otp_validation"
}

// NoPassword returns true if user
// has a password.
func (user *User) NoPassword() bool {
	return user.Password == ""
}

// BeforeCreate Hooks is a function
// that is called before a user is created.
func (user *User) BeforeCreate() (err error) {
	if helpers.InvalidEmail(user.Email) {
		err = errors.New("can't save invalid data")
	}
	return
}

func (user *User) GUUID() string {
	return user.ID
}
