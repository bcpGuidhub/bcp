import cotisation from "./lib/index.js";
import {
  financialSynthesis,
  disbursements,
  financialSituation,
  incomeSituation,
  microReelIncomeStatement,
  financingDashboardReview,
} from "./financial_synthesis/index.js";
import { sectorsClasifications } from "./financial_synthesis/sectors.js";
import express from "express";
import helmet from "helmet";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import bodyParser from "body-parser";
const app = express();

if (process.env.APPENV === "production") {
  Sentry.init({
    dsn: "https://85b115161aa848708a1f669a62c01d69@o461961.ingest.sentry.io/5596942",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

const router = express.Router();
const port = 9000;
app.use(helmet());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  const allowedOrigins = [
    "http://localhost:3001",
    "https://stagingfront.bcp.guidhub.fr",
    "http://localhost:8080",
    "https://bcp.guidhub.fr",
    "https://www.bcp.guidhub.fr",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// mount the router on the app
app.get("/healthy", function (req, res, next) {
  res.sendStatus(200);
});
app.use("/cotisations", router);
router.get("/", async (req, res) => {
  const situation = {
    dirigeant: "oui",
    "entreprise . ACRE": "oui",
    "entreprise . date de création": "01/2020",
    "entreprise . catégorie d'activité": "'commerciale ou industrielle'",
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations": 9000,
  };
  const evaluate = "dirigeant . indépendant . cotisations et contributions";
  const response = await cotisation(situation, evaluate);
  res.send(`--- ${response} --- `);
});
router.post("/directors", async (req, res) => {
  const { situation, evaluate } = req.body;
  const result = await cotisation(situation, evaluate);
  res.json({ cotisation: result });
});
router.post("/employees", async (req, res) => {
  const { situation } = req.body;
  const evaluate = [
    "contrat salarié . cotisations . patronales",
    "contrat salarié . cotisations . salariales",
  ];
  const patronales = await cotisation(situation, evaluate[0]);
  const salariales = await cotisation(situation, evaluate[1]);
  const result = patronales * 12 + salariales * 12;
  res.json({ cotisation: result });
});
router.post("/directors/employee-cotisation", async (req, res) => {
  const { situation } = req.body;
  const evaluate = [
    "contrat salarié . cotisations . patronales",
    "contrat salarié . cotisations . salariales",
  ];
  const patronales = await cotisation(situation, evaluate[0]);
  const salariales = await cotisation(situation, evaluate[1]);
  const result = patronales + salariales;
  res.json({ cotisation: result });
});
router.post("/employees/net-cotisation", async (req, res) => {
  const { situation } = req.body;
  const evaluate = [
    "contrat salarié . rémunération . net",
    "contrat salarié . cotisations . patronales",
  ];

  const net = await cotisation(situation, evaluate[0]);
  const patronales = await cotisation(situation, evaluate[1]);
  res.json({
    cotisation: {
      net,
      patronales,
    },
  });
});
router.post("/director-general-self-employed", async (req, res) => {
  const { director, sector } = req.body;
  const {
    director_acre,
    net_compensation_year_1,
    net_compensation_year_2,
    net_compensation_year_3,
  } = director;
  const activity = Object.keys(sectorsClasifications).find((key) =>
    sectorsClasifications[key].includes(sector)
  );
  const evaluate = "dirigeant . indépendant . cotisations et contributions";
  let situation;
  situation = {
    dirigeant: "oui",
    "entreprise . ACRE": director_acre,
    "entreprise . date de création": "01/2020",
    "entreprise . catégorie d'activité": activity,
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations":
      net_compensation_year_1,
  };
  const result = {};
  const c = await cotisation(situation, evaluate);
  result[`cotisations_sociales_year_1`] = c.toString();
  situation = {
    dirigeant: "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "entreprise . catégorie d'activité": activity,
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations":
      net_compensation_year_2,
  };
  const cc = await cotisation(situation, evaluate);
  result["cotisations_sociales_year_2"] = cc.toString();
  situation = {
    dirigeant: "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "entreprise . catégorie d'activité": activity,
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations":
      net_compensation_year_3,
  };
  const ccc = await cotisation(situation, evaluate);
  result["cotisations_sociales_year_3"] = ccc.toString();
  res.json(result);
});
router.post("/director-self-employed-general", async (req, res) => {
  const { director } = req.body;
  const evaluate = [
    "contrat salarié . cotisations . patronales",
    "contrat salarié . cotisations . salariales",
  ];
  const result = {};
  if (director.compensation_partition === "Personnalisée") {
    result["director_cotisation_years"] = [];

    for (const year of director.director_renumeration_years) {
      let situation;
      if (year.year === "year_1") {
        situation = {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": director.director_acre,
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": "",
        };
      } else {
        situation = {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": "non",
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": "",
        };
      }
      const cotisationsComputed = {
        year: year.year,
      };
      let cotisationSum = 0;
      let i = 1;
      for (let month in year) {
        if (month != "id" && month != "year") {
          situation["contrat salarié . rémunération . net"] = parseInt(
            year[month],
            10
          );
          if (situation["contrat salarié . rémunération . net"] > 0) {
            const patronales = await cotisation(situation, evaluate[0]);
            const salariales = await cotisation(situation, evaluate[1]);
            const ss = patronales + salariales;
            // const s = Math.ceil(ss);
            cotisationsComputed[`month_${i}_cotisation`] = ss.toString();
            cotisationSum += ss;
          } else {
            cotisationsComputed[`month_${i}_cotisation`] = "0";
          }
          ++i;
        }
      }
      result["director_cotisation_years"].push(cotisationsComputed);
      result[`cotisations_sociales_${year.year}`] = cotisationSum.toString();
    }
  } else {
    for (let i = 1; i <= 3; i++) {
      let situation;
      let renumeration = parseInt(director[`net_compensation_year_${i}`], 10);
      if (i === 1) {
        situation = {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": director.director_acre,
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": renumeration / 12,
        };
      } else {
        situation = {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": "non",
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": renumeration / 12,
        };
      }
      const patronales = await cotisation(situation, evaluate[0]);
      const salariales = await cotisation(situation, evaluate[1]);
      const ss = patronales * 12 + salariales * 12;
      // const s = Math.ceil(ss);
      result[`cotisations_sociales_year_${i}`] = ss.toString();
    }
  }
  res.json(result);
});
router.post("/legal-status", async (req, res) => {
  const { net, sector } = req.body;
  const situationGeneral = {
    dirigeant: "oui",
    "dirigeant . assimilé salarié": "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "contrat salarié . statut cadre": "oui",
    "contrat salarié . chômage": "non",
    "contrat salarié . rémunération . net": net / 12,
  };
  const evaluateGeneral = [
    "contrat salarié . cotisations . patronales",
    "contrat salarié . cotisations . salariales",
  ];
  const patronales = await cotisation(situationGeneral, evaluateGeneral[0]);
  const salariales = await cotisation(situationGeneral, evaluateGeneral[1]);

  const general = patronales * 12 + salariales * 12;
  const situationPensionGeneral = {
    dirigeant: "oui",
    "dirigeant . assimilé salarié": "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "contrat salarié . statut cadre": "oui",
    "contrat salarié . chômage": "non",
    "contrat salarié . rémunération . net": net / 12,
  };
  const evaluatePensionGeneral = [
    "protection sociale . retraite . base",
    "protection sociale . retraite . complémentaire salarié",
  ];
  const a = await cotisation(
    situationPensionGeneral,
    evaluatePensionGeneral[0]
  );
  const b = await cotisation(
    situationPensionGeneral,
    evaluatePensionGeneral[1]
  );
  const pension_general = a + b;
  const situationDailyAllowanceGeneral = {
    dirigeant: "oui",
    "dirigeant . assimilé salarié": "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "contrat salarié . statut cadre": "oui",
    "contrat salarié . chômage": "non",
    "contrat salarié . rémunération . net": net / 12,
  };
  const evaluateDailyAllowanceGeneral =
    "protection sociale . santé . indemnités journalières";
  const n = await cotisation(
    situationDailyAllowanceGeneral,
    evaluateDailyAllowanceGeneral
  );
  const situationSelfEmployed = {
    dirigeant: "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "entreprise . catégorie d'activité": sector,
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations": net,
  };
  const evaluateSelfEmployed =
    "dirigeant . indépendant . cotisations et contributions";
  const self_employed = await cotisation(
    situationSelfEmployed,
    evaluateSelfEmployed
  );
  const situationPensionSelfEmployed = {
    dirigeant: "oui",
    "entreprise . ACRE": "non",
    "entreprise . date de création": "01/2020",
    "dirigeant . indépendant": "oui",
    "dirigeant . indépendant . revenu net de cotisations": net,
  };
  const evaluatePensionSelfEmployed = [
    "protection sociale . retraite . base",
    "protection sociale . retraite . complémentaire sécurité des indépendants",
  ];
  const i = await cotisation(
    situationPensionSelfEmployed,
    evaluatePensionSelfEmployed[0]
  );
  const j = await cotisation(
    situationPensionSelfEmployed,
    evaluatePensionSelfEmployed[1]
  );
  const pension_self_employed = i + j;

  const evaluateDailyAllowanceSelfEmployed =
    "protection sociale . santé . indemnités journalières . indépendant";
  const k = await cotisation(
    situationPensionSelfEmployed,
    evaluateDailyAllowanceSelfEmployed
  );
  res.json({
    cotisation: {
      general,
      self_employed,
      pension_self_employed,
      daily_allowance_self_employed: k,
      daily_allowance_general: n,
      pension_general,
    },
  });
});
router.post("/disbursements", async (req, res) => {
  const resources = req.body;
  const tables = await disbursements(resources);
  res.json({ tables: tables });
});
router.post("/financial-situation", async (req, res) => {
  const resources = req.body;
  const tables = await financialSituation(resources);
  res.json({ tables: tables });
});
router.post("/income-situation", async (req, res) => {
  const resources = req.body;
  const tables = await incomeSituation(resources);
  res.json({ tables: tables });
});
router.post("/financial-synthesis", async (req, res) => {
  const resources = req.body;
  const tables = await financialSynthesis(resources);
  res.json({ tables: tables });
});
router.post("/finance-dashboard", async (req, res) => {
  const resources = req.body;
  const tables = await financingDashboardReview(resources);
  res.json({ tables: tables });
});
router.post("/micro-reel-tax-regime", async (req, res) => {
  const resources = req.body;
  const tables = await microReelIncomeStatement(resources);
  res.json({
    micro: tables.micro,
    reel: tables.reel,
    revenue_collected: tables.revenue_collected,
  });
});
if (process.env.APPENV === "production") {
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
