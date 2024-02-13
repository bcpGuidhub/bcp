package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectLoanDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type projectLoanEditPayload struct {
	Id                      string `form:"id" json:"id" binding:"required"`
	LoanName                string `form:"bank_loan_name" json:"bank_loan_name"`
	YearOfLoanDisbursement  string `form:"year_of_loan_disbursement" json:"year_of_loan_disbursement"`
	MonthOfLoanDisbursement string `form:"month_of_loan_disbursement" json:"month_of_loan_disbursement"`
	LoanRate                string `form:"loan_rate" json:"loan_rate"`
	LoanDuration            string `form:"loan_duration" json:"loan_duration"`
	AmountMonthlyPayments   string `form:"amount_monthly_payments" json:"amount_monthly_payments"`
	TypeOfExternalFund      string `form:"type_of_external_fund" json:"type_of_external_fund"`
	AmountLoan              string `form:"amount_loan" json:"amount_loan"`
}

type projectLoanCreationPayload struct {
	LoanName                string `form:"bank_loan_name" json:"bank_loan_name" binding:"required"`
	YearOfLoanDisbursement  string `form:"year_of_loan_disbursement" json:"year_of_loan_disbursement" binding:"required"`
	MonthOfLoanDisbursement string `form:"month_of_loan_disbursement" json:"month_of_loan_disbursement" binding:"required"`
	LoanRate                string `form:"loan_rate" json:"loan_rate"`
	LoanDuration            string `form:"loan_duration" json:"loan_duration"`
	AmountMonthlyPayments   string `form:"amount_monthly_payments" json:"amount_monthly_payments"`
	TypeOfExternalFund      string `form:"type_of_external_fund" json:"type_of_external_fund" binding:"required"`
	AmountLoan              string `form:"amount_loan" json:"amount_loan" binding:"required"`
}

func CreateProjectLoan(c *gin.Context) {
	projectId := c.Param("id")

	var p projectLoanCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectLoan{
		ProjectId:               projectId,
		LoanName:                p.LoanName,
		YearOfLoanDisbursement:  p.YearOfLoanDisbursement,
		MonthOfLoanDisbursement: p.MonthOfLoanDisbursement,
		LoanRate:                p.LoanRate,
		LoanDuration:            p.LoanDuration,
		AmountMonthlyPayments:   p.AmountMonthlyPayments,
		TypeOfExternalFund:      p.TypeOfExternalFund,
		AmountLoan:              p.AmountLoan,
	}
	dao := dao.NewProjectLoanDAO()
	svc := services.NewProjectLoanService(dao)
	i, err := svc.CreateProjectLoan(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateLoan(&i))
}

func FetchProjectLoans(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectLoans(projectId))
}

func EditProjectLoan(c *gin.Context) {
	var p projectLoanEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLoanDAO()
	svc := services.NewProjectLoanService(dao)
	pI := models.ProjectLoan{
		ID:                      p.Id,
		LoanName:                p.LoanName,
		YearOfLoanDisbursement:  p.YearOfLoanDisbursement,
		MonthOfLoanDisbursement: p.MonthOfLoanDisbursement,
		LoanRate:                p.LoanRate,
		LoanDuration:            p.LoanDuration,
		AmountMonthlyPayments:   p.AmountMonthlyPayments,
		TypeOfExternalFund:      p.TypeOfExternalFund,
		AmountLoan:              p.AmountLoan,
	}
	i, err := svc.EditProjectLoan(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditLoan(i))
}

func DeleteProjectLoan(c *gin.Context) {
	projectId := c.Param("id")

	var i projectLoanDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectLoanDAO()
	svc := services.NewProjectLoanService(dao)
	p := models.ProjectLoan{
		ID: i.Id,
	}
	if err := svc.DeleteLoan(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectLoans(projectId))
}
