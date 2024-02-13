package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateDirector(pl *messages.CreateDirector) *DirectorDto {
	s := []DirectorRenumerationYearDto{}
	for _, v := range pl.DirectorRenumerationYears {
		ry := DirectorRenumerationYearDto{
			ID:            v.ID,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		s = append(s, ry)
	}
	cotisationYears := []DirectorCotisationYearDto{}
	for _, v := range pl.DirectorCotisationYears {
		cotisationY := DirectorCotisationYearDto{
			ID:                v.ID,
			Year:              v.Year,
			Month1Cotisation:  v.Month1Cotisation,
			Month2Cotisation:  v.Month2Cotisation,
			Month3Cotisation:  v.Month3Cotisation,
			Month4Cotisation:  v.Month4Cotisation,
			Month5Cotisation:  v.Month5Cotisation,
			Month6Cotisation:  v.Month6Cotisation,
			Month7Cotisation:  v.Month7Cotisation,
			Month8Cotisation:  v.Month8Cotisation,
			Month9Cotisation:  v.Month9Cotisation,
			Month10Cotisation: v.Month10Cotisation,
			Month11Cotisation: v.Month11Cotisation,
			Month12Cotisation: v.Month12Cotisation,
		}
		cotisationYears = append(cotisationYears, cotisationY)
	}
	return &DirectorDto{
		ID:                        pl.Director.ID,
		FirstName:                 pl.Director.FirstName,
		LastName:                  pl.Director.LastName,
		PercentageEquityCapital:   pl.Director.PercentageEquityCapital,
		DirectorAcre:              pl.Director.DirectorAcre,
		CompensationPartition:     pl.Director.CompensationPartition,
		NetCompensationYear1:      pl.Director.NetCompensationYear1,
		NetCompensationYear2:      pl.Director.NetCompensationYear2,
		NetCompensationYear3:      pl.Director.NetCompensationYear3,
		CotisationsSocialesYear1:  pl.Director.CotisationsSocialesYear1,
		CotisationsSocialesYear2:  pl.Director.CotisationsSocialesYear2,
		CotisationsSocialesYear3:  pl.Director.CotisationsSocialesYear3,
		DirectorRenumerationYears: s,
		DirectorCotisationYears:   cotisationYears,
	}
}

func FetchProjectDirectors(id string) []DirectorDto {
	return fetchProjectDirectors(id)
}
func FetchProjectDirector(d *models.ProjectDirector) DirectorDto {
	return fetchProjectDirector(d)
}
func OnEditDirector(pl *messages.EditDirector) *DirectorDto {
	s := []DirectorRenumerationYearDto{}
	for _, v := range pl.DirectorRenumerationYears {
		ry := DirectorRenumerationYearDto{
			ID:            v.ID,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		s = append(s, ry)
	}
	cotisationYears := []DirectorCotisationYearDto{}
	for _, v := range pl.DirectorCotisationYears {
		cotisationY := DirectorCotisationYearDto{
			ID:                v.ID,
			Year:              v.Year,
			Month1Cotisation:  v.Month1Cotisation,
			Month2Cotisation:  v.Month2Cotisation,
			Month3Cotisation:  v.Month3Cotisation,
			Month4Cotisation:  v.Month4Cotisation,
			Month5Cotisation:  v.Month5Cotisation,
			Month6Cotisation:  v.Month6Cotisation,
			Month7Cotisation:  v.Month7Cotisation,
			Month8Cotisation:  v.Month8Cotisation,
			Month9Cotisation:  v.Month9Cotisation,
			Month10Cotisation: v.Month10Cotisation,
			Month11Cotisation: v.Month11Cotisation,
			Month12Cotisation: v.Month12Cotisation,
		}
		cotisationYears = append(cotisationYears, cotisationY)
	}
	return &DirectorDto{
		ID:                        pl.Director.ID,
		FirstName:                 pl.Director.FirstName,
		LastName:                  pl.Director.LastName,
		PercentageEquityCapital:   pl.Director.PercentageEquityCapital,
		DirectorAcre:              pl.Director.DirectorAcre,
		CompensationPartition:     pl.Director.CompensationPartition,
		NetCompensationYear1:      pl.Director.NetCompensationYear1,
		NetCompensationYear2:      pl.Director.NetCompensationYear2,
		NetCompensationYear3:      pl.Director.NetCompensationYear3,
		CotisationsSocialesYear1:  pl.Director.CotisationsSocialesYear1,
		CotisationsSocialesYear2:  pl.Director.CotisationsSocialesYear2,
		CotisationsSocialesYear3:  pl.Director.CotisationsSocialesYear3,
		DirectorRenumerationYears: s,
		DirectorCotisationYears:   cotisationYears,
	}
}
