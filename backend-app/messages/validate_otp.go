package messages

import (
	"bytes"
	"fmt"
	"html/template"

	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

// SendOTPEmail sends an email with the otp.
func SendOTPEmail(user *models.User, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": fmt.Sprintf("Saisissez %s comme code de confirmation Guidhub", user.OTP),
		"user": map[string]string{
			"name":  user.FirstName,
			"email": user.Email,
		},
		"body": otpTemplate(user.OTP),
	}
	email := NewUserEmail(args)
	return email.Send()
}

// SendOTPStakeholderEmail sends an email with the otp.
func SendOTPStakeholderEmail(stakeholder *models.ProjectStakeholder, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": fmt.Sprintf("Saisissez %s comme code de confirmation Guidhub", stakeholder.OTP),
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": stakeholder.Email,
		},
		"body": otpTemplate(stakeholder.OTP),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func otpTemplate(code string) string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/otp_validate.html"))
	err := tmpl.Execute(&tmplBytes, struct {
		OTP string
	}{
		OTP: code,
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
