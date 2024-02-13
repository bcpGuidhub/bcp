// routes
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);
const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'platform',
    items: [
      {
        title: 'home',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      { title: 'formation', path: PATH_DASHBOARD.general.formation, icon: ICONS.ecommerce },
      { title: 'Marketplace', path: '', icon: ICONS.analytics },
      {
        title: 'Parcours',
        icon: ICONS.banking,
        path: PATH_DASHBOARD.general.guides.root,
        children: [
          { title: 'Tous les parcours', path: PATH_DASHBOARD.general.guides.root },
          { title: 'Faire son prévisionnel financier', path: PATH_DASHBOARD.general.guides.financial_forecast },
          { title: 'Faire son business plan', path: PATH_DASHBOARD.general.guides.business_plan },
          { title: 'Faire ses choix de création', path: PATH_DASHBOARD.general.guides.company_legal_status },
          { title: 'Créer sa micro-entreprise', path: PATH_DASHBOARD.general.guides.micro_entreprise }
        ]
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'sector',
        path: '',
        icon: ICONS.dashboard
      },
      // MANAGEMENT : USER
      {
        title: 'Tools',
        icon: ICONS.user,
        children: [
          { title: 'securite sociale', path: '' },
          { title: 'IR/IS', path: '' },
          { title: 'Cotisation', path: '' },
          { title: 'statut juridique', path: '' },
          { title: 'aide', path: '' },
          { title: 'etude de marche', path: '' }
        ]
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      { title: 'chat', path: '', icon: ICONS.chat },
      { title: 'calendar', path: '', icon: ICONS.calendar },
      {
        title: 'undercover',
        path: '',
        icon: ICONS.kanban
      }
    ]
  }
];

export default sidebarConfig;
