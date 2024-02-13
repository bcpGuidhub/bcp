package messages

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/models"

type EditGuideCaseStudy struct {
	Message        string
	GuideCaseStudy *models.GuideCaseStudy
}
