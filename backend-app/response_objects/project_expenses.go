package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateExpense(pl *messages.CreateExpense) *ExpenseDto {
	return &ExpenseDto{
		ID:                   pl.Expense.ID,
		ExpenseLabel:         pl.Expense.ExpenseLabel,
		AnnualAmountTaxInc1:  pl.Expense.AnnualAmountTaxInc1,
		AnnualAmountTaxInc2:  pl.Expense.AnnualAmountTaxInc2,
		AnnualAmountTaxInc3:  pl.Expense.AnnualAmountTaxInc3,
		ExpenditurePartition: pl.Expense.ExpenditurePartition,
		VatRateExpenditure:   pl.Expense.VatRateExpenditure,
		OneTimePaymentYear:   pl.Expense.OneTimePaymentYear,
		OneTimePaymentMonth:  pl.Expense.OneTimePaymentMonth,
		ExpenseCategory:      pl.Expense.ExpenseCategory,
	}
}

func FetchProjectExpenses(id string) []ExpenseDto {
	return fetchProjectExpenses(id)
}

func OnEditExpense(pl *models.ProjectExpense) *ExpenseDto {
	return &ExpenseDto{
		ID:                   pl.ID,
		ExpenseLabel:         pl.ExpenseLabel,
		AnnualAmountTaxInc1:  pl.AnnualAmountTaxInc1,
		AnnualAmountTaxInc2:  pl.AnnualAmountTaxInc2,
		AnnualAmountTaxInc3:  pl.AnnualAmountTaxInc3,
		ExpenditurePartition: pl.ExpenditurePartition,
		VatRateExpenditure:   pl.VatRateExpenditure,
		OneTimePaymentYear:   pl.OneTimePaymentYear,
		OneTimePaymentMonth:  pl.OneTimePaymentMonth,
		ExpenseCategory:      pl.ExpenseCategory,
	}
}
