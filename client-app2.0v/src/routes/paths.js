// ----------------------------------------------------------------------

function path(root, sublink) {
  return sublink && typeof sublink !== 'undefined' ? `${root}${sublink}` : root;
}

const ROOTS_AUTH = '';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_HUB = '/hub';
const ROOTS_GUIDES = '/guide';
const ROOTS_PROJECT = '/project';
const ROOTS_BOARD_ROOM = '/board-room';
const ROOTS_INQUIST = '/inquist';
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/se-connecter'),
  register: path(ROOTS_AUTH, '/inscription'),
  resetPassword: path(ROOTS_AUTH, '/mot-de-passe/oubli'),
  resetPasswordStakeholder: path(ROOTS_AUTH, '/mot-de-passe/oubli/stakeholder'),
  verify: path(ROOTS_AUTH, '/confirmer-email'),
  verifyStakeholder: path(ROOTS_AUTH, '/confirmer-email-stakeholder')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account/auth'),
    admin: path(ROOTS_DASHBOARD, '/user/admin')
  },
  finance: {
    aid: path(ROOTS_PROJECT, '/finance/aid')
  },
  legal: {
    status: path(ROOTS_PROJECT, '/legal-formalities/legal-status'),
    taxes: path(ROOTS_PROJECT, '/legal-formalities/tax-status'),
    socialSecurity: path(ROOTS_PROJECT, '/legal-formalities/social-security-status'),
    statusForm: path(ROOTS_PROJECT, '/legal-formalities/legal-status-form'),
    taxesForm: path(ROOTS_PROJECT, '/legal-formalities/tax-status-form'),
    socialSecurityForm: path(ROOTS_PROJECT, '/legal-formalities/social-security-status-form')
  },
  sector: {
    activityAggregate: path(ROOTS_PROJECT, '/activity-sector/aggregate')
  },
  hub: {
    root: path(ROOTS_HUB, '/messenger'),
    new: path(ROOTS_HUB, '/messenger/new'),
    conversation: path(ROOTS_HUB, '/messenger/:conversationKey')
  },
  inquist: {
    root: path(ROOTS_INQUIST, ''),
    browse: path(ROOTS_INQUIST, '/browse'),
    new: path(ROOTS_INQUIST, '/new'),
    post: path(ROOTS_INQUIST, '/posts/:id')
  },
  project: {
    root: path(ROOTS_PROJECT),
    newProject: path(ROOTS_PROJECT, '/new'),
    editById: path(ROOTS_PROJECT, `/:id/edit`),
    testSuite: path(ROOTS_PROJECT, '/:id/test_suite'),
    // businessPlan: {
    //   edition: {
    //     canvas: path(ROOTS_PROJECT, '/faire-son-business-plan/board')
    //   }
    // },
    financialForecasts: {
      root: path(ROOTS_PROJECT, '/dashboard/faire-son-previsionnel-financier/'),
      financialForecast: {
        root: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier'),
        revenue: path(
          ROOTS_PROJECT,
          '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/chiffre-d-affaires'
        ),
        expenses: path(
          ROOTS_PROJECT,
          '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/depenses'
        ),
        employees: path(
          ROOTS_PROJECT,
          '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/salaires'
        ),
        investments: path(
          ROOTS_PROJECT,
          '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/investissements'
        ),
        finance: path(
          ROOTS_PROJECT,
          '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/financements'
        )
      },
      synthesis: {
        forecastSynthesis: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/synthese-previsionnelle')
      },
      visualisation: {
        root: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/graphique'),
        incomeStatement: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/graphique/compte-de-resultat'),
        balanceSheet: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/graphique/bilan'),
        financialPlan: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/graphique/plan-de-financement'),
        treasury: path(ROOTS_PROJECT, '/faire-son-previsionnel-financier/graphique/tresorerie')
      }
    }
  },
  boardRoom: {
    root: path(ROOTS_BOARD_ROOM)
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';

export const PATH_GUIDE = {
  faire_son_previsionnel_financier: {
    root: path(ROOTS_GUIDES, '/dashboard/faire-son-previsionnel-financier/'),
    legalDeclarations: {
      root: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/completez-choix-de-creation-d-entreprise'),
      legal: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-choix-de-creation-d-entreprise/statut-juridique'
      ),
      fiscal: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-choix-de-creation-d-entreprise/regime-fiscal'
      ),
      social: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-choix-de-creation-d-entreprise/securite-sociale'
      )
    },
    financialForecast: {
      root: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier'),
      revenue: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/chiffre-d-affaires'
      ),
      expenses: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/depenses'),
      employees: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/salaires'
      ),
      investments: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/investissements'
      ),
      finance: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/financements'
      )
    },
    synthesis: {
      root: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/etudiez-votre-synthese-previsionnelle'),
      forecastSynthesis: path(
        ROOTS_GUIDES,
        '/faire-son-previsionnel-financier/etudiez-votre-synthese-previsionnelle/synthese-previsionnelle'
      )
    },
    visualisation: {
      root: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/graphique'),
      incomeStatement: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/graphique/compte-de-resultat'),
      balanceSheet: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/graphique/bilan'),
      financialPlan: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/graphique/plan-de-financement'),
      treasury: path(ROOTS_GUIDES, '/faire-son-previsionnel-financier/graphique/tresorerie')
    }
  }
};
