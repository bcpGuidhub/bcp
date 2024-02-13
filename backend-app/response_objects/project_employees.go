package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateEmployee(pl *messages.CreateEmployee) *EmployeeDto {
	return &EmployeeDto{
		ID:                       pl.Employee.ID,
		Post:                     pl.Employee.Post,
		SalaryBruteYear1:         pl.Employee.SalaryBruteYear1,
		SalaryBruteYear2:         pl.Employee.SalaryBruteYear2,
		SalaryBruteYear3:         pl.Employee.SalaryBruteYear3,
		ContractType:             pl.Employee.ContractType,
		ContractDuration:         pl.Employee.ContractDuration,
		GrossMonthlyRemuneration: pl.Employee.GrossMonthlyRemuneration,
		YearOfHire:               pl.Employee.YearOfHire,
		DateOfHire:               pl.Employee.DateOfHire,
		NetMonthlyRemuneration:   pl.Employee.NetMonthlyRemuneration,
		EmployerContributions:    pl.Employee.EmployerContributions,
	}
}

func FetchProjectEmployees(id string) []EmployeeDto {
	return fetchProjectEmployees(id)
}

func OnEditEmployee(pl *models.ProjectEmployee) *EmployeeDto {
	return &EmployeeDto{
		ID:                       pl.ID,
		Post:                     pl.Post,
		SalaryBruteYear1:         pl.SalaryBruteYear1,
		SalaryBruteYear2:         pl.SalaryBruteYear2,
		SalaryBruteYear3:         pl.SalaryBruteYear3,
		ContractType:             pl.ContractType,
		ContractDuration:         pl.ContractDuration,
		GrossMonthlyRemuneration: pl.GrossMonthlyRemuneration,
		YearOfHire:               pl.YearOfHire,
		DateOfHire:               pl.DateOfHire,
		NetMonthlyRemuneration:   pl.NetMonthlyRemuneration,
		EmployerContributions:    pl.EmployerContributions,
	}
}
