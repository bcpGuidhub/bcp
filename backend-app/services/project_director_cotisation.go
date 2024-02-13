package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectDirectorCotisationYearDAO interface {
	EditProjectDirectorCotisationYear(pp *models.ProjectDirectorCotisationYear) (*models.ProjectDirectorCotisationYear, error)
	CreateProjectDirectorCotisationYear(pp *models.ProjectDirectorCotisationYear) error
	DeleteDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) error
}

type ProjectDirectorCotisationYearService struct {
	dao projectDirectorCotisationYearDAO
}

func NewProjectDirectorCotisationYearService(dao projectDirectorCotisationYearDAO) *ProjectDirectorCotisationYearService {
	return &ProjectDirectorCotisationYearService{dao: dao}
}
func (svc *ProjectDirectorCotisationYearService) CreateProjectDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) (messages.CreateDirectorCotisationYear, error) {
	if err := svc.dao.CreateProjectDirectorCotisationYear(p); err != nil {
		return messages.CreateDirectorCotisationYear{}, err
	}
	return messages.CreateDirectorCotisationYear{
		DirectorCotisationYear: p,
	}, nil
}

func (svc *ProjectDirectorCotisationYearService) EditProjectDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) (*models.ProjectDirectorCotisationYear, error) {
	return svc.dao.EditProjectDirectorCotisationYear(p)
}

func (svc *ProjectDirectorCotisationYearService) DeleteDirectorCotisationYear(p *models.ProjectDirectorCotisationYear) error {
	return svc.dao.DeleteDirectorCotisationYear(p)
}
