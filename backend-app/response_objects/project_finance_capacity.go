package response

import "gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"

func OnEditProjectFinanceCapacity(pl *messages.EditProjectFinanceCapacity) *ProjectFinanceCapacityDto {
	return &ProjectFinanceCapacityDto{
		Declarations: pl.FinanceCapacity.Declarations,
	}
}

func OnFetchProjectFinanceCapacity(id string) ProjectFinanceCapacityDto {
	return fetchProjectFinanceCapacity(id)
}
