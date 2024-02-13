package messages

import (
	"bytes"
	"html/template"

	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func SendWelcomeEmail(user *models.User, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Bienvenue sur Guidhub !",
		"user": map[string]string{
			"name":  user.FirstName,
			"email": user.Email,
		},
		"body": emailWelcomeTemplate(),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func SendWelcomeEmailStakeholder(stakeholder *models.ProjectStakeholder, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Bienvenue sur Guidhub !",
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": stakeholder.Email,
		},
		"body": emailWelcomeTemplate(),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func emailWelcomeTemplate() string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/welcome_email.html"))
	err := tmpl.Execute(&tmplBytes, nil)
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
