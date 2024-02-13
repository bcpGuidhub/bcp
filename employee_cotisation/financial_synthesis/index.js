import IncomeStatement from "./income_statement/index.js";
import { computeAnnualRevenueMicroEntreprise } from "./income_statement/data_field.js";
import Treasury from "./treasury/index.js";
import BalanceSheet from "./balance_sheet/index.js";
import FinancialPlan from "./financial_plan/index.js";
import { Synthesis, financialVerification } from "./synthesis/index.js";

export const financialSynthesis = async (resources) => {
  const obj = {};
  console.log("financialSynthesis -- resources --", resources);
  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_legal_status,
    project: resources.project_details,
  };
  console.log(
    "financialSynthesis -- aggregateResources --",
    aggregateResources
  );
  obj["income_statement"] = await IncomeStatement(aggregateResources);
  obj["treasury"] = Treasury(aggregateResources, obj["income_statement"].rows);
  obj["balance_sheet"] = BalanceSheet(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  obj["financial_plan"] = FinancialPlan(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  obj["financial_analysis"] = Synthesis(
    obj["income_statement"].rows,
    obj["treasury"].rows,
    obj["balance_sheet"].rows,
    obj["financial_plan"].rows,
    aggregateResources
  );
  return obj;
};

export const disbursements = async (resources) => {
  const obj = {};
  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_legal_status,
    project: resources.project_details,
  };
  console.log("aggregateResources --- ", aggregateResources);
  obj["income_statement"] = await IncomeStatement(aggregateResources);
  obj["treasury"] = Treasury(aggregateResources, obj["income_statement"].rows);
  return obj;
};

export const financialSituation = async (resources) => {
  const obj = {};
  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_details.project_legal_status,
    project: resources.project_details.project,
  };
  obj["income_statement"] = await IncomeStatement(aggregateResources);
  obj["treasury"] = Treasury(aggregateResources, obj["income_statement"].rows);
  obj["balance_sheet"] = BalanceSheet(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  obj["financial_plan"] = FinancialPlan(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  return financialVerification(
    obj["treasury"].rows,
    obj["balance_sheet"].rows,
    obj["financial_plan"].rows
  );
};

export const incomeSituation = async (resources) => {
  const obj = {};
  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_details.project_legal_status,
    project: resources.project_details.project,
  };
  obj["income_statement"] = await IncomeStatement(aggregateResources);
  return obj;
};

export const microReelIncomeStatement = async (resources) => {
  const obj = {};

  console.log("-- resources -- : ", resources);

  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_legal_status,
    project: resources.project_details,
  };
  console.log("aggregateResources : ", aggregateResources);
  obj["micro"] = await IncomeStatement(aggregateResources);
  aggregateResources.legal["tax_system"] = "IR";
  aggregateResources.legal["social_security_scheme"] =
    "Sécurité sociale des indépendants";

  obj["reel"] = await IncomeStatement(aggregateResources);

  obj["revenue_collected"] = computeAnnualRevenueMicroEntreprise({
    revenues: aggregateResources.revenues,
  });
  return obj;
};

export const financingDashboardReview = async (resources) => {
  const obj = {};
  const aggregateResources = {
    revenues:
      resources.revenues.revenues !== null ? resources.revenues.revenues : [],
    revenueSources:
      resources.revenues.revenue_sources !== null &&
      resources.revenues.revenue_sources
        ? resources.revenues.revenue_sources
        : [],
    expenses: resources.expenses !== null ? resources.expenses : [],
    directors:
      resources.employees.directors !== null && resources.employees.directors
        ? resources.employees.directors
        : [],
    employees:
      resources.employees.employees !== null
        ? resources.employees.employees
        : [],
    investments: resources.investments !== null ? resources.investments : [],
    loans: resources.finances.loans !== null ? resources.finances.loans : [],
    capitalContributions:
      resources.finances.capital_Contributions !== null
        ? resources.finances.capital_Contributions
        : [],
    associatesCapitalContributions:
      resources.finances.associates_capital_contributions !== null
        ? resources.finances.associates_capital_contributions
        : [],
    legal: resources.project_details.project_legal_status,
    project: resources.project_details.project,
  };
  obj["income_statement"] = await IncomeStatement(aggregateResources);
  obj["treasury"] = Treasury(aggregateResources, obj["income_statement"].rows);
  obj["balance_sheet"] = BalanceSheet(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  obj["financial_plan"] = FinancialPlan(
    aggregateResources,
    obj["income_statement"].rows,
    obj["treasury"].rows
  );
  const verification = financialVerification(
    obj["treasury"].rows,
    obj["balance_sheet"].rows,
    obj["financial_plan"].rows
  );
  obj["loans"] = verification["loans"];
  obj["capital_contributions"] = verification["capital_contributions"];
  obj["partner_contributions"] = verification["partner_contributions"];
  obj["financial_review"] = verification["financial_review"];
  return obj;
};
