package messages

import (
	"fmt"
	"strings"

	"github.com/sfreiberg/gotwilio"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var (
	SMSApiSID    string
	SMSAuthToken string
	AdminLine    = "+16107562632"
)

func SendUserValidationCode(user *models.User) (*gotwilio.SmsResponse, *gotwilio.Exception, error) {
	twilio := gotwilio.NewTwilioClient(SMSApiSID, SMSAuthToken)
	message := "Votre code de vérification Guidhub"
	sms := fmt.Sprintf("%s code: %s", message, user.PhoneValidationOtp)
	telephone := strings.Replace(user.Telephone, "0", "+33", 1)
	return twilio.SendSMS(AdminLine, telephone, sms, "", "")
}

func SendUserAccountValidationCode(user *models.User) (*gotwilio.SmsResponse, *gotwilio.Exception, error) {
	twilio := gotwilio.NewTwilioClient(SMSApiSID, SMSAuthToken)
	message := "Votre code de vérification pour valider le compte sur Guidhub"
	sms := fmt.Sprintf("%s code: %s", message, user.OTP)
	telephone := strings.Replace(user.Telephone, "0", "+33", 1)
	return twilio.SendSMS(AdminLine, telephone, sms, "", "")
}
