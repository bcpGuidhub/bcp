package models

type ProjectDirector struct {
	Model
	ID                       string  `gorm:"primary_key;column:project_directors_id" json:"id"`
	ProjectId                string  `gorm:"column:project_id" json:"project_id"`
	Project                  Project `gorm:"foreignkey:project_id"`
	FirstName                string  `gorm:"column:first_name" json:"first_name"`
	LastName                 string  `gorm:"column:last_name" json:"last_name"`
	PercentageEquityCapital  string  `gorm:"column:percentage_equity_capital" json:"percentage_equity_capital"`
	DirectorAcre             string  `gorm:"column:director_acre" json:"director_acre"`
	CompensationPartition    string  `gorm:"column:compensation_partition" json:"compensation_partition"`
	NetCompensationYear1     string  `gorm:"column:net_compensation_year_1" json:"net_compensation_year_1"`
	NetCompensationYear2     string  `gorm:"column:net_compensation_year_2" json:"net_compensation_year_2"`
	NetCompensationYear3     string  `gorm:"column:net_compensation_year_3" json:"net_compensation_year_3"`
	CotisationsSocialesYear1 string  `gorm:"column:cotisations_sociales_year_1" json:"cotisations_sociales_year_1"`
	CotisationsSocialesYear2 string  `gorm:"column:cotisations_sociales_year_2" json:"cotisations_sociales_year_2"`
	CotisationsSocialesYear3 string  `gorm:"column:cotisations_sociales_year_3" json:"cotisations_sociales_year_3"`
	ProcessingCotisations    string  `gorm:"column:processing_cotisations" json:"processing_cotisations"`
}

// Set table name to be `project_directors`
func (ProjectDirector) TableName() string {
	return "project_directors"
}
