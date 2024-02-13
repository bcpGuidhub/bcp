package models

type ProjectCapitalContribution struct {
	Model
	ID                        string  `gorm:"primary_key;column:project_capital_contributions_id" json:"id"`
	ProjectId                 string  `gorm:"column:project_id" json:"project_id"`
	Project                   Project `gorm:"foreignkey:project_id"`
	CapitalContributionType   string  `gorm:"column:type_capital_contribution" json:"type_capital_contribution"`
	CapitalContributionAmount string  `gorm:"column:contribution_amount" json:"contribution_amount"`
	YearOfContribution        string  `gorm:"column:year_of_contribution" json:"year_of_contribution"`
	MonthOfContribution       string  `gorm:"column:month_of_contribution" json:"month_of_contribution"`
}

// Set table name to be `project_capital_contributions`
func (ProjectCapitalContribution) TableName() string {
	return "project_capital_contributions"
}
