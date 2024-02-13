package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

// UserResponsePayload is the response object returned
// on the user resource.
type UserResponsePayload struct {
	Email   string `json:"email"`
	Id      string `json:"id"`
	Error   string `json:"error"`
	Message string `json:"message"`
	Path    string `json:"path"`
}

func OnCreateUser(payload *messages.CreateUser) *UserResponsePayload {
	return &UserResponsePayload{
		Email: payload.User.Email,
		Id:    payload.User.ID,
		Path:  payload.Path,
	}
}

func OnCreateProjectStackholder(payload *messages.CreateProjectStakeholder) *UserResponsePayload {
	return &UserResponsePayload{
		Email: payload.User.Email,
		Id:    payload.User.ID,
		Path:  payload.Path,
	}
}

func OnGetUser(u *models.User) *UserResponsePayload {
	return &UserResponsePayload{
		Email: u.Email,
		Id:    u.ID,
	}
}

func OnGetUserProjects(user *models.User) []ProjectDto {
	var projectsDto []ProjectDto
	dao := dao.NewUserDAO()
	projects := dao.FetchProjects(user.ID)
	for _, p := range projects {
		hiring := "Non"
		if p.Hiring {
			hiring = "Oui"
		}
		projectsDto = append(projectsDto, ProjectDto{
			ID:                          p.ID,
			TypeProject:                 p.TypeProject,
			SearchableAddress:           p.SearchableAddress,
			ActivitySector:              p.ActivitySector,
			ProjectAdvancementStage:     p.ProjectAdvancementStage,
			ExpectedTurnover:            p.ExpectedTurnover,
			Hiring:                      hiring,
			ProjectBudget:               p.ProjectBudget,
			PersonalContributionsBudget: p.PersonalContributionsBudget,
			Status:                      p.Status,
			ProjectLaunchValidationRdv:  p.ProjectLaunchValidationRdv,
			ExpertStatus:                p.ExpertStatus,
			ProjectFinanceValidationRdv: p.ProjectFinanceValidationRdv,
			ProjectName:                 p.Name,
		})
	}
	return projectsDto
}
