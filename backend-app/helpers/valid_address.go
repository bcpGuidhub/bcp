package helpers

import (
	"errors"
	"fmt"
)

var (
	missingField = errors.New("missing field")
	countryCode  = "FR"
)

func ValidAddress(city, postCode, address string) (string, error) {
	if city == "" || postCode == "" {
		return "", missingField
	}
	fmtAddr := fmt.Sprintf("%s, %s, %s, %s", address, city, countryCode, postCode)
	return fmtAddr, nil
}
