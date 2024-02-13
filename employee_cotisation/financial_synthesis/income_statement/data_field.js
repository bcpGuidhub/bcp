import { supportedSituation } from "../situtations.js";
import cotisation from "../../lib/index.js";
import currency from "currency.js";
import { buildRevenueSchedule } from "../treasury/data_field.js";
const euro = (value) =>
  currency(value, {
    symbol: "€",
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: " ",
    decimal: ",",
    precision: 2,
  });
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
const yearIntTable = {
  "Année 1": 1,
  "Année 2": 2,
  "Année 3": 3,
};
const yearOrdering = { "Année 1": 1, "Année 2": 2, "Année 3": 3 };
export const microEntrepriseCotisation = {
  acre: {
    oui: {
      serviceProvider: {
        year_1: 0.11,
        year_2: 0.22,
        year_3: 0.22,
      },
      trader: {
        year_1: 0.064,
        year_2: 0.128,
        year_3: 0.128,
      },
    },
    non: {
      serviceProvider: {
        year_1: 0.22,
        year_2: 0.22,
        year_3: 0.22,
      },
      trader: {
        year_1: 0.128,
        year_2: 0.128,
        year_3: 0.128,
      },
    },
  },
};
export const microEntrepriseActivityCategory = {
  trader: [
    "Bijouterie - Joaillerie",
    "Boucherie - Charcuterie",
    "Boulangerie - Pâtisserie",
    "Biscuiterie",
    "Caviste",
    "Chocolaterie - confiserie",
    "Cordonnerie",
    "Ébénisterie",
    "Fabrication de boissons alcoolisées",
    "Fabrication de textiles",
    "Ferronnerie",
    "Fleuriste",
    "Fromagerie",
    "Hôtellerie",
    "Poissonnerie",
    "Restauration rapide à livrer ou à emporter",
    "Traiteur",
    "Verrerie",
    "Bar, café, débit de tabac",
    "Commerce de détail alimentaire",
    "Commerce de détail non alimentaire",
    "Commerce de gros",
    "Commerce de véhicules",
    "E-commerce",
    "Galerie d'art",
    "Jardinerie",
    "Location d'équipements et de matériels",
    "Presse et médias",
    "Industrie",
    "Restauration traditionnelle",
    "Restauration rapide sur place",
    "Salle de sport - fitness",
  ],
  serviceProvider: [
    "Électricité",
    "Travaux publics",
    "Carrosserie",
    "Carrelage et sols",
    "Couverture",
    "Cuisiniste",
    "Crèche",
    "Déménagement",
    "Démolition",
    "Optique et lunetterie",
    "Institut de beauté",
    "Maçonnerie",
    "Menuiserie",
    "Paysagiste",
    "Spectacle vivant",
    "Peinture en bâtiment",
    "Salon de coiffure",
    "Transport léger de marchandises",
    "Transport lourd de marchandises",
    "Plâtrerie - Isolation",
    "Plomberie-chauffage",
    "Agence de sécurité",
    "Agence de voyage",
    "Agent commercial",
    "Agence immobilière",
    "Architecte d'intérieur",
    "Taxi",
    "VTC",
    "Diagnostic immobilier",
    "Services administratifs",
    "Entretien et réparation de véhicules",
    "Services à la personne",
    "Ambulance",
    "Agence de communication ou publicité",
    "Agence marketing",
    "Agence web",
    "Agent général d'assurance",
    "Architecte",
    "Auto-école",
    "Avocat",
    "Bureau d'études",
    "Cabinet de diététique",
    "Coach sportif",
    "Conseil et activités informatiques",
    "Consulting et conseil",
    "Courtage en assurance",
    "Courtage en financement",
    "Designer",
    "Décoration d'intérieur",
    "Enseignement privé",
    "Formation",
    "Géomètre-expert",
    "Graphiste",
    "Kinésithérapie",
    "Médecine",
    "Médecine douce",
    "Ostéopathie",
    "Pharmacie",
    "Vétérinaire",
    "Autre activité libérale",
  ],
  exception: [
    "Autre activité commerciale",
    "Autre activité artisanale",
    "Start-up",
  ],
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
 * Chiffre d’affaires
 */
export const Revenues = function (query) {
  this.query = query;
};
Revenues.prototype.compute = function (association, year) {
  return association.reduce((acc, revenue) => {
    acc += parseInt(revenue[this.query], 10);
    return acc;
  }, 0);
};

/**
 * Autres produits
 */
export const RevenueSources = function (query) {
  this.query = query;
};
RevenueSources.prototype.compute = function (association, year) {
  return association.reduce((acc, revenue_source) => {
    if (
      revenue_source.source_type === "Autre produit d'exploitation" &&
      revenue_source.year === year
    ) {
      acc += parseInt(revenue_source[this.query], 10);
    }
    return acc;
  }, 0);
};
export const Grants = function (query) {
  this.query = query;
};
Grants.prototype.compute = function (association, year) {
  return association.reduce((acc, loan) => {
    if (
      loan.type_of_external_fund === "Subvention" &&
      loan.year_of_loan_disbursement === year
    ) {
      acc += parseInt(loan["amount_loan"], 10);
    }
    return acc;
  }, 0);
};
/**
 * Achats de marchandises
 */
export const StockPurchased = function (query) {
  this.query = query;
};

StockPurchased.prototype.compute = function (association, year) {
  return association.reduce((acc, revenue) => {
    if (year === "year_1") {
      acc += computePurchasesYear1(revenue);
    }
    if (year === "year_2") {
      acc += computePurchasesYear2(revenue);
    }
    if (year === "year_3") {
      acc += computePurchasesYear3(revenue);
    }
    return acc;
  }, 0);
};
export function computeEndOfYear1Stock(revenue) {
  let endYear1Stock = 0;
  const valuationStartingStock = parseInt(
    revenue.valuation_of_starting_stock,
    10
  );
  const annualAmountTaxExcluded = parseInt(
    revenue.annual_amount_tax_excluded_year_1,
    10
  );
  const percentageMargin = parseInt(revenue.percentage_margin, 10) / 100;
  const averageStock = parseInt(revenue.mean_valuation_of_stock, 10);
  const indicator =
    valuationStartingStock - annualAmountTaxExcluded * (1 - percentageMargin) <
    averageStock;
  if (indicator) {
    endYear1Stock = averageStock;
  } else {
    endYear1Stock =
      valuationStartingStock - annualAmountTaxExcluded * (1 - percentageMargin);
  }
  return endYear1Stock;
}
export function computeEndOfYear2Stock(revenue) {
  let endYear2Stock = 0;
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
      (annualAmountTaxExcluded + annualAmountTaxExcludedYear2) *
        (1 - percentageMargin) <
    averageStock;
  if (indicator) {
    endYear2Stock = averageStock;
  } else {
    endYear2Stock =
      valuationStartingStock -
      (annualAmountTaxExcluded + annualAmountTaxExcludedYear2) *
        (1 - percentageMargin);
  }
  return endYear2Stock;
}
export function computeEndOfYear3Stock(revenue) {
  let endYear3Stock = 0;
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
      (annualAmountTaxExcluded +
        annualAmountTaxExcludedYear2 +
        annualAmountTaxExcludedYear3) *
        (1 - percentageMargin) <
    averageStock;
  if (indicator) {
    endYear3Stock = averageStock;
  } else {
    endYear3Stock =
      (annualAmountTaxExcluded +
        annualAmountTaxExcludedYear2 +
        annualAmountTaxExcludedYear3) *
      (1 - percentageMargin);
  }
  return endYear3Stock;
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

/**
 * Variation de stock
 */
export const StockVariation = function (query) {
  this.query = query;
};

StockVariation.prototype.compute = function (association, year) {
  return association.reduce((acc, revenue) => {
    if (year === "year_1") {
      acc += computeVariationsInStockYear1(revenue);
    }
    if (year === "year_2") {
      acc += computeVariationsInStockYear2(revenue);
    }
    if (year === "year_3") {
      acc += computeVariationsInStockYear3(revenue);
    }
    return acc;
  }, 0);
};

function computeVariationsInStockYear1(revenue) {
  let endYear1Stock = 0;
  if (revenue.inventory_linked_revenue === "Oui") {
    endYear1Stock = computeEndOfYear1Stock(revenue);
  }
  return -endYear1Stock;
}
function computeVariationsInStockYear2(revenue) {
  let endYear1Stock = 0;
  let endYear2Stock = 0;
  if (revenue.inventory_linked_revenue === "Oui") {
    endYear1Stock = computeEndOfYear1Stock(revenue);
    endYear2Stock = computeEndOfYear2Stock(revenue);
  }
  return endYear1Stock - endYear2Stock;
}
function computeVariationsInStockYear3(revenue) {
  let endYear2Stock = 0;
  let endYear3Stock = 0;
  if (revenue.inventory_linked_revenue === "Oui") {
    endYear2Stock = computeEndOfYear2Stock(revenue);
    endYear3Stock = computeEndOfYear3Stock(revenue);
  }
  return endYear2Stock - endYear3Stock;
}

/**
 * Dépenses
 */
export const Expenses = function (query) {
  this.query = query;
};
Expenses.prototype.compute = function (association, year) {
  let years = {
    year_1: 12,
    year_2: 24,
    year_3: 36,
  };
  return association.reduce((acc, expense) => {
    let amount = parseInt(expense[this.query], 10);
    if (expense.expenditure_partition === "Ponctuelle") {
      amount = 0;
      let i = years[year];
      let j =
        (yearIntTable[expense["one_time_payment_year"]] - 1) * 12 +
        monthIntTable[expense["one_time_payment_month"]];
      if (j <= 12) {
        if (i <= 12) {
          amount = parseInt(expense[this.query], 10);
        }
      }
      if (j > 12 && j <= 24) {
        if (i > 12 && i <= 24) {
          amount = parseInt(expense[this.query], 10);
        }
      }
      if (j > 24 && j <= 36) {
        if (i > 24 && i <= 36) {
          amount = parseInt(expense[this.query], 10);
        }
      }
    }
    acc += amount;
    return acc;
  }, 0);
};

/**
 * Impôts et taxes
 */
export const DuesTaxes = function (query) {
  this.query = query;
};
DuesTaxes.prototype.compute = function (association, year) {
  return association.reduce((acc, employee) => {
    if (employee.contract_type === "CDI") {
      acc += computeEmployeeOnCDI(
        employee,
        year,
        parseInt(employee.gross_monthly_remuneration, 10)
      );
    }
    if (employee.contract_type === "CDD") {
      acc += computeEmployeeOnCDD(
        employee,
        year,
        parseInt(employee.gross_monthly_remuneration, 10)
      );
    }
    return acc;
  }, 0);
};
/**
 * Salaires nets des dirigeants
 */
export const DirectorNetEarning = function (query) {
  this.query = query;
};
DirectorNetEarning.prototype.compute = function (association, year) {
  return association.reduce((acc, director) => {
    acc += parseInt(director[this.query].replace(/\s/g, ""), 10);
    return acc;
  }, 0);
};

/**
 * Cotisations sociales des dirigeants
 */
export const SocialCotisation = function (query) {
  this.query = query;
};
SocialCotisation.prototype.compute = function (association, year) {
  return association.reduce((acc, director) => {
    const salary = parseInt(director[this.query].replace(/\s/g, ""), 10);
    acc += isNaN(salary) ? 0 : salary;
    return acc;
  }, 0);
};
export const SocialCotisationIR = function (query) {
  this.query = query;
};
SocialCotisationIR.prototype.compute = async (association, year) => {
  const { directors, renumerations, legal, sector } = association;
  if (
    legal.legal_status_idea === "Entreprise individuelle" ||
    legal.legal_status_idea === "EIRL"
  ) {
    let situations, situation, evaluate;
    let acre;
    if (year !== "year_1") {
      acre = "non";
    } else {
      acre =
        typeof legal.micro_entreprise_accre_exemption === "undefined" ||
        legal.micro_entreprise_accre_exemption === ""
          ? "non"
          : legal.micro_entreprise_accre_exemption;
    }
    const options = {
      acre: acre,
      sector: sector,
      net: renumerations[year],
    };
    situations = supportedSituation(options);
    situation = situations["TNS"]["IR"]["ELSE"].situation;
    evaluate = situations["TNS"]["IR"]["ELSE"].evaluate;
    let v = await cotisation(situation, evaluate);
    let c = isNaN(parseFloat(v)) ? 0 : parseFloat(v);
    return parseInt(c, 10);
  } else {
    let acc = 0;
    for (const director of directors) {
      let situations, situation, evaluate;
      let acre;
      if (year !== "year_1") {
        acre = "non";
      } else {
        acre = director.director_acre;
      }
      if (legal.legal_status_idea !== "SARL") {
        const options = {
          acre: acre,
          sector: sector,
          net: renumerations[year],
        };
        situations = supportedSituation(options);
        situation = situations["TNS"]["IR"]["ELSE"].situation;
        evaluate = situations["TNS"]["IR"]["ELSE"].evaluate;
      }
      if (legal.legal_status_idea === "SARL") {
        const options = {
          acre: acre,
          sector: sector,
          net:
            renumerations[year] *
            (parseInt(director.percentage_equity_capital, 10) / 100),
        };
        situations = supportedSituation(options);
        situation = situations["TNS"]["IR"]["SARL"].situation;
        evaluate = situations["TNS"]["IR"]["SARL"].evaluate;
      }
      let v = await cotisation(situation, evaluate);
      let c = isNaN(parseFloat(v)) ? 0 : parseFloat(v);
      acc += parseInt(c, 10);
    }
    return acc;
  }
};
export const SocialCotisationMicroEntreprise = function (query) {
  this.query = query;
};
SocialCotisationMicroEntreprise.prototype.compute = function (association, y) {
  const totalAnnualRevenue = computeAnnualRevenueMicroEntreprise(association);
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
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const rate = microEntrepriseCotisation.acre[acre][sectorPlacement][year];
      acc[year] = totalAnnualRevenue[year] * rate;
      return acc;
    },
    { field: "Cotisations sociales des dirigeants" }
  );
};
export function computeAnnualRevenueMicroEntreprise(association) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return buildRevenueSchedule(association.revenues).reduce((acc, year, i) => {
    acc[`year_${i + 1}`] = year.reduce(reducer);
    return acc;
  }, {});
}
/**
 * Salaires bruts des salariés
 */
export const EmployeeSalaries = function (query) {
  this.query = query;
};
EmployeeSalaries.prototype.compute = function (association, year) {
  return association.reduce((acc, employee) => {
    if (employee.contract_type === "CDI") {
      acc += computeEmployeeOnCDI(
        employee,
        year,
        parseInt(employee.gross_monthly_remuneration, 10)
      );
    }
    if (employee.contract_type === "CDD") {
      acc += computeEmployeeOnCDD(
        employee,
        year,
        parseInt(employee.gross_monthly_remuneration, 10)
      );
    }
    return acc;
  }, 0);
};

/**
 * Cotisations sociales patronales
 */
export const EmployeeSocialContributions = function (query) {
  this.query = query;
};
EmployeeSocialContributions.prototype.compute = function (association, year) {
  return association.reduce((acc, employee) => {
    if (employee.contract_type === "CDI") {
      acc += computeEmployeeOnCDI(
        employee,
        year,
        parseInt(employee.employer_contributions.replace(/\s/g, ""), 10)
      );
    }
    if (employee.contract_type === "CDD") {
      acc += computeEmployeeOnCDD(
        employee,
        year,
        parseInt(employee.employer_contributions.replace(/\s/g, ""), 10)
      );
    }
    return acc;
  }, 0);
};

function computeEmployeeOnCDI(employee, year, amount) {
  if (employee.year_of_hire === year) {
    return monthMappingChart[employee.date_of_hire] * amount;
  } else if (yearOrdering[employee.year_of_hire] < yearOrdering[year]) {
    return 12 * amount;
  } else {
    return 0;
  }
}
function computeEmployeeOnCDD(employee, year, amount) {
  const yearSpace = { "Année 1": 2, "Année 2": 1, "Année 3": 0 };
  const duration = parseInt(employee.contract_duration, 10);
  const yearDiff = yearSpace[employee.year_of_hire] - yearSpace[year];
  if (employee.year_of_hire === year) {
    let p = monthMappingChart[employee.date_of_hire];
    if (p < duration) {
      return p * amount;
    }
    return duration * amount;
  } else if (yearOrdering[employee.year_of_hire] < yearOrdering[year]) {
    let p = monthMappingChart[employee.date_of_hire];
    let o = p + 12 * yearDiff;
    if (o <= duration) {
      return 12 * amount;
    } else {
      const r = o - 12;
      if (r > duration) {
        return 0;
      } else {
        return (duration - r) * amount;
      }
      // if (yearDiff === 1) {
      //   return (duration - monthMappingChart[employee.date_of_hire]) * amount;
      // }
      // if (yearDiff === 2) {
      //   return (
      //     (duration - (monthMappingChart[employee.date_of_hire] + 12)) * amount
      //   );
      // }
    }
  } else {
    return 0;
  }
}

/**
 * Dotations aux amortissements
 */
export const DepreciationAmortization = function (query) {
  this.query = query;
};
DepreciationAmortization.prototype.compute = function (association, year) {
  return association.reduce((acc, investment) => {
    if (investment.duration === "Non amortissable") {
      acc += 0;
    } else {
      acc += computeDepreciationAmortization(
        investment,
        year,
        parseInt(investment.investment_amount_tax_included, 10)
      );
    }
    return acc;
  }, 0);
};

export function computeDepreciationAmortization(investment, year, amount) {
  const yearSpace = { "Année 1": 2, "Année 2": 1, "Année 3": 0 };
  const duration = parseInt(investment.duration, 10);
  const yearDiff = yearSpace[investment.year_of_purchase] - yearSpace[year];
  if (investment.year_of_purchase === year) {
    let p = monthMappingChart[investment.month_of_purchase];
    if (p <= duration) {
      return (amount / duration) * p;
    }
    return amount;
  } else if (yearOrdering[investment.year_of_purchase] < yearOrdering[year]) {
    let p = monthMappingChart[investment.month_of_purchase];
    let o = p + 12 * yearDiff;
    if (o <= duration) {
      return (amount / duration) * 12;
    } else {
      const r = o - 12;
      if (r > duration) {
        return 0;
      } else {
        return (amount / duration) * (duration - r);
      }
    }
  } else {
    return 0;
  }
}

/**
 * Produits financiers
 */
export const FinancialProducts = function (query) {
  this.query = query;
};
FinancialProducts.prototype.compute = function (association, year) {
  return association.reduce((acc, revenue_source) => {
    if (
      revenue_source.source_type === "Produit financier" &&
      revenue_source.year === year
    ) {
      acc += parseInt(revenue_source[this.query], 10);
    }
    return acc;
  }, 0);
};

/**
 * Charges financières
 */
export const FinancialExpenses = function (query) {
  this.query = query;
};
FinancialExpenses.prototype.compute = function (association, year) {
  return computeFinancialExpenses(association);
};
export function computeFinancialExpenses(association) {
  const years = ["year_1", "year_2", "year_3"];
  const annualPayments = association.reduce(
    (acc, loan) => {
      if (
        loan.type_of_external_fund === "Prêt bancaire" ||
        loan.type_of_external_fund === "Prêt d'honneur" ||
        loan.type_of_external_fund === "Autre prêt"
      ) {
        const possibleDuration = computePaymentSchedule(loan);
        const payments = computeAnnualLoanPayments(loan, possibleDuration);
        acc[0].push(payments[0]);
        acc[1].push(payments[1]);
        acc[2].push(payments[2]);
        return acc;
      }
      return acc;
    },
    [[], [], []]
  );
  return years.reduce((acc, year, i) => {
    acc[year] = annualPayments[i].reduce((acx, v) => {
      acx += v;
      return acx;
    }, 0);
    return acc;
  }, {});
}
function computePaymentSchedule(loan) {
  const yearSpace = { "Année 1": 2, "Année 2": 1, "Année 3": 0 };
  const paymentSchedule = [];
  let index = 0;
  for (const i in yearSpace) {
    const yearDiff = yearSpace[loan.year_of_loan_disbursement] - yearSpace[i];
    const duration = parseInt(loan.loan_duration, 10);
    if (loan.year_of_loan_disbursement === i) {
      let p = monthMappingChart[loan.month_of_loan_disbursement];
      if (p <= duration) {
        paymentSchedule[index] = p;
      } else {
        paymentSchedule[index] = duration;
      }
    } else if (yearOrdering[loan.year_of_loan_disbursement] < yearOrdering[i]) {
      let p = monthMappingChart[loan.month_of_loan_disbursement];
      let o = p + 12 * yearDiff;
      if (o <= duration) {
        paymentSchedule[index] = 12;
      } else {
        const r = o - 12;
        if (r > duration) {
          paymentSchedule[index] = 0;
        } else {
          paymentSchedule[index] = duration - r;
        }
      }
    } else {
      paymentSchedule[index] = 0;
    }
    ++index;
  }
  return paymentSchedule;
}
function computeAnnualLoanPayments(loan, possibleDuration) {
  let amount = parseInt(loan.amount_loan, 10);
  let rate = loan.loan_rate / 100 / 12;
  let payment = loan.amount_monthly_payments;
  let interest = 0;
  let repaidAmount = 0;
  let acc = [];
  let interestAccumulation = 0;
  for (const iterations of possibleDuration) {
    const year = new Array(iterations);
    year.fill(0);
    for (const _ of year) {
      interest = amount * rate;
      repaidAmount = euro(payment).subtract(interest);
      amount = amount - repaidAmount;
      interestAccumulation += interest;
    }
    acc.push(interestAccumulation);
    interestAccumulation = 0;
  }
  return acc;
}

/**
 * IS
 */
export const IncomeTax = function (query) {
  this.query = query;
};
IncomeTax.prototype.compute = function (association, year) {
  const incomeTax = {};
  let taxableProfitYear1 = 0;
  let taxableProfitYear2 = 0;
  let taxableProfitYear3 = 0;
  if (
    typeof association.legal === "undefined" ||
    association.legal.tax_system === "IR" ||
    association.legal.tax_system === "Micro-entreprise"
  ) {
    return {
      year_1: 0,
      year_2: 0,
      year_3: 0,
    };
  }
  taxableProfitYear1 = association.ResultBeforeTax.year_1;
  computetaxableProfit(taxableProfitYear1, incomeTax, "year_1");

  taxableProfitYear2 = association.ResultBeforeTax.year_2;
  if (taxableProfitYear1 < 0) {
    taxableProfitYear2 += taxableProfitYear1;
  }
  computetaxableProfit(taxableProfitYear2, incomeTax, "year_2");

  taxableProfitYear3 = association.ResultBeforeTax.year_3;
  if (taxableProfitYear2 < 0) {
    taxableProfitYear3 += taxableProfitYear2;
  }
  computetaxableProfit(taxableProfitYear3, incomeTax, "year_3");

  return incomeTax;
};

function computetaxableProfit(taxableProfit, incomeTax, key) {
  if (taxableProfit <= 0) {
    incomeTax[key] = 0;
  } else if (taxableProfit <= 38120) {
    incomeTax[key] = taxableProfit * 0.15;
  } else {
    incomeTax[key] = 38120 * 0.15 + (taxableProfit - 38120) * (26.5 / 100);
  }
}
