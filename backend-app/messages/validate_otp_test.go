package messages

import (
	"testing"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func TestSendOTPEmail(t *testing.T) {
	user := models.User{
		Model:     models.Model{},
		FirstName: "Test",
		LastName:  "User",
		Email:     "baraka00007x@gmail.com",
		Status:    "pending_otp_validation",
		OTP:       "123456",
	}
	adminEmail := "lecoindesentrepreneurs.app@gmail.com"
	_, err := SendOTPEmail(&user, adminEmail)

	// t.Errorf("%d", response.StatusCode)
	// t.Errorf("%s", response.Body)
	// t.Errorf("%v", response.Headers)
	if err != nil {
		t.Errorf("Failed to send email %s", err.Error())
	}
}
