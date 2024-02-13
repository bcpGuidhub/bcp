package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

func MicroFormations(formations []models.MicroFormation) []MicroFormation {
	var s []MicroFormation
	for _, formation := range formations {
		f := getMicroFormations(formation.ID)
		f.Title = formation.Title
		f.Category = formation.Category
		s = append(s, f)
	}
	return s
}
