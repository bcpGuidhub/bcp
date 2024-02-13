import * as IncomeStatementField from "./data_field.js";
import { sectorsClasifications } from "../sectors.js";

export const computeRevenueRow = (aggregateResources) => {
  const { revenues } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = `annual_amount_tax_excluded_${year}`;
      const revenueYear = new IncomeStatementField.Revenues(query);
      row.setField(revenueYear);
      acc[year] = row.compute(revenues, year);
      return acc;
    },
    { field: "Chiffre d'affaires" }
  );
};
export const computeRevenueSourcesRow = (aggregateResources) => {
  const { revenueSources, loans } = aggregateResources;
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = "amount_excluding_taxes";
      const revenueSourceYear = new IncomeStatementField.RevenueSources(query);
      const grantYear = new IncomeStatementField.Grants(null);
      row.setField(revenueSourceYear);
      let i = row.compute(revenueSources, yearLabel[year]);
      row.setField(grantYear);
      let j = row.compute(loans, yearLabel[year]);
      acc[year] = i + j;
      return acc;
    },
    { field: "Autres produits" }
  );
};
export const computeTotalExploitationproduct = (obj1, obj2) => {
  const row = {
    field: "Total des produits d'exploitation",
    year_1: obj1.year_1 + obj2.year_1,
    year_2: obj1.year_2 + obj2.year_2,
    year_3: obj1.year_3 + obj2.year_3,
    color: "#fff",
    background: "#12a8f2",
  };
  return row;
};
export const computePurchasesOfGoodsRow = (aggregateResources) => {
  const { revenues } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const revenueYear = new IncomeStatementField.StockPurchased(null);
      row.setField(revenueYear);
      acc[year] = row.compute(revenues, year);
      return acc;
    },
    { field: "Achats de marchandises" }
  );
};
export const computeStockVariation = (aggregateResources) => {
  const { revenues } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const revenueYear = new IncomeStatementField.StockVariation(null);
      row.setField(revenueYear);
      acc[year] = row.compute(revenues, year);
      return acc;
    },
    { field: "Variation de stocks" }
  );
};
export const computeExpenseRow = (aggregateResources) => {
  const { expenses } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = `annual_amount_tax_inc_${year[year.length - 1]}`;
      const expensesYear = new IncomeStatementField.Expenses(query);
      row.setField(expensesYear);
      acc[year] = row.compute(expenses, year);
      return acc;
    },
    { field: "Frais généraux" }
  );
};
export const computeDuesTaxesRow = (aggregateResources) => {
  const { employees } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = null;
      const employeeSalaries = new IncomeStatementField.DuesTaxes(query);
      row.setField(employeeSalaries);
      acc[year] = row.compute(employees, yearLabel[year]) * (1.23 / 100);
      return acc;
    },
    { field: "Impôts et taxes" }
  );
};
export const computeDirectorNetEarningRow = (aggregateResources) => {
  const { directors, legal } = aggregateResources;
  if (
    (legal.legal_status_idea === "Entreprise individuelle" ||
      legal.legal_status_idea === "EIRL") &&
    (legal.tax_system === "IR" || legal.tax_system === "Micro-entreprise")
  ) {
    return {
      field: "Salaires nets des dirigeants",
      year_1: 0,
      year_2: 0,
      year_3: 0,
    };
  }
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = `net_compensation_${year}`;
      const employeeEarnings = new IncomeStatementField.DirectorNetEarning(
        query
      );
      row.setField(employeeEarnings);
      acc[year] = row.compute(directors, year);
      return acc;
    },
    { field: "Salaires nets des dirigeants" }
  );
};
export const computeSocialCotisationRow = (aggregateResources) => {
  const { directors } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = `cotisations_sociales_${year}`;
      const socialCotisation = new IncomeStatementField.SocialCotisation(query);
      row.setField(socialCotisation);
      acc[year] = row.compute(directors, year);
      return acc;
    },
    { field: "Cotisations sociales des dirigeants" }
  );
};
export const computeMicroEntrepriseSocialCotisationRow = (
  aggregateResources
) => {
  const row = new IncomeStatementField.FieldEntry();
  const socialCotisation =
    new IncomeStatementField.SocialCotisationMicroEntreprise(null);
  row.setField(socialCotisation);
  return row.compute(aggregateResources, null);
};
export const recomputeDirectorSocialCotisationRow = async (
  aggregateResources,
  marginRow,
  expenseRow,
  duesTaxesRow,
  employeeSalariesRow,
  employeeSocialContributionsRow,
  depreciationAmortizationRow,
  financialResultRow
) => {
  const { directors, legal, project } = aggregateResources;
  const renumerations = {
    year_1:
      marginRow.year_1 -
      (expenseRow.year_1 -
        duesTaxesRow.year_1 -
        employeeSalariesRow.year_1 -
        employeeSocialContributionsRow.year_1 -
        depreciationAmortizationRow.year_1) +
      financialResultRow.year_1,
    year_2:
      marginRow.year_2 -
      (expenseRow.year_2 -
        duesTaxesRow.year_2 -
        employeeSalariesRow.year_2 -
        employeeSocialContributionsRow.year_2 -
        depreciationAmortizationRow.year_2) +
      financialResultRow.year_2,
    year_3:
      marginRow.year_3 -
      (expenseRow.year_3 -
        duesTaxesRow.year_3 -
        employeeSalariesRow.year_3 -
        employeeSocialContributionsRow.year_3 -
        depreciationAmortizationRow.year_3) +
      financialResultRow.year_3,
  };
  const sector = project["activity_sector"];
  const companySector = Object.keys(sectorsClasifications).find((key) =>
    sectorsClasifications[key].includes(sector)
  );
  const association = {
    directors,
    legal,
    renumerations,
    sector: companySector,
  };
  const row = new IncomeStatementField.FieldEntry();
  const query = null;
  const socialCotisation = new IncomeStatementField.SocialCotisationIR(query);
  const result = { field: "Cotisations sociales des dirigeants" };
  row.setField(socialCotisation);
  result["year_1"] = await row.compute(association, "year_1");
  result["year_2"] = await row.compute(association, "year_2");
  result["year_3"] = await row.compute(association, "year_3");
  return result;
};
export const computeEmployeeSalariesRow = (aggregateResources) => {
  const { employees } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = null;
      const employeeSalaries = new IncomeStatementField.EmployeeSalaries(query);
      row.setField(employeeSalaries);
      acc[year] = row.compute(employees, yearLabel[year]);
      return acc;
    },
    { field: "Salaires bruts des salariés" }
  );
};
export const computeEmployeeSocialContributionsRow = (aggregateResources) => {
  const { employees } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = null;
      const employeeSalaries =
        new IncomeStatementField.EmployeeSocialContributions(query);
      row.setField(employeeSalaries);
      acc[year] = row.compute(employees, yearLabel[year]);
      return acc;
    },
    { field: "Cotisations sociales patronales" }
  );
};
export const computeDepreciationAmortization = (aggregateResources) => {
  const { investments } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = null;
      const depreciationAmortization =
        new IncomeStatementField.DepreciationAmortization(query);
      row.setField(depreciationAmortization);
      acc[year] = row.compute(investments, yearLabel[year]);
      return acc;
    },
    { field: "Dotations aux amortissements" }
  );
};
export const computeFinancialProductsRow = (aggregateResources) => {
  const { revenueSources } = aggregateResources;
  const yearLabel = {
    year_1: "Année 1",
    year_2: "Année 2",
    year_3: "Année 3",
  };
  const row = new IncomeStatementField.FieldEntry();
  return ["year_1", "year_2", "year_3"].reduce(
    (acc, year) => {
      const query = "amount_excluding_taxes";
      const revenueSourceYear = new IncomeStatementField.FinancialProducts(
        query
      );
      row.setField(revenueSourceYear);
      acc[year] = row.compute(revenueSources, yearLabel[year]);
      return acc;
    },
    { field: "Produits financiers" }
  );
};
export const computeFinancialExpenses = (aggregateResources) => {
  const { loans } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const query = null;
  const financialExpenses = new IncomeStatementField.FinancialExpenses(query);
  row.setField(financialExpenses);
  row.compute(loans, null);
  return Object.assign(
    {},
    { field: "Charges financières" },
    row.compute(loans, null)
  );
};
export const computeMarginRow = (c6, c7, c8) => {
  const row = {
    field: "Marge brute d'exploitation",
    year_1: c6.year_1 - (c7.year_1 + c8.year_1),
    year_2: c6.year_2 - (c7.year_2 + c8.year_2),
    year_3: c6.year_3 - (c7.year_3 + c8.year_3),
    color: "rgb(255, 255, 255)",
    fontStyle: "italic",
    background: "rgb(102 102 102)",
  };
  return row;
};
export const computeTotalExploitationCharges = (
  c7,
  c8,
  c10,
  c11,
  c12,
  C13,
  c14,
  c15,
  c16
) => {
  const row = {
    field: "Total des charges d'exploitation",
    year_1:
      c7.year_1 +
      c8.year_1 +
      c10.year_1 +
      c11.year_1 +
      c12.year_1 +
      C13.year_1 +
      c14.year_1 +
      c15.year_1 +
      c16.year_1,
    year_2:
      c7.year_2 +
      c8.year_2 +
      c10.year_2 +
      c11.year_2 +
      c12.year_2 +
      C13.year_2 +
      c14.year_2 +
      c15.year_2 +
      c16.year_2,
    year_3:
      c7.year_3 +
      c8.year_3 +
      c10.year_3 +
      c11.year_3 +
      c12.year_3 +
      C13.year_3 +
      c14.year_3 +
      c15.year_3 +
      c16.year_3,
    color: "#fff",
    background: "#12a8f2",
  };
  return row;
};
export const computeOperatingResultsRow = (c6, c18) => {
  const row = {
    field: "Résultat d'exploitation",
    year_1: c6.year_1 - c18.year_1,
    year_2: c6.year_2 - c18.year_2,
    year_3: c6.year_3 - c18.year_3,
    color: "#fff",
    background: "#2578a1",
  };
  return row;
};
export const computeFinancialResultRow = (c20, c21) => {
  const row = {
    field: "Résultat financier",
    year_1: c20.year_1 - c21.year_1,
    year_2: c20.year_2 - c21.year_2,
    year_3: c20.year_3 - c21.year_3,
    color: "#fff",
    background: "#2578a1",
  };
  return row;
};
export const computeCurrentResultBeforeTaxRow = (c22, c19) => {
  const row = {
    field: "Résultat courant avant impôts",
    year_1: c22.year_1 + c19.year_1,
    year_2: c22.year_2 + c19.year_2,
    year_3: c22.year_3 + c19.year_3,
    color: "#fff",
    background: "#2578a1",
  };
  return row;
};
export const computeIncomeTaxRow = (aggregateResources, c23) => {
  const { legal } = aggregateResources;
  const row = new IncomeStatementField.FieldEntry();
  const IncomeTaxYear = new IncomeStatementField.IncomeTax(null);
  row.setField(IncomeTaxYear);
  let association = {
    legal,
    ResultBeforeTax: c23,
  };

  return {
    field: "Impôts sur les bénéfices",
    ...row.compute(association, null),
  };
};
export const computeNetResultRow = (c21, c22) => {
  const row = {
    field: "Résultat de l'exercice",
    year_1: c21.year_1 - c22.year_1,
    year_2: c21.year_2 - c22.year_2,
    year_3: c21.year_3 - c22.year_3,
    color: "#fff",
    background: "#fe6018",
  };
  return row;
};
export const computeIncomeStatement = async (aggregateResources) => {
  const { legal } = aggregateResources;
  let rows = [];
  let socialCotisationRow = {
    field: "Cotisations sociales des dirigeants",
    year_1: 0,
    year_2: 0,
    year_3: 0,
  };
  const revenuesRow = computeRevenueRow(aggregateResources);
  const revenueSourcesRow = computeRevenueSourcesRow(aggregateResources);
  const totalExploitationproductRow = computeTotalExploitationproduct(
    revenuesRow,
    revenueSourcesRow
  );
  const purchasesOfGoodsRow = computePurchasesOfGoodsRow(aggregateResources);
  const stockVariationRow = computeStockVariation(aggregateResources);
  const marginRow = computeMarginRow(
    totalExploitationproductRow,
    purchasesOfGoodsRow,
    stockVariationRow
  );
  const expenseRow = computeExpenseRow(aggregateResources);
  const duesTaxesRow = computeDuesTaxesRow(aggregateResources);
  if (
    !(
      legal.tax_system === "IR" &&
      legal.social_security_scheme === "Sécurité sociale des indépendants"
    )
  ) {
    socialCotisationRow = computeSocialCotisationRow(aggregateResources);
  }
  if (legal.tax_system === "Micro-entreprise") {
    socialCotisationRow =
      computeMicroEntrepriseSocialCotisationRow(aggregateResources);
  }
  const directorNetEarningRow =
    computeDirectorNetEarningRow(aggregateResources);
  const employeeSalariesRow = computeEmployeeSalariesRow(aggregateResources);
  const employeeSocialContributionsRow =
    computeEmployeeSocialContributionsRow(aggregateResources);
  const depreciationAmortizationRow =
    computeDepreciationAmortization(aggregateResources);
  let totalExploitationChargesRow = computeTotalExploitationCharges(
    purchasesOfGoodsRow,
    stockVariationRow,
    expenseRow,
    duesTaxesRow,
    directorNetEarningRow,
    socialCotisationRow,
    employeeSalariesRow,
    employeeSocialContributionsRow,
    depreciationAmortizationRow
  );
  let operatingResultsRow = computeOperatingResultsRow(
    totalExploitationproductRow,
    totalExploitationChargesRow
  );
  const financialProductsRow = computeFinancialProductsRow(aggregateResources);
  const financialExpenses = computeFinancialExpenses(aggregateResources);
  const financialResultRow = computeFinancialResultRow(
    financialProductsRow,
    financialExpenses
  );
  if (
    legal.tax_system === "IR" &&
    legal.social_security_scheme === "Sécurité sociale des indépendants"
  ) {
    socialCotisationRow = await recomputeDirectorSocialCotisationRow(
      aggregateResources,
      marginRow,
      expenseRow,
      duesTaxesRow,
      employeeSalariesRow,
      employeeSocialContributionsRow,
      depreciationAmortizationRow,
      financialResultRow
    );
    totalExploitationChargesRow = computeTotalExploitationCharges(
      purchasesOfGoodsRow,
      stockVariationRow,
      expenseRow,
      duesTaxesRow,
      directorNetEarningRow,
      socialCotisationRow,
      employeeSalariesRow,
      employeeSocialContributionsRow,
      depreciationAmortizationRow
    );
    operatingResultsRow = computeOperatingResultsRow(
      totalExploitationproductRow,
      totalExploitationChargesRow
    );
  }
  const currentResultBeforeTaxRow = computeCurrentResultBeforeTaxRow(
    financialResultRow,
    operatingResultsRow
  );
  const incomeTaxRow = computeIncomeTaxRow(
    aggregateResources,
    currentResultBeforeTaxRow
  );
  const resultRow = computeNetResultRow(
    currentResultBeforeTaxRow,
    incomeTaxRow
  );
  rows.push(
    revenuesRow,
    revenueSourcesRow,
    totalExploitationproductRow,
    purchasesOfGoodsRow,
    stockVariationRow,
    marginRow,
    expenseRow,
    duesTaxesRow,
    directorNetEarningRow,
    socialCotisationRow,
    employeeSalariesRow,
    employeeSocialContributionsRow,
    depreciationAmortizationRow,
    totalExploitationChargesRow,
    operatingResultsRow,
    financialProductsRow,
    financialExpenses,
    financialResultRow,
    currentResultBeforeTaxRow,
    incomeTaxRow,
    resultRow
  );
  return rows;
};
const IncomeStatement = async (aggregateResources) => {
  const obj = {};
  const columns = [
    {
      id: "field",
      label: "",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "#2578a1",
    },
    {
      id: "year_1",
      label: "Année 1",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "#2578a1",
    },
    {
      id: "year_2",
      label: "Année 2",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "#2578a1",
    },
    {
      id: "year_3",
      label: "Année 3",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "#2578a1",
    },
  ];
  console.log("IncomeStatement -- aggregateResources --", aggregateResources);
  obj["rows"] = await computeIncomeStatement(aggregateResources);
  obj["columns"] = columns;
  return obj;
};

export default IncomeStatement;
