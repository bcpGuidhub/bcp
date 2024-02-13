package services

import (
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectLegalStatusDao interface {
	GetById(id string) (*models.ProjectLegalStatus, error)
	PreloadProject(id string) (*models.ProjectLegalStatus, error)
	EditProjectLegalStatus(pp *models.ProjectLegalStatus) (*models.ProjectLegalStatus, error)
	EditProjectCriteriaBasedLegalStatus(pp *models.ProjectLegalStatus) (*models.ProjectLegalStatus, error)
}

type ProjectLegalStatusService struct {
	dao projectLegalStatusDao
}

// NewUserService creates a new UserService with the given user DAO.
func NewProjectLegalStatusService(dao projectLegalStatusDao) *ProjectLegalStatusService {
	return &ProjectLegalStatusService{dao: dao}
}

func (svc *ProjectLegalStatusService) GetById(id string) (*models.ProjectLegalStatus, error) {
	return svc.dao.GetById(id)
}

func (svc *ProjectLegalStatusService) PreloadProject(id string) (*models.ProjectLegalStatus, error) {
	return svc.dao.PreloadProject(id)
}
func (svc *ProjectLegalStatusService) EditProjectLegalStatus(pl *models.ProjectLegalStatus) (messages.EditProjectLegalStatus, error) {
	currLegalStatus, err := svc.PreloadProject(pl.ID)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return messages.EditProjectLegalStatus{}, err
	}
	pL, err := svc.dao.EditProjectLegalStatus(pl)
	if (pL.LegalStatusIdea == "Entreprise individuelle" || pL.LegalStatusIdea == "EIRL") && pL.TaxSystem == "IR" && pL.MicroEntrepriseAccreExemption != "" {
		directorDao := dao.NewProjectDirectorDAO()
		directorService := NewProjectDirectorService(directorDao)
		if err := directorService.UpdateAll(pL.ID, "director_acre", pL.MicroEntrepriseAccreExemption); err != nil {
			return messages.EditProjectLegalStatus{}, err
		}
	}
	if pL.TaxSystem != "Micro-entreprise" {
		go func() {
			if currLegalStatus.LegalStatusIdea != "" && currLegalStatus.LegalStatusIdea != "Je ne sais pas encore" && pL.LegalStatusIdea != "Je ne sais pas encore" {
				directorDao := dao.NewProjectDirectorDAO()
				directorService := NewProjectDirectorService(directorDao)
				directorService.updateCotisation(currLegalStatus, pL)
			}
		}()
	} else {
		directorDao := dao.NewProjectDirectorDAO()
		directorService := NewProjectDirectorService(directorDao)
		directorService.DeleteDirectors(pL.ID)
	}
	if pL.CompanyVatRegime == "Franchise en base de TVA" {
		resetVat(pl.ID)
	}
	if err != nil {
		return messages.EditProjectLegalStatus{}, err
	}
	if pLp, err := svc.PreloadProject(pl.ID); err != nil {
		return messages.EditProjectLegalStatus{}, err
	} else {
		pDao := dao.NewProjectDAO()
		err = pDao.UpdateField(&pLp.Project, "legal_status_idea", pL.LegalStatusIdea)
		return messages.EditProjectLegalStatus{
			Message:            "edited",
			ProjectLegalStatus: pLp,
		}, err
	}
}
func (svc *ProjectLegalStatusService) EditProjectCriteriaBasedLegalStatus(pl *models.ProjectLegalStatus) (messages.EditProjectLegalStatus, error) {
	currLegalStatus, err := svc.PreloadProject(pl.ID)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return messages.EditProjectLegalStatus{}, err
	}
	pL, err := svc.dao.EditProjectCriteriaBasedLegalStatus(pl)
	go func() {
		if currLegalStatus.LegalStatusIdea != "" && currLegalStatus.LegalStatusIdea != "Je ne sais pas encore" && pL.LegalStatusIdea != "Je ne sais pas encore" {
			directorDao := dao.NewProjectDirectorDAO()
			directorService := NewProjectDirectorService(directorDao)
			directorService.updateCotisation(currLegalStatus, pL)
		}
	}()
	if pL.CompanyVatRegime == "Franchise en base de TVA" {
		resetVat(pl.ID)
	}
	if err != nil {
		return messages.EditProjectLegalStatus{}, err
	}
	if pLp, err := svc.PreloadProject(pl.ID); err != nil {
		return messages.EditProjectLegalStatus{}, err
	} else {
		pDao := dao.NewProjectDAO()
		err = pDao.UpdateField(&pLp.Project, "legal_status_idea", pL.LegalStatusIdea)
		return messages.EditProjectLegalStatus{
			Message:            "edited",
			ProjectLegalStatus: pLp,
		}, err
	}
}
func resetVat(id string) error {
	daoRevenues := dao.NewProjectRevenueDAO()
	svcRevenues := NewProjectRevenueService(daoRevenues)
	if err := svcRevenues.ResetVat(id); err != nil {
		return err
	}
	daoRevenueSources := dao.NewProjectRevenueSourceDAO()
	svcRevenueSources := NewProjectRevenueSourceService(daoRevenueSources)
	if err := svcRevenueSources.ResetVat(id); err != nil {
		return err
	}
	daoInvestments := dao.NewProjectInvestmentDAO()
	svcInvestments := NewProjectInvestmentService(daoInvestments)
	if err := svcInvestments.ResetVat(id); err != nil {
		return err
	}
	daoExpenses := dao.NewProjectExpenseDAO()
	svcExpenses := NewProjectExpenseService(daoExpenses)
	if err := svcExpenses.ResetVat(id); err != nil {
		return err
	}
	return nil
}
