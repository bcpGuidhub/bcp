import currency from "currency.js";
import {
  microEntrepriseCotisation,
  microEntrepriseActivityCategory,
} from "../income_statement/data_field.js";
const euro = (value) =>
  currency(value, {
    symbol: "€",
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: " ",
    decimal: ",",
    precision: 2,
  });

const delayTable = {
  "0 jour": 0,
  "30 jours": 1,
  "60 jours": 2,
};
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
const yearLabel = {
  year_1: "Année 1",
  year_2: "Année 2",
  year_3: "Année 3",
};
export const FieldEntry = function () {
  this.field = null;
};
FieldEntry.prototype.setField = function (field) {
  this.field = field;
};
FieldEntry.prototype.compute = function (association, year, month) {
  return this.field.compute(association, year, month);
};

/**
 * Chiffre d’affaires
 */

export const Revenues = function (query) {
  this.query = query;
};
Revenues.prototype.compute = function (association, year, month) {
  return buildRevenueSchedule(association);
};
export function buildRevenueSchedule(revenues) {
  const paymentVector = revenues.map((revenue) => computePayments(revenue));
  return paymentVector.reduce(
    (acc, revenue) => {
      revenue.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computePayments(revenue) {
  let revenuPayments = [];
  revenuPayments.push(new Array(12).fill(0));
  revenuPayments.push(new Array(12).fill(0));
  revenuPayments.push(new Array(12).fill(0));
  let paymentYear;
  let paymentPlacementIndex;
  let paymentIndex;
  let amount;
  let delay = delayTable[revenue.customer_payment_deadline];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    if (revenue.revenue_partition === "Personnalisée") {
      const payments = revenue.revenue_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount =
        payment[`month_${paymentIndex}_amount`] === ""
          ? 0
          : parseInt(payment[`month_${paymentIndex}_amount`]);
      amount =
        amount *
        (1 +
          parseFloat(
            revenue["vat_rate_revenue"].replace("%", "").replace(",", ".")
          ) /
            100);
      paymentPlacementIndex = i + delay;
    }
    if (revenue.revenue_partition === "Mensuelle") {
      const payment = revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
      amount = parseInt(payment) / 12;
      paymentPlacementIndex = i + delay;
      amount =
        amount *
        (1 +
          parseFloat(
            revenue["vat_rate_revenue"].replace("%", "").replace(",", ".")
          ) /
            100);
    }
    if (paymentPlacementIndex <= 12) {
      revenuPayments[0][paymentPlacementIndex - 1] = amount;
    }
    if (paymentPlacementIndex > 12 && paymentPlacementIndex <= 24) {
      revenuPayments[1][paymentPlacementIndex - 12 - 1] = amount;
    }
    if (paymentPlacementIndex > 24 && paymentPlacementIndex <= 36) {
      revenuPayments[2][paymentPlacementIndex - 24 - 1] = amount;
    }
  }
  return revenuPayments;
}

/**
 * Apports en capital
 */
export const CapitalContributions = function (query) {
  this.query = query;
};
CapitalContributions.prototype.compute = function (association, year, month) {
  return buildCapitalsContributions(association);
};
function buildCapitalsContributions(capitalContributions) {
  const capitalContributionVector = capitalContributions.map(
    (capitalContribution) => computeCapitalsContributions(capitalContribution)
  );
  return capitalContributionVector.reduce(
    (acc, capitalContribution) => {
      capitalContribution.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeCapitalsContributions(capitalContribution) {
  let capitalContributionPayments = [];
  capitalContributionPayments.push(new Array(12).fill(0));
  capitalContributionPayments.push(new Array(12).fill(0));
  capitalContributionPayments.push(new Array(12).fill(0));
  let payment = 0;
  let paymentPlacementIndex =
    (yearIntTable[capitalContribution["year_of_contribution"]] - 1) * 12 +
    monthIntTable[capitalContribution["month_of_contribution"]];
  for (let i = 1; i <= 36; i++) {
    if (i === paymentPlacementIndex) {
      payment = parseInt(capitalContribution["contribution_amount"]);
    } else {
      payment = 0;
    }
    if (i <= 12) {
      capitalContributionPayments[0][i - 1] = payment;
    }
    if (i > 12 && i <= 24) {
      capitalContributionPayments[1][i - 12 - 1] = payment;
    }
    if (i > 24 && i <= 36) {
      capitalContributionPayments[2][i - 24 - 1] = payment;
    }
  }
  return capitalContributionPayments;
}

/**
 * C/C d’associé
 */
export const AssociatesCapitalContributions = function (query) {
  this.query = query;
};
AssociatesCapitalContributions.prototype.compute = function (
  association,
  year,
  month
) {
  const { associatesCapitalContributions } = association;
  return buildAssociatesCapitalContributions(associatesCapitalContributions);
};
function buildAssociatesCapitalContributions(associatesCapitalContributions) {
  const associatesCapitalContributionsVector =
    associatesCapitalContributions.map((associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Apport en compte courant d'associé"
      ) {
        return computeAssociatesCapitalContributions(
          associatesCapitalContribution
        );
      }
      return [
        new Array(12).fill(0),
        new Array(12).fill(0),
        new Array(12).fill(0),
      ];
    });
  return associatesCapitalContributionsVector.reduce(
    (acc, associatesCapitalContribution) => {
      associatesCapitalContribution.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}

function computeAssociatesCapitalContributions(associatesCapitalContribution) {
  let associatesCapitalContributionPayments = [];
  associatesCapitalContributionPayments.push(new Array(12).fill(0));
  associatesCapitalContributionPayments.push(new Array(12).fill(0));
  associatesCapitalContributionPayments.push(new Array(12).fill(0));
  let payment = 0;
  let paymentPlacementIndex =
    (yearIntTable[
      associatesCapitalContribution["year_of_contribution_repayment"]
    ] -
      1) *
      12 +
    monthIntTable[
      associatesCapitalContribution["month_of_contribution_repayment"]
    ];
  for (let i = 1; i <= 36; i++) {
    if (i === paymentPlacementIndex) {
      payment = parseInt(
        associatesCapitalContribution["associate_capital_contribution_amount"]
      );
    } else {
      payment = 0;
    }
    if (i <= 12) {
      associatesCapitalContributionPayments[0][i - 1] = payment;
    }
    if (i > 12 && i <= 24) {
      associatesCapitalContributionPayments[1][i - 12 - 1] = payment;
    }
    if (i > 24 && i <= 36) {
      associatesCapitalContributionPayments[2][i - 24 - 1] = payment;
    }
  }
  return associatesCapitalContributionPayments;
}
/**
 * Souscription d’emprunts
 */
export const LoanSubscription = function (query) {
  this.query = query;
};
LoanSubscription.prototype.compute = function (association, year, month) {
  return buildLoanSubscriptions(association);
};
export function buildLoanSubscriptions(loans) {
  const loansVector = loans.map((loan) => {
    if (
      loan.type_of_external_fund === "Prêt bancaire" ||
      loan.type_of_external_fund === "Prêt d'honneur" ||
      loan.type_of_external_fund === "Autre prêt"
    ) {
      return computeLoanSubscriptions(loan);
    }
    return [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
  });
  return loansVector.reduce(
    (acc, loan) => {
      loan.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeLoanSubscriptions(loan) {
  let loanSubscriptionPayments = [];
  loanSubscriptionPayments.push(new Array(12).fill(0));
  loanSubscriptionPayments.push(new Array(12).fill(0));
  loanSubscriptionPayments.push(new Array(12).fill(0));
  let payment = 0;
  let paymentPlacementIndex =
    (yearIntTable[loan["year_of_loan_disbursement"]] - 1) * 12 +
    monthIntTable[loan["month_of_loan_disbursement"]];
  for (let i = 1; i <= 36; i++) {
    if (i === paymentPlacementIndex) {
      payment = parseInt(loan["amount_loan"]);
    } else {
      payment = 0;
    }
    if (i <= 12) {
      loanSubscriptionPayments[0][i - 1] = payment;
    }
    if (i > 12 && i <= 24) {
      loanSubscriptionPayments[1][i - 12 - 1] = payment;
    }
    if (i > 24 && i <= 36) {
      loanSubscriptionPayments[2][i - 24 - 1] = payment;
    }
  }
  return loanSubscriptionPayments;
}

/**
 * Charges sociales
 */
export const SocialSecurityReimbursements = function (query) {
  this.query = query;
};
SocialSecurityReimbursements.prototype.compute = function (
  association,
  year,
  month
) {
  return buildSocialSecurityReimbursements(association);
};
function buildSocialSecurityReimbursements(association) {
  const { legal } = association;
  let directors = [];
  if (
    association.directors?.length === 0 &&
    (legal.legal_status_idea === "Entreprise individuelle" ||
      (legal.legal_status_idea === "EIRL" && legal.tax_system === "IR"))
  ) {
    directors.push({
      director_acre:
        typeof legal.micro_entreprise_accre_exemption === "undefined" ||
        legal.micro_entreprise_accre_exemption === ""
          ? "non"
          : legal.micro_entreprise_accre_exemption,
    });
  } else {
    directors = [...association.directors];
  }
  const directorsVector = directors.map((director) => {
    return computeSocialSecurityReimbursements(director, association);
  });
  return directorsVector.reduce(
    (acc, director) => {
      director.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeSocialSecurityReimbursements(director, association) {
  let socialSecurityReimbursementsPayments = [];
  socialSecurityReimbursementsPayments.push(new Array(12).fill(0));
  socialSecurityReimbursementsPayments.push(new Array(12).fill(0));
  socialSecurityReimbursementsPayments.push(new Array(12).fill(0));
  let payment = 0;
  for (let i = 1; i <= 36; i++) {
    if (i === 19) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        19,
        association.directorCotisations
      );
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        12,
        association.directorCotisations
      );
      const e = regularisationDirector(association.directorCotisations, 12, d);
      const v = e + c;
      if (v < 0) {
        payment = -c - e;
      }
    } else if (i === 31) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        31,
        association.directorCotisations
      );
      const e = regularisationDirector(
        association.directorCotisations,
        13,
        null
      );
      const v = e + c;
      if (v < 0) {
        payment = -c - e;
      }
    } else {
      payment = 0;
    }

    if (i <= 12) {
      socialSecurityReimbursementsPayments[0][i - 1] = payment;
    }
    if (i > 12 && i <= 24) {
      socialSecurityReimbursementsPayments[1][i - 12 - 1] = payment;
    }
    if (i > 24 && i <= 36) {
      socialSecurityReimbursementsPayments[2][i - 24 - 1] = payment;
    }
  }
  return socialSecurityReimbursementsPayments;
}

/**
 * TVA
 */
export const VatRefunds = function (query) {
  this.query = query;
};
VatRefunds.prototype.compute = function (association, year, month) {
  return buildVatRefunds(association);
};
function buildVatRefunds(association) {
  const { legal } = association;
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return computeVatRefunds(association);
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return computeVatRefundsNormal(association);
  }
  return [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
}
export function computeVatRefunds(association) {
  let VatRefunds = [];
  VatRefunds.push(new Array(12).fill(0));
  VatRefunds.push(new Array(12).fill(0));
  VatRefunds.push(new Array(12).fill(0));
  let payment = 0;
  const { revenues, revenueSources, expenses, investments } = association;
  let vatInvestmentsYear1;
  let vatDepositTotal = 0;
  let tva2yr_5 = 0;
  let tvaRefund2yr_5 = 0;
  let tvaDeposit2yr_7 = 0;
  let tvaDeposit2yr_12 = 0;
  let vatPaymentyear1_7 = 0;
  let vatPaymentyear1_12 = 0;
  for (let i = 1; i <= 36; i++) {
    if (i === 7) {
      const vatOnRevenues = computeVatOnRevenuesFirstSixMonths(revenues);
      const vatOnResourceSources = computeVatOnRevenueSourcesFirstSixMonths(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases = vatOnPurchasesMonthly(revenues);
      const vatOnExpenses = computeVatOnExpensesFirstSixMonths(expenses);
      const vatOnInvestments = vatOnInvestmentsMonthly(investments);
      let s = vatOnRevenues + vatOnResourceSources;
      let z = annualBasedVatPurchases + vatOnExpenses + vatOnInvestments;
      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;
      vatPaymentyear1_7 = payment;
    } else if (i === 12) {
      const vatOnRevenues = computeVatSevenTwelveMonths(revenues);
      const vatOnResourceSources = computeVatOnRevenueSourcesSixTwelveMonths(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases =
        vatOnPurchasesMonthlySevenTwelve(revenues);
      const vatOnExpenses = computeVatOnExpensesSevenElevenMonths(expenses);
      const vatOnInvestments = vatOnInvestmentsMonthSevenEleven(investments);
      let s = vatOnRevenues + vatOnResourceSources;
      let z = annualBasedVatPurchases + vatOnExpenses + vatOnInvestments;
      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;
      vatPaymentyear1_12 = payment;
    } else if (i === 17) {
      const vatOnRevenues = computeVatOnRevenues(revenues, 12);
      const vatOnResourceSources = computeVatOnRevenueSources(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases = computeAnnualBasedVatPurchases(
        revenues,
        "year_1"
      );
      const vatOnExpenses = computeVatOnExpenses(expenses, 12);
      const vatOnInvestments = computeVatOnInvestments(investments, 12);
      vatInvestmentsYear1 = vatOnInvestments;
      let s = vatOnRevenues + vatOnResourceSources;
      let z =
        annualBasedVatPurchases +
        vatOnExpenses +
        vatOnInvestments +
        vatPaymentyear1_7 +
        vatPaymentyear1_12;
      let c = 0;
      if (s < z) {
        c = z - s;
      }
      tvaRefund2yr_5 = c;
      VatRefunds[1][i - 12 - 1] = tvaRefund2yr_5;
      //tva paid year 2 month 5
      let d = 0;
      if (s > z) {
        d = s - z;
      }
      tva2yr_5 = d;
    }
    if (i === 19) {
      const c =
        tva2yr_5 +
        vatPaymentyear1_7 +
        vatPaymentyear1_12 -
        tvaRefund2yr_5 +
        vatInvestmentsYear1;
      if (c > 1000) {
        tvaDeposit2yr_7 = (c * 55) / 100;
      }
    }
    if (i === 24) {
      const c =
        tva2yr_5 +
        vatPaymentyear1_7 +
        vatPaymentyear1_12 -
        tvaRefund2yr_5 +
        vatInvestmentsYear1;
      if (c > 1000) {
        tvaDeposit2yr_12 = (c * 40) / 100;
      }
    }
    if (i === 29) {
      const vatOnRevenues = computeVatOnRevenues(revenues, 24);
      const vatOnResourceSources = computeVatOnRevenueSources(
        revenueSources,
        yearLabel["year_2"]
      );
      const annualBasedVatPurchases = computeAnnualBasedVatPurchases(
        revenues,
        "year_2"
      );
      const vatOnExpenses = computeVatOnExpenses(expenses, 24);
      const vatOnInvestments = computeVatOnInvestments(investments, 24);
      vatDepositTotal = tvaDeposit2yr_7 + tvaDeposit2yr_12;
      let s = vatOnRevenues + vatOnResourceSources;
      let z =
        annualBasedVatPurchases +
        vatOnExpenses +
        vatOnInvestments +
        vatDepositTotal;
      let c = 0;
      if (s < z) {
        c = z - s;
      }
      VatRefunds[2][i - 24 - 1] = c;
    }
  }
  return VatRefunds;
}
export function computeVatRefundsNormal(association) {
  const { revenues, revenueSources, expenses, investments } = association;
  const vatRevenues = vatOnRevenuesMonthlyBased(revenues);
  const vatRevenuesSources = vatOnRevenuesSourcesMonthlyBased(revenueSources);
  const vatPurcahes = vatOnPurchasesMonthlyBased(revenues);
  const vatExpenses = vatOnExpensesMonthlyBased(expenses);
  const vatInvestments = vatOnInvestmentsMonthlyBased(investments);
  const composedVatRevenues = vatRevenues.reduce((acc, year, i) => {
    year.reduce((a, j, k) => {
      a[k] += j;
      return a;
    }, acc[i]);
    return acc;
  }, vatRevenuesSources);
  const composedPurchases = vatPurcahes.reduce((acc, year, i) => {
    year.reduce((a, j, k) => {
      a[k] += j;
      return a;
    }, acc[i]);
    return acc;
  }, vatExpenses);
  const composeExpenseInvestmentPurchase = vatInvestments.reduce(
    (acc, year, i) => {
      year.reduce((a, j, k) => {
        a[k] += j;
        return a;
      }, acc[i]);
      return acc;
    },
    composedPurchases
  );
  let vatComposedReal = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  composeExpenseInvestmentPurchase.reduce((acc, year, i) => {
    year.reduce((a, n, k) => {
      if (a[k] < n) {
        vatComposedReal[i][k] = n - a[k];
      }
      return a;
    }, acc[i]);
    return acc;
  }, composedVatRevenues);
  return vatComposedReal;
}
/**
 * Autres
 */

export const OtherReceipts = function (query) {
  this.query = query;
};
OtherReceipts.prototype.compute = function (association, year, month) {
  return buildOtherReceipts(association);
};
function buildOtherReceipts(association) {
  const { incomeTaxRow, aggregateResources } = association;
  const { loans, revenueSources } = aggregateResources;
  const grants = computeGrants(loans);
  const otherProducts = computeOtherProducts(revenueSources);
  const incomeTaxYear3 = computeIncomeTaxYear3(incomeTaxRow);
  return otherProducts.reduce((acc, year, i) => {
    const n = i;
    year.reduce((a, j, k) => {
      if (k === 3 && n === 2) {
        a[k] = a[k] + j + incomeTaxYear3;
      } else {
        a[k] += j;
      }
      return a;
    }, acc[i]);
    return acc;
  }, grants);
}
function computeGrants(loans) {
  const paymentVector = loans.map((loan) => {
    if (loan.type_of_external_fund === "Subvention") {
      return computeGrantsOtheReceipts(loan);
    }
    return [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
  });
  return paymentVector.reduce(
    (acc, loan) => {
      loan.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeGrantsOtheReceipts(loan) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let amount;
  for (let i = 1; i <= 36; i++) {
    let paymentPlacementIndex =
      (yearIntTable[loan["year_of_loan_disbursement"]] - 1) * 12 +
      monthIntTable[loan["month_of_loan_disbursement"]];

    if (paymentPlacementIndex === i) {
      const payment = loan["amount_loan"];
      amount = parseInt(payment);
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
function computeOtherProducts(revenueSources) {
  const paymentVector = revenueSources.map((revenueSource) =>
    computeOtherProductsRevenues(revenueSource)
  );
  return paymentVector.reduce(
    (acc, revenue) => {
      revenue.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeOtherProductsRevenues(revenueSource) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let amount;
  const vat = revenueSource["vat_rate"];
  let paymentPlacementIndex =
    (yearIntTable[revenueSource["year"]] - 1) * 12 +
    monthIntTable[revenueSource["month"]];

  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  for (let i = 1; i <= 36; i++) {
    if (paymentPlacementIndex === i) {
      amount = revenueSource["amount_excluding_taxes"];
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = amount * (1 + rate);
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount * (1 + rate);
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount * (1 + rate);
    }
  }
  return purchases;
}
export function computeIncomeTaxYear3(incomeTaxRow) {
  if (incomeTaxRow.year_1 >= 3000) {
    if (incomeTaxRow.year_1 > incomeTaxRow.year_2) {
      return incomeTaxRow.year_1 - incomeTaxRow.year_2;
    }
  }
  return 0;
}

/**
 * Investments
 */
export const Investments = function (query) {
  this.query = query;
};
Investments.prototype.compute = function (association, year, month) {
  const { investments } = association;
  return buildInvestments(investments);
};
function buildInvestments(investments) {
  const paymentVector = investments.map((investment) =>
    computeInvestmentsVector(investment)
  );
  return paymentVector.reduce(
    (acc, investment) => {
      investment.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeInvestmentsVector(investment) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurringPurchase = 0;
  const vat = investment["vat_rate_on_investment"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const paymentPlacementIndex =
    (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
    monthIntTable[investment["month_of_purchase"]];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    if (paymentPlacementIndex === i) {
      const payment = investment["investment_amount_tax_included"];
      amount = parseInt(payment);
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = amount * (1 + rate);
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount * (1 + rate);
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount * (1 + rate);
    }
  }
  return purchases;
}

/**
 * Achats
 */
export const Purchases = function (query) {
  this.query = query;
};
Purchases.prototype.compute = function (association, year, month) {
  const { revenues } = association;
  return buildPurchases(revenues);
};
function buildPurchases(revenues) {
  const paymentVector = revenues.map((revenue) => computePurchases(revenue));
  return paymentVector.reduce(
    (acc, revenue) => {
      revenue.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computePurchases(revenue) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  if (revenue.inventory_linked_revenue === "Oui") {
    let paymentYear;
    let paymentIndex;
    let amount = 0;
    let delay = delayTable[revenue.supplier_payment_deadline];
    let recurringPurchase = 0;
    let amountEndOfMonth = 0;
    const amountAveragestock = parseInt(revenue.mean_valuation_of_stock, 10);
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const vat = revenue["vat_rate_on_purchases"];
    const rate =
      1 +
      (vat === ""
        ? 0
        : parseFloat(vat.replace("%", "").replace(",", ".")) / 100);
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    let runningSum = 0;
    // const paymentPlacementIndex = 1 + delay;
    const startingStock = valuationStartingStock * rate;
    for (let i = 1; i <= 36; i++) {
      if (i <= 12) {
        paymentYear = 1;
        paymentIndex = i;
      }
      if (i > 12 && i <= 24) {
        paymentYear = 2;
        paymentIndex = i - 12;
      }
      if (i > 24 && i <= 36) {
        paymentYear = 3;
        paymentIndex = i - 24;
      }

      if (revenue.revenue_partition === "Personnalisée") {
        const payments = revenue.revenue_years;
        const payment = payments.find((p) => p.year === `year_${paymentYear}`);
        amount =
          payment[`month_${paymentIndex}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${paymentIndex}_amount`]);
      }
      if (revenue.revenue_partition === "Mensuelle") {
        const payment =
          revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
        amount = parseInt(payment) / 12;
      }
      if (i === 1) {
        const c = valuationStartingStock - amount * (1 - percentageMargin);
        if (amountAveragestock > c) {
          recurringPurchase = amountAveragestock - c;
        }
      } else {
        const indicatorOnPurchases =
          amountAveragestock >
          amountEndOfMonth - amount * (1 - percentageMargin);

        if (indicatorOnPurchases) {
          recurringPurchase =
            amountAveragestock -
            (amountEndOfMonth - amount * (1 - percentageMargin));
        } else {
          recurringPurchase = 0;
        }
      }

      if (i <= 12) {
        if (i === 1) {
          purchases[0][i - 1] = recurringPurchase * rate + startingStock;
        } else {
          purchases[0][i - 1] = recurringPurchase * rate;
        }
      }
      if (i > 12 && i <= 24) {
        purchases[1][i - 12 - 1] = recurringPurchase * rate;
      }
      if (i > 24 && i <= 36) {
        purchases[2][i - 24 - 1] = recurringPurchase * rate;
      }
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
    }
    return applyDelay(purchases, delay);
  }
  return purchases;
}
function applyDelay(purchases, delay) {
  const r = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  let placementIndex = 0;
  let paymentYear;
  let paymentIndex;

  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    placementIndex = i + delay;
    if (placementIndex <= 12) {
      r[0][placementIndex - 1] = purchases[paymentYear - 1][paymentIndex - 1];
    }
    if (placementIndex > 12 && placementIndex <= 24) {
      r[1][placementIndex - 12 - 1] =
        purchases[paymentYear - 1][paymentIndex - 1];
    }
    if (placementIndex > 24 && placementIndex <= 36) {
      r[2][placementIndex - 24 - 1] =
        purchases[paymentYear - 1][paymentIndex - 1];
    }
  }
  return r;
}
/**
 * Frais généraux
 */
export const AdministrativeExpenses = function (query) {
  this.query = query;
};
AdministrativeExpenses.prototype.compute = function (association, year, month) {
  const { expenses } = association;
  return buildAdministrativeExpenses(expenses);
};
function buildAdministrativeExpenses(expenses) {
  const paymentVector = expenses.map((expense) =>
    computeAdministrativeExpenses(expense)
  );
  return paymentVector.reduce(
    (acc, expense) => {
      expense.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeAdministrativeExpenses(expense) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  const vat = expense["vat_rate_expenditure"];
  const rate =
    1 +
    (vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100);
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    const payment = expense[`annual_amount_tax_inc_${paymentYear}`];
    if (expense.expenditure_partition === "Mensuelle") {
      amount = parseInt(payment) / 12;
    }
    if (expense.expenditure_partition === "Trimestrielle") {
      let m = ((paymentYear - 1) * 12 + i) % 3;
      amount = m === 0 ? parseInt(payment) / 4 : 0;
    }
    if (expense.expenditure_partition === "Semestrielle") {
      let m = ((paymentYear - 1) * 12 + i) % 6;
      amount = m === 0 ? parseInt(payment) / 2 : 0;
    }
    if (expense.expenditure_partition === "Annuelle (début d'année)") {
      let m = [1, 13, 25];
      amount = m.includes(i) ? parseInt(payment) : 0;
    }
    if (expense.expenditure_partition === "Annuelle (fin d'année)") {
      let m = [12, 24, 36];
      amount = m.includes(i) ? parseInt(payment) : 0;
    }
    if (expense.expenditure_partition === "Ponctuelle") {
      let j =
        (yearIntTable[expense["one_time_payment_year"]] - 1) * 12 +
        monthIntTable[expense["one_time_payment_month"]];
      amount = i === j ? parseInt(payment) : 0;
    }
    if (i <= 12) {
      purchases[0][i - 1] = amount * rate;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount * rate;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount * rate;
    }
  }
  return purchases;
}
/**
 * Salaires dirigeants
 */

export const DirectorSalaries = function (query) {
  this.query = query;
};
DirectorSalaries.prototype.compute = function (association, year, month) {
  const { directors } = association;
  return buildDirectorSalaries(directors);
};
function buildDirectorSalaries(directors) {
  const directorsVector = directors.map((director) => {
    return computeDirectorSalaries(director);
  });
  return directorsVector.reduce(
    (acc, director) => {
      director.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeDirectorSalaries(director) {
  let salaries = [];
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }

    if (director.compensation_partition === "Mensuelle") {
      const payment = director[`net_compensation_year_${paymentYear}`];
      amount = parseInt(payment) / 12;
    }
    if (director.compensation_partition === "Personnalisée") {
      const payments = director.director_renumeration_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount =
        payment[`month_${paymentIndex}_amount`] === ""
          ? 0
          : parseInt(payment[`month_${paymentIndex}_amount`]);
    }
    if (i <= 12) {
      salaries[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      salaries[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      salaries[2][i - 24 - 1] = amount;
    }
  }
  return salaries;
}
/**
 * Charges sociales dirigeants
 */
export const DirectorSocialSecurity = function (query) {
  this.query = query;
};
DirectorSocialSecurity.prototype.compute = function (association, year, month) {
  return buildDirectorSocialSecurity(association);
};
function buildDirectorSocialSecurity(association) {
  const { legal, directors } = association;
  if (legal["social_security_scheme"] === "Sécurité sociale des indépendants") {
    if (
      directors.length === 0 &&
      (legal.legal_status_idea === "Entreprise individuelle" ||
        (legal.legal_status_idea === "EIRL" && legal.tax_system === "IR"))
    ) {
      return computeDirectorsSelfEmployedIndividuelle(association);
    } else {
      return computeDirectorsSelfEmployed(association);
    }
  }
  if (
    legal["social_security_scheme"] === "Régime général de la sécurité sociale"
  ) {
    return computeDirectorsEmployed(association);
  }
  if (legal.tax_system === "Micro-entreprise") {
    return computeMicroEntrepriseSocialCharges(association);
  }
  return [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
}
function computeDirectorsSelfEmployedIndividuelle(association) {
  const { legal } = association;
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  const director = {};
  const directorCount = 1;
  director["director_acre"] =
    typeof legal.micro_entreprise_accre_exemption === "undefined" ||
    legal.micro_entreprise_accre_exemption === ""
      ? "non"
      : legal.micro_entreprise_accre_exemption;

  let amount = 0;
  for (let i = 1; i <= 36; i++) {
    // Année 1
    // Mois 4 à Mois 12:
    if (4 <= i && i <= 12) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        i,
        association.directorCotisations
      );
      amount = (c * directorCount) / 9;
    }
    // Année 2
    // Mois 1 à 6
    if (13 <= i && i <= 18) {
      if (
        association.sector === "'libérale'" ||
        association.sector === "'commerciale ou industrielle'"
      ) {
        amount = (3559 * directorCount) / 12;
      } else {
        amount = (3575 * directorCount) / 12;
      }
    }
    // Mois 7 à 12:
    if (19 <= i && i <= 24) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        12,
        association.directorCotisations
      );
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        24,
        association.directorCotisations
      );
      const e = regularisationDirector(association.directorCotisations, 12, c);
      const v = e + d;
      if (v > 0) {
        amount = v / 6;
      } else {
        amount = 0;
      }
    }
    // Année 3
    // Mois 1 à 6:
    if (25 <= i && i <= 30) {
      amount = association.directorCotisations.year_1 / 12;
    }
    if (31 <= i && i <= 36) {
      const c = regularisationDirector(
        association.directorCotisations,
        13,
        null
      );
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        30,
        association.directorCotisations
      );
      const v = c + d;
      if (v > 0) {
        amount = v / 6;
      } else {
        amount = 0;
      }
    }
    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
function computeMicroEntrepriseSocialCharges(association) {
  const partition =
    typeof association.legal.micro_entreprise_declare_pay_cotisations ===
      "undefined" ||
    association.legal.micro_entreprise_declare_pay_cotisations === ""
      ? "Mensuellement"
      : association.legal.micro_entreprise_declare_pay_cotisations;
  if (partition === "Mensuellement") {
    return computeMicroEntrepriseSocialChargesMonthlyDeclaration(association);
  }
  if (partition === "Trimestriellement") {
    return computeMicroEntrepriseSocialChargesTrimesterDeclaration(association);
  }
}
function computeDirectorsSelfEmployed(association) {
  const { directors } = association;
  const paymentVector = directors.map((director) =>
    DirectorSsSelfEmployed(director, association)
  );
  return paymentVector.reduce(
    (acc, director) => {
      director.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function DirectorSsSelfEmployed(director, association) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount = 0;
  let recurringPurchase = 0;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    // Année 1
    // Mois 4 à Mois 12:
    if (4 <= i && i <= 12) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        i,
        association.directorCotisations
      );
      amount = (c * association.directors.length) / 9;
    }
    // Année 2
    // Mois 1 à 6
    if (13 <= i && i <= 18) {
      if (
        association.sector === "'libérale'" ||
        association.sector === "'commerciale ou industrielle'"
      ) {
        amount = (3559 * association.directors.length) / 12;
      } else {
        amount = (3575 * association.directors.length) / 12;
      }
    }
    // Mois 7 à 12:
    if (19 <= i && i <= 24) {
      const c = cotisationsProvisionnelles(
        director,
        association.sector,
        12,
        association.directorCotisations
      );
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        24,
        association.directorCotisations
      );
      const e = regularisationDirector(association.directorCotisations, 12, c);
      const v = e + d;
      if (v > 0) {
        amount = v / 6;
      } else {
        amount = 0;
      }
    }
    // Année 3
    // Mois 1 à 6:
    if (25 <= i && i <= 30) {
      amount = association.directorCotisations.year_1 / 12;
    }
    if (31 <= i && i <= 36) {
      const c = regularisationDirector(
        association.directorCotisations,
        13,
        null
      );
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        30,
        association.directorCotisations
      );
      const v = c + d;
      if (v > 0) {
        amount = v / 6;
      } else {
        amount = 0;
      }
    }
    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
function computeDirectorsEmployed(association) {
  const { directors } = association;
  const paymentVector = directors.map((director) =>
    DirectorsEmployed(director)
  );
  return paymentVector.reduce(
    (acc, director) => {
      director.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function DirectorsEmployed(director) {
  let salaries = [];
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let recurring = 0;
  let amount;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }

    if (director.compensation_partition === "Mensuelle") {
      const payment = director[`cotisations_sociales_year_${paymentYear}`];
      amount = parseInt(payment) / 12;
    }
    if (director.compensation_partition === "Personnalisée") {
      const payments = director.director_cotisation_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount =
        payment[`month_${paymentIndex}_cotisation`] === ""
          ? 0
          : parseInt(payment[`month_${paymentIndex}_cotisation`]);
    }
    if (i <= 12) {
      salaries[0][i - 1] = recurring;
    }
    if (i > 12 && i <= 24) {
      salaries[1][i - 12 - 1] = recurring;
    }
    if (i > 24 && i <= 36) {
      salaries[2][i - 24 - 1] = recurring;
    }
    recurring = amount;
  }
  return salaries;
}
export function cotisationsProvisionnelles(
  director,
  sector,
  month,
  directorCotisations
) {
  console.log(
    "director === ",
    director,
    "sector === ",
    sector,
    "month === ",
    month,
    "directorCotisations=== ",
    directorCotisations
  );
  if (month >= 4 && month <= 12) {
    if (sector === "'libérale'" || sector === "'commerciale ou industrielle'") {
      if (director.director_acre === "oui") {
        return 1408;
      } else {
        return 3559;
      }
    } else {
      if (director.director_acre === "oui") {
        return 1424;
      } else {
        return 3575;
      }
    }
  }
  if (month >= 19 && month <= 24) {
    if (sector === "'libérale'" || sector === "'commerciale ou industrielle'") {
      return directorCotisations.year_1 - 3559 * (6 / 12);
    } else {
      return directorCotisations.year_1 - 3575 * (6 / 12);
    }
  }
  if (month >= 30 && month <= 36) {
    return directorCotisations.year_2 - (directorCotisations.year_1 / 12) * 6;
  } else {
    return 0;
  }
}
export function regularisationDirector(
  directorCotisations,
  month,
  cotisationsProvisionnelles
) {
  if (month <= 12) {
    return directorCotisations.year_1 - cotisationsProvisionnelles;
  }
  if (month < 25 && month >= 13) {
    return directorCotisations.year_2 - directorCotisations.year_1;
  }
  if (month >= 25) {
    return (
      directorCotisations.year_3 -
      ((directorCotisations.year_1 / 12) * 6 +
        (directorCotisations.year_2 - (directorCotisations.year_1 / 12) * 6))
    );
  }
}
function computeMicroEntrepriseSocialChargesMonthlyDeclaration(association) {
  let charges = [];
  charges.push(new Array(12).fill(0));
  charges.push(new Array(12).fill(0));
  charges.push(new Array(12).fill(0));
  const revenues = buildRevenueSchedule(association.revenues).flat();
  const l = association.legal;
  const p = association.project;
  const acre =
    typeof l.micro_entreprise_accre_exemption === "undefined" ||
    l.micro_entreprise_accre_exemption === ""
      ? "non"
      : l.micro_entreprise_accre_exemption;
  const sectorPlacement = microEntrepriseActivityCategory.exception.includes(
    p.activity_sector
  )
    ? l.micro_entreprise_activity_category === "Vente de marchandises"
      ? "trader"
      : "serviceProvider"
    : microEntrepriseActivityCategory.trader.includes(p.activity_sector)
    ? "trader"
    : "serviceProvider";
  const socialCRT = ["year_1", "year_2", "year_3"].reduce((acc, year) => {
    acc[year] = microEntrepriseCotisation.acre[acre][sectorPlacement][year];
    return acc;
  }, {});
  let amount = 0;
  let paymentYear;
  let paymentIndex;
  let recurringPurchase = 0;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    if (4 >= i) {
      recurringPurchase += revenues[i - 1];
    }
    if (5 === i) {
      amount = recurringPurchase;
    }
    if (6 <= i && i <= 36) {
      amount = revenues[i - 2];
    }
    if (i === 13 || i === 25) {
      charges[paymentYear - 1][paymentIndex - 1] =
        amount * socialCRT[`year_${paymentYear - 1}`];
    } else {
      charges[paymentYear - 1][paymentIndex - 1] =
        amount * socialCRT[`year_${paymentYear}`];
    }
  }
  return charges;
}
function computeMicroEntrepriseSocialChargesTrimesterDeclaration(association) {
  let charges = [];
  charges.push(new Array(12).fill(0));
  charges.push(new Array(12).fill(0));
  charges.push(new Array(12).fill(0));
  const revenues = buildRevenueSchedule(association.revenues).flat();
  const l = association.legal;
  const p = association.project;
  const acre =
    typeof l.micro_entreprise_accre_exemption === "undefined" ||
    l.micro_entreprise_accre_exemption === ""
      ? "non"
      : l.micro_entreprise_accre_exemption;
  const sectorPlacement = microEntrepriseActivityCategory.exception.includes(
    p.activity_sector
  )
    ? l.micro_entreprise_activity_category === "Vente de marchandises"
      ? "trader"
      : "serviceProvider"
    : microEntrepriseActivityCategory.trader.includes(p.activity_sector)
    ? "trader"
    : "serviceProvider";
  const socialCRT = ["year_1", "year_2", "year_3"].reduce((acc, year) => {
    acc[year] = microEntrepriseCotisation.acre[acre][sectorPlacement][year];
    return acc;
  }, {});
  let amount = 0;
  let recurringPurchase = 0;
  let paymentYear;
  let paymentIndex;
  const trimesters = [7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }

    if (trimesters.includes(i)) {
      amount = recurringPurchase;
      recurringPurchase = revenues[i - 1];
    } else {
      recurringPurchase += revenues[i - 1];
    }
    if (trimesters.includes(i)) {
      charges[paymentYear - 1][paymentIndex - 1] =
        i === 13
          ? amount * socialCRT[`year_${paymentYear - 1}`]
          : amount * socialCRT[`year_${paymentYear}`];
    }
  }
  return charges;
}
/**
 * Salaires du personnel
 */
export const StaffPay = function (query) {
  this.query = query;
};
StaffPay.prototype.compute = function (association, year, month) {
  return buildStaffPay(association);
};
function buildStaffPay(association) {
  const { employees } = association;
  const employeesVector = employees.map((employee) => {
    return computeStaffPay(employee);
  });
  return employeesVector.reduce(
    (acc, employee) => {
      employee.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
export function computeStaffPay(employee) {
  let salaries = [];
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let duration;
  const paymentPlacementIndex =
    (yearIntTable[employee.year_of_hire] - 1) * 12 +
    monthIntTable[employee.date_of_hire];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }

    if (paymentPlacementIndex <= i) {
      if (employee.contract_type === "CDI") {
        amount = parseInt(employee.net_monthly_remuneration, 10);
      }
      if (employee.contract_type === "CDD") {
        duration =
          parseInt(employee.contract_duration, 10) + paymentPlacementIndex;
        if (i < duration) {
          amount = parseInt(employee.net_monthly_remuneration, 10);
        } else {
          amount = 0;
        }
      }
    } else {
      amount = 0;
    }
    if (i <= 12) {
      salaries[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      salaries[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      salaries[2][i - 24 - 1] = amount;
    }
  }
  return salaries;
}
/**
 * Charges sociales salariés
 */
export const StaffSocialSecurity = function (query) {
  this.query = query;
};
StaffSocialSecurity.prototype.compute = function (association, year, month) {
  return buildStaffSocialSecurity(association);
};
function buildStaffSocialSecurity(association) {
  const { employees } = association;
  const employeesVector = employees.map((employee) => {
    return computeStaffSocialSecurity(employee);
  });
  return employeesVector.reduce(
    (acc, employee) => {
      employee.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeStaffSocialSecurity(employee) {
  let salaries = [];
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  salaries.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurring = 0;
  let duration;
  const paymentPlacementIndex =
    (yearIntTable[employee.year_of_hire] - 1) * 12 +
    monthIntTable[employee.date_of_hire];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }

    if (paymentPlacementIndex <= i) {
      if (employee.contract_type === "CDI") {
        amount =
          parseInt(employee.gross_monthly_remuneration, 10) -
          parseInt(employee.net_monthly_remuneration, 10) +
          parseInt(employee.employer_contributions, 10);
      }
      if (employee.contract_type === "CDD") {
        duration =
          parseInt(employee.contract_duration, 10) + paymentPlacementIndex;
        if (i < duration) {
          amount =
            parseInt(employee.gross_monthly_remuneration, 10) -
            parseInt(employee.net_monthly_remuneration, 10) +
            parseInt(employee.employer_contributions, 10);
        } else {
          amount = 0;
        }
      }
    } else {
      amount = 0;
    }
    if (i <= 12) {
      salaries[0][i - 1] = recurring;
    }
    if (i > 12 && i <= 24) {
      salaries[1][i - 12 - 1] = recurring;
    }
    if (i > 24 && i <= 36) {
      salaries[2][i - 24 - 1] = recurring;
    }
    recurring = amount;
  }
  return salaries;
}
/***
 * “TVA à payer”
 * Régime de TVA = “Franchise en base de TVA” : zéro partout
 * Régime de TVA = “Réel simplifié”
 */
export const VatPayment = function (query) {
  this.query = query;
};
VatPayment.prototype.compute = function (association, year, month) {
  return buildVatPayment(association);
};
function buildVatPayment(association) {
  const { legal } = association.aggregateResources;
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return computeVatPayment(association);
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return computeVatPaymentNormal(association);
  }
  return [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
}
export function computeVatPayment(association) {
  let VatPayments = [];
  VatPayments.push(new Array(12).fill(0));
  VatPayments.push(new Array(12).fill(0));
  VatPayments.push(new Array(12).fill(0));
  let payment = 0;
  let vatInvestmentsYear1;
  let vatInvestmentsYear2;
  const { revenues, revenueSources, expenses, investments } =
    association.aggregateResources;
  const { refund } = association;
  let vatDeposit = 0;
  let vatDepositTotal = 0;
  let vatPaymentyear3_5 = 0;
  let vatPaymentyear1_7 = 0;
  let vatPaymentyear1_12 = 0;
  for (let i = 1; i <= 36; i++) {
    if (i === 7) {
      const vatOnRevenues = computeVatOnRevenuesFirstSixMonths(revenues);
      const vatOnResourceSources = computeVatOnRevenueSourcesFirstSixMonths(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases = vatOnPurchasesMonthly(revenues);
      const vatOnExpenses = computeVatOnExpensesFirstSixMonths(expenses);
      const vatOnInvestments = vatOnInvestmentsMonthly(investments);
      let s = vatOnRevenues + vatOnResourceSources;
      let z = annualBasedVatPurchases + vatOnExpenses + vatOnInvestments;

      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;

      vatPaymentyear1_7 = payment;
    } else if (i === 12) {
      const vatOnRevenues = computeVatSevenTwelveMonths(revenues);
      const vatOnResourceSources = computeVatOnRevenueSourcesSixTwelveMonths(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases =
        vatOnPurchasesMonthlySevenTwelve(revenues);

      const vatOnExpenses = computeVatOnExpensesSevenElevenMonths(expenses);
      const vatOnInvestments = vatOnInvestmentsMonthSevenEleven(investments);
      let s = vatOnRevenues + vatOnResourceSources;
      let z = annualBasedVatPurchases + vatOnExpenses + vatOnInvestments;

      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;
      vatPaymentyear1_12 = payment;
    } else if (i === 17) {
      const vatOnRevenues = computeVatOnRevenues(revenues, 12);
      const vatOnResourceSources = computeVatOnRevenueSources(
        revenueSources,
        yearLabel["year_1"]
      );
      const annualBasedVatPurchases = computeAnnualBasedVatPurchases(
        revenues,
        "year_1"
      );
      const vatOnExpenses = computeVatOnExpenses(expenses, 12);
      const vatOnInvestments = computeVatOnInvestments(investments, 12);
      vatInvestmentsYear1 = vatOnInvestments;
      let s = vatOnRevenues + vatOnResourceSources;
      let z =
        annualBasedVatPurchases +
        vatOnExpenses +
        vatOnInvestments +
        vatPaymentyear1_7 +
        vatPaymentyear1_12;
      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;
      vatDeposit = payment;
    } else if (i === 29) {
      const vatOnRevenues = computeVatOnRevenues(revenues, 24);
      const vatOnResourceSources = computeVatOnRevenueSources(
        revenueSources,
        yearLabel["year_2"]
      );
      const annualBasedVatPurchases = computeAnnualBasedVatPurchases(
        revenues,
        "year_2"
      );
      const vatOnExpenses = computeVatOnExpenses(expenses, 24);
      const vatOnInvestments = computeVatOnInvestments(investments, 24);
      vatInvestmentsYear2 = vatOnInvestments;
      let s = vatOnRevenues + vatOnResourceSources;
      let z =
        annualBasedVatPurchases +
        vatOnExpenses +
        vatOnInvestments +
        vatDepositTotal;
      let c = 0;
      if (s > z) {
        c = s - z;
      }
      payment = c;
      vatPaymentyear3_5 = c;
    } else if (i === 31) {
      const g =
        vatPaymentyear3_5 +
        vatDepositTotal -
        refund[2]["month_5"] +
        vatInvestmentsYear2;
      if (g > 1000) {
        payment = g * (55 / 100);
      } else {
        payment = 0;
      }
    } else if (i === 36) {
      const g =
        vatPaymentyear3_5 +
        vatDepositTotal -
        refund[2]["month_5"] +
        vatInvestmentsYear2;
      if (g > 1000) {
        payment = g * (40 / 100);
      } else {
        payment = 0;
      }
    } else {
      payment = 0;
    }

    if (i <= 12) {
      VatPayments[0][i - 1] = payment;
    }
    if (i > 12 && i <= 24) {
      if (i === 19) {
        // TVA à payer Année 2 mois 5 -
        // Remboursement TVA Année 2 mois 5 +
        // TVA sur investissements année 1
        const c =
          vatDeposit +
          vatPaymentyear1_7 +
          vatPaymentyear1_12 -
          refund[1]["month_5"] +
          vatInvestmentsYear1;
        if (c > 1000) {
          vatDepositTotal += c * (55 / 100);
        }
        VatPayments[1][i - 12 - 1] = vatDepositTotal;
      } else if (i === 24) {
        //  TVA à payer Année 2 mois 5 -
        //  Remboursement TVA Année 2 mois 5  +
        //  TVA sur investissements année 1
        const c =
          vatDeposit +
          vatPaymentyear1_7 +
          vatPaymentyear1_12 -
          refund[1]["month_5"] +
          vatInvestmentsYear1;
        let vatPaid = 0;
        if (c > 1000) {
          vatDepositTotal += c * (40 / 100);
          vatPaid = c * (40 / 100);
        }
        VatPayments[1][i - 12 - 1] = vatPaid;
      } else {
        VatPayments[1][i - 12 - 1] = payment;
      }
    }
    if (i > 24 && i <= 36) {
      VatPayments[2][i - 24 - 1] = payment;
    }
  }
  return VatPayments;
}
export function computeVatPaymentNormal(association) {
  const { revenues, revenueSources, expenses, investments } =
    association.aggregateResources;
  const vatRevenues = vatOnRevenuesMonthlyBased(revenues);
  const vatRevenuesSources = vatOnRevenuesSourcesMonthlyBased(revenueSources);
  const vatPurcahes = vatOnPurchasesMonthlyBased(revenues);
  const vatExpenses = vatOnExpensesMonthlyBased(expenses);
  const vatInvestments = vatOnInvestmentsMonthlyBased(investments);
  const composedVatRevenues = vatRevenues.reduce((acc, year, i) => {
    year.reduce((a, j, k) => {
      a[k] += j;
      return a;
    }, acc[i]);
    return acc;
  }, vatRevenuesSources);
  const composedPurchases = vatPurcahes.reduce((acc, year, i) => {
    year.reduce((a, j, k) => {
      a[k] += j;
      return a;
    }, acc[i]);
    return acc;
  }, vatExpenses);
  const composeExpenseInvestmentPurchase = vatInvestments.reduce(
    (acc, year, i) => {
      year.reduce((a, j, k) => {
        a[k] += j;
        return a;
      }, acc[i]);
      return acc;
    },
    composedPurchases
  );
  let vatComposedReal = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  composeExpenseInvestmentPurchase.reduce((acc, year, i) => {
    year.reduce((a, n, k) => {
      if (a[k] > n) {
        vatComposedReal[i][k] = a[k] - n;
      }
      return a;
    }, acc[i]);
    return acc;
  }, composedVatRevenues);
  return vatComposedReal;
}
function computeVatOnRevenuesFirstSixMonths(revenues) {
  const paymentYear = 1;
  return revenues.reduce((acc, revenue) => {
    let amount = 0;
    if (revenue.revenue_partition === "Personnalisée") {
      const payments = revenue.revenue_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount = new Array(6).fill(0).reduce((acc, month, index) => {
        const paymentIndex = index + 1;
        acc +=
          payment[`month_${paymentIndex}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${paymentIndex}_amount`]);
        return acc;
      }, 0);
    }
    if (revenue.revenue_partition === "Mensuelle") {
      const payment = revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
      amount = parseInt(payment) / 2;
    }
    const vat = revenue["vat_rate_revenue"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    acc += amount * rate;
    return acc;
  }, 0);
}
function computeVatSevenTwelveMonths(revenues) {
  const paymentYear = 1;
  return revenues.reduce((acc, revenue) => {
    let amount = 0;
    if (revenue.revenue_partition === "Personnalisée") {
      const payments = revenue.revenue_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount = new Array(5).fill(0).reduce((acc, month, index) => {
        const paymentIndex = index + 7;
        acc +=
          payment[`month_${paymentIndex}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${paymentIndex}_amount`]);
        return acc;
      }, 0);
    }
    if (revenue.revenue_partition === "Mensuelle") {
      const payment = revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
      amount = (parseInt(payment) / 12) * 5;
    }
    const vat = revenue["vat_rate_revenue"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    acc += amount * rate;
    return acc;
  }, 0);
}
export function computeVatOnRevenues(revenues, month) {
  return revenues.reduce((acc, revenue) => {
    let amount = 0;
    if (month <= 12) {
      amount = revenue.annual_amount_tax_excluded_year_1;
    }
    if (month > 12 && month <= 24) {
      amount = revenue.annual_amount_tax_excluded_year_2;
    }
    if (month > 24) {
      amount = revenue.annual_amount_tax_excluded_year_3;
    }
    const vat = revenue["vat_rate_revenue"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    acc += amount * rate;
    return acc;
  }, 0);
}
export function computeVatOnRevenueSourcesFirstSixMonths(revenueSources, year) {
  return revenueSources.reduce((acc, revenueSource) => {
    if (
      revenueSource.source_type === "Autre produit d'exploitation" &&
      revenueSource.year === year
    ) {
      const vat = revenueSource["vat_rate"];
      const rate =
        vat === ""
          ? 0
          : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
      const payment = (revenueSource["amount_excluding_taxes"] / 2) * rate;
      let j =
        (yearIntTable[revenueSource["year"]] - 1) * 12 +
        monthIntTable[revenueSource["month"]];
      acc += 6 >= j ? parseInt(payment) : 0;
    }
    return acc;
  }, 0);
}
export function computeVatOnRevenueSourcesSixTwelveMonths(
  revenueSources,
  year
) {
  return revenueSources.reduce((acc, revenueSource) => {
    if (
      revenueSource.source_type === "Autre produit d'exploitation" &&
      revenueSource.year === year
    ) {
      const vat = revenueSource["vat_rate"];
      const rate =
        vat === ""
          ? 0
          : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
      const payment = (revenueSource["amount_excluding_taxes"] / 2) * rate;
      let j =
        (yearIntTable[revenueSource["year"]] - 1) * 12 +
        monthIntTable[revenueSource["month"]];
      acc += 6 < j && j < 12 ? parseInt(payment) : 0;
    }
    return acc;
  }, 0);
}
export function computeVatOnRevenueSources(revenueSources, year) {
  return revenueSources.reduce((acc, revenueSource) => {
    if (
      revenueSource.source_type === "Autre produit d'exploitation" &&
      revenueSource.year === year
    ) {
      const vat = revenueSource["vat_rate"];
      const rate =
        vat === ""
          ? 0
          : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
      acc += revenueSource["amount_excluding_taxes"] * rate;
    }
    return acc;
  }, 0);
}
export function computeAnnualBasedVatPurchases(revenues, year) {
  const purchases = revenues.reduce((acc, revenue) => {
    const vat = revenue["vat_rate_on_purchases"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    if (year === "year_1") {
      acc += computePurchasesYear1(revenue) * rate;
    }
    if (year === "year_2") {
      acc += computePurchasesYear2(revenue) * rate;
    }
    if (year === "year_3") {
      acc += computePurchasesYear3(revenue) * rate;
    }
    return acc;
  }, 0);
  return purchases;
}
function computePurchasesYear1(revenue) {
  if (revenue.inventory_linked_revenue === "Oui") {
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    const averageStock = parseInt(revenue.mean_valuation_of_stock, 10);
    const annualAmountTaxExcluded = parseInt(
      revenue.annual_amount_tax_excluded_year_1,
      10
    );
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const indicator =
      valuationStartingStock - annualAmountTaxExcluded * (1 - percentageMargin);
    if (averageStock > indicator) {
      const purchases =
        averageStock -
        (valuationStartingStock -
          annualAmountTaxExcluded * (1 - percentageMargin));
      return valuationStartingStock + purchases;
    }
    return valuationStartingStock;
  }
  return 0;
}
function computePurchasesYear2(revenue) {
  let purchases = 0;
  if (revenue.inventory_linked_revenue === "Oui") {
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    const annualAmountTaxExcluded = parseInt(
      revenue.annual_amount_tax_excluded_year_1,
      10
    );
    const annualAmountTaxExcludedYear2 = parseInt(
      revenue.annual_amount_tax_excluded_year_2,
      10
    );
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const averageStock = parseInt(revenue.mean_valuation_of_stock, 10);
    const indicator =
      valuationStartingStock -
        annualAmountTaxExcluded * (1 - percentageMargin) <
      averageStock;
    let endYear1Stock;
    if (indicator) {
      endYear1Stock = averageStock;
    } else {
      endYear1Stock =
        valuationStartingStock -
        annualAmountTaxExcluded * (1 - percentageMargin);
    }
    const indicatorOnPurchases =
      averageStock >
      endYear1Stock - annualAmountTaxExcludedYear2 * (1 - percentageMargin);
    if (indicatorOnPurchases) {
      purchases =
        averageStock -
        (endYear1Stock - annualAmountTaxExcludedYear2 * (1 - percentageMargin));
    }
    return purchases;
  }
  return purchases;
}
function computePurchasesYear3(revenue) {
  let purchases = 0;
  if (revenue.inventory_linked_revenue === "Oui") {
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    const annualAmountTaxExcluded = parseInt(
      revenue.annual_amount_tax_excluded_year_1,
      10
    );
    const annualAmountTaxExcludedYear2 = parseInt(
      revenue.annual_amount_tax_excluded_year_2,
      10
    );
    const annualAmountTaxExcludedYear3 = parseInt(
      revenue.annual_amount_tax_excluded_year_3,
      10
    );
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const averageStock = parseInt(revenue.mean_valuation_of_stock, 10);
    const indicator =
      valuationStartingStock -
        (annualAmountTaxExcluded + annualAmountTaxExcludedYear2) *
          (1 - percentageMargin) <
      averageStock;
    let endYear2Stock;
    if (indicator) {
      endYear2Stock = averageStock;
    } else {
      endYear2Stock =
        valuationStartingStock -
        (annualAmountTaxExcluded + annualAmountTaxExcludedYear2) *
          (1 - percentageMargin);
    }
    const indicatorOnPurchases =
      averageStock >
      endYear2Stock - annualAmountTaxExcludedYear3 * (1 - percentageMargin);

    if (indicatorOnPurchases) {
      purchases =
        averageStock -
        (endYear2Stock - annualAmountTaxExcludedYear3 * (1 - percentageMargin));
    }
    return purchases;
  }
  return purchases;
}
function vatOnPurchasesMonthly(revenues) {
  const paymentVector = revenues.map((revenue) =>
    computeVatOnPurchasesMonthly(revenue)
  );
  return paymentVector
    .reduce((acc, revenue) => {
      return revenue.reduce((acc0, month, k) => {
        acc0[k] += month;
        return acc0;
      }, acc);
    }, new Array(6).fill(0))
    .reduce((acc, v) => {
      acc += v;
      return acc;
    }, 0);
}
function vatOnPurchasesMonthlySevenTwelve(revenues) {
  const paymentVector = revenues.map((revenue) =>
    computeVatOnPurchaseSevenTwelve(revenue)
  );
  return paymentVector
    .reduce((acc, revenue) => {
      return revenue.reduce((acc0, month, k) => {
        acc0[k] += month;
        return acc0;
      }, acc);
    }, new Array(5).fill(0))
    .reduce((acc, v) => {
      acc += v;
      return acc;
    }, 0);
}
function computeVatOnPurchasesMonthly(revenue) {
  let purchases = new Array(6).fill(0);
  if (revenue.inventory_linked_revenue === "Oui") {
    const paymentYear = 1;
    let amount = 0;
    let recurringPurchase = 0;
    let amountEndOfMonth = 0;
    const amountAveragestock = parseInt(revenue.mean_valuation_of_stock, 10);
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const vat = revenue["vat_rate_on_purchases"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    let yearOneMonth = valuationStartingStock * rate;
    let runningSum = 0;
    for (let i = 1; i <= 6; i++) {
      if (i === 1) {
        purchases[i - 1] = 0;
      } else if (i === 2) {
        purchases[i - 1] = recurringPurchase * rate + yearOneMonth;
      } else {
        purchases[i - 1] = recurringPurchase * rate;
      }
      if (revenue.revenue_partition === "Personnalisée") {
        const payments = revenue.revenue_years;
        const payment = payments.find((p) => p.year === `year_${paymentYear}`);
        amount =
          payment[`month_${i}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${i}_amount`]);
      }
      if (revenue.revenue_partition === "Mensuelle") {
        const payment =
          revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
        amount = parseInt(payment) / 12;
      }
      if (i === 1) {
        const c = valuationStartingStock - amount * (1 - percentageMargin);
        if (amountAveragestock > c) {
          recurringPurchase = amountAveragestock - c;
        }
      } else {
        const indicatorOnPurchases =
          amountAveragestock >
          amountEndOfMonth - amount * (1 - percentageMargin);

        if (indicatorOnPurchases) {
          recurringPurchase =
            amountAveragestock -
            (amountEndOfMonth - amount * (1 - percentageMargin));
        } else {
          recurringPurchase = 0;
        }
      }
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
    }
  }
  return purchases;
}
function computeVatOnPurchaseSevenTwelve(revenue) {
  let purchases = new Array(5).fill(0);
  if (revenue.inventory_linked_revenue === "Oui") {
    const paymentYear = 1;
    let amount = 0;
    let recurringPurchase = 0;
    let amountEndOfMonth = 0;
    const amountAveragestock = parseInt(revenue.mean_valuation_of_stock, 10);
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const vat = revenue["vat_rate_on_purchases"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    let runningSum = 0;
    for (let i = 1; i < 12; i++) {
      if (i > 6) {
        purchases[i - 7] = recurringPurchase * rate;
      }
      if (revenue.revenue_partition === "Personnalisée") {
        const payments = revenue.revenue_years;
        const payment = payments.find((p) => p.year === `year_${paymentYear}`);
        amount =
          payment[`month_${i}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${i}_amount`]);
      }
      if (revenue.revenue_partition === "Mensuelle") {
        const payment =
          revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
        amount = parseInt(payment) / 12;
      }
      if (i === 1) {
        const c = valuationStartingStock - amount * (1 - percentageMargin);
        if (amountAveragestock > c) {
          recurringPurchase = amountAveragestock - c;
        }
      } else {
        const indicatorOnPurchases =
          amountAveragestock >
          amountEndOfMonth - amount * (1 - percentageMargin);

        if (indicatorOnPurchases) {
          recurringPurchase =
            amountAveragestock -
            (amountEndOfMonth - amount * (1 - percentageMargin));
        } else {
          recurringPurchase = 0;
        }
      }
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
    }
  }
  return purchases;
}
export function computeVatOnExpensesFirstSixMonths(expenses) {
  const paymentVector = expenses.map((expense) =>
    computeVatOnExpensesMonthly(expense)
  );
  return paymentVector.reduce((acc, expense) => {
    acc += expense;
    return acc;
  }, 0);
}
export function computeVatOnExpensesSevenElevenMonths(expenses) {
  const paymentVector = expenses.map((expense) =>
    vatOnExpensesSevenElevenMonths(expense)
  );
  return paymentVector.reduce((acc, expense) => {
    acc += expense;
    return acc;
  }, 0);
}
function computeVatOnExpensesMonthly(expense) {
  let purchases = 0;
  let amount;
  const vat = expense["vat_rate_expenditure"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;

  const payment = expense["annual_amount_tax_inc_1"];
  if (expense.expenditure_partition === "Mensuelle") {
    amount = parseInt(payment) / 2;
  }
  if (expense.expenditure_partition === "Trimestrielle") {
    amount = parseInt(payment) / 2;
  }
  if (expense.expenditure_partition === "Semestrielle") {
    amount = parseInt(payment) / 2;
  }
  if (expense.expenditure_partition === "Annuelle (début d'année)") {
    amount = parseInt(payment);
  }
  if (expense.expenditure_partition === "Annuelle (fin d'année)") {
    amount = 0;
  }
  if (expense.expenditure_partition === "Ponctuelle") {
    let j =
      (yearIntTable[expense["one_time_payment_year"]] - 1) * 12 +
      monthIntTable[expense["one_time_payment_month"]];
    amount = 6 <= j ? parseInt(payment) : 0;
  }
  purchases = amount * rate;
  return purchases;
}
function vatOnExpensesSevenElevenMonths(expense) {
  let purchases = 0;
  let amount;
  const vat = expense["vat_rate_expenditure"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;

  const payment = expense["annual_amount_tax_inc_1"];
  if (expense.expenditure_partition === "Mensuelle") {
    amount = (parseInt(payment) / 12) * 5;
  }
  if (expense.expenditure_partition === "Trimestrielle") {
    amount = parseInt(payment) / 4;
  }
  if (expense.expenditure_partition === "Semestrielle") {
    amount = 0;
  }
  if (expense.expenditure_partition === "Annuelle (début d'année)") {
    amount = 0;
  }
  if (expense.expenditure_partition === "Annuelle (fin d'année)") {
    amount = 0;
  }
  if (expense.expenditure_partition === "Ponctuelle") {
    let j =
      (yearIntTable[expense["one_time_payment_year"]] - 1) * 12 +
      monthIntTable[expense["one_time_payment_month"]];
    amount = 7 <= j && j < 12 ? parseInt(payment) : 0;
  }
  purchases = amount * rate;
  return purchases;
}
export function computeVatOnExpenses(expenses, month) {
  return expenses.reduce((acc, expense) => {
    let amount = 0;
    if (month <= 12) {
      amount = expense["annual_amount_tax_inc_1"];
    }
    if (month > 12 && month <= 24) {
      amount = expense["annual_amount_tax_inc_2"];
    }
    if (month > 24) {
      amount = expense["annual_amount_tax_inc_3"];
    }
    const vat = expense["vat_rate_expenditure"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    acc += amount * rate;
    return acc;
  }, 0);
}
export function computeVatOnInvestments(investments, month) {
  return investments.reduce((acc, investment) => {
    if (investment["contribution"] === "Non") {
      const paymentPlacementIndex =
        (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
        monthIntTable[investment["month_of_purchase"]];
      let amount = 0;
      if (month <= 12 && paymentPlacementIndex <= 12) {
        amount = investment["investment_amount_tax_included"];
      }
      if (
        month > 12 &&
        month <= 24 &&
        paymentPlacementIndex > 12 &&
        paymentPlacementIndex <= 24
      ) {
        amount = investment["investment_amount_tax_included"];
      }
      if (month > 24 && paymentPlacementIndex > 24) {
        amount = investment["investment_amount_tax_included"];
      }
      const vat = investment["vat_rate_on_investment"];
      const rate =
        vat === ""
          ? 0
          : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
      acc += amount * rate;
    }
    return acc;
  }, 0);
}
function vatOnInvestmentsMonthly(investments) {
  const paymentVector = investments.map((investment) => {
    if (investment["contribution"] === "Non") {
      return computeVatOnInvestmentsMonthly(investment);
    }
    return 0;
  });
  return paymentVector.reduce((acc, investment) => {
    acc += investment;
    return acc;
  }, 0);
}
function computeVatOnInvestmentsMonthly(investment) {
  let purchases = 0;
  let amount;
  const vat = investment["vat_rate_on_investment"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const paymentPlacementIndex =
    (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
    monthIntTable[investment["month_of_purchase"]];

  if (paymentPlacementIndex <= 6) {
    const payment = investment["investment_amount_tax_included"];
    amount = parseInt(payment);
  } else {
    amount = 0;
  }
  purchases = amount * rate;
  return purchases;
}
function vatOnInvestmentsMonthSevenEleven(investments) {
  const paymentVector = investments.map((investment) => {
    if (investment["contribution"] === "Non") {
      return computeVatOnInvestmentsSevenEleven(investment);
    }
    return 0;
  });
  return paymentVector.reduce((acc, investment) => {
    acc += investment;
    return acc;
  }, 0);
}
function computeVatOnInvestmentsSevenEleven(investment) {
  let purchases = 0;
  let amount;
  const vat = investment["vat_rate_on_investment"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const paymentPlacementIndex =
    (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
    monthIntTable[investment["month_of_purchase"]];

  if (paymentPlacementIndex > 6 && paymentPlacementIndex < 12) {
    const payment = investment["investment_amount_tax_included"];
    amount = parseInt(payment);
  } else {
    amount = 0;
  }
  purchases = amount * rate;
  return purchases;
}
/***
 * “TVA à payer”
 * Régime de TVA = “Réel normal”
 */
function vatOnRevenuesMonthlyBased(revenues) {
  const paymentVector = revenues.map((revenue) =>
    computeVatOnRevenuesMonthlyBased(revenue)
  );
  return paymentVector.reduce(
    (acc, revenue) => {
      revenue.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeVatOnRevenuesMonthlyBased(revenue) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurringPurchase = 0;
  const vat = revenue["vat_rate_revenue"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    if (revenue.revenue_partition === "Personnalisée") {
      const payments = revenue.revenue_years;
      const payment = payments.find((p) => p.year === `year_${paymentYear}`);
      amount =
        payment[`month_${paymentIndex}_amount`] === ""
          ? 0
          : parseInt(payment[`month_${paymentIndex}_amount`]);
    }
    if (revenue.revenue_partition === "Mensuelle") {
      const payment = revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
      amount = parseInt(payment) / 12;
    }

    if (i <= 12) {
      purchases[0][i - 1] = recurringPurchase * rate;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = recurringPurchase * rate;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = recurringPurchase * rate;
    }
    recurringPurchase = amount;
  }
  return purchases;
}
function vatOnRevenuesSourcesMonthlyBased(revenueSources) {
  const paymentVector = revenueSources.map((revenueSource) => {
    if (revenueSource.source_type === "Autre produit d'exploitation") {
      return computeVatOnRevenuesSourcesMonthlyBased(revenueSource);
    }
    return [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
  });
  return paymentVector.reduce(
    (acc, revenueSource) => {
      revenueSource.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeVatOnRevenuesSourcesMonthlyBased(revenueSource) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurringPurchase = 0;
  const vat = revenueSource["vat_rate"];
  let paymentPlacementIndex =
    (yearIntTable[revenueSource["year"]] - 1) * 12 +
    monthIntTable[revenueSource["month"]];

  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  for (let i = 1; i <= 36; i++) {
    if (paymentPlacementIndex === i) {
      amount = revenueSource["amount_excluding_taxes"];
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = recurringPurchase * rate;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = recurringPurchase * rate;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = recurringPurchase * rate;
    }
    recurringPurchase = amount;
  }
  return purchases;
}
function vatOnPurchasesMonthlyBased(revenues) {
  const paymentVector = revenues.map((revenue) =>
    computeVatOnPurchasesMonthlyBased(revenue)
  );
  return paymentVector.reduce(
    (acc, revenue) => {
      revenue.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeVatOnPurchasesMonthlyBased(revenue) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  if (revenue.inventory_linked_revenue === "Oui") {
    let paymentYear;
    let paymentIndex;
    let amount = 0;
    let recurringPurchase = 0;
    let amountEndOfMonth = 0;
    const amountAveragestock = parseInt(revenue.mean_valuation_of_stock, 10);
    const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
    const vat = revenue["vat_rate_on_purchases"];
    const rate =
      vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
    const valuationStartingStock = parseInt(
      revenue.valuation_of_starting_stock,
      10
    );
    let yearOneMonth = valuationStartingStock * rate;
    let runningSum = 0;
    for (let i = 1; i <= 36; i++) {
      if (i <= 12) {
        paymentYear = 1;
        paymentIndex = i;
      }
      if (i > 12 && i <= 24) {
        paymentYear = 2;
        paymentIndex = i - 12;
      }
      if (i > 24 && i <= 36) {
        paymentYear = 3;
        paymentIndex = i - 24;
      }
      if (i <= 12) {
        if (i === 1) {
          purchases[0][i - 1] = 0;
        } else if (i === 2) {
          purchases[0][i - 1] = recurringPurchase * rate + yearOneMonth;
        } else {
          purchases[0][i - 1] = recurringPurchase * rate;
        }
      }
      if (i > 12 && i <= 24) {
        purchases[1][i - 12 - 1] = recurringPurchase * rate;
      }
      if (i > 24 && i <= 36) {
        purchases[2][i - 24 - 1] = recurringPurchase * rate;
      }
      if (revenue.revenue_partition === "Personnalisée") {
        const payments = revenue.revenue_years;
        const payment = payments.find((p) => p.year === `year_${paymentYear}`);
        amount =
          payment[`month_${paymentIndex}_amount`] === ""
            ? 0
            : parseInt(payment[`month_${paymentIndex}_amount`]);
      }
      if (revenue.revenue_partition === "Mensuelle") {
        const payment =
          revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
        amount = parseInt(payment) / 12;
      }
      if (i === 1) {
        const c = valuationStartingStock - amount * (1 - percentageMargin);
        if (amountAveragestock > c) {
          recurringPurchase = amountAveragestock - c;
        }
      } else {
        const indicatorOnPurchases =
          amountAveragestock >
          amountEndOfMonth - amount * (1 - percentageMargin);

        if (indicatorOnPurchases) {
          recurringPurchase =
            amountAveragestock -
            (amountEndOfMonth - amount * (1 - percentageMargin));
        } else {
          recurringPurchase = 0;
        }
      }
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
    }
  }
  return purchases;
}
export function computeEndOfMonthStockValue(
  valuationStartingStock,
  runningSum,
  percentageMargin,
  amountAveragestock
) {
  const indicator =
    valuationStartingStock - runningSum * (1 - percentageMargin);
  if (indicator < amountAveragestock) {
    return amountAveragestock;
  }
  return indicator;
}
function vatOnExpensesMonthlyBased(expenses) {
  const paymentVector = expenses.map((expense) =>
    computeVatOnExpensesMonthlyBased(expense)
  );
  return paymentVector.reduce(
    (acc, expense) => {
      expense.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeVatOnExpensesMonthlyBased(expense) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurringPurchase = 0;
  const vat = expense["vat_rate_expenditure"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    const payment = expense[`annual_amount_tax_inc_${paymentYear}`];
    if (expense.expenditure_partition === "Mensuelle") {
      amount = parseInt(payment) / 12;
    }
    if (expense.expenditure_partition === "Trimestrielle") {
      let m = ((paymentYear - 1) * 12 + i) % 3;
      amount = m === 0 ? parseInt(payment) / 4 : 0;
    }
    if (expense.expenditure_partition === "Semestrielle") {
      let m = ((paymentYear - 1) * 12 + i) % 6;
      amount = m === 0 ? parseInt(payment) / 2 : 0;
    }
    if (expense.expenditure_partition === "Annuelle (début d'année)") {
      let m = [1, 13, 25];
      amount = m.includes(i) ? parseInt(payment) : 0;
    }
    if (expense.expenditure_partition === "Annuelle (fin d'année)") {
      let m = [12, 24, 36];
      amount = m.includes(i) ? parseInt(payment) : 0;
    }
    if (expense.expenditure_partition === "Ponctuelle") {
      let j =
        (yearIntTable[expense["one_time_payment_year"]] - 1) * 12 +
        monthIntTable[expense["one_time_payment_month"]];
      amount = i === j ? parseInt(payment) : 0;
    }
    if (i <= 12) {
      purchases[0][i - 1] = recurringPurchase * rate;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = recurringPurchase * rate;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = recurringPurchase * rate;
    }
    recurringPurchase = amount;
  }
  return purchases;
}
function vatOnInvestmentsMonthlyBased(investments) {
  const paymentVector = investments.map((investment) => {
    if (investment["contribution"] === "Non") {
      return computeVatOnInvestmentsMonthlyBased(investment);
    }
    return [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
  });
  return paymentVector.reduce(
    (acc, investment) => {
      investment.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
function computeVatOnInvestmentsMonthlyBased(investment) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let paymentYear;
  let paymentIndex;
  let amount;
  let recurringPurchase = 0;
  const vat = investment["vat_rate_on_investment"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const paymentPlacementIndex =
    (yearIntTable[investment["year_of_purchase"]] - 1) * 12 +
    monthIntTable[investment["month_of_purchase"]];
  for (let i = 1; i <= 36; i++) {
    if (i <= 12) {
      paymentYear = 1;
      paymentIndex = i;
    }
    if (i > 12 && i <= 24) {
      paymentYear = 2;
      paymentIndex = i - 12;
    }
    if (i > 24 && i <= 36) {
      paymentYear = 3;
      paymentIndex = i - 24;
    }
    if (paymentPlacementIndex === i) {
      const payment = investment["investment_amount_tax_included"];
      amount = parseInt(payment);
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = recurringPurchase * rate;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = recurringPurchase * rate;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = recurringPurchase * rate;
    }

    recurringPurchase = amount;
  }
  return purchases;
}

/**
 * IS
 */
export const IncomeTax = function (query) {
  this.query = query;
};
IncomeTax.prototype.compute = function (association, year, month) {
  return computeIncomeTax(association);
};
function computeIncomeTax(association) {
  const { annualIncomeTax } = association;
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let amount = 0;
  let year3Tax = 0;
  let year3TaxMonth9 = 0;
  for (let i = 1; i <= 36; i++) {
    // Année 2 mois 4 :
    //   “IS en Année 1 dans le compte de résultat”
    if (i == 16) {
      amount = annualIncomeTax.year_1;
    }
    // Année 2 mois 6 : si “IS
    // en Année 1 dans le compte de résultat” > ou = “3000” alors
    // (“IS en Année 1 dans le compte de résultat” / 2)
    // sinon “0”
    else if (i == 18) {
      if (annualIncomeTax.year_1 >= 3000) {
        amount = annualIncomeTax.year_1 / 2;
      } else {
        amount = 0;
      }
    }
    // Année 2 mois 9 : si “IS
    // en Année 1 dans le compte de résultat” > ou = “3000” alors
    // (“IS en Année 1 dans le compte de résultat” / 4) sinon “0”
    else if (i === 21) {
      if (annualIncomeTax.year_1 >= 3000) {
        amount = annualIncomeTax.year_1 / 4;
      } else {
        amount = 0;
      }
    }
    //     Année 2 mois 12 = Année 2 mois 9

    // Année 3 mois 3 = Année 2 mois 9
    else if (i === 24 || i === 27) {
      if (annualIncomeTax.year_1 >= 3000) {
        amount = annualIncomeTax.year_1 / 4;
        year3Tax = amount;
      } else {
        amount = 0;
        year3Tax = amount;
      }
    } else if (i === 28) {
      if (
        annualIncomeTax.year_2 > 0 &&
        annualIncomeTax.year_1 > 3000 &&
        annualIncomeTax.year_2 > annualIncomeTax.year_1
      ) {
        amount = annualIncomeTax.year_2 - annualIncomeTax.year_1;
      } else {
        if (annualIncomeTax.year_1 < 3000) {
          amount = annualIncomeTax.year_2;
        } else {
          amount = 0;
        }
      }
    } else if (i === 30) {
      if (annualIncomeTax.year_2 >= 3000) {
        amount = annualIncomeTax.year_2 / 2 - year3Tax;
      } else {
        amount = 0;
      }
    } else if (i === 33) {
      if (annualIncomeTax.year_2 >= 3000) {
        amount = annualIncomeTax.year_2 / 4;
        year3TaxMonth9 = amount;
      } else {
        amount = 0;
        year3TaxMonth9 = amount;
      }
    } else if (i === 36) {
      amount = year3TaxMonth9;
    } else {
      amount = 0;
    }

    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
/**
 * Autres impôts et taxes
 */
export const OtherTaxes = function (query) {
  this.query = query;
};
OtherTaxes.prototype.compute = function (association, year, month) {
  return computeOtherTaxes(association);
};
function computeOtherTaxes(association) {
  const { annualIncomeTax } = association;
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let amount = 0;
  for (let i = 1; i <= 36; i++) {
    // Année 2 mois 2 : “Impôts et taxes en Année 1 dans le compte de résultat”
    if (i == 14) {
      amount = annualIncomeTax.year_1;
    }
    // Année 3 mois 2 : “Impôts et taxes en Année 2 dans le compte de résultat”
    else if (i == 26) {
      amount = annualIncomeTax.year_2;
    } else {
      amount = 0;
    }
    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
/**
 * C/C d’associé
 */
export const ReimbursementsPartners = function (query) {
  this.query = query;
};
ReimbursementsPartners.prototype.compute = function (association, year, month) {
  const { associatesCapitalContributions } = association;
  return buildReimbursementsPartners(associatesCapitalContributions);
};
export function buildReimbursementsPartners(associatesCapitalContributions) {
  const paymentVector = associatesCapitalContributions.map(
    (associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Remboursement de compte courant d'associé"
      ) {
        return computeReimbursementsPartnersVector(
          associatesCapitalContribution
        );
      }
      return [
        new Array(12).fill(0),
        new Array(12).fill(0),
        new Array(12).fill(0),
      ];
    }
  );
  return paymentVector.reduce(
    (acc, associatesCapitalContribution) => {
      associatesCapitalContribution.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}
export function computeReimbursementsPartnersVector(
  associatesCapitalContribution
) {
  let purchases = [];
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  purchases.push(new Array(12).fill(0));
  let amount;
  const paymentPlacementIndex =
    (yearIntTable[
      associatesCapitalContribution["year_of_contribution_repayment"]
    ] -
      1) *
      12 +
    monthIntTable[
      associatesCapitalContribution["month_of_contribution_repayment"]
    ];
  for (let i = 1; i <= 36; i++) {
    if (paymentPlacementIndex === i) {
      const payment =
        associatesCapitalContribution["associate_capital_contribution_amount"];
      amount = parseInt(payment);
    } else {
      amount = 0;
    }
    if (i <= 12) {
      purchases[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      purchases[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      purchases[2][i - 24 - 1] = amount;
    }
  }
  return purchases;
}
/**
 * Échéances d’emprunt
 */
export const DebtRepayments = function (query) {
  this.query = query;
};
DebtRepayments.prototype.compute = function (association, year, month) {
  const { loans } = association;
  return buildDebtRepayments(loans);
};
export function buildDebtRepayments(loans) {
  const loansVector = loans.map((loan) => {
    if (
      loan.type_of_external_fund === "Prêt bancaire" ||
      loan.type_of_external_fund === "Prêt d'honneur" ||
      loan.type_of_external_fund === "Autre prêt"
    ) {
      return computeDebtRepayments(loan);
    }
    return [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
  });
  return loansVector.reduce(
    (acc, loan) => {
      loan.map((year, j) => {
        year.reduce((a, i, k) => {
          a[k] += i;
          return a;
        }, acc[j]);
      });
      return acc;
    },
    [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)]
  );
}

function computeDebtRepayments(loan) {
  let debtRepayments = [];
  debtRepayments.push(new Array(12).fill(0));
  debtRepayments.push(new Array(12).fill(0));
  debtRepayments.push(new Array(12).fill(0));
  let paymentPlacementIndex =
    (yearIntTable[loan["year_of_loan_disbursement"]] - 1) * 12 +
    monthIntTable[loan["month_of_loan_disbursement"]];
  const duration = parseInt(loan["loan_duration"]);
  const payment = loan.amount_monthly_payments
    .replace(" ", "")
    .replace(",", ".")
    .replace("€", "")
    .trim();
  const endDate = paymentPlacementIndex + duration - 1;
  let amount = 0;
  for (let i = 1; i <= 36; i++) {
    if (paymentPlacementIndex <= i && i <= endDate) {
      amount = parseFloat(payment);
    } else {
      amount = 0;
    }
    if (i <= 12) {
      debtRepayments[0][i - 1] = amount;
    }
    if (i > 12 && i <= 24) {
      debtRepayments[1][i - 12 - 1] = amount;
    }
    if (i > 24 && i <= 36) {
      debtRepayments[2][i - 24 - 1] = amount;
    }
  }
  return debtRepayments;
}
