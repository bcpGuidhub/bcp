import { PATH_GUIDE } from '../../../routes/paths';

export const GUIDELABEL = {
  'Faire son prévisionnel financier': 'faire_son_previsionnel_financier',
  'Faire son business plan': 'faire_son_business_plan',
  'Faire ses choix de création': 'faire_choix_creation_entreprise',
  'Créer sa micro-entreprise': 'creer_sa_micro_entreprise'
};
export const GUIDES = {
  faire_son_previsionnel_financier: {
    label: 'Faire son prévisionnel financier',
    root_url: 'faire-son-previsionnel-financier',
    landmarks: [
      {
        label: "Complétez vos choix de création d'entreprise",
        end_point: 'completez-choix-de-creation-d-entreprise',
        achievements: [
          {
            label: 'Choisissez votre statut juridique',
            end_point: 'statut-juridique'
          },
          {
            label: 'Choisissez votre régime fiscal',
            end_point: 'regime-fiscal'
          },
          {
            label: 'Choisissez votre régime de sécurité sociale',
            end_point: 'securite-sociale'
          }
        ]
      },
      {
        label: 'Complétez votre prévisionnel financier',
        end_point: 'completez-votre-previsionnel-financier',
        achievements: [
          {
            label: "Ajoutez votre chiffre d'affaires prévisionnel",
            end_point: 'chiffre-d-affaires'
          },
          {
            label: 'Ajoutez vos dépenses',
            end_point: 'depenses'
          },
          {
            label: 'Ajoutez vos charges de personnel',
            end_point: 'salaires'
          },
          {
            label: 'Ajoutez vos investissements',
            end_point: 'investissements'
          },
          {
            label: 'Ajoutez vos financements',
            end_point: 'financements'
          }
        ]
      },
      {
        label: 'Etudiez votre synthèse prévisionnelle',
        end_point: 'etudiez-votre-synthese-previsionnelle',
        achievements: [
          {
            label: 'Ma synthèse prévisionnelle',
            end_point: 'synthese-previsionnelle'
          }
        ]
      },
      {
        label: 'Vérifiez votre prévisionnel',
        end_point: 'verifiez-votre-previsionnel',
        achievements: [
          {
            label: 'Etudiez votre marge de sécurité financière',
            end_point: 'verification-marge-de-securite'
          },
          {
            label: 'Analysez la rentabilité de votre projet',
            end_point: 'verification-rentabilite'
          },
          {
            label: 'Validez le plan de financement de votre projet',
            end_point: 'verification-plan-de-financement-initial'
          }
        ]
      },
      {
        label: 'Téléchargez votre prévisionnel',
        end_point: 'telechargez',
        achievements: [
          {
            label: 'Téléchargez votre prévisionnel',
            end_point: 'votre-previsionnel'
          }
        ]
      }
      // {
      //   label: "Validez votre prévisionnel avec un expert",
      //   end_point: "validez-votre-previsionnel-avec-un-expert",
      //   achievements: [
      //     {
      //       label: "Validez votre prévisionnel avec un expert",
      //       end_point: "validation-expert",
      //     },
      //   ],
      // },
    ]
  },
  faire_son_business_plan: {
    label: 'Faire son business plan',
    root_url: 'faire-son-business-plan',
    landmarks: [
      {
        label: 'Présentez votre équipe projet',
        end_point: 'presentez-equipe',
        achievements: [
          {
            label: 'Présentez votre équipe projet',
            end_point: 'equipe-projet'
          }
        ]
      },
      {
        label: 'Expliquez votre projet',
        end_point: 'expliquez-projet',
        achievements: [
          {
            label: 'Présentez votre idée de projet',
            end_point: 'presentez-idee'
          },
          { label: 'Présentez votre marché', end_point: 'marche' },
          { label: 'Présentez vos concurrents', end_point: 'concurrents' },
          {
            label: 'Présentez votre segment de clientèle',
            end_point: 'segment-de-clientele'
          },
          { label: 'Présentez votre offre', end_point: 'offre' },
          {
            label: 'Présentez vos points forts / points faibles',
            end_point: 'points-fort-points-faibles'
          },
          {
            label: 'Présentez votre stratégie et vos objectifs',
            end_point: 'objectifs-projet'
          },
          {
            label: 'Présentez vos circuits de distribution',
            end_point: 'strategie-distribution'
          },
          {
            label: 'Présentez votre plan de communication',
            end_point: 'strategie-communication'
          },
          {
            label: "Présentez votre plan d'action",
            end_point: 'plan-d-actions'
          }
        ]
      },
      {
        label: "Complétez vos choix de création d'entreprise",
        end_point: 'completez-choix-de-creation-d-entreprise',
        achievements: [
          {
            label: 'Choisissez votre statut juridique',
            end_point: 'statut-juridique'
          },
          {
            label: 'Choisissez votre régime fiscal',
            end_point: 'regime-fiscal'
          },
          {
            label: 'Choisissez votre régime de sécurité sociale',
            end_point: 'securite-sociale'
          }
        ]
      },
      {
        label: 'Complétez votre prévisionnel financier',
        end_point: 'completez-votre-previsionnel-financier',
        achievements: [
          {
            label: "Ajoutez votre chiffre d'affaires prévisionnel",
            end_point: 'chiffre-d-affaires'
          },
          {
            label: 'Ajoutez vos dépenses',
            end_point: 'depenses'
          },
          {
            label: 'Ajoutez vos charges de personnel',
            end_point: 'salaires'
          },
          {
            label: 'Ajoutez vos investissements',
            end_point: 'investissements'
          },
          {
            label: 'Ajoutez vos financements',
            end_point: 'financements'
          }
        ]
      },
      {
        label: 'Etudiez votre synthèse prévisionnelle',
        end_point: 'etudiez-votre-synthese-previsionnelle',
        achievements: [
          {
            label: 'Ma synthèse prévisionnelle',
            end_point: 'synthese-previsionnelle'
          }
        ]
      },
      {
        label: 'Vérifiez votre business plan',
        end_point: 'verifiez-votre-business-plan',
        achievements: [
          {
            label: 'Etudiez votre marge de sécurité financière',
            end_point: 'verification-marge-de-securite'
          },
          {
            label: 'Analysez la rentabilité de votre projet',
            end_point: 'verification-rentabilite'
          },
          {
            label: 'Validez le plan de financement de votre projet',
            end_point: 'verification-plan-de-financement-initial'
          }
        ]
      },
      {
        label: 'Téléchargez votre business plan',
        end_point: 'telechargez',
        achievements: [
          {
            label: 'Téléchargez votre business plan',
            end_point: 'votre-business-plan'
          }
        ]
      }
      // {
      //   label: "Validez votre business plan avec un expert",
      //   end_point: "validez",
      //   achievements: [
      //     {
      //       label: "Validez votre business plan avec un expert",
      //       end_point: "votre-business-plan-avec-un-expert",
      //     },
      //   ],
      // },
    ]
  },
  faire_choix_creation_entreprise: {
    label: 'Faire ses choix de création',
    root_url: 'faire-choix-creation-entreprise',
    landmarks: [
      {
        label: 'Choisissez votre statut juridique',
        end_point: 'completez-choix-de-creation-d-entreprise',
        achievements: [
          {
            label: 'Choisissez votre statut juridique',
            end_point: 'statut-juridique'
          }
        ]
      },
      {
        label: 'Choisissez votre régime fiscal',
        end_point: 'completez-choix-de-creation-d-entreprise',
        achievements: [
          {
            label: 'Choisissez votre régime fiscal',
            end_point: 'regime-fiscal'
          }
        ]
      },
      {
        label: 'Choisissez votre régime de sécurité sociale',
        end_point: 'completez-choix-de-creation-d-entreprise',
        achievements: [
          {
            label: 'Choisissez votre régime de sécurité sociale',
            end_point: 'securite-sociale'
          }
        ]
      },
      {
        label: "Validez votre choix de domiciliation d'entreprise",
        end_point: 'choix-de-domiciliation',
        achievements: [
          {
            label: "Validez votre choix de domiciliation d'entreprise",
            end_point: 'domiciliation-entreprise'
          }
        ]
      },
      {
        label: 'Vérifiez vos choix',
        end_point: 'verifiez-vos-choix',
        achievements: [
          {
            label: 'Vérifiez votre statut juridique',
            end_point: 'verification-statut-juridique'
          },
          {
            label: 'Vérifiez votre protection sociale',
            end_point: 'verification-regime-securite-sociale'
          }
        ]
      }
      // {
      //   label: "Validez vos choix avec un expert",
      //   end_point: "validez-choix",
      //   achievements: [
      //     {
      //       label: "Validez vos choix avec un expert",
      //       end_point: "validation-expert",
      //     },
      //   ],
      // },
    ]
  },
  creer_sa_micro_entreprise: {
    label: 'Créer sa micro-entreprise',
    root_url: 'creer-sa-micro-entreprise',
    landmarks: [
      {
        label: 'Configurez votre micro-entreprise',
        end_point: 'statut-juridique',
        achievements: [
          {
            label: 'Configurez votre micro-entreprise',
            end_point: 'configurez-votre-micro-entreprise'
          }
        ]
      },
      {
        label: 'Complétez votre prévisionnel financier',
        end_point: 'completez-votre-previsionnel-financier',
        achievements: [
          {
            label: "Ajoutez votre chiffre d'affaires prévisionnel",
            end_point: 'chiffre-d-affaires'
          },
          {
            label: 'Ajoutez vos dépenses',
            end_point: 'depenses'
          },
          {
            label: 'Ajoutez vos charges de personnel',
            end_point: 'salaires'
          },
          {
            label: 'Ajoutez vos investissements',
            end_point: 'investissements'
          },
          {
            label: 'Ajoutez vos financements',
            end_point: 'financements'
          }
        ]
      },
      {
        label: 'Etudiez votre synthèse prévisionnelle',
        end_point: 'etudiez-votre-synthese-previsionnelle',
        achievements: [
          {
            label: 'Ma synthèse prévisionnelle',
            end_point: 'synthese-previsionnelle'
          }
        ]
      },
      {
        label: 'Vérifiez votre choix pour la micro-entreprise',
        end_point: 'verifiez-votre-choix-pour-la-micro-entreprise',
        achievements: [
          {
            label: 'Vérifiez la compatibilité avec le régime micro-entreprise',
            end_point: 'verification-compatibilite-micro'
          },
          {
            label: "Comparez le régime micro et le régime réel d'imposition",
            end_point: 'verification-micro-ou-regime-reel'
          }
        ]
      },
      {
        label: 'Téléchargez votre prévisionnel',
        end_point: 'telechargez',
        achievements: [
          {
            label: 'Téléchargez votre prévisionnel',
            end_point: 'votre-previsionnel'
          }
        ]
      },
      {
        label: 'Lancez votre micro-entreprise',
        end_point: 'lancez-votre-micro-entreprise',
        achievements: [
          {
            label: 'Immatriculez votre micro-entreprise',
            end_point: 'immatriculation'
          },
          {
            label: 'Ouvrez un compte bancaire',
            end_point: 'compte-bancaire'
          },
          {
            label: 'Assurez votre activité professionnelle',
            end_point: 'assurances-professionnelles'
          }
        ]
      }
    ]
  }
};
export const GUIDETHUMBNAILS = {
  'Faire son prévisionnel financier':
    'https://storage.googleapis.com/project-application-assets/vignette%20parcours%20pre%CC%81visionnel.png',
  'Faire son business plan': 'https://storage.googleapis.com/project-application-assets/vignette%20business%20plan.png',
  'Trouver son financement':
    'https://storage.googleapis.com/project-application-assets/vignette%20parcours%20financement.png',
  'Faire ses choix de création':
    'https://storage.googleapis.com/project-application-assets/vignette%20choix%20de%20cre%CC%81ation.png',
  'Créer sa micro-entreprise':
    'https://storage.googleapis.com/project-application-assets/vignette%20parcours%20micro.png',
  'Immatriculer son entreprise':
    'https://storage.googleapis.com/project-application-assets/vignette%20parcours%20immatriculation.png'
};
export const GuideNavMenu = {
  'faire-son-previsionnel-financier': [
    {
      subheader: 'Faire son prévisionnel financier',
      items: [
        {
          title: 'Aperçu',
          path: PATH_GUIDE.faire_son_previsionnel_financier.root,
          icon: ''
        },
        {
          title: "Choix de création d'entreprise",
          icon: '',
          path: PATH_GUIDE.faire_son_previsionnel_financier.legalDeclarations.root,
          children: [
            {
              title: 'Choisissez votre statut juridique',
              path: PATH_GUIDE.faire_son_previsionnel_financier.legalDeclarations.legal
            },
            {
              title: 'Choisissez votre régime fiscal',
              path: PATH_GUIDE.faire_son_previsionnel_financier.legalDeclarations.fiscal
            },
            {
              title: 'Choisissez votre régime de sécurité sociale',
              path: PATH_GUIDE.faire_son_previsionnel_financier.legalDeclarations.social
            }
          ]
        },
        {
          title: 'Votre prévisionnel financier',
          icon: '',
          path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.root,
          children: [
            {
              title: "Ajoutez votre chiffre d'affaires prévisionnel",
              path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.revenue
            },
            {
              title: 'Ajoutez vos dépenses',
              path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.expenses
            },
            {
              title: 'Ajoutez vos charges de personnel',
              path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.employees
            },
            {
              title: 'Ajoutez vos investissements',
              path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.investments
            },
            {
              title: 'Ajoutez vos financements',
              path: PATH_GUIDE.faire_son_previsionnel_financier.financialForecast.finance
            }
          ]
        },
        {
          title: 'Etudiez votre synthèse prévisionnelle',
          path: PATH_GUIDE.faire_son_previsionnel_financier.synthesis.root,
          icon: '',
          children: [
            {
              title: 'Ma synthèse prévisionnelle',
              path: PATH_GUIDE.faire_son_previsionnel_financier.synthesis.forecastSynthesis
            }
          ]
        },
        {
          title: 'Mes tableaux financiers',
          path: PATH_GUIDE.faire_son_previsionnel_financier.visualisation.root,
          icon: '',
          children: [
            {
              title: 'Compte de résultat',
              path: PATH_GUIDE.faire_son_previsionnel_financier.visualisation.incomeStatement
            },
            {
              title: 'Bilan',
              path: PATH_GUIDE.faire_son_previsionnel_financier.visualisation.balanceSheet
            },
            {
              title: 'Plan de financement',
              path: PATH_GUIDE.faire_son_previsionnel_financier.visualisation.financialPlan
            },
            {
              title: 'Trésorerie',
              path: PATH_GUIDE.faire_son_previsionnel_financier.visualisation.treasury
            }
          ]
        },
        {
          title: 'Vérifiez votre prévisionnel',
          icon: '',
          children: [
            { title: 'Etudiez votre marge de sécurité financière', path: '' },
            { title: 'Analysez la rentabilité de votre projet', path: '' },
            { title: 'Validez le plan de financement de votre projet', path: '' }
          ]
        },
        {
          title: 'Téléchargez votre prévisionnel',
          path: '',
          icon: ''
        },
        {
          title: 'Donnez votre avis',
          path: '',
          icon: ''
        }
      ]
    }
  ]
};
