export const taxHelperInformation = {
  default: {
    header: 'Deux régimes d’imposition des bénéfices existent: ',
    list_1: [
      "L'impôt sur le revenu (IR), c'est-à-dire l'imposition des bénéfices professionnels au nom de l'entrepreneur, ou au nom des associés de la société.",
      "L'impôt sur les sociétés (IS), c'est-à-dire l'imposition des bénéfices professionnels au niveau de l'entreprise, au taux de l'impôt sur les sociétés."
    ],
    sub_text: "Voici les points essentiels à retenir au niveau du choix du régime fiscal de l'entreprise :",
    list_2: [
      "Le statut juridique de l'entreprise détermine les choix possibles en matière d'imposition des bénéfices (IR, IS),",
      "Pour bénéficier du régime fiscal de la micro-entreprise, il faut être à l'IR et que l'entreprise soit une entreprise individuelle, une EIRL ou une EURL",
      "À l'IR, les rémunérations du dirigeant ne sont pas déductibles des bénéfices imposables. La notion de dividendes est également inexistante."
    ]
  },
  legal_status_idea: {
    label: 'Statut juridique de votre entreprise',
    conditional: {
      response: {
        'Entreprise individuelle': {
          label: "Régime d'imposition des bénéfices de votre entreprise individuelle",
          header:
            "Si vous exercez votre activité en entreprise individuelle, vos bénéfices professionnels seront obligatoirement imposés à l'impôt sur le revenu. ",
          sub_text: `L'option pour l'EIRL (Entreprise Individuelle à Responsabilité Limitée) peut vous permettre d'opter pour l'imposition de vos bénéfices à l'impôt sur les sociétés (IS)`
        },
        EIRL: {
          label: "Régime d'imposition des bénéfices de votre EIRL",
          header:
            "Si vous exercez votre activité en EIRL, vos bénéfices professionnels seront normalement imposés à l'impôt sur le revenu.",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur les sociétés (IS)."
        },
        EURL: {
          label: "Régime d'imposition des bénéfices de votre EURL",
          header:
            "Si vous exercez votre activité en EURL, vos bénéfices professionnels seront normalement imposés à l'impôt sur le revenu.",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur les sociétés (IS)."
        },
        SASU: {
          label: "Régime d'imposition des bénéfices de votre SASU",
          header:
            "Si vous exercez votre activité en SASU, vos bénéfices professionnels seront normalement imposés à l'impôt sur les sociétés (IS).",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur le revenu (IR) pendant 5 exercices maximums."
        },
        SARL: {
          label: "Régime d'imposition des bénéfices de votre SARL",
          header:
            "Si vous exercez votre activité en SARL, vos bénéfices professionnels seront normalement imposés à l'impôt sur les sociétés (IS).",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur le revenu (IR) pendant 5 exercices maximums."
        },
        SAS: {
          label: "Régime d'imposition des bénéfices de votre SAS",
          header:
            "Si vous exercez votre activité en SAS, vos bénéfices professionnels seront normalement imposés à l'impôt sur les sociétés (IS).",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur le revenu (IR) pendant 5 exercices maximums."
        },
        SNC: {
          label: "Régime d'imposition des bénéfices de votre SNC",
          header:
            "Si vous exercez votre activité en SNC, vos bénéfices professionnels seront normalement imposés à l'impôt sur le revenu.",
          sub_text:
            "Toutefois, vous avez la possibilité d'opter pour l'imposition de vos bénéfices à l'impôt sur les sociétés (IS)."
        }
      }
    }
  }
};
