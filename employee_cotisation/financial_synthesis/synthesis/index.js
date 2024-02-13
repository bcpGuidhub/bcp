const defaultNotesOnFinance = {
  result_year_1: 0,
  result_year_2: 0,
  result_year_3: 0,
  treasury_year_1: 0,
  treasury_year_2: 0,
  treasury_year_3: 0,
  personal_deposits: 0,
  director_salary_year_1: 0,
  director_salary_year_2: 0,
  director_salary_year_3: 0,
};
const computeFinancialNotes = (
  incomeStatement,
  treasury,
  capital,
  currentDirectorAccount,
  loans,
  aggregateResources
) => {
  const review = {};
  let year1Salary = 0;
  const { directors, legal } = aggregateResources;
  let obj = Object.assign({}, defaultNotesOnFinance);
  if (
    directors.length > 0 &&
    ((legal.legal_status_idea === "Entreprise individuelle" &&
      legal.tax_system === "IR") ||
      (legal.legal_status_idea === "EIRL" && legal.tax_system === "IR"))
  ) {
    const director = directors[0];
    const query = "net_compensation_year_1";
    year1Salary = parseInt(director[query].replace(/\s/g, ""), 10);
  }
  const c =
    (capital[0]["liability_net"] +
      year1Salary +
      currentDirectorAccount[0]["liability_net"]) /
    (capital[0]["liability_net"] +
      year1Salary +
      currentDirectorAccount[0]["liability_net"] +
      loans["year_1"]);
  const deposits = isNaN(c) ? 0 : c;

  const incomeStatementSize = incomeStatement.length - 1;
  obj["result_year_1"] =
    incomeStatement[incomeStatementSize].year_1 > 0 ? 1 : 0;
  obj["result_year_2"] =
    incomeStatement[incomeStatementSize].year_2 > 0 ? 1 : 0;
  obj["result_year_3"] =
    incomeStatement[incomeStatementSize].year_3 > 0 ? 1 : 0;

  let l = treasury[0].length;
  obj["treasury_year_1"] = treasury[0][l - 1]["month_12"] > 0 ? 1 : 0;
  obj["treasury_year_2"] = treasury[1][l - 1]["month_12"] > 0 ? 1 : 0;
  obj["treasury_year_3"] = treasury[2][l - 1]["month_12"] > 0 ? 1 : 0;

  obj["personal_deposits"] = deposits > 0.25 ? 1 : 0;
  review["personal_deposits"] = deposits;

  if (
    directors.length > 0 &&
    ((legal.legal_status_idea === "Entreprise individuelle" &&
      (legal.tax_system === "IR" || legal.tax_system === "Micro-entreprise")) ||
      (legal.legal_status_idea === "EIRL" &&
        (legal.tax_system === "IR" || legal.tax_system === "Micro-entreprise")))
  ) {
    obj["director_salary_year_1"] =
      directors[0].net_compensation_year_1 > 0 ? 1 : 0;
    obj["director_salary_year_2"] =
      directors[0].net_compensation_year_2 > 0 ? 1 : 0;
    obj["director_salary_year_3"] =
      directors[0].net_compensation_year_3 > 0 ? 1 : 0;
  } else {
    obj["director_salary_year_1"] = incomeStatement[8].year_1 > 0 ? 1 : 0;
    obj["director_salary_year_2"] = incomeStatement[8].year_2 > 0 ? 1 : 0;
    obj["director_salary_year_3"] = incomeStatement[8].year_3 > 0 ? 1 : 0;
  }

  const score = Object.keys(obj).reduce((acc, v) => {
    acc += obj[v];
    return acc;
  }, 0);
  review["details"] = obj;
  review["score"] = score;
  if (score > 5) {
    review["stable"] = true;
  } else {
    review["stable"] = false;
  }
  return review;
};
const computeFinancialSynthesis = (incomeStatement, treasury) => {
  let obj = [];
  let l = treasury[0].length;
  const totalRevenues = {
    name: "Le montant total du chiffre d’affaires",
    type: "bar",
    data: [
      Number.parseFloat(incomeStatement[0].year_1).toFixed(0),
      Number.parseFloat(incomeStatement[0].year_2).toFixed(0),
      Number.parseFloat(incomeStatement[0].year_3).toFixed(0),
    ],
  };
  obj.push(totalRevenues);
  const incomeStatementSize = incomeStatement.length - 1;
  const totalResult = {
    name: "Le montant total du résultat net",
    type: "bar",
    data: [
      Number.parseFloat(incomeStatement[incomeStatementSize].year_1).toFixed(0),
      Number.parseFloat(incomeStatement[incomeStatementSize].year_2).toFixed(0),
      Number.parseFloat(incomeStatement[incomeStatementSize].year_3).toFixed(0),
    ],
  };
  obj.push(totalResult);
  const totalTreasury = {
    name: "Le montant de la trésorerie en fin d’année",
    type: "bar",
    data: [
      Number.parseFloat(treasury[0][l - 1]["month_12"]).toFixed(0),
      Number.parseFloat(treasury[1][l - 1]["month_12"]).toFixed(0),
      Number.parseFloat(treasury[2][l - 1]["month_12"]).toFixed(0),
    ],
  };
  obj.push(totalTreasury);
  return obj;
};
const computeFinancialVerification = (
  treasury,
  capital,
  currentDirectorAccount,
  loans
) => {
  let obj = {};
  const c =
    (capital[0]["liability_net"] + currentDirectorAccount[0]["liability_net"]) /
    (capital[0]["liability_net"] +
      currentDirectorAccount[0]["liability_net"] +
      loans["year_1"]);
  const deposits = isNaN(c) ? 0 : c;

  let l = treasury[0].length;
  obj["treasury_year_1"] = treasury[0][l - 1]["month_12"];

  obj["personal_deposits"] = deposits;
  return obj;
};
export const Synthesis = (
  incomeStatement,
  treasury,
  balanceSheet,
  financialPlan,
  aggregateResources
) => {
  const obj = {};
  const capital = [];
  balanceSheet.forEach((category, i) => {
    const row = category.find((row) => row.liability === "Capital");
    capital.push(row);
  });
  const currentDirectorAccount = [];
  balanceSheet.forEach((category, i) => {
    const row = category.find(
      (row) => row.liability === "Comptes courants d'associés"
    );
    currentDirectorAccount.push(row);
  });
  const loans = financialPlan.find(
    (row) => row.field === "Souscriptions d’emprunts"
  );
  obj["financial_review"] = computeFinancialNotes(
    incomeStatement,
    treasury,
    capital,
    currentDirectorAccount,
    loans,
    aggregateResources
  );
  obj["financial_plot"] = computeFinancialSynthesis(incomeStatement, treasury);

  return obj;
};
export const financialVerification = (
  treasury,
  balanceSheet,
  financialPlan
) => {
  const obj = {};
  const capital = [];
  balanceSheet.forEach((category, i) => {
    const row = category.find((row) => row.liability === "Capital");
    capital.push(row);
  });
  const currentDirectorAccount = [];
  balanceSheet.forEach((category, i) => {
    const row = category.find(
      (row) => row.liability === "Comptes courants d'associés"
    );
    currentDirectorAccount.push(row);
  });

  const loans = financialPlan.find(
    (row) => row.field === "Souscriptions d’emprunts"
  );
  obj["financial_review"] = computeFinancialVerification(
    treasury,
    capital,
    currentDirectorAccount,
    loans
  );
  obj["loans"] = loans;
  obj["capital_contributions"] = capital;
  obj["partner_contributions"] = currentDirectorAccount;
  obj["treasury"] = treasury;
  return obj;
};
