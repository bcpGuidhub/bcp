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

type projectExpenseDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}
type projectExpenseEditPayload struct {
	Id                   string `form:"id" json:"id" binding:"required"`
	ExpenseLabel         string `form:"expense_label" json:"expense_label"`
	AnnualAmountTaxInc1  string `form:"annual_amount_tax_inc_1" json:"annual_amount_tax_inc_1"`
	AnnualAmountTaxInc2  string `form:"annual_amount_tax_inc_2" json:"annual_amount_tax_inc_2"`
	AnnualAmountTaxInc3  string `form:"annual_amount_tax_inc_3" json:"annual_amount_tax_inc_3"`
	ExpenditurePartition string `form:"expenditure_partition" json:"expenditure_partition"`
	VatRateExpenditure   string `form:"vat_rate_expenditure" json:"vat_rate_expenditure"`
	OneTimePaymentYear   string `form:"one_time_payment_year" json:"one_time_payment_year"`
	OneTimePaymentMonth  string `form:"one_time_payment_month" json:"one_time_payment_month"`
	ExpenseCategory      string `form:"expense_category" json:"expense_category"`
}
type projectExpenseCreationPayload struct {
	ExpenseLabel         string `form:"expense_label" json:"expense_label" binding:"required"`
	AnnualAmountTaxInc1  string `form:"annual_amount_tax_inc_1" json:"annual_amount_tax_inc_1" binding:"required"`
	AnnualAmountTaxInc2  string `form:"annual_amount_tax_inc_2" json:"annual_amount_tax_inc_2" binding:"required"`
	AnnualAmountTaxInc3  string `form:"annual_amount_tax_inc_3" json:"annual_amount_tax_inc_3" binding:"required"`
	ExpenditurePartition string `form:"expenditure_partition" json:"expenditure_partition" binding:"required"`
	VatRateExpenditure   string `form:"vat_rate_expenditure" json:"vat_rate_expenditure" binding:"required"`
	OneTimePaymentYear   string `form:"one_time_payment_year" json:"one_time_payment_year"`
	OneTimePaymentMonth  string `form:"one_time_payment_month" json:"one_time_payment_month"`
	ExpenseCategory      string `form:"expense_category" json:"expense_category" binding:"required"`
}

func CreateProjectExpense(c *gin.Context) {
	projectId := c.Param("id")

	var p projectExpenseCreationPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectExpense{
		ProjectId:            projectId,
		ExpenseLabel:         p.ExpenseLabel,
		AnnualAmountTaxInc1:  p.AnnualAmountTaxInc1,
		AnnualAmountTaxInc2:  p.AnnualAmountTaxInc2,
		AnnualAmountTaxInc3:  p.AnnualAmountTaxInc3,
		ExpenditurePartition: p.ExpenditurePartition,
		VatRateExpenditure:   p.VatRateExpenditure,
		OneTimePaymentYear:   p.OneTimePaymentYear,
		OneTimePaymentMonth:  p.OneTimePaymentMonth,
		ExpenseCategory:      p.ExpenseCategory,
	}
	dao := dao.NewProjectExpenseDAO()
	svc := services.NewProjectExpenseService(dao)
	i, err := svc.CreateProjectExpense(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateExpense(&i))
}

func FetchProjectExpenses(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectExpenses(projectId))
}

func EditProjectExpense(c *gin.Context) {
	var p projectExpenseEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectExpenseDAO()
	svc := services.NewProjectExpenseService(dao)
	pI := models.ProjectExpense{
		ID:                   p.Id,
		ExpenseLabel:         p.ExpenseLabel,
		AnnualAmountTaxInc1:  p.AnnualAmountTaxInc1,
		AnnualAmountTaxInc2:  p.AnnualAmountTaxInc2,
		AnnualAmountTaxInc3:  p.AnnualAmountTaxInc3,
		ExpenditurePartition: p.ExpenditurePartition,
		VatRateExpenditure:   p.VatRateExpenditure,
		OneTimePaymentYear:   p.OneTimePaymentYear,
		OneTimePaymentMonth:  p.OneTimePaymentMonth,
		ExpenseCategory:      p.ExpenseCategory,
	}
	_, err := svc.EditProjectExpense(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectExpenses(user.ID))
}

func DeleteProjectExpense(c *gin.Context) {
	var i projectExpenseDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectExpenseDAO()
	svc := services.NewProjectExpenseService(dao)
	p := models.ProjectExpense{
		ID: i.Id,
	}
	if err := svc.DeleteExpense(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.FetchProjectExpenses(user.ID))
}
