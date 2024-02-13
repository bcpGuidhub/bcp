package messages

import (
	"github.com/sendgrid/rest"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

var MailApiKey string

type Email struct {
	From    *mail.Email
	Body    string
	Subject string
	Client  *sendgrid.Client
}

type UserEmail struct {
	To *mail.Email
	*Email
}

func NewEmail(from, body, subject string) *Email {
	return &Email{
		From:    mail.NewEmail("Guidhub Team", from),
		Body:    body,
		Subject: subject,
		Client:  sendgrid.NewSendClient(MailApiKey),
	}
}
func NewUserEmail(args map[string]interface{}) *UserEmail {
	return &UserEmail{
		To:    mail.NewEmail(args["user"].(map[string]string)["name"], args["user"].(map[string]string)["email"]),
		Email: NewEmail(args["from"].(string), args["body"].(string), args["subject"].(string)),
	}
}
func (email *UserEmail) Send() (*rest.Response, error) {
	p := "and easy to do anywhere, even with Go"
	message := mail.NewSingleEmail(email.From, email.Subject, email.To, p, email.Body)
	return email.Client.Send(message)
}
