import * as TreasuryStatementField from "./data_field.js";
import { sectorsClasifications } from "../sectors.js";

const MONTHS = [
  "month_1",
  "month_2",
  "month_3",
  "month_4",
  "month_5",
  "month_6",
  "month_7",
  "month_8",
  "month_9",
  "month_10",
  "month_11",
  "month_12",
];
const years = ["year_1", "year_2", "year_3"];
const yearLabel = {
  "Année 1": 0,
  "Année 2": 1,
  "Année 3": 2,
};

export const computeRevenueTreasuryRow = (aggregateResources) => {
  const { revenues } = aggregateResources;
  const rows = new TreasuryStatementField.FieldEntry();
  const revenueMonth = new TreasuryStatementField.Revenues(null);
  rows.setField(revenueMonth);
  const revenueTableRows = rows.compute(revenues, null, null);
  return revenueTableRows.reduce(
    (acc, revenueRow, j) => {
      revenueRow.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Chiffre d'affaires" },
      { field: "Chiffre d'affaires" },
      { field: "Chiffre d'affaires" },
    ]
  );
};
export const computeCapitalContributionRow = (aggregateResources) => {
  const { capitalContributions } = aggregateResources;
  const rows = new TreasuryStatementField.FieldEntry();
  const query = null;
  const capital = new TreasuryStatementField.CapitalContributions(query);
  rows.setField(capital);
  const capitalContributionsRows = rows.compute(
    capitalContributions,
    null,
    null
  );
  return capitalContributionsRows.reduce(
    (acc, capitalContributionRow, j) => {
      capitalContributionRow.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [{ field: "Apports" }, { field: "Apports" }, { field: "Apports" }]
  );
};
export const computeAssociatesCapitalContributions = (aggregateResources) => {
  const {legal} = aggregateResources
  if (legal.legal_status_idea === "Entreprise individuelle" ||
  legal.legal_status_idea === "EIRL") {
    const result = [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
    return result.reduce(
      (acc, r0, j) => {
        r0.reduce((a, r, k) => {
          const key = "month_" + (k + 1);
          a[key] = r;
          return a;
        }, acc[j]);
        return acc;
      },
      [
        { field: "C/C d’associé" },
        { field: "C/C d’associé" },
        { field: "C/C d’associé" },
      ]
    );
  }
  const rows = new TreasuryStatementField.FieldEntry();
  const query = null;
  const associatesCapital = new TreasuryStatementField.AssociatesCapitalContributions(
    query
  );
  rows.setField(associatesCapital);
  const associatesCapitalContributionsRows = rows.compute(
    aggregateResources,
    null,
    null
  );
  return associatesCapitalContributionsRows.reduce(
    (acc, associatesCapitalContributionRow, j) => {
      associatesCapitalContributionRow.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "C/C d’associé" },
      { field: "C/C d’associé" },
      { field: "C/C d’associé" },
    ]
  );
};
export const computeLoanSubscription = (aggregateResources) => {
  const { loans } = aggregateResources;
  const rows = new TreasuryStatementField.FieldEntry();
  const query = null;
  const loanSubscription = new TreasuryStatementField.LoanSubscription(query);
  rows.setField(loanSubscription);
  const loanSubscriptionRows = rows.compute(loans, null, null);
  return loanSubscriptionRows.reduce(
    (acc, loanSubscriptionRow, j) => {
      loanSubscriptionRow.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Souscription d’emprunts" },
      { field: "Souscription d’emprunts" },
      { field: "Souscription d’emprunts" },
    ]
  );
};
export const computeSocialCotisation = (incomeStatement) => {
  const cotisations = incomeStatement.find(
    (row) => row.field === "Cotisations sociales des dirigeants"
  );
  return cotisations;
};
export const computeSocialSecurityReimbursements = (
  aggregateResources,
  incomeStatement
) => {
  const { directors, legal, project } = aggregateResources;

  if (
    legal.social_security_scheme === "Régime général de la sécurité sociale"
  ) {
    const result = [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
    return result.reduce(
      (acc, r0, j) => {
        r0.reduce((a, r, k) => {
          const key = "month_" + (k + 1);
          a[key] = r;
          return a;
        }, acc[j]);
        return acc;
      },
      [
        { field: "Charges sociales" },
        { field: "Charges sociales" },
        { field: "Charges sociales" },
      ]
    );
  } else {
    const sector = project["activity_sector"];
    const companySector = Object.keys(sectorsClasifications).find((key) =>
      sectorsClasifications[key].includes(sector)
    );
    const association = {
      directors,
      legal,
      directorCotisations: computeSocialCotisation(incomeStatement),
      sector: companySector,
    };
    const rows = new TreasuryStatementField.FieldEntry();
    const query = null;
    const socialSecurityReimbursements = new TreasuryStatementField.SocialSecurityReimbursements(
      query
    );
    rows.setField(socialSecurityReimbursements);
    const socialSecurityReimbursementsRows = rows.compute(
      association,
      null,
      null
    );
    return socialSecurityReimbursementsRows.reduce(
      (acc, socialSecurityReimbursementsRow, j) => {
        socialSecurityReimbursementsRow.reduce((a, r, k) => {
          const key = "month_" + (k + 1);
          a[key] = r;
          return a;
        }, acc[j]);
        return acc;
      },
      [
        { field: "Charges sociales" },
        { field: "Charges sociales" },
        { field: "Charges sociales" },
      ]
    );
  }
};
export const computeVatRefundsRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const VatRefunds = new TreasuryStatementField.VatRefunds(null);
  rows.setField(VatRefunds);
  const VatRefundsTableRows = rows.compute(aggregateResources, null, null);
  return VatRefundsTableRows.reduce(
    (acc, vat, j) => {
      vat.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [{ field: "TVA" }, { field: "TVA" }, { field: "TVA" }]
  );
};

export const computeOtherReceiptsRow = (aggregateResources, incomeTaxRow) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const otherReceipts = new TreasuryStatementField.OtherReceipts(null);
  rows.setField(otherReceipts);
  const otherReceiptsTableRows = rows.compute(
    { aggregateResources, incomeTaxRow },
    null,
    null
  );
  return otherReceiptsTableRows.reduce(
    (acc, receipt, j) => {
      receipt.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [{ field: "Autres" }, { field: "Autres" }, { field: "Autres" }]
  );
};
export const computeReceiptsRow = (b1, b2, b3, b4, b5, b6, b7) => {
  let rows = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  return rows.reduce(
    (acc, receipt, j) => {
      receipt.reduce((a, _, k) => {
        const key = "month_" + (k + 1);
        a[key] =
          b1[j][key] +
          b2[j][key] +
          b3[j][key] +
          b4[j][key] +
          b5[j][key] +
          b6[j][key] +
          b7[j][key];
        return a;
      }, acc[j]);
      return acc;
    },
    [
      {
        field: "ENCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
      {
        field: "ENCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
      {
        field: "ENCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
    ]
  );
};
export const computeInvestmentsRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const Investments = new TreasuryStatementField.Investments(null);
  rows.setField(Investments);
  const investmentRows = rows.compute(aggregateResources, null, null);
  return investmentRows.reduce(
    (acc, investment, j) => {
      investment.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Investissements" },
      { field: "Investissements" },
      { field: "Investissements" },
    ]
  );
};
export const computePurchasesRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const Purchases = new TreasuryStatementField.Purchases(null);
  rows.setField(Purchases);
  const purchasesRows = rows.compute(aggregateResources, null, null);
  return purchasesRows.reduce(
    (acc, purchase, j) => {
      purchase.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [{ field: "Achats" }, { field: "Achats" }, { field: "Achats" }]
  );
};
export const computeAdministrativeExpensesRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const AdministrativeExpenses = new TreasuryStatementField.AdministrativeExpenses(
    null
  );
  rows.setField(AdministrativeExpenses);
  const administrativeExpensesRows = rows.compute(
    aggregateResources,
    null,
    null
  );
  return administrativeExpensesRows.reduce(
    (acc, expense, j) => {
      expense.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Frais généraux" },
      { field: "Frais généraux" },
      { field: "Frais généraux" },
    ]
  );
};
export const computeDirectorSalariesRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const DirectorSalaries = new TreasuryStatementField.DirectorSalaries(null);
  rows.setField(DirectorSalaries);
  const directorSalariesRows = rows.compute(aggregateResources, null, null);
  return directorSalariesRows.reduce(
    (acc, director, j) => {
      director.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Salaires dirigeants" },
      { field: "Salaires dirigeants" },
      { field: "Salaires dirigeants" },
    ]
  );
};
export const computeDirectorSocialSecurityRow = (
  aggregateResources,
  incomeStatement
) => {
  const { project, legal, directors, revenues } = aggregateResources;
  const sector = project["activity_sector"];
  const companySector = Object.keys(sectorsClasifications).find((key) =>
    sectorsClasifications[key].includes(sector)
  );
  const association = {
    directors,
    legal,
    directorCotisations: computeSocialCotisation(incomeStatement),
    sector: companySector,
    revenues,
    project,
  };
  const rows = new TreasuryStatementField.FieldEntry();
  const DirectorSocialSecurity = new TreasuryStatementField.DirectorSocialSecurity(
    null
  );
  rows.setField(DirectorSocialSecurity);
  const directorSocialSecurityRows = rows.compute(association, null, null);
  return directorSocialSecurityRows.reduce(
    (acc, director, j) => {
      director.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Charges sociales dirigeants" },
      { field: "Charges sociales dirigeants" },
      { field: "Charges sociales dirigeants" },
    ]
  );
};
export const computeStaffPayRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const StaffPay = new TreasuryStatementField.StaffPay(null);
  rows.setField(StaffPay);
  const staffPayRows = rows.compute(aggregateResources, null, null);
  return staffPayRows.reduce(
    (acc, staff, j) => {
      staff.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Salaires du personnel" },
      { field: "Salaires du personnel" },
      { field: "Salaires du personnel" },
    ]
  );
};
export const computeStaffSocialSecurityRow = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const StaffSocialSecurity = new TreasuryStatementField.StaffSocialSecurity(
    null
  );
  rows.setField(StaffSocialSecurity);
  const staffSocialSecurityRows = rows.compute(aggregateResources, null, null);
  return staffSocialSecurityRows.reduce(
    (acc, staff, j) => {
      staff.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Charges sociales salariés" },
      { field: "Charges sociales salariés" },
      { field: "Charges sociales salariés" },
    ]
  );
};
export const computeVatPaymentRow = (aggregateResources, refund) => {
  const association = { aggregateResources, refund };
  const rows = new TreasuryStatementField.FieldEntry();
  const VatPayment = new TreasuryStatementField.VatPayment(null);
  rows.setField(VatPayment);
  const VatPaymentRows = rows.compute(association, null, null);
  return VatPaymentRows.reduce(
    (acc, vat, j) => {
      vat.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "TVA à payer" },
      { field: "TVA à payer" },
      { field: "TVA à payer" },
    ]
  );
};
export const generateAnnualIncomeTax = (incomeStatement) => {
  const row = incomeStatement.find(
    (row) => row.field === "Impôts sur les bénéfices"
  );
  return row;
};
export const computeIncomeTaxTreasuryRow = (
  aggregateResources,
  incomeStatement
) => {
  const annualIncomeTax = generateAnnualIncomeTax(incomeStatement);
  const association = { aggregateResources, annualIncomeTax };
  const rows = new TreasuryStatementField.FieldEntry();
  const IncomeTax = new TreasuryStatementField.IncomeTax(null);
  rows.setField(IncomeTax);
  const IncomeTaxRows = rows.compute(association, null, null);
  return IncomeTaxRows.reduce(
    (acc, tax, j) => {
      tax.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [{ field: "IS" }, { field: "IS" }, { field: "IS" }]
  );
};
export const computeOtherTaxesTreasuryRow = (
  aggregateResources,
  incomeStatement
) => {
  const annualIncomeTax = incomeStatement.find(
    (row) => row.field === "Impôts et taxes"
  );
  const association = { aggregateResources, annualIncomeTax };
  const rows = new TreasuryStatementField.FieldEntry();
  const OtherTaxes = new TreasuryStatementField.OtherTaxes(null);
  rows.setField(OtherTaxes);
  const OtherTaxesRows = rows.compute(association, null, null);
  return OtherTaxesRows.reduce(
    (acc, tax, j) => {
      tax.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Autres impôts et taxes" },
      { field: "Autres impôts et taxes" },
      { field: "Autres impôts et taxes" },
    ]
  );
};
export const computeReimbursementsPartners = (aggregateResources) => {
  const {legal} = aggregateResources
  if (legal.legal_status_idea === "Entreprise individuelle" ||
  legal.legal_status_idea === "EIRL") {
    const result = [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0),
    ];
    return result.reduce(
      (acc, r0, j) => {
        r0.reduce((a, r, k) => {
          const key = "month_" + (k + 1);
          a[key] = r;
          return a;
        }, acc[j]);
        return acc;
      },
      [
        { field: "C/C d’associé" },
        { field: "C/C d’associé" },
        { field: "C/C d’associé" },
      ]
    );
  }
  const rows = new TreasuryStatementField.FieldEntry();
  const query = null;
  const ReimbursementsPartners = new TreasuryStatementField.ReimbursementsPartners(
    query
  );
  rows.setField(ReimbursementsPartners);
  const ReimbursementsPartnersRows = rows.compute(
    aggregateResources,
    null,
    null
  );
  return ReimbursementsPartnersRows.reduce(
    (acc, reimbursements, j) => {
      reimbursements.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "C/C d’associé" },
      { field: "C/C d’associé" },
      { field: "C/C d’associé" },
    ]
  );
};
export const computeDebtRepayments = (aggregateResources) => {
  const rows = new TreasuryStatementField.FieldEntry();
  const query = null;
  const DebtRepayments = new TreasuryStatementField.DebtRepayments(query);
  rows.setField(DebtRepayments);
  const DebtRepaymentsRows = rows.compute(aggregateResources, null, null);
  return DebtRepaymentsRows.reduce(
    (acc, payment, j) => {
      payment.reduce((a, r, k) => {
        const key = "month_" + (k + 1);
        a[key] = r;
        return a;
      }, acc[j]);
      return acc;
    },
    [
      { field: "Échéances d’emprunt" },
      { field: "Échéances d’emprunt" },
      { field: "Échéances d’emprunt" },
    ]
  );
};
export const computePaymentsRow = (
  b10,
  b11,
  b12,
  b13,
  b14,
  b15,
  b16,
  b17,
  b18,
  b19,
  b20,
  b21
) => {
  let rows = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  return rows.reduce(
    (acc, receipt, j) => {
      receipt.reduce((a, _, k) => {
        const key = "month_" + (k + 1);
        a[key] =
          b10[j][key] +
          b11[j][key] +
          b12[j][key] +
          b13[j][key] +
          b14[j][key] +
          b15[j][key] +
          b16[j][key] +
          b17[j][key] +
          b18[j][key] +
          b19[j][key] +
          b20[j][key] +
          b21[j][key];
        return a;
      }, acc[j]);
      return acc;
    },
    [
      {
        field: "DÉCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
      {
        field: "DÉCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
      {
        field: "DÉCAISSEMENTS",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(0, 176, 240)",
      },
    ]
  );
};
export const computeChangeNetCashRow = (c1, c2) => {
  let rows = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  return rows.reduce(
    (acc, receipt, j) => {
      receipt.reduce((a, _, k) => {
        const key = "month_" + (k + 1);
        a[key] = c1[j][key] - c2[j][key];
        return a;
      }, acc[j]);
      return acc;
    },
    [
      {
        field: "Variation",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(46, 117, 181)",
      },
      {
        field: "Variation",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(46, 117, 181)",
      },
      {
        field: "Variation",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(46, 117, 181)",
      },
    ]
  );
};
export const computeTotalCashRow = (c1, c2) => {
  let prevTotal = 0;
  let rows = [
    new Array(12).fill(0),
    new Array(12).fill(0),
    new Array(12).fill(0),
  ];
  return rows.reduce(
    (acc, receipt, j) => {
      receipt.reduce((a, _, k) => {
        const key = "month_" + (k + 1);
        a[key] = prevTotal + (c1[j][key] - c2[j][key]);
        prevTotal = a[key];
        return a;
      }, acc[j]);
      return acc;
    },
    [
      {
        field: "SOLDE",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(255, 153, 0)",
      },
      {
        field: "SOLDE",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(255, 153, 0)",
      },
      {
        field: "SOLDE",
        color: "rgb(255, 255, 255)",
        fontStyle: "italic",
        background: "rgb(255, 153, 0)",
      },
    ]
  );
};
export const computeTreasury = (aggregateResources, incomeStatement) => {
  let rows = [];
  const revenues = computeRevenueTreasuryRow(aggregateResources);
  const capitalContributions = computeCapitalContributionRow(
    aggregateResources
  );
  const associatesCapitalContributions = computeAssociatesCapitalContributions(
    aggregateResources
  );
  const loanSubscription = computeLoanSubscription(aggregateResources);
  const socialSecurityReimbursements = computeSocialSecurityReimbursements(
    aggregateResources,
    incomeStatement
  );
  const vatRefunds = computeVatRefundsRow(aggregateResources);
  const otherReceipts = computeOtherReceiptsRow(
    aggregateResources,
    generateAnnualIncomeTax(incomeStatement)
  );
  const receipts = computeReceiptsRow(
    revenues,
    capitalContributions,
    associatesCapitalContributions,
    loanSubscription,
    socialSecurityReimbursements,
    vatRefunds,
    otherReceipts
  );
  const investments = computeInvestmentsRow(aggregateResources);
  const purchases = computePurchasesRow(aggregateResources);
  const administrativeExpenses = computeAdministrativeExpensesRow(
    aggregateResources
  );
  const directorSalaries = computeDirectorSalariesRow(aggregateResources);
  const directorSocialSecurity = computeDirectorSocialSecurityRow(
    aggregateResources,
    incomeStatement
  );
  const staffPay = computeStaffPayRow(aggregateResources);
  const staffSocialSecurity = computeStaffSocialSecurityRow(aggregateResources);
  const vatPayment = computeVatPaymentRow(aggregateResources, vatRefunds);
  const incomeTax = computeIncomeTaxTreasuryRow(
    aggregateResources,
    incomeStatement
  );
  const otherTaxes = computeOtherTaxesTreasuryRow(
    aggregateResources,
    incomeStatement
  );
  const reimbursements = computeReimbursementsPartners(aggregateResources);
  const debtPayments = computeDebtRepayments(aggregateResources);
  const payments = computePaymentsRow(
    investments,
    purchases,
    administrativeExpenses,
    directorSalaries,
    directorSocialSecurity,
    staffPay,
    staffSocialSecurity,
    vatPayment,
    incomeTax,
    otherTaxes,
    reimbursements,
    debtPayments
  );
  const changeInNetCash = computeChangeNetCashRow(receipts, payments);
  const totalCash = computeTotalCashRow(receipts, payments);
  rows.push(revenues);
  rows.push(capitalContributions);
  rows.push(associatesCapitalContributions);
  rows.push(loanSubscription);
  rows.push(socialSecurityReimbursements);
  rows.push(vatRefunds);
  rows.push(otherReceipts);
  rows.push(receipts);
  rows.push(investments);
  rows.push(purchases);
  rows.push(administrativeExpenses);
  rows.push(directorSalaries);
  rows.push(directorSocialSecurity);
  rows.push(staffPay);
  rows.push(staffSocialSecurity);
  rows.push(vatPayment);
  rows.push(incomeTax);
  rows.push(otherTaxes);
  rows.push(reimbursements);
  rows.push(debtPayments);
  rows.push(payments);
  rows.push(changeInNetCash);
  rows.push(totalCash);
  return rows;
};
function Treasury(aggregateResources, incomeStatement) {
  const obj = {};
  obj["columns"] = [
    {
      id: "field",
      label: "",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_1",
      label: "Mois 1",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_2",
      label: "Mois 2",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_3",
      label: "Mois 3",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_4",
      label: "Mois 4",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_5",
      label: "Mois 5",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_6",
      label: "Mois 6",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_7",
      label: "Mois 7",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_8",
      label: "Mois 8",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_9",
      label: "Mois 9",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_10",
      label: "Mois 10",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_11",
      label: "Mois 11",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "month_12",
      label: "Mois 12",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
  ];
  obj["rows"] = computeTreasury(aggregateResources, incomeStatement).reduce(
    (acc, category) => {
      category.forEach((_, i) => acc[i].push(category[i]));
      return acc;
    },
    [[], [], []]
  );
  return obj;
}
export default Treasury;
