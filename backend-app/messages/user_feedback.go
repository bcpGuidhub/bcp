package messages

import (
	"github.com/sendgrid/rest"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

var supportEmail = "support@guidhub.fr"

func SendUserFeedbackEmail(user *models.User, message, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Commentaires des utilisateurs",
		"user": map[string]string{
			"name":  user.FirstName,
			"email": supportEmail,
		},
		"body": message,
	}
	email := NewUserEmail(args)
	return email.Send()
}

func SendStakeholderFeedbackEmail(stakeholder *models.ProjectStakeholder, message, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    emailAdmin,
		"subject": "Commentaires des utilisateurs",
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": supportEmail,
		},
		"body": message,
	}
	email := NewUserEmail(args)
	return email.Send()
}
