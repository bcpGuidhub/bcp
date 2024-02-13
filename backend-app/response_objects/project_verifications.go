package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateProjectVerification(pl *messages.CreateVerification) *ProjectVerificationDto {
	s := []ProjectVerificationQuestionsDto{}
	for _, v := range pl.Questions {
		ry := ProjectVerificationQuestionsDto{
			ID:       v.ID,
			Label:    v.Label,
			Response: v.Response,
		}
		s = append(s, ry)
	}
	return &ProjectVerificationDto{
		ID:        pl.Verification.ID,
		Label:     pl.Verification.Label,
		Visible:   pl.Verification.Visible,
		UpdatedAt: pl.Verification.UpdatedAt.String(),
		Questions: s,
	}
}
func FetchProjectVerifications(id string) []ProjectVerificationDto {
	return fetchProjectVerifications(id)
}
func ProjectVerificationAggregatedWorkFlow(projectId string) *ProjectVerificationAggregatedWorkFlowDto {
	return fetchProjectVerificationAggregatedWorkFlowDto(projectId)
}
func FetchProjectVerification(p *models.ProjectVerification) *ProjectVerificationDto {
	return fetchProjectVerification(p)
}
func OnEditProjectVerification(pl *messages.EditVerification) *ProjectVerificationDto {
	s := []ProjectVerificationQuestionsDto{}
	for _, v := range pl.Questions {
		ry := ProjectVerificationQuestionsDto{
			ID:       v.ID,
			Label:    v.Label,
			Response: v.Response,
		}
		s = append(s, ry)
	}
	return &ProjectVerificationDto{
		ID:        pl.Verification.ID,
		Label:     pl.Verification.Label,
		Visible:   pl.Verification.Visible,
		UpdatedAt: pl.Verification.UpdatedAt.String(),
		Questions: s,
	}
}
