package messages

import (
	"bytes"
	"fmt"
	"html/template"

	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var (
	PasswordCallback        string
	AdvisorPasswordCallback string
)

func SendRenewEmail(token *models.Token, user *models.User, emailAdmin string) (*rest.Response, error) {
	url := fmt.Sprintf("%s%s", PasswordCallback, token.Content)
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": EmailSubjects["subject"],
		"user": map[string]string{
			"name":  user.FirstName,
			"email": user.Email,
		},
		"body": passwordTemplate(token.Content, url),
	}
	email := NewUserEmail(args)
	response, err := email.Send()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func SendStakeholderRenewEmail(token *models.TokenStakeholder, stakeholder *models.ProjectStakeholder, emailAdmin string) (*rest.Response, error) {
	url := fmt.Sprintf("%s%s", AdvisorPasswordCallback, token.Content)
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": EmailSubjects["subject"],
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": stakeholder.Email,
		},
		"body": passwordTemplate(token.Content, url),
	}
	email := NewUserEmail(args)
	response, err := email.Send()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func passwordTemplate(token, url string) string {
	var tmplBytes bytes.Buffer
	err := template.Must(template.ParseFiles("./messages/email_templates/renew_password.html")).Execute(&tmplBytes, struct {
		TOKEN string
	}{
		TOKEN: url,
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
