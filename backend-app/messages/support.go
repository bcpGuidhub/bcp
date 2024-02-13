package messages

import (
	"bytes"
	"html/template"

	"github.com/sendgrid/rest"
)

func SendSupportEmail(obj map[string]string, emailAdmin string) (*rest.Response, error) {
	args := map[string]interface{}{
		"type":    "user",
		"from":    obj["email"],
		"subject": "Contactez le support",
		"user": map[string]string{
			"name":  "support creators",
			"email": supportEmail,
		},
		"body": contactTemplate(obj),
	}
	email := NewUserEmail(args)
	return email.Send()
}
func contactTemplate(obj map[string]string) string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/contact.html"))
	err := tmpl.Execute(&tmplBytes, struct {
		Email      string
		FirstName  string
		LastName   string
		Telephone  string
		City       string
		Profession string
		Message    string
	}{
		Email:      obj["email"],
		FirstName:  obj["first_name"],
		LastName:   obj["last_name"],
		Telephone:  obj["telephone"],
		City:       obj["city"],
		Profession: obj["profession"],
		Message:    obj["message"],
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
