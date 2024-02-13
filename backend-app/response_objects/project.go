package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"

func OnEditProject(p *messages.EditProject) *ProjectDto {
	hiring := "Non"
	if p.Project.Hiring {
		hiring = "Oui"
	}
	return &ProjectDto{
		ID:                          p.Project.ID,
		ProjectName:                 p.Project.Name,
		TypeProject:                 p.Project.TypeProject,
		SearchableAddress:           p.Project.SearchableAddress,
		ActivitySector:              p.Project.ActivitySector,
		ProjectAdvancementStage:     p.Project.ProjectAdvancementStage,
		ExpectedTurnover:            p.Project.ExpectedTurnover,
		Hiring:                      hiring,
		ProjectBudget:               p.Project.ProjectBudget,
		PersonalContributionsBudget: p.Project.PersonalContributionsBudget,
		Status:                      p.Project.Status,
	}
}
