package helpers

import (
	"testing"
)

var (
	samples = []struct {
		mail    string
		valid bool 
	}{
		{mail: "email@example.com", valid: true },
		{mail: "firstname.lastname@example.com", valid: true },
		{mail: "email@subdomain.example.com", valid: true },
		{mail: "firstname+lastname@example.com", valid: true },
		{mail: "email@123.123.123.123", valid: true },
		{mail: "1234567890@example.com", valid: true },
		{mail: "email@example-one.com", valid: true },
		{mail: "_______@example.com", valid: true },
		{mail: "email@example.name", valid: true },
		{mail: "email@example.museum", valid: true },
		{mail: "email@example.co.jp", valid: true },
		{mail: "firstname-lastname@example.com", valid: true },
	}
)

func TestInvalidEmail(t *testing.T) {
	for _, s := range samples {
		if InvalidEmail(s.mail) && s.valid == true {
			t.Errorf(`"%s" => expected error`, s.mail)
		}
	}
}