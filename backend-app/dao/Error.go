package dao

import "encoding/json"

type GormErr struct {
	Number  int    `json:"Number"`
	Message string `json:"Message"`
}

func IsDuplicateKeyviolation(err error) bool {
	byteErr, _ := json.Marshal(err)
	var d GormErr
	json.Unmarshal((byteErr), &d)
	return d.Number == 1062
}
