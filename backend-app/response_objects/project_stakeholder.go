package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateStakeholder(pl *messages.CreateStakeholder) *StakeholderDto {
	return &StakeholderDto{
		ID:          pl.Stakeholder.ID,
		FirstName:   pl.Stakeholder.FirstName,
		LastName:    pl.Stakeholder.LastName,
		Role:        pl.Stakeholder.Role,
		RoleDetails: pl.Stakeholder.RoleDetails,
	}
}

func FetchProjectStakeholders(id string) []StakeholderDto {
	return fetchProjectStakeholders(id)
}

func OnEditStakeholder(pl *models.ProjectStakeholder) *StakeholderDto {
	return &StakeholderDto{
		ID:          pl.ID,
		FirstName:   pl.FirstName,
		LastName:    pl.LastName,
		Role:        pl.Role,
		RoleDetails: pl.RoleDetails,
	}
}

func OnGetStakeholderProject(pl *models.ProjectStakeholder) ProjectDto {
	return Project(pl.ProjectId)
}
