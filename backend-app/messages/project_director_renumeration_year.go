package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type CreateDirectorRenumerationYear struct {
	Message                  string
	DirectorRenumerationYear *models.ProjectDirectorRenumerationYear
}
