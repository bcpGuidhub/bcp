package messages

import (
	"bytes"
	"html/template"

	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

// SendOTPEmail sends an email with the otp.
func SendPasswordModificationEmail(user *models.User, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Mot de passe modifié",
		"user": map[string]string{
			"name":  user.FirstName,
			"email": user.Email,
		},
		"body": passwordModifiedTemplate(),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func SendStakeholderPasswordModificationEmail(stakeholder *models.ProjectStakeholder, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Mot de passe modifié",
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": stakeholder.Email,
		},
		"body": passwordModifiedTemplate(),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func passwordModifiedTemplate() string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/modified_password.html"))
	err := tmpl.Execute(&tmplBytes, nil)
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
