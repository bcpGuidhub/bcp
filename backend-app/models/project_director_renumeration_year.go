package models

type ProjectDirectorRenumerationYear struct {
	Model
	ID                 string          `gorm:"primary_key;column:project_director_renumeration_year_id" json:"id"`
	ProjectDirectorsId string          `gorm:"column:project_directors_id" json:"project_directors_id"`
	ProjectDirector    ProjectDirector `gorm:"foreignkey:project_directors_id"`
	Year               string          `gorm:"column:year" json:"year"`
	Month1Amount       string          `gorm:"column:month_1_amount" json:"month_1_amount"`
	Month2Amount       string          `gorm:"column:month_2_amount" json:"month_2_amount"`
	Month3Amount       string          `gorm:"column:month_3_amount" json:"month_3_amount"`
	Month4Amount       string          `gorm:"column:month_4_amount" json:"month_4_amount"`
	Month5Amount       string          `gorm:"column:month_5_amount" json:"month_5_amount"`
	Month6Amount       string          `gorm:"column:month_6_amount" json:"month_6_amount"`
	Month7Amount       string          `gorm:"column:month_7_amount" json:"month_7_amount"`
	Month8Amount       string          `gorm:"column:month_8_amount" json:"month_8_amount"`
	Month9Amount       string          `gorm:"column:month_9_amount" json:"month_9_amount"`
	Month10Amount      string          `gorm:"column:month_10_amount" json:"month_10_amount"`
	Month11Amount      string          `gorm:"column:month_11_amount" json:"month_11_amount"`
	Month12Amount      string          `gorm:"column:month_12_amount" json:"month_12_amount"`
}

// Set table name to be `project_director_renumeration_year`
func (ProjectDirectorRenumerationYear) TableName() string {
	return "project_director_renumeration_year"
}
