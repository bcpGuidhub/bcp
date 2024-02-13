import {
  computeIntangibleAssets,
  buildStocks,
  buildClients,
} from "../balance_sheet/data_field.js";
import { buildDebtRepayments } from "../treasury/data_field.js";
const delayTable = {
  "0 jour": 0,
  "30 jours": 1,
  "60 jours": 2,
};
const yearLabel = {
  year_1: "Année 1",
  year_2: "Année 2",
  year_3: "Année 3",
};
const yearOrdering = { "Année 1": 1, "Année 2": 2, "Année 3": 3 };
const monthIntTable = {
  "Mois 1": 1,
  "Mois 2": 2,
  "Mois 3": 3,
  "Mois 4": 4,
  "Mois 5": 5,
  "Mois 6": 6,
  "Mois 7": 7,
  "Mois 8": 8,
  "Mois 9": 9,
  "Mois 10": 10,
  "Mois 11": 11,
  "Mois 12": 12,
};
const yearIntTable = {
  "Année 1": 1,
  "Année 2": 2,
  "Année 3": 3,
};
export const FieldEntry = function () {
  this.field = null;
};
FieldEntry.prototype.setField = function (field) {
  this.field = field;
};
FieldEntry.prototype.compute = function (association, year) {
  return this.field.compute(association, year);
};
/**
 * Investissements incorporels
 */
export const IntangibleInvestments = function (query) {
  this.query = query;
};
IntangibleInvestments.prototype.compute = function (association) {
  const { investments } = association;
  const initial = computeIntangibleInvestmentsInitial(investments);
  const annualVector = investments
    .map((investment) => {
      if (investment.investment_type === "Investissement incorporel") {
        return computeIntangibleAssets(investment);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, investment, i) => {
      investment.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeIntangibleInvestmentsInitial(investments) {
  return investments.reduce((acc, investment) => {
    if (investment["investment_type"] === "Investissement incorporel") {
      const paymentPlacementIndex =
        (yearOrdering[investment["year_of_purchase"]] - 1) * 12 +
        monthIntTable[investment["month_of_purchase"]];
      if (paymentPlacementIndex === 1) {
        const payment = investment["investment_amount_tax_included"];
        acc += parseInt(payment, 10);
      }
    }
    return acc;
  }, 0);
}
/**
 * Investissements corporels
 */
export const TangibleInvestments = function (query) {
  this.query = query;
};
TangibleInvestments.prototype.compute = function (association) {
  const { investments } = association;
  const initial = computeTangibleInvestmentsInitial(investments);
  const annualVector = investments
    .map((investment) => {
      if (investment.investment_type === "Investissement corporel") {
        return computeTangibleInvestmentsAssets(investment);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, investment, i) => {
      investment.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeTangibleInvestmentsInitial(investments) {
  return investments.reduce((acc, investment) => {
    if (investment["investment_type"] === "Investissement corporel") {
      const paymentPlacementIndex =
        (yearOrdering[investment["year_of_purchase"]] - 1) * 12 +
        monthIntTable[investment["month_of_purchase"]];
      if (paymentPlacementIndex === 1) {
        const payment = investment["investment_amount_tax_included"];
        acc += parseInt(payment, 10);
      }
    }
    return acc;
  }, 0);
}
function computeTangibleInvestmentsAssets(investment) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop = yearOrdering[investment.year_of_purchase];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(investment.investment_amount_tax_included, 10);
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}
/**
 * Investissement financier
 */
export const FinancialInvestments = function (query) {
  this.query = query;
};
FinancialInvestments.prototype.compute = function (association) {
  const { investments } = association;
  const initial = computeFinancialInvestmentsInitial(investments);
  const annualVector = investments
    .map((investment) => {
      if (investment.investment_type === "Investissement financier") {
        return computeFinancialInvestmentsAssets(investment);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, investment, i) => {
      investment.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeFinancialInvestmentsInitial(investments) {
  return investments.reduce((acc, investment) => {
    if (investment["investment_type"] === "Investissement financier") {
      const paymentPlacementIndex =
        (yearOrdering[investment["year_of_purchase"]] - 1) * 12 +
        monthIntTable[investment["month_of_purchase"]];
      if (paymentPlacementIndex === 1) {
        const payment = investment["investment_amount_tax_included"];
        acc += parseInt(payment, 10);
      }
    }
    return acc;
  }, 0);
}
function computeFinancialInvestmentsAssets(investment) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop = yearOrdering[investment.year_of_purchase];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(investment.investment_amount_tax_included, 10);
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}
/**
 * Variation du besoin en fonds de roulement
 */
export const VariationWorkingCapital = function (query) {
  this.query = query;
};
VariationWorkingCapital.prototype.compute = function (association) {
  const { aggregateResources, taxesClaimsTreasury } = association;
  const { revenues, investments } = aggregateResources;
  const { taxReceivables, socialClaims, treasury } = taxesClaimsTreasury;
  const stocks = buildStocks(aggregateResources);
  const clients = buildClients(aggregateResources);
  const initial =
    computeInitialStock(revenues) + computeInitialInvestment(investments);

  let recurring = 0;
  let recurringYear = 0;
  const annualVector = stocks.reduce((acc, year, j) => {
    const cal =
      year[2] +
      clients[j][2] +
      (taxReceivables[j]["asset_net"] === null
        ? 0
        : taxReceivables[j]["asset_net"]) +
      (socialClaims[j]["asset_net"] === null
        ? 0
        : socialClaims[j]["asset_net"]) -
      ((taxReceivables[j]["liability_net"] === null
        ? 0
        : taxReceivables[j]["liability_net"]) +
        (socialClaims[j]["liability_net"] === null
          ? 0
          : socialClaims[j]["liability_net"]) +
        (treasury[j]["liability_net"] === null
          ? 0
          : treasury[j]["liability_net"]));
    if (j < 2) {
      acc[j] = cal - recurring;
      recurring = acc[j];
      recurringYear = cal;
    } else {
      acc[j] = cal - recurringYear;
    }
    return acc;
  }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeInitialStock(revenues) {
  return revenues.reduce((acc, revenue) => {
    let delay = delayTable[revenue.supplier_payment_deadline];
    if (revenue.inventory_linked_revenue === "Oui" && delay === 0) {
      const valuationStartingStock = parseInt(
        revenue.valuation_of_starting_stock,
        10
      );
      const vat = revenue["vat_rate_on_purchases"];
      const rate =
        vat === ""
          ? 0
          : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
      acc += valuationStartingStock * (1 + rate);
    }
    return acc;
  }, 0);
}
export function computeInitialInvestment(investments) {
  return investments.reduce((acc, investment) => {
    if (investment["contribution"] === "Non") {
      const paymentPlacementIndex =
        (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
        monthIntTable[investment["month_of_purchase"]];
      if (paymentPlacementIndex === 1) {
        let amount = investment["investment_amount_tax_included"];
        const vat = investment["vat_rate_on_investment"];
        const rate =
          vat === ""
            ? 0
            : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
        acc += parseInt(amount, 10) * rate;
      }
    }
    return acc;
  }, 0);
}
/**
 * Remboursements d’emprunts
 */
export const LoanRepayments = function (query) {
  this.query = query;
};
LoanRepayments.prototype.compute = function (association) {
  const { aggregateResources, financialCharges } = association;
  const { loans } = aggregateResources;
  const loanPayments = buildDebtRepayments(loans);
  const annualLoanPayments = loanPayments.reduce((acc, year, j) => {
    const i = j;
    year.reduce((a, m) => {
      a[i] += m;
      return a;
    }, acc);
    return acc;
  }, new Array(3).fill(0));

  let accAnnualFinancialCharges = [
    financialCharges["year_1"],
    financialCharges["year_2"],
    financialCharges["year_3"],
  ];
  const annualVector = annualLoanPayments.reduce((acc, year, j) => {
    acc[j] = year - acc[j];
    return acc;
  }, accAnnualFinancialCharges);

  return [0, ...annualVector];
};
/**
 *Remboursements d’apports en compte courant d’associés
 */
export const AssociateContributions = function (query) {
  this.query = query;
};
AssociateContributions.prototype.compute = function (association) {
  const { associatesCapitalContributions } = association;
  const initial = computeAssociatesCapitalContributionsInitial(
    associatesCapitalContributions
  );
  const annualVector = associatesCapitalContributions
    .map((associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Remboursement de compte courant d'associé"
      ) {
        return computeAssociatesCapitalContributions(
          associatesCapitalContribution
        );
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, associatesCapitalContribution, i) => {
      associatesCapitalContribution.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeAssociatesCapitalContributionsInitial(
  associatesCapitalContributions
) {
  return associatesCapitalContributions.reduce(
    (acc, associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Remboursement de compte courant d'associé"
      ) {
        const paymentPlacementIndex =
          (yearIntTable[
            associatesCapitalContribution["year_of_contribution_repayment"]
          ] -
            1) *
            12 +
          monthIntTable[
            associatesCapitalContribution["month_of_contribution_repayment"]
          ];
        if (paymentPlacementIndex === 1) {
          const payment =
            associatesCapitalContribution[
              "associate_capital_contribution_amount"
            ];
          acc += parseInt(payment, 10);
        }
      }

      return acc;
    },
    0
  );
}
function computeAssociatesCapitalContributions(associatesCapitalContribution) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop =
    yearOrdering[
      associatesCapitalContribution["year_of_contribution_repayment"]
    ];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(
        associatesCapitalContribution["associate_capital_contribution_amount"],
        10
      );
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}
/**
 * Apports en capital
 */

export const CapitalContributions = function (query) {
  this.query = query;
};
CapitalContributions.prototype.compute = function (association) {
  const { capitalContributions } = association;
  const initial = computeCapitalContributionsInitial(capitalContributions);
  const annualVector = capitalContributions
    .map((capitalContribution) =>
      computeCapitalContribution(capitalContribution)
    )
    .reduce((acc, capitalContribution, i) => {
      capitalContribution.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeCapitalContributionsInitial(capitalContributions) {
  return capitalContributions.reduce((acc, capitalContribution) => {
    const paymentPlacementIndex =
      (yearOrdering[capitalContribution["year_of_contribution"]] - 1) * 12 +
      monthIntTable[capitalContribution["month_of_contribution"]];
    if (paymentPlacementIndex === 1) {
      const payment = capitalContribution["contribution_amount"];
      acc += parseInt(payment, 10);
    }
    return acc;
  }, 0);
}
function computeCapitalContribution(capitalContribution) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop = yearOrdering[capitalContribution.year_of_contribution];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(capitalContribution.contribution_amount, 10);
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}

/**
 * Apports en compte courant d'associés
 */

export const CurrentShareholdersAccount = function (query) {
  this.query = query;
};
CurrentShareholdersAccount.prototype.compute = function (association) {
  const { associatesCapitalContributions } = association;
  const initial = computeCurrentShareholdersAccountInitial(
    associatesCapitalContributions
  );
  const annualVector = associatesCapitalContributions
    .map((associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Apport en compte courant d'associé"
      ) {
        return computeCurrentShareholdersAccount(associatesCapitalContribution);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, associatesCapitalContribution, i) => {
      associatesCapitalContribution.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeCurrentShareholdersAccountInitial(
  associatesCapitalContributions
) {
  return associatesCapitalContributions.reduce(
    (acc, associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Apport en compte courant d'associé"
      ) {
        const paymentPlacementIndex =
          (yearOrdering[
            associatesCapitalContribution["year_of_contribution_repayment"]
          ] -
            1) *
            12 +
          monthIntTable[
            associatesCapitalContribution["month_of_contribution_repayment"]
          ];
        if (paymentPlacementIndex === 1) {
          const payment =
            associatesCapitalContribution[
              "associate_capital_contribution_amount"
            ];
          acc += parseInt(payment, 10);
        }
      }
      return acc;
    },
    0
  );
}
function computeCurrentShareholdersAccount(associatesCapitalContribution) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop =
    yearOrdering[associatesCapitalContribution.year_of_contribution_repayment];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(
        associatesCapitalContribution.associate_capital_contribution_amount,
        10
      );
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}

/**
 * Emprunts
 */
export const Borrowing = function (query) {
  this.query = query;
};
Borrowing.prototype.compute = function (association) {
  const { loans } = association;
  const initial = computeBorrowingInitial(loans);
  const annualVector = loans
    .map((loan) => {
      if (
        loan.type_of_external_fund === "Prêt bancaire" ||
        loan.type_of_external_fund === "Prêt d'honneur" ||
        loan.type_of_external_fund === "Autre prêt"
      ) {
        return computeBorrowing(loan);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, loan, i) => {
      loan.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return [initial, ...annualVector];
};
function computeBorrowingInitial(loans) {
  return loans.reduce((acc, loan) => {
    if (
      loan.type_of_external_fund === "Prêt bancaire" ||
      loan.type_of_external_fund === "Prêt d'honneur" ||
      loan.type_of_external_fund === "Autre prêt"
    ) {
      const paymentPlacementIndex =
        (yearOrdering[loan.year_of_loan_disbursement] - 1) * 12 +
        monthIntTable[loan.month_of_loan_disbursement];
      if (paymentPlacementIndex === 1) {
        const payment = loan.amount_loan;
        acc += parseInt(payment, 10);
      }
    }
    return acc;
  }, 0);
}
function computeBorrowing(loan) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let yop = yearOrdering[loan.year_of_loan_disbursement];
  for (let i = 1; i <= 3; i++) {
    if (yop === i) {
      amount = parseInt(loan.amount_loan, 10);
    } else {
      amount = 0;
    }
    acc[i - 1] = amount;
  }
  return acc;
}
