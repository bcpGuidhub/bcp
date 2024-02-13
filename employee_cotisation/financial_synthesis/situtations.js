export function supportedSituation(options) {
  return {
    TNS: {
      IS: {
        year_1: {
          situation: {
            dirigeant: "oui",
            "entreprise . ACRE": options.acre,
            "entreprise . date de création": "01/2020",
            "entreprise . catégorie d'activité": options.sector,
            "dirigeant . indépendant": "oui",
            "dirigeant . indépendant . revenu net de cotisations": options.net,
          },
        },
        year_x: {
          situation: {
            dirigeant: "oui",
            "entreprise . ACRE": "non",
            "entreprise . date de création": "01/2020",
            "entreprise . catégorie d'activité": options.sector,
            "dirigeant . indépendant": "oui",
            "dirigeant . indépendant . revenu net de cotisations": options.net,
          },
        },
        evaluate: "dirigeant . indépendant . cotisations et contributions",
      },
      IR: {
        SARL: {
          situation: {
            dirigeant: "oui",
            "entreprise . ACRE": options.acre,
            "entreprise . date de création": "01/2020",
            "entreprise . catégorie d'activité": options.sector,
            "dirigeant . indépendant": "oui",
            "dirigeant . rémunération totale": options.net || 0,
          },
          evaluate: "dirigeant . indépendant . cotisations et contributions",
        },
        ELSE: {
          situation: {
            dirigeant: "oui",
            "entreprise . ACRE": options.acre,
            "entreprise . date de création": "01/2020",
            "entreprise . catégorie d'activité": options.sector,
            "dirigeant . indépendant": "oui",
            "dirigeant . rémunération totale": options.net || 0,
          },
          evaluate: "dirigeant . indépendant . cotisations et contributions",
        },
      },
    },
    "assimilé-salarié": {
      year_1: {
        situation: {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": options.acre,
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": options.net,
        },
      },
      year_x: {
        situation: {
          dirigeant: "oui",
          "dirigeant . assimilé salarié": "oui",
          "entreprise . ACRE": "non",
          "entreprise . date de création": "01/2020",
          "contrat salarié . statut cadre": "oui",
          "contrat salarié . chômage": "non",
          "contrat salarié . rémunération . net": options.net,
        },
      },
      evaluate: {
        sum: [
          "contrat salarié . cotisations . patronales",
          "contrat salarié . cotisations . salariales",
        ],
      },
    },
  };
}

export function employeeSituation(options) {
  return {
    net_salary: {
      CDD: {
        situation: {
          "contrat salarié . CDD": "oui",
          "contrat salarié . rémunération . brut de base":
            options.gross_monthly_remuneration,
        },
      },
      CDI: {
        situation: {
          "contrat salarié . CDI": "oui",
          "contrat salarié . rémunération . brut de base":
            options.gross_monthly_remuneration,
        },
      },
      evaluate: "contrat salarié . rémunération . net",
    },
    employer_contributions: {
      CDD: {
        situation: {
          "contrat salarié . CDD": "oui",
          "contrat salarié . rémunération . brut de base":
            options.gross_monthly_remuneration,
        },
      },
      CDI: {
        situation: {
          "contrat salarié . CDI": "oui",
          "contrat salarié . rémunération . brut de base":
            options.gross_monthly_remuneration,
        },
      },
      evaluate: "contrat salarié . cotisations . patronales",
    },
  };
}
