package messages

import (
	"bytes"
	"html/template"

	"github.com/sendgrid/rest"
)

func SendInvitation(emailPayload map[string]interface{}) (*rest.Response, error) {
	emailPayload["body"] = invitationTemplate(emailPayload["embededLink"].(string), emailPayload["invitee"].(string), emailPayload["projectName"].(string))
	email := NewUserEmail(emailPayload)
	return email.Send()
}

func invitationTemplate(embededLink, firstName, project string) string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/stakeholder_invite.html"))
	err := tmpl.Execute(&tmplBytes, struct {
		EmbededLink string
		FirstName   string
		ProjectName string
	}{
		EmbededLink: embededLink,
		FirstName:   firstName,
		ProjectName: project,
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
