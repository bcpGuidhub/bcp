import * as BalanceSheetField from "./data_field.js";
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

const fixedAssetsSectionHeading = () => {
  const row = [
    {
      asset: "ACTIF IMMOBILISE",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "CAPITAUX PROPRES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
    {
      asset: "ACTIF IMMOBILISE",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "CAPITAUX PROPRES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
    {
      asset: "ACTIF IMMOBILISE",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "CAPITAUX PROPRES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
  ];
  return row;
};
const intangibleAssetsRow = (aggregateResources) => {
  const rows = new BalanceSheetField.FieldEntry();
  const IntangibleAssets = new BalanceSheetField.IntangibleAssets(null);
  rows.setField(IntangibleAssets);
  const computedRow = rows.compute(aggregateResources, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Investissements incorporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Capital",
        liability_net: "",
      },
      {
        asset: "Investissements incorporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Capital",
        liability_net: "",
      },
      {
        asset: "Investissements incorporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Capital",
        liability_net: "",
      },
      ,
    ]
  );
};
const tangibleAssetsRow = (aggregateResources) => {
  const rows = new BalanceSheetField.FieldEntry();
  const TangibleAssets = new BalanceSheetField.TangibleAssets(null);
  rows.setField(TangibleAssets);
  const computedRow = rows.compute(aggregateResources, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Investissements corporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Réserves et report à nouveau",
        liability_net: "",
      },
      {
        asset: "Investissements corporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Réserves et report à nouveau",
        liability_net: "",
      },
      {
        asset: "Investissements corporels",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Réserves et report à nouveau",
        liability_net: "",
      },
      ,
    ]
  );
};
const financialAssetsRow = (aggregateResources) => {
  const rows = new BalanceSheetField.FieldEntry();
  const FinancialAssets = new BalanceSheetField.FinancialAssets(null);
  rows.setField(FinancialAssets);
  const computedRow = rows.compute(aggregateResources, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Investissements financiers",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Résultat de l'exercice",
        liability_net: "",
      },
      {
        asset: "Investissements financiers",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Résultat de l'exercice",
        liability_net: "",
      },
      {
        asset: "Investissements financiers",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Résultat de l'exercice",
        liability_net: "",
      },
      ,
    ]
  );
};
const totalAssetsRow = (b1, b2, b3) => {
  let rows = [new Array(3).fill(0), new Array(3).fill(0), new Array(3).fill(0)];
  return rows.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = b1[j]["gross"] + b2[j]["gross"] + b3[j]["gross"];
      acc[j]["payment"] =
        b1[j]["payment"] + b2[j]["payment"] + b3[j]["payment"];
      acc[j]["asset_net"] =
        b1[j]["asset_net"] + b2[j]["asset_net"] + b3[j]["asset_net"];
      return acc;
    },
    [
      {
        asset: "Total des Investissements",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des capitaux propres",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47 ,117 ,181)",
      },
      {
        asset: "Total des Investissements",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des capitaux propres",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47, 117, 181)",
      },
      {
        asset: "Total des Investissements",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des capitaux propres",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47, 117, 181)",
      },
      ,
    ]
  );
};
const fixedCurrentAssetsHeading = () => {
  const row = [
    {
      asset: "ACTIF CIRCULANT",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "DETTES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
    {
      asset: "ACTIF CIRCULANT",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "DETTES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
    {
      asset: "ACTIF CIRCULANT",
      gross: null,
      payment: null,
      asset_net: null,
      liability: "DETTES",
      liability_net: null,
      color: "rgb(255, 255, 255)",
      background: "rgb(0, 176, 240)",
    },
  ];
  return row;
};
const stocksRow = (aggregateResources) => {
  const rows = new BalanceSheetField.FieldEntry();
  const Stocks = new BalanceSheetField.Stocks(null);
  rows.setField(Stocks);
  const computedRow = rows.compute(aggregateResources, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Stocks",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Emprunts",
        liability_net: "",
      },
      {
        asset: "Stocks",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Emprunts",
        liability_net: "",
      },
      {
        asset: "Stocks",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Emprunts",
        liability_net: "",
      },
      ,
    ]
  );
};
const clientsRow = (aggregateResources) => {
  const rows = new BalanceSheetField.FieldEntry();
  const Clients = new BalanceSheetField.Clients(null);
  rows.setField(Clients);
  const computedRow = rows.compute(aggregateResources, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Clients",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Comptes courants d'associés",
        liability_net: "",
      },
      {
        asset: "Clients",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Comptes courants d'associés",
        liability_net: "",
      },
      {
        asset: "Clients",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Comptes courants d'associés",
        liability_net: "",
      },
    ]
  );
};
export const taxReceivablesRow = (aggregateResources, incomeTaxRow, refund) => {
  const association = { aggregateResources, incomeTaxRow, refund };
  const rows = new BalanceSheetField.FieldEntry();
  const TaxReceivables = new BalanceSheetField.TaxReceivables(null);
  rows.setField(TaxReceivables);
  const computedRow = rows.compute(association, null, null);
  return computedRow.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
      {
        asset: "Créances fiscales",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Fournisseurs",
        liability_net: "",
      },
      {
        asset: "Créances fiscales",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Fournisseurs",
        liability_net: "",
      },
      {
        asset: "Créances fiscales",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Fournisseurs",
        liability_net: "",
      },
      ,
    ]
  );
};
export const socialClaimsRow = (aggregateResources, incomeStatement) => {
  const { directors, legal, project } = aggregateResources;
  if (
    legal.social_security_scheme === "Régime général de la sécurité sociale"
  ) {
    const c = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    return c.reduce(
      (acc, cal, j) => {
        acc[j]["gross"] = cal[0];
        acc[j]["payment"] = cal[1];
        acc[j]["asset_net"] = cal[2];
        return acc;
      },
      [
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
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
      directorCotisations: incomeStatement.find(
        (row) => row.field === "Cotisations sociales des dirigeants"
      ),
      sector: companySector,
    };
    const rows = new BalanceSheetField.FieldEntry();
    const SocialClaims = new BalanceSheetField.SocialClaims(null);
    rows.setField(SocialClaims);
    const computedRow = rows.compute(association, null, null);
    return computedRow.reduce(
      (acc, cal, j) => {
        acc[j]["gross"] = cal[0];
        acc[j]["payment"] = cal[1];
        acc[j]["asset_net"] = cal[2];
        return acc;
      },
      [
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
        {
          asset: "Créances sociales",
          gross: "",
          payment: "",
          asset_net: "",
          liability: "Dettes fiscales",
          liability_net: "",
        },
        ,
      ]
    );
  }
};
const treasuryRow = (treasury) => {
  const total = [];
  treasury.forEach((category, i) => {
    const row = category.find((row) => row.field === "SOLDE");
    total.push(row);
  });
  const netTotalAnnual = [
    [null, null, total[0]["month_12"]],
    [null, null, total[1]["month_12"]],
    [null, null, total[2]["month_12"]],
  ];
  return netTotalAnnual.reduce(
    (acc, cal, j) => {
      acc[j]["gross"] = cal[0];
      acc[j]["payment"] = cal[1];
      acc[j]["asset_net"] = cal[2];
      return acc;
    },
    [
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
    ]
  );
};
const totalCurrentAssetsRow = (d9, d10, d11, d12, d13) => {
  let totalCurrent = new Array(3).fill(0);
  return totalCurrent.reduce(
    (acc, _, j) => {
      acc[j]["gross"] = null;
      acc[j]["payment"] = null;
      acc[j]["asset_net"] =
        d9[j]["asset_net"] +
        d10[j]["asset_net"] +
        d11[j]["asset_net"] +
        (d12[j]["asset_net"] === null ? 0 : d12[j]["asset_net"]) +
        d13[j]["asset_net"];
      return acc;
    },
    [
      {
        asset: "Total de l'actif circulant",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des dettes",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47 ,117 ,181)",
      },
      {
        asset: "Total de l'actif circulant",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des dettes",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47 ,117 ,181)",
      },
      {
        asset: "Total de l'actif circulant",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "Total des dettes",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(47 ,117 ,181)",
      },
      ,
    ]
  );
};
const totalNetAssetsRow = (d7, d14) => {
  let totalAssets = new Array(3).fill(0);
  return totalAssets.reduce(
    (acc, _, j) => {
      acc[j]["gross"] = null;
      acc[j]["payment"] = null;
      acc[j]["asset_net"] = d7[j]["asset_net"] + d14[j]["asset_net"];
      return acc;
    },
    [
      {
        asset: "TOTAL ACTIF",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "TOTAL PASSIF",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(255, 109, 1)",
      },
      {
        asset: "TOTAL ACTIF",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "TOTAL PASSIF",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(255, 109, 1)",
      },
      {
        asset: "TOTAL ACTIF",
        gross: "",
        payment: "",
        asset_net: "",
        liability: "TOTAL PASSIF",
        liability_net: "",
        color: "rgb(255, 255, 255)",
        background: "rgb(255, 109, 1)",
      },
      ,
    ]
  );
};
export const capitalLiabilitiesRow = (
  aggregateResources,
  intangibleAssets,
  incomeStatement
) => {
  const rows = new BalanceSheetField.FieldEntry();
  const CapitalLiabilities = new BalanceSheetField.CapitalLiabilities(null);
  rows.setField(CapitalLiabilities);
  const computedRow = rows.compute(
    { associations: aggregateResources, incomeStatement },
    null,
    null
  );
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, intangibleAssets);
  return intangibleAssets;
};
const grantsRetainedEarnings = (
  incomeStatement,
  tangibleAssets,
  aggregateResources
) => {
  const { legal } = aggregateResources;
  if (
    (legal.legal_status_idea === "Entreprise individuelle" ||
      legal.legal_status_idea === "EIRL") &&
    (legal.tax_system === "IR" || legal.tax_system === "Micro-entreprise")
  ) {
    [0, 0, 0].reduce((acc, cal, j) => {
      acc[j]["liability_net"] = cal;
      return acc;
    }, tangibleAssets);
    return tangibleAssets;
  }
  const incomeStatementNetResult = incomeStatement[incomeStatement.length - 1];
  [
    0,
    incomeStatementNetResult["year_1"],
    incomeStatementNetResult["year_1"] + incomeStatementNetResult["year_2"],
  ].reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, tangibleAssets);
  return tangibleAssets;
};
const operationResult = (incomeStatement, financialAssets) => {
  const incomeStatementNetResult = incomeStatement[incomeStatement.length - 1];
  [
    incomeStatementNetResult["year_1"],
    incomeStatementNetResult["year_2"],
    incomeStatementNetResult["year_3"],
  ].reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, financialAssets);
  return financialAssets;
};
const overallEquity = (
  totalAssets,
  intangibleAssets,
  tangibleAssets,
  financialAssets
) => {
  [0, 0, 0].reduce((acc, _, j) => {
    acc[j]["liability_net"] =
      intangibleAssets[j]["liability_net"] +
      tangibleAssets[j]["liability_net"] +
      financialAssets[j]["liability_net"];
    return acc;
  }, totalAssets);
  return totalAssets;
};
const loans = (aggregateResources, stocks) => {
  const rows = new BalanceSheetField.FieldEntry();
  const LoansLiabilities = new BalanceSheetField.LoansLiabilities(null);
  rows.setField(LoansLiabilities);

  const computedRow = rows.compute(aggregateResources, null, null);
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, stocks);
  return stocks;
};
export const partnerCurrentAccount = (aggregateResources, clients) => {
  const {legal} = aggregateResources
  if (legal.legal_status_idea === "Entreprise individuelle" ||
  legal.legal_status_idea === "EIRL") {
    const noopRow = new Array(3).fill(0)
    return noopRow.reduce((acc, cal, j) => {
      acc[j]["liability_net"] = cal;
      return acc;
    }, clients);
  }
  const rows = new BalanceSheetField.FieldEntry();
  const PartnerCurrentAccount = new BalanceSheetField.PartnerCurrentAccount(
    null
  );
  rows.setField(PartnerCurrentAccount);
  const computedRow = rows.compute(aggregateResources, null, null);
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, clients);
  return clients;
};
export const suppliers = (aggregateResources, taxReceivables) => {
  const rows = new BalanceSheetField.FieldEntry();
  const Suppliers = new BalanceSheetField.Suppliers(null);
  rows.setField(Suppliers);
  const computedRow = rows.compute(aggregateResources, null, null);
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, taxReceivables);
  return taxReceivables;
};
export const taxDebt = (
  aggregateResources,
  incomeTaxRow,
  refund,
  taxReturns,
  socialClaims
) => {
  const association = { aggregateResources, incomeTaxRow, refund, taxReturns };
  const rows = new BalanceSheetField.FieldEntry();
  const TaxDebt = new BalanceSheetField.TaxDebt(null);
  rows.setField(TaxDebt);
  const computedRow = rows.compute(association, null, null);
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, socialClaims);
  return socialClaims;
};
export const socialDebt = (aggregateResources, incomeStatement, treasury) => {
  const { directors, legal, project } = aggregateResources;
  const sector = project["activity_sector"];
  const companySector = Object.keys(sectorsClasifications).find((key) =>
    sectorsClasifications[key].includes(sector)
  );
  const association = {
    directors,
    legal,
    directorCotisations: incomeStatement.find(
      (row) => row.field === "Cotisations sociales des dirigeants"
    ),
    sector: companySector,
    aggregateResources,
  };
  const rows = new BalanceSheetField.FieldEntry();
  const SocialDebt = new BalanceSheetField.SocialDebt(null);
  rows.setField(SocialDebt);
  const computedRow = rows.compute(association, null, null);
  computedRow.reduce((acc, cal, j) => {
    acc[j]["liability_net"] = cal;
    return acc;
  }, treasury);
  return treasury;
};
const totalLiabilities = (
  stocks,
  clients,
  taxDebt,
  socialDebt,
  treasury,
  totalCurrent
) => {
  let total = new Array(3).fill(0);
  total.reduce((acc, _, j) => {
    acc[j]["liability_net"] =
      stocks[j]["liability_net"] +
      clients[j]["liability_net"] +
      taxDebt[j]["liability_net"] +
      socialDebt[j]["liability_net"] +
      treasury[j]["liability_net"];
    return acc;
  }, totalCurrent);
  return totalCurrent;
};
const netLiability = (totalAssets, totalCurrent, totalNetAssets) => {
  let total = new Array(3).fill(0);
  total.reduce((acc, _, j) => {
    acc[j]["liability_net"] =
      totalAssets[j]["liability_net"] + totalCurrent[j]["liability_net"];
    return acc;
  }, totalNetAssets);
  return totalNetAssets;
};
const getTreasuryVatRefundsRow = (treasury) => {
  const rows = [];
  treasury.forEach((category, i) => {
    const row = category.find((row) => row.field === "TVA");
    rows.push(row);
  });
  return rows;
};
const computeTable = (
  aggregateResources,
  incomeStatement,
  treasuryTable,
  annualIncomeTax,
  taxReturns
) => {
  let rows = [];
  const fixedAssetsHeading = fixedAssetsSectionHeading();
  const intangibleAssets = intangibleAssetsRow(aggregateResources);
  const tangibleAssets = tangibleAssetsRow(aggregateResources);
  const financialAssets = financialAssetsRow(aggregateResources);
  const currentAssetsHeading = fixedCurrentAssetsHeading();
  const stocks = stocksRow(aggregateResources);
  const totalAssets = totalAssetsRow(
    intangibleAssets,
    tangibleAssets,
    financialAssets
  );
  const clients = clientsRow(aggregateResources);
  const vatRefunds = getTreasuryVatRefundsRow(treasuryTable);
  const taxReceivables = taxReceivablesRow(
    aggregateResources,
    annualIncomeTax,
    vatRefunds
  );
  const socialClaims = socialClaimsRow(aggregateResources, incomeStatement);
  const treasury = treasuryRow(treasuryTable);
  const totalCurrent = totalCurrentAssetsRow(
    stocks,
    clients,
    taxReceivables,
    socialClaims,
    treasury
  );
  const totalNetAssets = totalNetAssetsRow(totalAssets, totalCurrent);
  capitalLiabilitiesRow(aggregateResources, intangibleAssets, incomeStatement);
  grantsRetainedEarnings(incomeStatement, tangibleAssets, aggregateResources);
  operationResult(incomeStatement, financialAssets);
  overallEquity(totalAssets, intangibleAssets, tangibleAssets, financialAssets);
  loans(aggregateResources, stocks);
  partnerCurrentAccount(aggregateResources, clients);
  suppliers(aggregateResources, taxReceivables);
  taxDebt(
    aggregateResources,
    annualIncomeTax,
    vatRefunds,
    taxReturns,
    socialClaims
  );
  socialDebt(aggregateResources, incomeStatement, treasury);
  totalLiabilities(
    stocks,
    clients,
    taxReceivables,
    socialClaims,
    treasury,
    totalCurrent
  );
  netLiability(totalAssets, totalCurrent, totalNetAssets);
  rows.push(fixedAssetsHeading);
  rows.push(intangibleAssets);
  rows.push(tangibleAssets);
  rows.push(financialAssets);
  rows.push(totalAssets);
  rows.push(currentAssetsHeading);
  rows.push(stocks);
  rows.push(clients);
  rows.push(taxReceivables);
  rows.push(socialClaims);
  rows.push(treasury);
  rows.push(totalCurrent);
  rows.push(totalNetAssets);
  return rows;
};
const BalanceSheet = (aggregateResources, incomeStatement, treasury) => {
  const obj = {};
  obj["columns"] = [
    {
      id: "asset",
      label: "ACTIF",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "gross",
      label: "Brut",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "payment",
      label: "Amort.",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "asset_net",
      label: "Net",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "liability",
      label: "PASSIF",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
    {
      id: "liability_net",
      label: "Net",
      minWidth: 75,
      align: "left",
      fontSize: "0.8rem",
      color: "#2578a1",
    },
  ];
  const annualIncomeTax = incomeStatement.find(
    (row) => row.field === "Impôts sur les bénéfices"
  );
  const taxReturns = incomeStatement.find(
    (row) => row.field === "Impôts et taxes"
  );

  obj["rows"] = computeTable(
    aggregateResources,
    incomeStatement,
    treasury,
    annualIncomeTax,
    taxReturns
  ).reduce(
    (acc, category) => {
      category.forEach((_, i) => acc[i].push(category[i]));
      return acc;
    },
    [[], [], []]
  );
  return obj;
};

export default BalanceSheet;
