package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type ProjectEmployeeDAO struct{}

func NewProjectEmployeeDAO() *ProjectEmployeeDAO {
	return &ProjectEmployeeDAO{}
}
func (dao *ProjectEmployeeDAO) CreateProjectEmployee(p *models.ProjectEmployee) (err error) {
	err = config.Datastore.AppDatabase.Create(p).Error
	return
}
func (dao *ProjectEmployeeDAO) FindProjectEmployee(pI *models.ProjectEmployee) (err error) {
	err = config.Datastore.AppDatabase.
		First(pI).
		Error
	return
}

func (dao *ProjectEmployeeDAO) EditProjectEmployee(pl *models.ProjectEmployee) (*models.ProjectEmployee, error) {
	err := config.Datastore.AppDatabase.Model(pl).Updates(models.ProjectEmployee{
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
	}).Error
	return pl, err
}
func (dao *ProjectEmployeeDAO) FetchEmployees(id string) []models.ProjectEmployee {
	var i []models.ProjectEmployee
	config.Datastore.AppDatabase.Where("project_id = ?", id).Order("created_at desc").Find(&i)
	return i
}
func (dao *ProjectEmployeeDAO) DeleteEmployee(p *models.ProjectEmployee) (err error) {
	err = config.Datastore.AppDatabase.Unscoped().Delete(p).Error
	return
}
