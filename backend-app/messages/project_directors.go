package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateDirector struct {
	Message                   string
	Director                  *models.ProjectDirector
	DirectorRenumerationYears []*models.ProjectDirectorRenumerationYear
	DirectorCotisationYears   []*models.ProjectDirectorCotisationYear
}

type EditDirector struct {
	Message                   string
	Director                  *models.ProjectDirector
	DirectorRenumerationYears []*models.ProjectDirectorRenumerationYear
	DirectorCotisationYears   []*models.ProjectDirectorCotisationYear
}
