package response

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

func OnCreateLoan(pl *messages.CreateLoan) *LoanDto {
	return &LoanDto{
		ID:                      pl.Loan.ID,
		LoanName:                pl.Loan.LoanName,
		YearOfLoanDisbursement:  pl.Loan.YearOfLoanDisbursement,
		MonthOfLoanDisbursement: pl.Loan.MonthOfLoanDisbursement,
		LoanRate:                pl.Loan.LoanRate,
		LoanDuration:            pl.Loan.LoanDuration,
		AmountMonthlyPayments:   pl.Loan.AmountMonthlyPayments,
		TypeOfExternalFund:      pl.Loan.TypeOfExternalFund,
		AmountLoan:              pl.Loan.AmountLoan,
	}
}

func FetchProjectLoans(id string) []LoanDto {
	return fetchProjectLoans(id)
}

func OnEditLoan(pl *models.ProjectLoan) *LoanDto {
	return &LoanDto{
		ID:                      pl.ID,
		LoanName:                pl.LoanName,
		YearOfLoanDisbursement:  pl.YearOfLoanDisbursement,
		MonthOfLoanDisbursement: pl.MonthOfLoanDisbursement,
		LoanRate:                pl.LoanRate,
		LoanDuration:            pl.LoanDuration,
		AmountMonthlyPayments:   pl.AmountMonthlyPayments,
		TypeOfExternalFund:      pl.TypeOfExternalFund,
		AmountLoan:              pl.AmountLoan,
	}
}
