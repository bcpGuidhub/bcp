package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectDirectorRenumerationYearDao interface {
	EditProjectDirectorRenumerationYear(pp *models.ProjectDirectorRenumerationYear) (*models.ProjectDirectorRenumerationYear, error)
	CreateProjectDirectorRenumerationYear(pp *models.ProjectDirectorRenumerationYear) error
	DeleteDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) error
}

type ProjectDirectorRenumerationYearService struct {
	dao projectDirectorRenumerationYearDao
}

func NewProjectDirectorRenumerationYearService(dao projectDirectorRenumerationYearDao) *ProjectDirectorRenumerationYearService {
	return &ProjectDirectorRenumerationYearService{dao: dao}
}
func (svc *ProjectDirectorRenumerationYearService) CreateProjectDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) (messages.CreateDirectorRenumerationYear, error) {
	if err := svc.dao.CreateProjectDirectorRenumerationYear(p); err != nil {
		return messages.CreateDirectorRenumerationYear{}, err
	}
	return messages.CreateDirectorRenumerationYear{
		DirectorRenumerationYear: p,
	}, nil
}

func (svc *ProjectDirectorRenumerationYearService) EditProjectDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) (*models.ProjectDirectorRenumerationYear, error) {
	return svc.dao.EditProjectDirectorRenumerationYear(p)
}

func (svc *ProjectDirectorRenumerationYearService) DeleteDirectorRenumerationYear(p *models.ProjectDirectorRenumerationYear) error {
	return svc.dao.DeleteDirectorRenumerationYear(p)
}
