package messages

import (
	"bytes"
	"html/template"
	"os"
)

func SendProjectLaunchRdv(obj map[string]string, emailAdmin string) []error {
	var contacts []map[string]string
	env := os.Getenv("APPENV")
	if env == "staging" || env == "dev" {
		contacts = []map[string]string{{"name": "Codou Diouf",
			"email": obj["email"]}, {"name": "Sylvère Brost", "email": obj["email"]}, {"name": "Le Coin support", "email": "support@lecoindesentrepreneurs.fr"}}
	} else {
		contacts = []map[string]string{{"name": "Willy Bieri",
			"email": "willy.bieri@inextenso.fr"}, {"name": "Anne-Laure du Grandlaunay", "email": "anne-laure.du-grandlaunay@inextenso.fr"}, {"name": "Mbarka Kone", "email": "mbarka.kone@inextenso.fr"}, {"name": "Le Coin support", "email": "support@lecoindesentrepreneurs.fr"}}
	}
	var response []error
	for _, contactEmail := range contacts {
		args := map[string]interface{}{
			"type":    "user",
			"from":    emailAdmin,
			"subject": "Nouvelle demande de rendez-vous adressée par Guidhub",
			"user": map[string]string{
				"name":  contactEmail["name"],
				"email": contactEmail["email"],
			},
			"body": contactProjectValidationRdvTemplate(obj, contactEmail["name"]),
		}
		email := NewUserEmail(args)
		_, err := email.Send()
		response = append(response, err)
	}
	return response
}
func SendProjectFinanceRdv(obj map[string]string, emailAdmin string) []error {
	var contacts []map[string]string
	env := os.Getenv("APPENV")
	if env == "staging" || env == "dev" {
		contacts = []map[string]string{{"name": "Maud Beaussier",
			"email": obj["Email"]}, {"name": "Thomas Loiselet", "email": obj["Email"]}, {"name": "Le Coin support", "email": "support@lecoindesentrepreneurs.fr"}}
	} else {
		contacts = []map[string]string{{"name": "Maud Beaussier",
			"email": "m.beaussier@lacentraledefinancement.fr "}, {"name": "Thomas Loiselet", "email": "t.loiselet@lacentraledefinancement.fr"}, {"name": "Le Coin support", "email": "support@lecoindesentrepreneurs.fr"}}
	}
	var response []error
	for _, contactEmail := range contacts {
		args := map[string]interface{}{
			"type":    "user",
			"from":    emailAdmin,
			"subject": "Nouvelle demande de rendez-vous adressée par Guidhub",
			"user": map[string]string{
				"name":  contactEmail["name"],
				"email": contactEmail["email"],
			},
			"body": contactProjectFinanceRdvTemplate(obj, contactEmail["name"]),
		}
		email := NewUserEmail(args)
		_, err := email.Send()
		response = append(response, err)
	}
	return response
}
func contactProjectValidationRdvTemplate(obj map[string]string, ContactName string) string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/project_launch_rdv.html"))
	err := tmpl.Execute(&tmplBytes, struct {
		ContactName string
		Name        string
		FirstName   string
		Telephone   string
		Email       string
		PostalCode  string
		Activity    string
		ProjectType string
		Destination string
		Message     string
	}{
		ContactName: ContactName,
		Name:        obj["last_name"],
		FirstName:   obj["first_name"],
		Telephone:   obj["telephone"],
		Email:       obj["email"],
		PostalCode:  obj["postal_code"],
		Activity:    obj["activity"],
		ProjectType: obj["project_type"],
		Destination: obj["destination"],
		Message:     obj["message"],
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
func contactProjectFinanceRdvTemplate(obj map[string]string, ContactName string) string {
	var tmplBytes bytes.Buffer
	tmpl := template.Must(template.ParseFiles("./messages/email_templates/project_finance_rdv.html"))
	err := tmpl.Execute(&tmplBytes, struct {
		ContactName      string
		Name             string
		FirstName        string
		Telephone        string
		Email            string
		City             string
		Activity         string
		ProjectType      string
		Legal            string
		ApportsPersonnel string
		Loan             string
		BusinessPlan     string
		ExpertStatus     string
		Message          string
	}{
		ContactName:      ContactName,
		Name:             obj["LastName"],
		FirstName:        obj["FirstName"],
		Telephone:        obj["Telephone"],
		Email:            obj["Email"],
		City:             obj["City"],
		Activity:         obj["Sector"],
		ProjectType:      obj["TypeProject"],
		Legal:            obj["Legal"],
		ApportsPersonnel: obj["ApportsPersonnel"],
		Loan:             obj["Loan"],
		BusinessPlan:     obj["BusinessPlan"],
		ExpertStatus:     obj["ExpertStatus"],
		Message:          obj["Message"],
	})
	if err != nil {
		return ""
	}
	return tmplBytes.String()
}
