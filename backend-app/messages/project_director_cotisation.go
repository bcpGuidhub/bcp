package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateDirectorCotisationYear struct {
	Message                string
	DirectorCotisationYear *models.ProjectDirectorCotisationYear
}
