package interactors

import (
	"encoding/json"
	"io"
	"os"

	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type Formation struct {
	Title    string `json:"title"`
	Category string `json:"category"`
	Url      string `json:"url"`
}

func CreateFormations() error {
	var formations []Formation
	desc, err := os.Open("./beta_micro_formation.json")
	if err != nil {
		return err
	}
	defer desc.Close()
	blob, err := io.ReadAll(desc)
	if err != nil {
		return err
	}
	err = json.Unmarshal(blob, &formations)
	if err != nil {
		return err
	}
	for _, formation := range formations {
		mFormation := models.MicroFormation{
			Title:    formation.Title,
			Category: formation.Category,
		}
		dao := dao.NewMicroFormationDAO()
		if _, err := dao.GetFormation(formation.Title, formation.Category); err != nil && gorm.IsRecordNotFoundError(err) {
			dao.CreateMicroFormation(&mFormation)
		}
	}
	return nil
}
