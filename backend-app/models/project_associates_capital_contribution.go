package models

type ProjectAssociatesCapitalContribution struct {
	Model
	ID                                 string  `gorm:"primary_key;column:project_associates_capital_contributions_id" json:"id"`
	ProjectId                          string  `gorm:"column:project_id" json:"project_id"`
	Project                            Project `gorm:"foreignkey:project_id"`
	TypeOfOperation                    string  `gorm:"column:type_of_operation" json:"type_of_operation"`
	YearOfContributionRepayment        string  `gorm:"column:year_of_contribution_repayment" json:"year_of_contribution_repayment"`
	MonthOfContributionRepayment       string  `gorm:"column:month_of_contribution_repayment" json:"month_of_contribution_repayment"`
	AssociateCapitalContributionAmount string  `gorm:"column:associate_capital_contribution_amount" json:"associate_capital_contribution_amount"`
}

// Set table name to be `project_associates_capital_contributions`
func (ProjectAssociatesCapitalContribution) TableName() string {
	return "project_associates_capital_contributions"
}
