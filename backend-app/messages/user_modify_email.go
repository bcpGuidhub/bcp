package messages

import (
	"bytes"
	"html/template"

	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func SendEmailModificationEmail(user *models.User, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Adresse email modifié",
		"user": map[string]string{
			"name":  user.FirstName,
			"email": user.Email,
		},
		"body": emailModifiedTemplate(),
	}
	email := NewUserEmail(args)
	return email.Send()
}

func emailModifiedTemplate() string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/modified_email.html"))
	err := tmpl.Execute(&tmplBytes, nil)
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
