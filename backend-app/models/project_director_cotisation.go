package models

type ProjectDirectorCotisationYear struct {
	Model
	ID                string          `gorm:"primary_key;column:project_directors_cotisation_year_id" json:"id"`
	ProjectDirectorId string          `gorm:"column:project_directors_id" json:"project_directors_id"`
	ProjectDirector   ProjectDirector `gorm:"foreignkey:project_directors_id"`
	Year              string          `gorm:"column:year" json:"year"`
	Month1Cotisation  string          `gorm:"column:month_1_cotisation" json:"month_1_cotisation"`
	Month2Cotisation  string          `gorm:"column:month_2_cotisation" json:"month_2_cotisation"`
	Month3Cotisation  string          `gorm:"column:month_3_cotisation" json:"month_3_cotisation"`
	Month4Cotisation  string          `gorm:"column:month_4_cotisation" json:"month_4_cotisation"`
	Month5Cotisation  string          `gorm:"column:month_5_cotisation" json:"month_5_cotisation"`
	Month6Cotisation  string          `gorm:"column:month_6_cotisation" json:"month_6_cotisation"`
	Month7Cotisation  string          `gorm:"column:month_7_cotisation" json:"month_7_cotisation"`
	Month8Cotisation  string          `gorm:"column:month_8_cotisation" json:"month_8_cotisation"`
	Month9Cotisation  string          `gorm:"column:month_9_cotisation" json:"month_9_cotisation"`
	Month10Cotisation string          `gorm:"column:month_10_cotisation" json:"month_10_cotisation"`
	Month11Cotisation string          `gorm:"column:month_11_cotisation" json:"month_11_cotisation"`
	Month12Cotisation string          `gorm:"column:month_12_cotisation" json:"month_12_cotisation"`
}

// Set table name to be `project_directors_cotisation_year`
func (ProjectDirectorCotisationYear) TableName() string {
	return "project_directors_cotisation_year"
}
