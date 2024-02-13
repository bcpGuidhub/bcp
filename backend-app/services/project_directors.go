package services

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
)

var generalRegime = []string{"SASU", "SAS"}
var selfEmployedRegime = []string{"EURL", "EIRL", "Entreprise individuelle"}
var cotisationUrl = os.Getenv("COTISATION_SVC") + "/cotisations"

type projectDirectorDao interface {
	EditProjectDirector(pp *models.ProjectDirector) (*models.ProjectDirector, error)
	CreateProjectDirector(pp *models.ProjectDirector) error
	DeleteDirector(p *models.ProjectDirector) error
	FindProjectDirector(p *models.ProjectDirector) error
	GetProjectLegalStatus(id string) (*models.ProjectLegalStatus, error)
	GetProjectDirector(id string) (*models.ProjectDirector, error)
	DeleteDirectors(id string) error
	UpdateAll(id, field, value string) error
}

type ProjectDirectorService struct {
	dao projectDirectorDao
}

func NewProjectDirectorService(dao projectDirectorDao) *ProjectDirectorService {
	return &ProjectDirectorService{dao: dao}
}
func (svc *ProjectDirectorService) FindProjectDirector(p *models.ProjectDirector) error {
	return svc.dao.FindProjectDirector(p)
}
func (svc *ProjectDirectorService) UpdateAll(id, field, value string) error {
	return svc.dao.UpdateAll(id, field, value)
}
func (svc *ProjectDirectorService) GetProjectDirector(id string) (*models.ProjectDirector, error) {
	return svc.dao.GetProjectDirector(id)
}
func (svc *ProjectDirectorService) GetProjectLegalStatus(id string) (*models.ProjectLegalStatus, error) {
	return svc.dao.GetProjectLegalStatus(id)
}
func (svc *ProjectDirectorService) CreateProjectDirector(p *models.ProjectDirector, years []*models.ProjectDirectorRenumerationYear, cotisations []*models.ProjectDirectorCotisationYear) (messages.CreateDirector, error) {
	if err := svc.dao.CreateProjectDirector(p); err != nil {
		return messages.CreateDirector{}, err
	}
	if p.CompensationPartition == "Personnalisée" {
		d := dao.NewProjectDirectorRenumerationYearDAO()
		s := NewProjectDirectorRenumerationYearService(d)
		for _, year := range years {
			year.ProjectDirectorsId = p.ID
			if _, err := s.CreateProjectDirectorRenumerationYear(year); err != nil {
				return messages.CreateDirector{}, err
			}
		}
		legal, err := svc.GetProjectLegalStatus(p.ProjectId)
		if err != nil {
			return messages.CreateDirector{}, err
		}
		if legal.SocialSecurityScheme == "Régime général de la sécurité sociale" {
			dC := dao.NewProjectDirectorCotisationYearDAO()
			sC := NewProjectDirectorCotisationYearService(dC)
			for _, cy := range cotisations {
				cy.ProjectDirectorId = p.ID
				if _, err := sC.CreateProjectDirectorCotisationYear(cy); err != nil {
					return messages.CreateDirector{}, err
				}
			}
		}

	}
	return messages.CreateDirector{
		Director:                  p,
		DirectorRenumerationYears: years,
		DirectorCotisationYears:   cotisations,
	}, nil
}

func (svc *ProjectDirectorService) EditProjectDirector(p *models.ProjectDirector, years []*models.ProjectDirectorRenumerationYear, cotisations []*models.ProjectDirectorCotisationYear) (messages.EditDirector, error) {
	pI := models.ProjectDirector{
		ID: p.ID,
	}
	err := svc.FindProjectDirector(&pI)
	if err != nil {
		return messages.EditDirector{}, err
	}
	// if the CompensationPartition was changed
	// create a new projectDirector
	// delete the preexisting projectDirector
	if pI.CompensationPartition != p.CompensationPartition {
		pInew := models.ProjectDirector{
			ProjectId:                pI.ProjectId,
			FirstName:                p.FirstName,
			LastName:                 p.LastName,
			PercentageEquityCapital:  p.PercentageEquityCapital,
			DirectorAcre:             p.DirectorAcre,
			CompensationPartition:    p.CompensationPartition,
			NetCompensationYear1:     p.NetCompensationYear1,
			NetCompensationYear2:     p.NetCompensationYear2,
			NetCompensationYear3:     p.NetCompensationYear3,
			CotisationsSocialesYear1: p.CotisationsSocialesYear1,
			CotisationsSocialesYear2: p.CotisationsSocialesYear2,
			CotisationsSocialesYear3: p.CotisationsSocialesYear3,
		}
		_, err := svc.CreateProjectDirector(&pInew, years, cotisations)
		if err != nil {
			return messages.EditDirector{}, err
		}
		if err = svc.DeleteDirector(&pI); err != nil {
			return messages.EditDirector{}, err
		}
		return messages.EditDirector{
			Director:                  &pInew,
			DirectorRenumerationYears: years,
		}, nil
	}
	_, err = svc.dao.EditProjectDirector(p)
	if err != nil {
		return messages.EditDirector{}, err
	}
	if p.CompensationPartition == "Personnalisée" {
		daoRenumerationYear := dao.NewProjectDirectorRenumerationYearDAO()
		s := NewProjectDirectorRenumerationYearService(daoRenumerationYear)
		for _, year := range years {
			if _, err := s.EditProjectDirectorRenumerationYear(year); err != nil {
				return messages.EditDirector{}, err
			}
		}
		legal, err := svc.GetProjectLegalStatus(pI.ProjectId)
		if err != nil {
			return messages.EditDirector{}, err
		}
		if legal.SocialSecurityScheme == "Régime général de la sécurité sociale" {
			dE := dao.NewProjectDirectorCotisationYearDAO()
			sE := NewProjectDirectorCotisationYearService(dE)
			for _, cy := range cotisations {
				if _, err := sE.EditProjectDirectorCotisationYear(cy); err != nil {
					return messages.EditDirector{}, err
				}
			}
		}
	}
	return messages.EditDirector{
		Director:                  p,
		DirectorRenumerationYears: years,
		DirectorCotisationYears:   cotisations,
	}, nil
}

func (svc *ProjectDirectorService) DeleteDirector(p *models.ProjectDirector) (err error) {
	err = svc.dao.DeleteDirector(p)
	return
}
func (svc *ProjectDirectorService) updateCotisation(currentLegal, modifiedLegal *models.ProjectLegalStatus) error {
	var currentRegime, modifiedRegime string
	if currentLegal.LegalStatusIdea == "SARL" && currentLegal.ManagementStake == "La gérance est majoritaire" {
		currentRegime = "self_employed"
	}
	if currentLegal.LegalStatusIdea == "SARL" && currentLegal.ManagementStake != "La gérance est majoritaire" {
		currentRegime = "general"
	}
	if modifiedLegal.LegalStatusIdea == "SARL" && modifiedLegal.ManagementStake == "La gérance est majoritaire" {
		modifiedRegime = "self_employed"
	}
	if modifiedLegal.LegalStatusIdea == "SARL" && modifiedLegal.ManagementStake != "La gérance est majoritaire" {
		modifiedRegime = "general"
	}

	for _, v := range generalRegime {
		if v == currentLegal.LegalStatusIdea {
			currentRegime = "general"
		}
		if v == modifiedLegal.LegalStatusIdea {
			modifiedRegime = "general"
		}
	}
	for _, k := range selfEmployedRegime {
		if k == currentLegal.LegalStatusIdea {
			currentRegime = "self_employed"
		}
		if k == modifiedLegal.LegalStatusIdea {
			modifiedRegime = "self_employed"
		}
	}
	if currentRegime != modifiedRegime && modifiedLegal.TaxSystem == currentLegal.TaxSystem {
		if modifiedRegime == "general" {
			return svc.computeCotisationToGeneral(currentLegal)
		}
		if modifiedRegime == "self_employed" {
			if currentLegal.TaxSystem == "IR" {
				return svc.resetDirectorCotisationToSelfEmployedIR(currentLegal)
			}
			if currentLegal.TaxSystem == "IS" {
				return svc.computeAnnualCotisationToSelfEmployed(currentLegal)
			}
		}
	} else if currentRegime == modifiedRegime && modifiedLegal.TaxSystem != currentLegal.TaxSystem {
		if currentRegime == "general" {
			return nil
		}
		if currentRegime == "self_employed" {
			if modifiedLegal.TaxSystem == "IR" {
				return svc.resetDirectorCotisationToSelfEmployed(currentLegal)
			}
			if modifiedLegal.TaxSystem == "IS" {
				return svc.computeAnnualCotisationToSelfEmployed(currentLegal)
			}
		}
	} else {
		if currentRegime != modifiedRegime && modifiedLegal.TaxSystem != currentLegal.TaxSystem {
			if modifiedRegime == "general" {
				return svc.computeCotisationToGeneral(currentLegal)
			}
			if modifiedRegime == "self_employed" {
				if modifiedLegal.TaxSystem == "IR" {
					return svc.resetDirectorCotisationToSelfEmployedIR(currentLegal)
				}
				if modifiedLegal.TaxSystem == "IS" {
					return svc.computeAnnualCotisationToSelfEmployed(currentLegal)
				}
			}
		}
	}
	return nil
}

func (svc *ProjectDirectorService) resetDirectorCotisationToSelfEmployedIR(legal *models.ProjectLegalStatus) error {
	directors := response.FetchProjectDirectors(legal.ID)
	daoDirector := dao.NewProjectDirectorDAO()
	for _, director := range directors {
		d := models.ProjectDirector{
			ID:                       director.ID,
			CotisationsSocialesYear1: "0",
			CotisationsSocialesYear2: "0",
			CotisationsSocialesYear3: "0",
		}
		if _, err := daoDirector.EditProjectDirector(&d); err != nil {
			return err
		}
		if director.CompensationPartition == "Personnalisée" {
			dC := dao.NewProjectDirectorCotisationYearDAO()
			if err := dC.DeleteDirectorCotisationYears(director.ID); err != nil {
				return err
			}
		}
	}
	return nil
}
func (svc *ProjectDirectorService) resetDirectorCotisationToSelfEmployed(legal *models.ProjectLegalStatus) (err error) {
	directors := response.FetchProjectDirectors(legal.ID)
	dao := dao.NewProjectDirectorDAO()
	for _, director := range directors {
		d := models.ProjectDirector{
			ID:                       director.ID,
			CotisationsSocialesYear1: "0",
			CotisationsSocialesYear2: "0",
			CotisationsSocialesYear3: "0",
		}
		if _, err := dao.EditProjectDirector(&d); err != nil {
			return err
		}
	}
	return nil
}
func (svc *ProjectDirectorService) computeAnnualCotisationToSelfEmployed(legal *models.ProjectLegalStatus) error {
	directors := response.FetchProjectDirectors(legal.ID)
	url := cotisationUrl + "/director-general-self-employed"
	daoDirector := dao.NewProjectDirectorDAO()
	for _, director := range directors {
		payload := map[string]interface{}{
			"director": director,
			"sector":   legal.Project.ActivitySector,
		}
		requestBody, err := json.Marshal(payload)
		if err != nil {
			return err
		}
		d := models.ProjectDirector{
			ID:                    director.ID,
			ProcessingCotisations: "true",
		}
		if _, err := daoDirector.EditProjectDirector(&d); err != nil {
			return err
		}
		resp, err := http.Post(url, "application/json", bytes.NewBuffer([]byte(requestBody)))
		if err != nil {
			d := models.ProjectDirector{
				ID:                    director.ID,
				ProcessingCotisations: "false",
			}
			if _, err := daoDirector.EditProjectDirector(&d); err != nil {
				return err
			}
			return err
		}
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)

		d = models.ProjectDirector{
			ID:                       director.ID,
			CotisationsSocialesYear1: result["cotisations_sociales_year_1"].(string),
			CotisationsSocialesYear2: result["cotisations_sociales_year_2"].(string),
			CotisationsSocialesYear3: result["cotisations_sociales_year_3"].(string),
			ProcessingCotisations:    "false",
		}
		if _, err := daoDirector.EditProjectDirector(&d); err != nil {
			return err
		}
		if director.CompensationPartition == "Personnalisée" {
			dC := dao.NewProjectDirectorCotisationYearDAO()
			if err := dC.DeleteDirectorCotisationYears(director.ID); err != nil {
				return err
			}
		}
	}
	return nil
}
func (svc *ProjectDirectorService) computeCotisationToGeneral(legal *models.ProjectLegalStatus) error {
	directors := response.FetchProjectDirectors(legal.ID)
	url := cotisationUrl + "/director-self-employed-general"
	daoDirector := dao.NewProjectDirectorDAO()
	for _, director := range directors {
		payload := map[string]interface{}{
			"director": director,
			"sector":   legal.Project.ActivitySector,
		}
		requestBody, err := json.Marshal(payload)

		if err != nil {
			return err
		}
		d := models.ProjectDirector{
			ID:                    director.ID,
			ProcessingCotisations: "true",
		}
		if _, err := daoDirector.EditProjectDirector(&d); err != nil {
			return err
		}
		resp, err := http.Post(url, "application/json", bytes.NewBuffer([]byte(requestBody)))
		if err != nil {
			d := models.ProjectDirector{
				ID:                    director.ID,
				ProcessingCotisations: "false",
			}
			if _, err := daoDirector.EditProjectDirector(&d); err != nil {
				return err
			}
			return err
		}
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if director.CompensationPartition == "Personnalisée" {
			cotisationYears := []*models.ProjectDirectorCotisationYear{}
			for _, item := range result["director_cotisation_years"].([]interface{}) {
				v := item.(map[string]interface{})
				cotisationY := models.ProjectDirectorCotisationYear{
					Year:              v["year"].(string),
					Month1Cotisation:  v["month_1_cotisation"].(string),
					Month2Cotisation:  v["month_2_cotisation"].(string),
					Month3Cotisation:  v["month_3_cotisation"].(string),
					Month4Cotisation:  v["month_4_cotisation"].(string),
					Month5Cotisation:  v["month_5_cotisation"].(string),
					Month6Cotisation:  v["month_6_cotisation"].(string),
					Month7Cotisation:  v["month_7_cotisation"].(string),
					Month8Cotisation:  v["month_8_cotisation"].(string),
					Month9Cotisation:  v["month_9_cotisation"].(string),
					Month10Cotisation: v["month_10_cotisation"].(string),
					Month11Cotisation: v["month_11_cotisation"].(string),
					Month12Cotisation: v["month_12_cotisation"].(string),
				}
				cotisationYears = append(cotisationYears, &cotisationY)
			}
			dC := dao.NewProjectDirectorCotisationYearDAO()
			sC := NewProjectDirectorCotisationYearService(dC)
			for _, cy := range cotisationYears {
				cy.ProjectDirectorId = director.ID
				if _, err := sC.CreateProjectDirectorCotisationYear(cy); err != nil {
					return err
				}
			}
		}
		d = models.ProjectDirector{
			ID:                       director.ID,
			CotisationsSocialesYear1: result["cotisations_sociales_year_1"].(string),
			CotisationsSocialesYear2: result["cotisations_sociales_year_2"].(string),
			CotisationsSocialesYear3: result["cotisations_sociales_year_3"].(string),
			ProcessingCotisations:    "false",
		}
		if _, err := daoDirector.EditProjectDirector(&d); err != nil {
			return err
		}
	}
	return nil
}
func (s *ProjectDirectorService) DeleteDirectors(id string) error {
	return s.dao.DeleteDirectors(id)
}
