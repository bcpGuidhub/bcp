package models

import "time"

// Project data model representation of project table.
type Project struct {
	Model
	ID                              string    `gorm:"primary_key;column:project_id" json:"id"`
	UserId                          string    `gorm:"column:user_id" json:"user_id"`
	User                            User      `gorm:"foreignkey:user_id"`
	Name                            string    `gorm:"column:project_name" json:"project_name"`
	TypeProject                     string    `gorm:"column:type_project" json:"type_project"`
	SearchableAddress               string    `gorm:"column:searchable_address" json:"searchable_address"`
	ActivitySector                  string    `gorm:"column:activity_sector" json:"activity_sector"`
	ProjectAdvancementStage         string    `gorm:"column:project_advancement_stage" json:"project_advancement_stage"`
	ExpectedTurnover                string    `gorm:"column:expected_turnover" json:"expected_turnover"`
	Hiring                          bool      `gorm:"column:hiring" json:"hiring"`
	ProjectBudget                   string    `gorm:"column:project_budget" json:"project_budget"`
	PersonalContributionsBudget     string    `gorm:"column:personal_contributions_budget" json:"personal_contributions_budget"`
	Status                          string    `gorm:"column:status" json:"status"`
	ProjectLaunchValidationRdv      bool      `gorm:"column:project_launch_validation_rdv" json:"project_launch_validation_rdv"`
	ProjectLaunchValidationRdvDate  time.Time `gorm:"column:project_launch_validation_rdv_date" json:"project_launch_validation_rdv_date"`
	ExpertStatus                    string    `gorm:"column:expert_status" json:"expert_status"`
	ProjectFinanceValidationRdv     bool      `gorm:"column:project_finance_validation_rdv" json:"project_finance_validation_rdv"`
	ProjectFinanceValidationRdvDate time.Time `gorm:"column:project_finance_validation_rdv_date" json:"project_finance_validation_rdv_date"`
}

func (project *Project) Pending() bool {
	return project.Status == "pending"
}

func (project *Project) Registered() bool {
	return project.Status == "registered"
}

func (project *Project) Closed() bool {
	return project.Status == "closed"
}
