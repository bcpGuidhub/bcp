package models

type ProjectEmployee struct {
	Model
	ID                       string  `gorm:"primary_key;column:project_employees_id" json:"id"`
	ProjectId                string  `gorm:"column:project_id" json:"project_id"`
	Project                  Project `gorm:"foreignkey:project_id"`
	Post                     string  `gorm:"column:post" json:"post"`
	SalaryBruteYear1         string  `gorm:"column:salary_brute_year_1" json:"salary_brute_year_1"`
	SalaryBruteYear2         string  `gorm:"column:salary_brute_year_2" json:"salary_brute_year_2"`
	SalaryBruteYear3         string  `gorm:"column:salary_brute_year_3" json:"salary_brute_year_3"`
	ContractType             string  `gorm:"column:contract_type" json:"contract_type"`
	ContractDuration         string  `gorm:"column:contract_duration" json:"contract_duration"`
	GrossMonthlyRemuneration string  `gorm:"column:gross_monthly_remuneration" json:"gross_monthly_remuneration"`
	YearOfHire               string  `gorm:"column:year_of_hire" json:"year_of_hire"`
	DateOfHire               string  `gorm:"column:date_of_hire" json:"date_of_hire"`
	NetMonthlyRemuneration   string  `gorm:"column:net_monthly_remuneration" json:"net_monthly_remuneration"`
	EmployerContributions    string  `gorm:"column:employer_contributions" json:"employer_contributions"`
}

// Set table name to be `project_employees`
func (ProjectEmployee) TableName() string {
	return "project_employees"
}
