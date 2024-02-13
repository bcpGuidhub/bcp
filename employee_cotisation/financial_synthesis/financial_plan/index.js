import * as FinancialPlanField from "./data_field.js";
import {
  taxReceivablesRow,
  suppliers,
  taxDebt,
  socialDebt,
  socialClaimsRow,
} from "../balance_sheet/index.js";

const needsSection = () => {
  const row = {
    field: "Besoins",
    initial: null,
    year_1: null,
    year_2: null,
    year_3: null,
    color: "rgb(255,103,1)",
    fontSize: "1rem",
  };
  return row;
};
const computeIntangibleInvestmentsRow = (aggregateResources) => {
  const row = new FinancialPlanField.FieldEntry();
  const IntangibleInvestment = new FinancialPlanField.IntangibleInvestments(
    null
  );
  row.setField(IntangibleInvestment);
  const computedRow = row.compute(aggregateResources, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Investissements incorporels",
    }
  );
};
const computeTangibleInvestmentsRow = (aggregateResources) => {
  const row = new FinancialPlanField.FieldEntry();
  const TangibleInvestment = new FinancialPlanField.TangibleInvestments(null);
  row.setField(TangibleInvestment);
  const computedRow = row.compute(aggregateResources, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Investissements corporels",
    }
  );
};
const computeFinancialInvestmentsRow = (aggregateResources) => {
  const row = new FinancialPlanField.FieldEntry();
  const FinancialInvestment = new FinancialPlanField.FinancialInvestments(null);
  row.setField(FinancialInvestment);
  const computedRow = row.compute(aggregateResources, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Investissements financiers",
    }
  );
};
const computetaxesClaimsTreasury = (
  aggregateResources,
  incomeStatement,
  annualIncomeTax,
  taxReturns,
  vatRefunds
) => {
  const socialClaims = socialClaimsRow(aggregateResources, incomeStatement);
  const treasury = [
    {
      asset: "Trésorerie",
      gross: "",
      payment: "",
      asset_net: "",
      liability: "Dettes sociales",
      liability_net: "",
    },
    {
      asset: "Trésorerie",
      gross: "",
      payment: "",
      asset_net: "",
      liability: "Dettes sociales",
      liability_net: "",
    },
    {
      asset: "Trésorerie",
      gross: "",
      payment: "",
      asset_net: "",
      liability: "Dettes sociales",
      liability_net: "",
    },
    ,
  ];
  const taxReceivables = taxReceivablesRow(
    aggregateResources,
    annualIncomeTax,
    vatRefunds
  );
  suppliers(aggregateResources, taxReceivables);
  taxDebt(
    aggregateResources,
    annualIncomeTax,
    vatRefunds,
    taxReturns,
    socialClaims
  );
  socialDebt(aggregateResources, incomeStatement, treasury);
  return {
    taxReceivables,
    socialClaims,
    treasury,
  };
};
const computeVariationWorkingCapitalRow = (
  aggregateResources,
  taxesClaimsTreasury
) => {
  const association = {
    aggregateResources,
    taxesClaimsTreasury,
  };
  const row = new FinancialPlanField.FieldEntry();
  const VariationWorkingCapital = new FinancialPlanField.VariationWorkingCapital(
    null
  );
  row.setField(VariationWorkingCapital);
  const computedRow = row.compute(association, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Variation du besoin en fonds de roulement",
      background: "rgb(71,207,255)",
      color: "rgb(255, 255, 255)",
    }
  );
};
const computeLoanRepaymentsRow = (aggregateResources, financialCharges) => {
  const row = new FinancialPlanField.FieldEntry();
  const LoanRepayments = new FinancialPlanField.LoanRepayments(null);
  row.setField(LoanRepayments);
  const association = {
    aggregateResources,
    financialCharges,
  };
  const computedRow = row.compute(association, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      const val = key === "initial" ? 0 : cal;
      acc[key] = val;
      return acc;
    },
    {
      field: "Remboursements d'emprunts",
    }
  );
};
const computeAssociateContributionsRow = (aggregateResources) => {
  const {legal} = aggregateResources
  let key;
  if (legal.legal_status_idea === "Entreprise individuelle" ||
  legal.legal_status_idea === "EIRL") {
    const noopRow = new Array(4).fill(0)
    return noopRow.reduce(
      (acc, cal, j) => {
        key = j === 0 ? "initial" : `year_${j}`;
        acc[key] = cal;
        return acc;
      },
      {
        field: "Remboursements d’apports en compte courant d’associés",
      }
    );
  }
  const row = new FinancialPlanField.FieldEntry();
  const AssociateContributions = new FinancialPlanField.AssociateContributions(
    null
  );
  row.setField(AssociateContributions);
  const computedRow = row.compute(aggregateResources, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Remboursements d’apports en compte courant d’associés",
    }
  );
};
const computeTotalFinancialNeeds = (b1, b2, b3, b4, b5, b6) => {
  const initialRow = ["initial", "year_1", "year_2", "year_3"];
  return initialRow.reduce(
    (acc, cal, j) => {
      acc[cal] = b1[cal] + b2[cal] + b3[cal] + b4[cal] + b5[cal] + b6[cal];
      return acc;
    },
    {
      field: "TOTAL DES BESOINS",
      background: "rgb(61,133,198)",
      color: "rgb(255, 255, 255)",
    }
  );
};
const resourcesSection = () => {
  const row = {
    field: "Ressources",
    initial: null,
    year_1: null,
    year_2: null,
    year_3: null,
    color: "rgb(255,103,1)",
    fontSize: "1rem",
  };
  return row;
};
const computeCapitalContributionsRow = (aggregateResources) => {
  const row = new FinancialPlanField.FieldEntry();
  const CapitalContributions = new FinancialPlanField.CapitalContributions(
    null
  );
  row.setField(CapitalContributions);
  const computedRow = row.compute(aggregateResources, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Apports en capital",
    }
  );
};
const computeCurrentShareholdersAccountRow = (aggregateResources) => {
  const {legal} = aggregateResources
  let key;
  if (legal.legal_status_idea === "Entreprise individuelle" ||
  legal.legal_status_idea === "EIRL") {
    const noopRow = new Array(4).fill(0)
    return noopRow.reduce(
      (acc, cal, j) => {
        key = j === 0 ? "initial" : `year_${j}`;
        acc[key] = cal;
        return acc;
      },
      {
        field: "Apports en compte courant d'associés",
      }
    );
  }
  const row = new FinancialPlanField.FieldEntry();
  const CurrentShareholdersAccount = new FinancialPlanField.CurrentShareholdersAccount(
    null
  );
  row.setField(CurrentShareholdersAccount);
  const computedRow = row.compute(aggregateResources, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Apports en compte courant d'associés",
    }
  );
};
export const computeBorrowingRow = (aggregateResources) => {
  const row = new FinancialPlanField.FieldEntry();
  const Borrowing = new FinancialPlanField.Borrowing(null);
  row.setField(Borrowing);
  const computedRow = row.compute(aggregateResources, null);
  let key;
  return computedRow.reduce(
    (acc, cal, j) => {
      key = j === 0 ? "initial" : `year_${j}`;
      acc[key] = cal;
      return acc;
    },
    {
      field: "Souscriptions d’emprunts",
    }
  );
};
const computeSelfSustainability = (depreciationCharge, incomeStatement) => {
  const result = incomeStatement[incomeStatement.length - 1];
  const row = {
    field: "Capacité d’autofinancement",
    initial: 0,
    year_1: result.year_1 + depreciationCharge.year_1,
    year_2: result.year_2 + depreciationCharge.year_2,
    year_3: result.year_3 + depreciationCharge.year_3,
  };
  return row;
};
const computeTotalResources = (b12, b13, b14, b15) => {
  const initialRow = ["initial", "year_1", "year_2", "year_3"];
  return initialRow.reduce(
    (acc, cal, j) => {
      acc[cal] = b12[cal] + b13[cal] + b14[cal] + b15[cal];
      return acc;
    },
    {
      field: "TOTAL DES RESSOURCES",
      background: "rgb(69,114,196)",
      color: "rgb(255, 255, 255)",
    }
  );
};
const computeCashChangeRow = (b11, b17) => {
  const initialRow = ["initial", "year_1", "year_2", "year_3"];
  return initialRow.reduce(
    (acc, cal, j) => {
      acc[cal] = b17[cal] - b11[cal];
      return acc;
    },
    {
      field: "Variation de trésorerie",
      background: "rgb(71,207,255)",
      color: " rgb(255,255,255)",
    }
  );
};
const computeCashBalance = (b18) => {
  const initialRow = ["initial", "year_1", "year_2", "year_3"];
  let acc = 0;
  let row = {
    field: "SOLDE DE TRÉSORERIE",
    background: "rgb(255,103,1)",
    color: " rgb(255,255,255)",
  };
  for (const i of initialRow) {
    row[i] = acc + b18[i];
    if (i !== "initial") {
      acc = row[i];
    }
  }
  return row;
};
const computeTableCells = (
  aggregateResources,
  incomeStatement,
  financialCharges,
  annualIncomeTax,
  taxReturns,
  vatRefunds,
  depreciationCharge
) => {
  let rows = [];
  const needs = needsSection();
  const intangibleInvestments = computeIntangibleInvestmentsRow(
    aggregateResources
  );
  const tangibleInvestments = computeTangibleInvestmentsRow(aggregateResources);
  const financialInvestments = computeFinancialInvestmentsRow(
    aggregateResources
  );
  const taxesClaimsTreasury = computetaxesClaimsTreasury(
    aggregateResources,
    incomeStatement,
    annualIncomeTax,
    taxReturns,
    vatRefunds
  );
  const variationWorkingCapital = computeVariationWorkingCapitalRow(
    aggregateResources,
    taxesClaimsTreasury
  );
  const loanRepayments = computeLoanRepaymentsRow(
    aggregateResources,
    financialCharges
  );
  const associateContributions = computeAssociateContributionsRow(
    aggregateResources
  );
  const totalFinancialNeeds = computeTotalFinancialNeeds(
    intangibleInvestments,
    tangibleInvestments,
    financialInvestments,
    variationWorkingCapital,
    loanRepayments,
    associateContributions
  );
  const resources = resourcesSection();
  const capitalContributions = computeCapitalContributionsRow(
    aggregateResources
  );
  const currentShareholdersAccount = computeCurrentShareholdersAccountRow(
    aggregateResources
  );
  const borrowing = computeBorrowingRow(aggregateResources);
  const selfSustainability = computeSelfSustainability(
    depreciationCharge,
    incomeStatement
  );
  const totalResources = computeTotalResources(
    capitalContributions,
    currentShareholdersAccount,
    borrowing,
    selfSustainability
  );
  const cashChange = computeCashChangeRow(totalFinancialNeeds, totalResources);
  const cashBalance = computeCashBalance(cashChange);
  rows.push(needs);
  rows.push(intangibleInvestments);
  rows.push(tangibleInvestments);
  rows.push(financialInvestments);
  rows.push(variationWorkingCapital);
  rows.push(loanRepayments);
  rows.push(associateContributions);
  rows.push(totalFinancialNeeds);
  rows.push(resources);
  rows.push(capitalContributions);
  rows.push(currentShareholdersAccount);
  rows.push(borrowing);
  rows.push(selfSustainability);
  rows.push(totalResources);
  rows.push(cashChange);
  rows.push(cashBalance);
  return rows;
};
const getTreasuryVatRefundsRow = (treasury) => {
  const rows = [];
  treasury.forEach((category, i) => {
    const row = category.find((row) => row.field === "TVA");
    rows.push(row);
  });
  return rows;
};
const FinancialPlan = (aggregateResources, incomeStatement, treasury) => {
  const obj = {};
  obj["columns"] = [
    {
      id: "field",
      label: "",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "rgb(254, 99, 30)",
    },
    {
      id: "initial",
      label: "Initial",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "rgb(254, 99, 30)",
    },
    {
      id: "year_1",
      label: "Année 1",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "rgb(254, 99, 30)",
    },
    {
      id: "year_2",
      label: "Année 2",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "rgb(254, 99, 30)",
    },
    {
      id: "year_3",
      label: "Année 3",
      minWidth: 170,
      align: "left",
      fontSize: "1.2rem",
      color: "rgb(254, 99, 30)",
    },
  ];
  const depreciationCharge = incomeStatement.find(
    (row) => row.field === "Dotations aux amortissements"
  );
  const annualIncomeTax = incomeStatement.find(
    (row) => row.field === "Impôts sur les bénéfices"
  );
  const taxReturns = incomeStatement.find(
    (row) => row.field === "Impôts et taxes"
  );
  const financialCharges = incomeStatement.find(
    (row) => row.field === "Charges financières"
  );
  const vatRefunds = getTreasuryVatRefundsRow(treasury);
  obj["rows"] = computeTableCells(
    aggregateResources,
    incomeStatement,
    financialCharges,
    annualIncomeTax,
    taxReturns,
    vatRefunds,
    depreciationCharge
  );

  return obj;
};
export default FinancialPlan;
