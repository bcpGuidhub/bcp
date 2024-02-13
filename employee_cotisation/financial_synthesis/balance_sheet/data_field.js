import {
  computeDepreciationAmortization,
  computeEndOfYear1Stock,
  computeEndOfYear2Stock,
  computeEndOfYear3Stock,
  computeFinancialExpenses,
  microEntrepriseCotisation,
  microEntrepriseActivityCategory,
} from "../income_statement/data_field.js";
import {
  computeVatRefunds,
  computeVatRefundsNormal,
  computeIncomeTaxYear3,
  computeEndOfMonthStockValue,
  computeVatOnRevenues,
  computeVatOnRevenueSources,
  computeVatOnExpenses,
  computeVatOnInvestments,
  computeVatPayment,
  computeAnnualBasedVatPurchases,
  regularisationDirector,
  cotisationsProvisionnelles,
  buildDebtRepayments,
  buildLoanSubscriptions,
  buildReimbursementsPartners,
  computeReimbursementsPartnersVector,
  computeVatPaymentNormal,
  computeStaffPay,
  buildRevenueSchedule,
} from "../treasury/data_field.js";
import currency from "currency.js";

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
const yearLabel = {
  year_1: "Année 1",
  year_2: "Année 2",
  year_3: "Année 3",
};
const monthMappingChart = {
  "Mois 1": 12,
  "Mois 2": 11,
  "Mois 3": 10,
  "Mois 4": 9,
  "Mois 5": 8,
  "Mois 6": 7,
  "Mois 7": 6,
  "Mois 8": 5,
  "Mois 9": 4,
  "Mois 10": 3,
  "Mois 11": 2,
  "Mois 12": 1,
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
const yearOrdering = { "Année 1": 1, "Année 2": 2, "Année 3": 3 };

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
 * Immobilisations incorporelles
 */

export const IntangibleAssets = function (query) {
  this.query = query;
};
IntangibleAssets.prototype.compute = function (association, year, month) {
  return buildIntangibleAssets(association);
};
function buildIntangibleAssets(association) {
  const { investments } = association;
  let grossAnnualReccuring = 0;
  const grossAnnualVector = investments
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
    }, new Array(3).fill(0))
    .reduce((acc, year, j) => {
      acc[j] = year + grossAnnualReccuring;
      grossAnnualReccuring = acc[j];
      return acc;
    }, new Array(3).fill(0));
  const paymentVector = investments
    .map((investment) => {
      if (
        investment.investment_type === "Investissement incorporel" &&
        investment.duration !== "Non amortissable"
      ) {
        return computePaymentAssets(investment);
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
  return paymentVector.reduce(
    (acc, year, i) => {
      acc[i].push(grossAnnualVector[i]);
      acc[i].push(year);
      let net = grossAnnualVector[i] - year;
      acc[i].push(net);
      return acc;
    },
    [[], [], []]
  );
}
export function computeIntangibleAssets(investment) {
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
function computePaymentAssets(investment) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let reccuring = 0;
  for (let i = 1; i <= 3; i++) {
    amount = computeDepreciationAmortization(
      investment,
      `Année ${i}`,
      parseInt(investment.investment_amount_tax_included, 10)
    );
    acc[i - 1] = reccuring + amount;
    reccuring = acc[i - 1];
  }
  return acc;
}
/**
 * Immobilisations corporelles
 */

export const TangibleAssets = function (query) {
  this.query = query;
};
TangibleAssets.prototype.compute = function (association, year, month) {
  return buildTangibleAssets(association);
};
function buildTangibleAssets(association) {
  const { investments } = association;
  let grossAnnualReccuring = 0;
  const grossAnnualVector = investments
    .map((investment) => {
      if (investment.investment_type === "Investissement corporel") {
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
    }, new Array(3).fill(0))
    .reduce((acc, year, j) => {
      acc[j] = year + grossAnnualReccuring;
      grossAnnualReccuring = acc[j];
      return acc;
    }, new Array(3).fill(0));
  const paymentVector = investments
    .map((investment) => {
      if (
        investment.investment_type === "Investissement corporel" &&
        investment.duration !== "Non amortissable"
      ) {
        return computePaymentAssets(investment);
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
  return paymentVector.reduce(
    (acc, year, i) => {
      acc[i].push(grossAnnualVector[i]);
      acc[i].push(year);
      let net = grossAnnualVector[i] - year;
      acc[i].push(net);
      return acc;
    },
    [[], [], []]
  );
}

/**
 * Immobilisations financières
 */

export const FinancialAssets = function (query) {
  this.query = query;
};
FinancialAssets.prototype.compute = function (association, year, month) {
  return buildFinancialAssets(association);
};
function buildFinancialAssets(association) {
  const { investments } = association;
  let grossAnnualReccuring = 0;
  const grossAnnualVector = investments
    .map((investment) => {
      if (investment.investment_type === "Investissement financier") {
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
    }, new Array(3).fill(0))
    .reduce((acc, year, j) => {
      acc[j] = year + grossAnnualReccuring;
      grossAnnualReccuring = acc[j];
      return acc;
    }, new Array(3).fill(0));
  const paymentVector = investments
    .map((_) => new Array(3).fill(0))
    .reduce((acc, investment, i) => {
      investment.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return paymentVector.reduce(
    (acc, year, i) => {
      acc[i].push(grossAnnualVector[i]);
      acc[i].push(year);
      let net = grossAnnualVector[i] - year;
      acc[i].push(net);
      return acc;
    },
    [[], [], []]
  );
}

/**
 * Stocks
 */
export const Stocks = function (query) {
  this.query = query;
};
Stocks.prototype.compute = function (association, year, month) {
  return buildStocks(association);
};
export function buildStocks(association) {
  const { revenues } = association;

  const netStocksVector = revenues
    .map((revenue) => {
      if (revenue.inventory_linked_revenue === "Oui") {
        return computeNetStocks(revenue);
      }
      return new Array(3).fill(0);
    })
    .reduce((acc, revenue, i) => {
      revenue.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return netStocksVector.reduce(
    (acc, stock, i) => {
      acc[i].push(null);
      acc[i].push(null);
      acc[i].push(stock);
      return acc;
    },
    [[], [], []]
  );
}

function computeNetStocks(revenue) {
  let acc = new Array(3).fill(0);
  for (let i = 1; i <= 3; i++) {
    if (i === 1) {
      acc[i - 1] = computeEndOfYear1Stock(revenue);
    }
    if (i === 2) {
      acc[i - 1] = computeEndOfYear2Stock(revenue);
    }
    if (i === 3) {
      acc[i - 1] = computeEndOfYear3Stock(revenue);
    }
  }
  return acc;
}

/**
 * Clients
 */
export const Clients = function (query) {
  this.query = query;
};
Clients.prototype.compute = function (association, year, month) {
  return buildClients(association);
};
export function buildClients(association) {
  const { revenues } = association;

  const netClientsVector = revenues
    .map((revenue) => computeNetClients(revenue))
    .reduce((acc, revenue, i) => {
      revenue.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return netClientsVector.reduce(
    (acc, client, i) => {
      acc[i].push(null);
      acc[i].push(null);
      acc[i].push(client);
      return acc;
    },
    [[], [], []]
  );
}
function computeNetClients(revenue) {
  let acc = new Array(3).fill(0);
  let paymentYear;
  let paymentIndex;
  let amount;
  let clientsYear1 = 0;
  let clientsYear2 = 0;
  let clientsYear3 = 0;
  const rate =
    1 +
    parseFloat(revenue["vat_rate_revenue"].replace("%", "").replace(",", ".")) /
      100;
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
    }
    if (revenue.revenue_partition === "Mensuelle") {
      const payment = revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
      amount = parseInt(payment) / 12;
      amount =
        amount *
        (1 +
          parseFloat(
            revenue["vat_rate_revenue"].replace("%", "").replace(",", ".")
          ) /
            100);
    }
    if (paymentYear === 1) {
      if (i === 11 && delay === 2) {
        clientsYear1 += amount;
      }
      if (i === 12 && delay >= 1) {
        clientsYear1 += amount;
      }
      acc[paymentYear - 1] = clientsYear1;
    }
    if (paymentYear === 2) {
      if (i === 23 && delay === 2) {
        clientsYear2 += amount;
      }
      if (i === 24 && delay >= 1) {
        clientsYear2 += amount;
      }
      acc[paymentYear - 1] = clientsYear2;
    }
    if (paymentYear === 3) {
      if (i === 35 && delay === 2) {
        clientsYear3 += amount;
      }
      if (i === 36 && delay >= 1) {
        clientsYear3 += amount;
      }
      acc[paymentYear - 1] = clientsYear3;
    }
  }
  return acc;
}
/**
 * Créances fiscales
 */
export const TaxReceivables = function (query) {
  this.query = query;
};
TaxReceivables.prototype.compute = function (association, year, month) {
  return buildTaxReceivables(association);
};
function buildTaxReceivables(association) {
  const { legal } = association.aggregateResources;
  const { incomeTaxRow } = association;
  let yearOne;
  let yearTwo;
  let yearThree;
  let vat;
  if (legal["company_vat_regime"] === "Réel simplifié") {
    vat = computeVatRefunds(association.aggregateResources);
    yearOne = computeTaxReceivablesYear1(vat, legal);
    yearTwo = computeTaxReceivablesYear2(vat, legal, incomeTaxRow);
    yearThree = computeTaxReceivablesYear3(association);
    return [
      [null, null, yearOne],
      [null, null, yearTwo],
      [null, null, yearThree],
    ];
  } else if (legal["company_vat_regime"] === "Réel normal") {
    vat = computeVatRefundsNormal(association.aggregateResources);
    yearOne = computeTaxReceivablesYear1(vat, legal);
    yearTwo = computeTaxReceivablesYear2(vat, legal, incomeTaxRow);
    yearThree = computeTaxReceivablesYear3(association);
    return [
      [null, null, yearOne],
      [null, null, yearTwo],
      [null, null, yearThree],
    ];
  } else {
    if (
      legal["company_vat_regime"] === "Franchise en base de TVA" &&
      legal["tax_system"] === "IS"
    ) {
      yearOne = 0;
      yearTwo = computeIncomeTaxYear3(incomeTaxRow);
      yearThree = computeIncomeTaxYear(incomeTaxRow);
      return [
        [null, null, yearOne],
        [null, null, yearTwo],
        [null, null, yearThree],
      ];
    }
  }
  const r = [
    [null, null, 0],
    [null, null, 0],
    [null, null, 0],
  ];
  return r;
}
function computeTaxReceivablesYear1(vat, legal) {
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return vat[1][4];
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return vat[1][0];
  }
}
function computeTaxReceivablesYear2(vat, legal, incomeTaxRow) {
  let c = 0;
  if (legal["tax_system"] === "IS") {
    c = computeIncomeTaxYear3(incomeTaxRow);
  }
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return vat[2][4] + c;
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return vat[2][0] + c;
  }
}
function computeTaxReceivablesYear3(association) {
  const { revenues, revenueSources, expenses, investments, legal } =
    association.aggregateResources;
  const { incomeTaxRow } = association;
  let incomeTax = 0;
  if (legal["tax_system"] === "IS") {
    incomeTax = computeIncomeTaxYear(incomeTaxRow);
  }
  if (legal["company_vat_regime"] === "Réel simplifié") {
    const vatRevenues = computeVatOnRevenues(revenues, 36);
    const vatRevenuesSources = computeVatOnRevenueSources(
      revenueSources,
      yearLabel["year_3"]
    );
    const vatPurcahes = computeAnnualBasedVatPurchases(revenues, "year_3");
    const vatExpenses = computeVatOnExpenses(expenses, 36);
    const vatInvestments = computeVatOnInvestments(investments, 36);
    const vatPayment = computeVatPayment(association);
    const c = vatRevenues + vatRevenuesSources;
    const d =
      vatPurcahes +
      vatExpenses +
      vatInvestments +
      vatPayment[2][6] +
      vatPayment[2][11];
    if (c < d) {
      return d - c + incomeTax;
    }
    return incomeTax;
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    const vatRevenues = vatOnRevenuesYear3Month12(revenues);
    const vatRevenuesSources = vatOnRevenuesSourceYear3Month12(revenueSources);
    const vatPurcahes = vatOnPurchasesYear3Month12(revenues);
    const vatExpenses = vatOnExpensesYear3Month12(expenses);
    const vatInvestments = vatOnInvestmentsYear3Month12(investments);
    const c = vatRevenues + vatRevenuesSources;
    const d = vatPurcahes + vatExpenses + vatInvestments;
    if (c < d) {
      return d - c + incomeTax;
    }
    return incomeTax;
  }
}
function computeIncomeTaxYear(incomeTaxRow) {
  if (incomeTaxRow.year_2 >= 3000) {
    if (incomeTaxRow.year_2 > incomeTaxRow.year_3) {
      return incomeTaxRow.year_2 - incomeTaxRow.year_3;
    }
  } else {
    if (incomeTaxRow.year_1 >= 3000) {
      const i = incomeTaxRow.year_1 / 4;
      if (i > incomeTaxRow.year_3) {
        return i;
      }
    }
  }
  return 0;
}
function vatOnRevenuesYear3Month12(revenues) {
  return revenues.reduce((acc, revenue) => {
    acc += computeVatOnRevenuesYear3Month12(revenue);
    return acc;
  }, 0);
}
function computeVatOnRevenuesYear3Month12(revenue) {
  let amount;
  const vat = revenue["vat_rate_revenue"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  if (revenue.revenue_partition === "Personnalisée") {
    const payments = revenue.revenue_years;
    const payment = payments.find((p) => p.year === "year_3");
    amount =
      payment["month_12_amount"] === ""
        ? 0
        : parseInt(payment["month_12_amount"]);
  }
  if (revenue.revenue_partition === "Mensuelle") {
    const payment = revenue["annual_amount_tax_excluded_year_3"];
    amount = parseInt(payment) / 12;
  }
  return amount * rate;
}
function vatOnRevenuesSourceYear3Month12(revenueSources) {
  return revenueSources.reduce((acc, revenueSource) => {
    if (revenueSource.source_type === "Autre produit d'exploitation") {
      acc += computeVatOnRevenuesSourceYear3Month12(revenueSource);
    }
    return acc;
  }, 0);
}
function computeVatOnRevenuesSourceYear3Month12(revenueSource) {
  const vat = revenueSource["vat_rate"];
  let paymentPlacementIndex =
    (yearOrdering[revenueSource["year"]] - 1) * 12 +
    monthIntTable[revenueSource["month"]];

  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  let amount;
  if (paymentPlacementIndex === 36) {
    amount = revenueSource["amount_excluding_taxes"];
  } else {
    amount = 0;
  }
  return amount * rate;
}
function vatOnPurchasesYear3Month12(revenues) {
  return revenues.reduce((acc, revenue) => {
    if (revenue.inventory_linked_revenue === "Oui") {
      acc += computeVatOnPurchasesYear3Month12(revenue)[2][11];
    }
    return acc;
  }, 0);
}
function computeVatOnPurchasesYear3Month12(revenue) {
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
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
      const indicatorOnPurchases =
        amountAveragestock > amountEndOfMonth - amount * (1 - percentageMargin);

      if (indicatorOnPurchases) {
        recurringPurchase =
          amountAveragestock -
          (amountEndOfMonth - amount * (1 - percentageMargin));
      } else {
        recurringPurchase = 0;
      }
      if (i <= 12) {
        if (i === 1) {
          purchases[0][i - 1] = 0;
        } else if (i === 2) {
          purchases[0][i - 1] = recurringPurchase * rate;
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
    }
  }
  return purchases;
}
function vatOnExpensesYear3Month12(expenses) {
  return expenses.reduce((acc, expense) => {
    acc += computeVatOnExpensesYear3Month12(expense);
    return acc;
  }, 0);
}
function computeVatOnExpensesYear3Month12(expense) {
  let paymentYear = 3;
  let amount;
  const vat = expense["vat_rate_expenditure"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const i = 36;
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
      (yearOrdering[expense["one_time_payment_year"]] - 1) * 12 +
      monthIntTable[expense["one_time_payment_month"]];
    amount = i === j ? parseInt(payment) : 0;
  }
  return amount * rate;
}
function vatOnInvestmentsYear3Month12(investments) {
  return investments.reduce((acc, investment) => {
    if (investment["contribution"] === "Non") {
      acc += computeVatOnInvestmentsYear3Month12(investment);
    }

    return acc;
  }, 0);
}
function computeVatOnInvestmentsYear3Month12(investment) {
  let amount;
  const vat = investment["vat_rate_on_investment"];
  const rate =
    vat === "" ? 0 : parseFloat(vat.replace("%", "").replace(",", ".")) / 100;
  const paymentPlacementIndex =
    (yearOrdering[investment["year_of_purchase"]] - 1) * 12 +
    monthIntTable[investment["month_of_purchase"]];

  if (paymentPlacementIndex === 36) {
    const payment = investment["investment_amount_tax_included"];
    amount = parseInt(payment, 10);
  } else {
    amount = 0;
  }
  return amount * rate;
}
/**
 * Créances sociales
 */
export const SocialClaims = function (query) {
  this.query = query;
};
SocialClaims.prototype.compute = function (association, year, month) {
  return buildSocialClaims(association);
};
function buildSocialClaims(association) {
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
  const netRegularisationVector = directors
    .map((director) => computeNetRegularisation(director, association))
    .reduce((acc, director, i) => {
      director.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  return netRegularisationVector.reduce(
    (acc, client, i) => {
      acc[i].push(null);
      acc[i].push(null);
      acc[i].push(client);
      return acc;
    },
    [[], [], []]
  );
}

function computeNetRegularisation(director, association) {
  let acc = new Array(3).fill(0);
  for (let i = 1; i <= 3; i++) {
    if (i === 1) {
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        12,
        association.directorCotisations
      );
      const c = regularisationDirector(association.directorCotisations, 12, d);
      if (c < 0) {
        acc[i - 1] = -c;
      } else {
        acc[i - 1] = 0;
      }
    }
    if (i === 2) {
      const c = regularisationDirector(
        association.directorCotisations,
        13,
        null
      );
      if (c < 0) {
        acc[i - 1] = -c;
      } else {
        acc[i - 1] = 0;
      }
    }
    if (i === 3) {
      const c = regularisationDirector(
        association.directorCotisations,
        25,
        null
      );
      if (c < 0) {
        acc[i - 1] = -c;
      } else {
        acc[i - 1] = 0;
      }
    }
  }
  return acc;
}

/**
 * Capital
 */

export const CapitalLiabilities = function (query) {
  this.query = query;
};
CapitalLiabilities.prototype.compute = function (association, year, month) {
  return buildCapitalLiabilities(association);
};
function buildCapitalLiabilities(association) {
  const { associations, incomeStatement } = association;
  const { capitalContributions, legal, directors } = associations;
  const annual = capitalContributions
    .map((capitalContribution) =>
      computeNetCapitalContributions(capitalContribution)
    )
    .reduce((acc, capitalContribution, i) => {
      capitalContribution.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
  let reccuring = 0;
  if (
    (legal.legal_status_idea === "Entreprise individuelle" ||
      legal.legal_status_idea === "EIRL") &&
    (legal.tax_system === "IR" || legal.tax_system === "Micro-entreprise")
  ) {
    const incomeStatementNetResult =
      incomeStatement[incomeStatement.length - 1];
    const derived = [
      0,
      incomeStatementNetResult["year_1"],
      incomeStatementNetResult["year_2"],
    ];
    const director =
      directors.length > 0
        ? directors[0]
        : {
            net_compensation_year_1: "0",
            net_compensation_year_2: "0",
            net_compensation_year_3: "0",
          };
    return annual.reduce((acc, year, j) => {
      const query = `net_compensation_year_${j + 1}`;
      acc[j] =
        year +
        reccuring -
        parseInt(director[query].replace(/\s/g, ""), 10) +
        derived[j];
      reccuring = acc[j];
      return acc;
    }, new Array(3).fill(0));
  }
  return annual.reduce((acc, year, j) => {
    acc[j] = year + reccuring;
    reccuring = acc[j];
    return acc;
  }, new Array(3).fill(0));
}
function computeNetCapitalContributions(capitalContribution) {
  let acc = new Array(3).fill(0);
  for (let i = 1; i <= 3; i++) {
    if (i === yearOrdering[capitalContribution["year_of_contribution"]]) {
      acc[i - 1] = parseInt(capitalContribution["contribution_amount"], 10);
    }
  }
  return acc;
}

/**
 * Emprunts
 */

export const LoansLiabilities = function (query) {
  this.query = query;
};
LoansLiabilities.prototype.compute = function (association, year, month) {
  return buildLoansLiabilities(association);
};
function buildLoansLiabilities(association) {
  const { loans } = association;
  const c = buildDebtRepayments(loans);
  const annualLoanPaid = c.reduce((acc, r, i) => {
    const x = i;
    r.reduce((acc, m, j) => {
      acc[x] += m;
      return acc;
    }, acc);
    return acc;
  }, new Array(3).fill(0));
  const e = buildLoanSubscriptions(loans);
  const loanSum = e.reduce((acc, r, i) => {
    const x = i;
    r.reduce((acc, m, j) => {
      acc[x] += m;
      return acc;
    }, acc);
    return acc;
  }, new Array(3).fill(0));
  const finacialExpenses = computeFinancialExpenses(loans);
  const accfinacialExpenses = Object.keys(finacialExpenses).map(
    (key) => finacialExpenses[key]
  );
  let prevAnnualLoanPaid = 0;
  let prevAccfinacialExpenses = 0;
  let prevLoanSum = 0;
  return loanSum.reduce((acc, payment, j) => {
    const paid =
      payment +
      prevLoanSum -
      (prevAnnualLoanPaid + annualLoanPaid[j]) +
      (prevAccfinacialExpenses + accfinacialExpenses[j]);
    prevAnnualLoanPaid += annualLoanPaid[j];

    acc[j] = paid < 0 ? 0 : paid;

    prevAccfinacialExpenses += accfinacialExpenses[j];
    prevLoanSum += payment;
    return acc;
  }, new Array(3).fill(0));
}

/**
 * Compte courant d’associés
 */

export const PartnerCurrentAccount = function (query) {
  this.query = query;
};
PartnerCurrentAccount.prototype.compute = function (association, year, month) {
  return buildPartnerCurrentAccount(association);
};
function buildPartnerCurrentAccount(association) {
  const { associatesCapitalContributions } = association;
  const c = buildReimbursementsPartners(associatesCapitalContributions);
  const partnerAnnual = c.reduce((acc, r, i) => {
    const x = i;
    r.reduce((acc, m, j) => {
      acc[x] += m;
      return acc;
    }, acc);
    return acc;
  }, new Array(3).fill(0));
  const e = buildCurrentAccountContributionsPartners(
    associatesCapitalContributions
  );
  const partnerContribution = e.reduce((acc, r, i) => {
    const x = i;
    r.reduce((acc, m, j) => {
      acc[x] += m;
      return acc;
    }, acc);
    return acc;
  }, new Array(3).fill(0));
  let recurring = 0;
  return partnerContribution.reduce((acc, payment, j) => {
    acc[j] = payment - partnerAnnual[j] + recurring;
    recurring = acc[j];
    return acc;
  }, new Array(3).fill(0));
}

function buildCurrentAccountContributionsPartners(
  associatesCapitalContributions
) {
  const paymentVector = associatesCapitalContributions.map(
    (associatesCapitalContribution) => {
      if (
        associatesCapitalContribution["type_of_operation"] ===
        "Apport en compte courant d'associé"
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

/**
 * Fournisseurs
 */
export const Suppliers = function (query) {
  this.query = query;
};
Suppliers.prototype.compute = function (association, year, month) {
  return buildSuppliers(association);
};
export function buildSuppliers(association) {
  const { revenues } = association;
  return revenues
    .map((revenue) => computeNetSuppliers(revenue))
    .reduce((acc, revenue, i) => {
      revenue.reduce((a, year, j) => {
        a[j] += year;
        return a;
      }, acc);
      return acc;
    }, new Array(3).fill(0));
}
function computeNetSuppliers(revenue) {
  let acc = new Array(3).fill(0);
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
    let clientsYear1 = 0;
    let clientsYear2 = 0;
    let clientsYear3 = 0;
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
              revenue["vat_rate_on_purchases"]
                .replace("%", "")
                .replace(",", ".")
            ) /
              100);
      }
      if (revenue.revenue_partition === "Mensuelle") {
        const payment =
          revenue[`annual_amount_tax_excluded_year_${paymentYear}`];
        amount = parseInt(payment) / 12;
        amount =
          amount *
          (1 +
            parseFloat(
              revenue["vat_rate_on_purchases"]
                .replace("%", "")
                .replace(",", ".")
            ) /
              100);
      }
      runningSum += amount;
      amountEndOfMonth = computeEndOfMonthStockValue(
        valuationStartingStock,
        runningSum,
        percentageMargin,
        amountAveragestock
      );
      const indicatorOnPurchases =
        amountAveragestock > amountEndOfMonth - amount * (1 - percentageMargin);

      if (indicatorOnPurchases) {
        recurringPurchase =
          amountAveragestock -
          (amountEndOfMonth - amount * (1 - percentageMargin));
      } else {
        recurringPurchase = 0;
      }

      if (paymentYear === 1) {
        if (i === 11 && delay === 2) {
          clientsYear1 += recurringPurchase;
        }
        if (i === 12 && delay >= 1) {
          clientsYear1 += recurringPurchase;
        }
        acc[paymentYear - 1] = clientsYear1;
      }
      if (paymentYear === 2) {
        if (i === 23 && delay === 2) {
          clientsYear2 += recurringPurchase;
        }
        if (i === 24 && delay >= 1) {
          clientsYear2 += recurringPurchase;
        }
        acc[paymentYear - 1] = clientsYear2;
      }
      if (paymentYear === 3) {
        if (i === 35 && delay === 2) {
          clientsYear3 += recurringPurchase;
        }
        if (i === 36 && delay >= 1) {
          clientsYear3 += recurringPurchase;
        }
        acc[paymentYear - 1] = clientsYear3;
      }
    }
  }
  return acc;
}
/**
 * Dettes fiscales
 */
export const TaxDebt = function (query) {
  this.query = query;
};
TaxDebt.prototype.compute = function (association, year, month) {
  return buildTaxDebt(association);
};
function buildTaxDebt(association) {
  const { legal } = association.aggregateResources;
  const { incomeTaxRow, taxReturns } = association;
  let vat;
  let yearOne;
  let yearTwo;
  let yearThree;
  if (legal["company_vat_regime"] === "Réel simplifié") {
    vat = computeVatPayment(association);
    yearOne = computeTaxDebtYear1(vat, legal, incomeTaxRow, taxReturns);
    yearTwo = computeTaxDebtYear2(vat, legal, incomeTaxRow, taxReturns);
    yearThree = computeTaxDebtYear3(association);

    return [yearOne, yearTwo, yearThree];
  } else if (legal["company_vat_regime"] === "Réel normal") {
    vat = computeVatPaymentNormal(association);
    yearOne = computeTaxDebtYear1(vat, legal, incomeTaxRow, taxReturns);
    yearTwo = computeTaxDebtYear2(vat, legal, incomeTaxRow, taxReturns);
    yearThree = computeTaxDebtYear3(association);
    return [yearOne, yearTwo, yearThree];
  } else {
    if (
      legal["company_vat_regime"] === "Franchise en base de TVA" &&
      legal["tax_system"] === "IS"
    ) {
      return [
        incomeTaxRow.year_1 + taxReturns.year_1,
        computeIncomeTaxYearOnTaxDebt(incomeTaxRow),
        computeIncomeTaxOnTaxDebtYear3(incomeTaxRow),
      ];
    }
    return [taxReturns.year_1, taxReturns.year_2, taxReturns.year_3];
  }
}
function computeTaxDebtYear1(vat, legal, incomeTaxRow, taxReturns) {
  let c = 0;
  if (legal["tax_system"] === "IS") {
    c = incomeTaxRow.year_1;
  }
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return vat[1][4] + c + taxReturns.year_1;
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return vat[1][0] + c + taxReturns.year_1;
  }
}
function computeTaxDebtYear2(vat, legal, incomeTaxRow, taxReturns) {
  let c = 0;
  if (legal["tax_system"] === "IS") {
    c = computeIncomeTaxYearOnTaxDebt(incomeTaxRow);
  }
  if (legal["company_vat_regime"] === "Réel simplifié") {
    return vat[2][4] + c + taxReturns.year_2;
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    return vat[2][0] + c + taxReturns.year_2;
  }
}
function computeIncomeTaxYearOnTaxDebt(incomeTaxRow) {
  if (incomeTaxRow.year_2 >= 0) {
    if (incomeTaxRow.year_1 < 3000) {
      return incomeTaxRow.year_2;
    } else {
      if (incomeTaxRow.year_1 < incomeTaxRow.year_2) {
        return incomeTaxRow.year_2 - incomeTaxRow.year_1;
      } else {
        return 0;
      }
    }
  }
  return 0;
}
function computeTaxDebtYear3(association) {
  const { revenues, revenueSources, expenses, investments, legal } =
    association.aggregateResources;
  const { incomeTaxRow, taxReturns } = association;
  let incomeTax = 0;
  if (legal["tax_system"] === "IS") {
    incomeTax = computeIncomeTaxOnTaxDebtYear3(incomeTaxRow);
  }
  if (legal["company_vat_regime"] === "Réel simplifié") {
    const vatRevenues = computeVatOnRevenues(revenues, 36);
    const vatRevenuesSources = computeVatOnRevenueSources(
      revenueSources,
      yearLabel["year_3"]
    );
    const vatPurcahes = computeAnnualBasedVatPurchases(revenues, "year_3");
    const vatExpenses = computeVatOnExpenses(expenses, 36);
    const vatInvestments = computeVatOnInvestments(investments, 36);
    const vatPayment = computeVatPayment(association);
    const c = vatRevenues + vatRevenuesSources;
    const d =
      vatPurcahes +
      vatExpenses +
      vatInvestments +
      vatPayment[2][6] +
      vatPayment[2][11];
    if (c > d) {
      return c - d + incomeTax + taxReturns.year_3;
    }
    return incomeTax + taxReturns.year_3;
  }
  if (legal["company_vat_regime"] === "Réel normal") {
    const vatRevenues = vatOnRevenuesYear3Month12(revenues);
    const vatRevenuesSources = vatOnRevenuesSourceYear3Month12(revenueSources);
    const vatPurcahes = vatOnPurchasesYear3Month12(revenues);
    const vatExpenses = vatOnExpensesYear3Month12(expenses);
    const vatInvestments = vatOnInvestmentsYear3Month12(investments);
    const c = vatRevenues + vatRevenuesSources;
    const d = vatPurcahes + vatExpenses + vatInvestments;
    if (c > d) {
      return c - d + incomeTax + taxReturns.year_3;
    }
    return incomeTax + taxReturns.year_3;
  }
}
function computeIncomeTaxOnTaxDebtYear3(incomeTaxRow) {
  if (incomeTaxRow.year_3 >= 0) {
    if (incomeTaxRow.year_2 < 3000) {
      if (incomeTaxRow.year_1 >= 3000) {
        const i = incomeTaxRow.year_1 / 4;
        if (i > incomeTaxRow.year_3) {
          return 0;
        } else {
          return incomeTaxRow.year_3 - i;
        }
      }
      return incomeTaxRow.year_3;
    } else {
      if (incomeTaxRow.year_2 < incomeTaxRow.year_3) {
        return incomeTaxRow.year_3 - incomeTaxRow.year_2;
      } else {
        return 0;
      }
    }
  }
  return 0;
}

/**
 * Dettes sociales
 */
export const SocialDebt = function (query) {
  this.query = query;
};
SocialDebt.prototype.compute = function (association, year, month) {
  return buildSocialDebt(association);
};
function buildSocialDebt(association) {
  if (association.legal.tax_system === "Micro-entreprise") {
    return computeMicroEntrepriseSocialDebt(association);
  } else {
    const { directors, legal, employees } = association.aggregateResources;
    let sscDirectors;
    if (
      legal["social_security_scheme"] === "Sécurité sociale des indépendants"
    ) {
      let enumDirectors = [];
      if (
        directors.length === 0 &&
        (legal.legal_status_idea === "Entreprise individuelle" ||
          (legal.legal_status_idea === "EIRL" && legal.tax_system === "IR"))
      ) {
        const director = {};
        director["director_acre"] =
          typeof legal.micro_entreprise_accre_exemption === "undefined" ||
          legal.micro_entreprise_accre_exemption === ""
            ? "non"
            : legal.micro_entreprise_accre_exemption;
        enumDirectors.push(director);
      } else {
        enumDirectors = directors;
      }
      sscDirectors = enumDirectors
        .map((director) =>
          computesscDirectorsIndependent(director, association)
        )
        .reduce((acc, director, i) => {
          director.reduce((a, year, j) => {
            a[j] += year;
            return a;
          }, acc);
          return acc;
        }, new Array(3).fill(0));
    } else if (
      legal["social_security_scheme"] ===
      "Régime général de la sécurité sociale"
    ) {
      sscDirectors = directors
        .map((director) => computesscDirectorsEmployee(director, association))
        .reduce((acc, director, i) => {
          director.reduce((a, year, j) => {
            a[j] += year;
            return a;
          }, acc);
          return acc;
        }, new Array(3).fill(0));
    } else {
      sscDirectors = new Array(3).fill(0);
    }
    const sscEmployees = employees
      .map((employee) => computesscEmployees(employee))
      .reduce((acc, employee, i) => {
        employee.reduce((a, year, j) => {
          a[j] += year;
          return a;
        }, acc);
        return acc;
      }, new Array(3).fill(0));
    return sscEmployees.reduce((acc, pay, j) => {
      acc[j] = pay + sscDirectors[j];
      return acc;
    }, new Array(3).fill(0));
  }
}
function computesscDirectorsIndependent(director, association) {
  let acc = new Array(3).fill(0);
  for (let i = 1; i <= 3; i++) {
    if (i === 1) {
      const d = cotisationsProvisionnelles(
        director,
        association.sector,
        12,
        association.directorCotisations
      );
      const c = regularisationDirector(association.directorCotisations, 12, d);
      if (c > 0) {
        acc[i - 1] = c;
      } else {
        acc[i - 1] = 0;
      }
    }
    if (i === 2) {
      const c = regularisationDirector(
        association.directorCotisations,
        13,
        null
      );
      if (c > 0) {
        acc[i - 1] = c;
      } else {
        acc[i - 1] = 0;
      }
    }
    if (i === 3) {
      const c = regularisationDirector(
        association.directorCotisations,
        25,
        null
      );
      if (c > 0) {
        acc[i - 1] = c;
      } else {
        acc[i - 1] = 0;
      }
    }
  }
  return acc;
}
function computesscDirectorsEmployee(director) {
  let acc = new Array(3).fill(0);
  let amount = 0;
  let paymentIndex = 12;
  for (let i = 1; i <= 3; i++) {
    if (director.compensation_partition === "Mensuelle") {
      const payment = director[`cotisations_sociales_year_${i}`];
      amount = parseInt(payment) / 12;
    }
    if (director.compensation_partition === "Personnalisée") {
      const payments = director.director_cotisation_years;
      const payment = payments.find((p) => p.year === `year_${i}`);
      amount =
        payment[`month_${paymentIndex}_cotisation`] === ""
          ? 0
          : parseInt(payment[`month_${paymentIndex}_cotisation`]);
    }
    if (i === 1) {
      acc[i - 1] = amount;
    }
    if (i === 2) {
      acc[i - 1] = amount;
    }
    if (i === 3) {
      acc[i - 1] = amount;
    }
  }
  return acc;
}
function computesscEmployees(employee) {
  let acc = new Array(3).fill(0);
  let paymentYear;
  let paymentIndex;
  let amount;
  let duration;
  const paymentPlacementIndex =
    (yearOrdering[employee.year_of_hire] - 1) * 12 +
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
    if (paymentYear === 1) {
      if (i === 12) {
        acc[paymentYear - 1] = amount;
      }
    }
    if (paymentYear === 2) {
      if (i === 24) {
        acc[paymentYear - 1] = amount;
      }
    }
    if (paymentYear === 3) {
      if (i === 36) {
        acc[paymentYear - 1] = amount;
      }
    }
  }
  return acc;
}
function computeMicroEntrepriseSocialDebt(association) {
  const partition =
    typeof association.legal.micro_entreprise_declare_pay_cotisations ===
      "undefined" ||
    association.legal.micro_entreprise_declare_pay_cotisations === ""
      ? "Mensuellement"
      : association.legal.micro_entreprise_declare_pay_cotisations;
  if (partition === "Mensuellement") {
    return computeMicroEntrepriseSocialDebtMonthlyDeclaration(association);
  }
  if (partition === "Trimestriellement") {
    return computeMicroEntrepriseSocialDebtTrimesterDeclaration(association);
  }
}
function computeMicroEntrepriseSocialDebtMonthlyDeclaration(association) {
  let acc = new Array(3).fill(0);
  const revenues = buildRevenueSchedule(
    association.aggregateResources.revenues
  );
  const l = association.legal;
  const p = association.aggregateResources.project;
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
  for (let i = 1; i <= 3; i++) {
    if (i === 1) {
      acc[i - 1] = revenues[i - 1][11] * socialCRT[`year_${i}`];
    }
    if (i === 2) {
      acc[i - 1] = revenues[i - 1][11] * socialCRT[`year_${i}`];
    }
    if (i === 3) {
      acc[i - 1] = revenues[i - 1][11] * socialCRT[`year_${i}`];
    }
  }
  return acc;
}
function computeMicroEntrepriseSocialDebtTrimesterDeclaration(association) {
  let acc = new Array(3).fill(0);
  const revenues = buildRevenueSchedule(
    association.aggregateResources.revenues
  );
  const l = association.legal;
  const p = association.aggregateResources.project;
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
  for (let i = 1; i <= 3; i++) {
    acc[i - 1] =
      (revenues[i - 1][12 * i - 1] +
        revenues[i - 1][12 * i - 2] +
        revenues[i - 1][12 * i - 3]) *
      socialCRT[`year_${i}`];
  }
  return acc;
}
