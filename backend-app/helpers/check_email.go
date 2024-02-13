package helpers

import (
	"regexp"
)

var rxEmail = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
// InvalidEmail checks
// if the email passed is invalid.
func InvalidEmail(email string) bool {
	return len(email) > 254 || !rxEmail.MatchString(email) 
}
