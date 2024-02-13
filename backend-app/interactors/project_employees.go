package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectEmployeeDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}
type projectEmployeeEditPayload struct {
	Id                       string `form:"id" json:"id" binding:"required"`
	Post                     string `form:"post" json:"post"  binding:"required"`
	SalaryBruteYear1         string `form:"salary_brute_year_1" json:"salary_brute_year_1" binding:"required" `
	SalaryBruteYear2         string `form:"salary_brute_year_2" json:"salary_brute_year_2" binding:"required"`
	SalaryBruteYear3         string `form:"salary_brute_year_3" json:"salary_brute_year_3" binding:"required"`
	ContractType             string `form:"contract_type" json:"contract_type" binding:"required"`
	ContractDuration         string `form:"contract_duration" json:"contract_duration" binding:"required"`
	GrossMonthlyRemuneration string `form:"gross_monthly_remuneration" json:"gross_monthly_remuneration" binding:"required"`
	YearOfHire               string `form:"year_of_hire" json:"year_of_hire" binding:"required"`
	DateOfHire               string `form:"date_of_hire" json:"date_of_hire" binding:"required"`
	NetMonthlyRemuneration   string `form:"net_monthly_remuneration" json:"net_monthly_remuneration" binding:"required"`
	EmployerContributions    string `form:"employer_contributions" json:"employer_contributions" binding:"required"`
}
type projectEmployeeCreationPayload struct {
	Post                     string `form:"post" json:"post"  binding:"required"`
	SalaryBruteYear1         string `form:"salary_brute_year_1" json:"salary_brute_year_1" binding:"required" `
	SalaryBruteYear2         string `form:"salary_brute_year_2" json:"salary_brute_year_2" binding:"required"`
	SalaryBruteYear3         string `form:"salary_brute_year_3" json:"salary_brute_year_3" binding:"required"`
	ContractType             string `form:"contract_type" json:"contract_type" binding:"required"`
	ContractDuration         string `form:"contract_duration" json:"contract_duration" binding:"required"`
	GrossMonthlyRemuneration string `form:"gross_monthly_remuneration" json:"gross_monthly_remuneration" binding:"required"`
	YearOfHire               string `form:"year_of_hire" json:"year_of_hire" binding:"required"`
	DateOfHire               string `form:"date_of_hire" json:"date_of_hire" binding:"required"`
	NetMonthlyRemuneration   string `form:"net_monthly_remuneration" json:"net_monthly_remuneration" binding:"required"`
	EmployerContributions    string `form:"employer_contributions" json:"employer_contributions" binding:"required"`
}

func CreateProjectEmployee(c *gin.Context) {
	projectId := c.Param("id")

	var p projectEmployeeCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectEmployee{
		ProjectId:                projectId,
		Post:                     p.Post,
		SalaryBruteYear1:         p.SalaryBruteYear1,
		SalaryBruteYear2:         p.SalaryBruteYear2,
		SalaryBruteYear3:         p.SalaryBruteYear3,
		ContractType:             p.ContractType,
		ContractDuration:         p.ContractDuration,
		GrossMonthlyRemuneration: p.GrossMonthlyRemuneration,
		YearOfHire:               p.YearOfHire,
		DateOfHire:               p.DateOfHire,
		NetMonthlyRemuneration:   p.NetMonthlyRemuneration,
		EmployerContributions:    p.EmployerContributions,
	}
	dao := dao.NewProjectEmployeeDAO()
	svc := services.NewProjectEmployeeService(dao)
	i, err := svc.CreateProjectEmployee(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateEmployee(&i))
}

func FetchProjectEmployees(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectEmployees(user.ID))
}

func EditProjectEmployee(c *gin.Context) {
	var p projectEmployeeEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectEmployeeDAO()
	svc := services.NewProjectEmployeeService(dao)
	pI := models.ProjectEmployee{
		ID:                       p.Id,
		Post:                     p.Post,
		SalaryBruteYear1:         p.SalaryBruteYear1,
		SalaryBruteYear2:         p.SalaryBruteYear2,
		SalaryBruteYear3:         p.SalaryBruteYear3,
		ContractType:             p.ContractType,
		ContractDuration:         p.ContractDuration,
		GrossMonthlyRemuneration: p.GrossMonthlyRemuneration,
		YearOfHire:               p.YearOfHire,
		DateOfHire:               p.DateOfHire,
		NetMonthlyRemuneration:   p.NetMonthlyRemuneration,
		EmployerContributions:    p.EmployerContributions,
	}
	i, err := svc.EditProjectEmployee(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditEmployee(i))
}

func DeleteProjectEmployee(c *gin.Context) {
	projectId := c.Param("id")

	var i projectEmployeeDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectEmployeeDAO()
	svc := services.NewProjectEmployeeService(dao)
	p := models.ProjectEmployee{
		ID: i.Id,
	}
	if err := svc.DeleteEmployee(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectEmployees(projectId))
}
