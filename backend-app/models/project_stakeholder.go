package models

type StakeholderAccountStatus int

const (
	PendingPassword StakeholderAccountStatus = iota
	Live
	Closed
)

type ProjectStakeholder struct {
	Model
	ID          string                   `gorm:"primary_key;column:project_stakeholder_id" json:"id"`
	ProjectId   string                   `gorm:"column:project_id" json:"project_id"`
	Project     Project                  `gorm:"foreignkey:project_id"`
	FirstName   string                   `gorm:"first_name" json:"first_name"`
	LastName    string                   `gorm:"last_name" json:"last_name"`
	Role        string                   `gorm:"column:role" json:"role"`
	RoleDetails string                   `gorm:"column:role_details" json:"role_details"`
	Email       string                   `gorm:"colum:email" json:"email"`
	Status      StakeholderAccountStatus `gorm:"column:status" json:"status"`
	Password    string                   `gorm:"column:password" json:"password"`
	LogInCount  int                      `gorm:"column:log_in_count" json:"log_in_count"`
	OTP         string                   `gorm:"column:otp" json:"otp"`
}

// Set table name to be `project_stakeholderm`
func (ProjectStakeholder) TableName() string {
	return "project_stakeholder"
}

func (p *ProjectStakeholder) Pending() bool {
	return p.Status == PendingPassword
}

func (p *ProjectStakeholder) Live() bool {
	return p.Status == Live
}

func (p *ProjectStakeholder) GUUID() string {
	return p.ID
}
