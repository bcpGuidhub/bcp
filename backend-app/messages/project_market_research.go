package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditProjectMarketResearch struct {
	Path                  string
	Message               string
	ProjectMarketResearch *models.ProjectMarketResearch
}
