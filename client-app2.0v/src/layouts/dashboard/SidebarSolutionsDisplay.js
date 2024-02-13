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
  booking: getIcon('ic_booking'),
  inquist: getIcon('ic_thinking')
};

const sidebarSolutionsDisplay = [
  {
    subheader: 'Chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.067a1.25 1.25 0 0 1-1.54-1.54l1.068-3.823A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2Zm0 1.5A8.5 8.5 0 0 0 3.5 12c0 1.47.373 2.883 1.073 4.137l.15.27l-1.112 3.984l3.987-1.112l.27.15A8.5 8.5 0 1 0 12 3.5ZM8.75 13h4.498a.75.75 0 0 1 .102 1.493l-.102.007H8.75a.75.75 0 0 1-.102-1.493L8.75 13h4.498H8.75Zm0-3.5h6.505a.75.75 0 0 1 .101 1.493l-.101.007H8.75a.75.75 0 0 1-.102-1.493L8.75 9.5h6.505H8.75Z"
        />
      </svg>
    ),
    path: PATH_DASHBOARD.hub.root
  },
  {
    subheader: 'Plateforme Questions Réponses',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m8 20l6-6l3-3l1.5-1.5a2.828 2.828 0 1 0-4-4L4 16v4h4zm5.5-13.5l4 4M19 22v.01M19 19a2.003 2.003 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"
        />
      </svg>
    ),
    path: PATH_DASHBOARD.inquist.browse
  },
  {
    subheader: 'Gestion Projet',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM11.75 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm-8.25.75a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-1.5 0ZM8 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 3Z"
        />
      </svg>
    ),
    path: PATH_DASHBOARD.project.root
  },
  {
    subheader: 'Le Board Room',
    path: PATH_DASHBOARD.boardRoom.root,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M7.5 2v3H2v-.5A2.5 2.5 0 0 1 4.5 2h3Zm1 0v8H14V4.5A2.5 2.5 0 0 0 11.5 2h-3Zm5.5 9H8.5v3h3a2.5 2.5 0 0 0 2.5-2.5V11Zm-6.5 3V6H2v5.5A2.5 2.5 0 0 0 4.5 14h3Z"
        />
      </svg>
    )
  }
];

export const sidebarProjectDisplay = [
  {
    subheader: 'Gestion Projet',
    items: [
      {
        title: "Vue d'ensemble",
        children: [
          {
            title: "Vue d'ensemble",
            path: PATH_DASHBOARD.project.root,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.5 5.5v-3h3v3h-3ZM1 2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Zm8 .25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.25ZM9.75 5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM2.5 10.5v3h3v-3h-3ZM2 9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H2Zm7.75.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                  clipRule="evenodd"
                />
              </svg>
            )
          }
        ]
      },
      {
        title: 'Choisissez votre statut juridique',
        children: [
          {
            title: 'Statut juridique',
            path: PATH_DASHBOARD.legal.statusForm,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                <path
                  fill="currentColor"
                  d="M.295 27.581a6.457 6.457 0 0 0 12.805 0H.295zM35.182 40.58a1 1 0 0 1-.998 1.003H15.528c-.548 0-1-.45-1-1.003a.998.998 0 0 1 1-.993h18.655c.552 0 .999.444.999.993zm-20.545 1.514h20.437v2.887H14.637zM36.9 27.581a6.457 6.457 0 0 0 6.402 5.626a6.452 6.452 0 0 0 6.399-5.626H36.9zm12.449-2.009l-5.243-7.222h2.803c.682 0 1.231-.559 1.231-1.25c0-.685-.55-1.238-1.231-1.238H32.061a7.353 7.353 0 0 0-5.634-4.732V7.233c0-.693-.556-1.246-1.245-1.246L25.066 6l-.116-.013a1.24 1.24 0 0 0-1.243 1.246v3.895a7.348 7.348 0 0 0-5.632 4.732H3.224c-.677 0-1.229.553-1.229 1.238c0 .692.552 1.25 1.229 1.25h2.675L.655 25.57H0v1.334h13.398V25.57h-.658l-5.242-7.22h12.169c0-.282.031-.559.073-.824c.043-.125.072-.252.072-.383a5.316 5.316 0 0 1 3.895-3.933v13.697h-.052c-.107 5.152-2.558 9.645-6.194 12.17h15.214c-3.637-2.525-6.086-7.018-6.199-12.17h-.048V13.21a5.315 5.315 0 0 1 3.894 3.933c.004.131.031.258.075.383c.04.266.065.542.065.824h12.042l-5.244 7.222h-.654v1.334H50v-1.334h-.651zm-43.184 0H1.98l4.185-5.765v5.765zm1.071 0v-5.765l4.185 5.765H7.236zm35.532 0h-4.187l4.187-5.765v5.765zm1.066 0v-5.765l4.19 5.765h-4.19zM7.941 14.124a1.243 1.243 0 0 1-2.485 0c0-.686.558-1.246 1.245-1.246c.684-.001 1.24.56 1.24 1.246zm36.604-.066c0 .691-.556 1.239-1.242 1.239a1.234 1.234 0 0 1-1.242-1.239a1.243 1.243 0 1 1 2.484 0z"
                />
              </svg>
            )
          }
        ]
      },
      {
        title: 'Choisissez votre régime fiscal',
        children: [
          {
            title: 'Régime fiscal',
            path: PATH_DASHBOARD.legal.taxesForm,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.91 5.5H1.09c-.56 0-.8-.61-.36-.9L6.64.73a.71.71 0 0 1 .72 0l5.91 3.87c.44.29.2.9-.36.9Z" />
                  <rect width="13" height="2.5" x=".5" y="11" rx=".5" />
                  <path d="M2 5.5V11m2.5-5.5V11M7 5.5V11m2.5-5.5V11M12 5.5V11" />
                </g>
              </svg>
            )
          }
        ]
      },
      {
        title: 'Choisissez votre régime de sécurité sociale',
        children: [
          {
            title: 'Sécurité sociale',
            path: PATH_DASHBOARD.legal.socialSecurityForm,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
                <path
                  fill="currentColor"
                  d="M55.568.649H8.997C4.433.649.721 4.361.721 8.927v46.566c0 4.566 3.712 8.28 8.276 8.28h46.571c4.563 0 8.277-3.714 8.277-8.28V8.927c0-4.565-3.714-8.278-8.277-8.278zM44.017 17.05a1.518 1.518 0 1 1-.002 3.036a1.518 1.518 0 0 1 .002-3.036zM33.27 7.396a2.164 2.164 0 0 1 0 4.327a2.164 2.164 0 0 1 0-4.327zM21.536 7.38c1.212 0 2.197.974 2.197 2.176a2.186 2.186 0 0 1-2.197 2.178a2.185 2.185 0 0 1-2.194-2.178c0-1.202.981-2.176 2.194-2.176zm6.916 45.245l-.01 3.851H19.33v-1.618c0-1.049-.203-1.742-1.034-2.524l-8.372-8.89a7.775 7.775 0 0 1-1.867-5.05V24.969a2.523 2.523 0 0 1 2.522-2.523a2.534 2.534 0 0 1 2.538 2.523v9.803c-1.341.611-2.151 1.85-2.151 3.198c0 .897.358 1.751 1.012 2.41l5.2 5.707c.242.3.563.766.724 1.285c.089.277.117.576.123.948h1.649c-.009-.522-.051-.977-.202-1.444c-.279-.899-.841-1.632-1.173-2.022l-5.123-5.488a2.015 2.015 0 0 1 2.935-2.758l10.622 10.666c1.835 1.923 1.715 3.883 1.715 5.349zm5.573-19.993v-9.769h-.938v9.769c0 .702-.568 1.269-1.269 1.269c-.7 0-1.274-.567-1.274-1.269v-17.17l-.755.002l-1.656 5.781a.792.792 0 0 1-.142.3a.864.864 0 0 1-.762.368a.865.865 0 0 1-.764-.373a.81.81 0 0 1-.13-.269l-1.664-5.807l-.817-.002l2.431 10.161h-2.134v7.218a1.08 1.08 0 0 1-1.082 1.078a1.076 1.076 0 0 1-1.074-1.078v-7.218h-.911v7.218c0 .594-.486 1.078-1.08 1.078a1.076 1.076 0 0 1-1.075-1.078v-7.218h-2.172l2.457-10.161l-.82.002l-1.684 5.868c-.127.449-.63.697-1.122.556c-.493-.142-.801-.57-.637-1.134l1.728-6.021c.69-2.406 2.707-2.332 2.707-2.332h4.293s2.012-.074 2.706 2.332l.844 2.942l.846-2.942c.69-2.406 2.706-2.332 2.706-2.332h5.548s2.017-.074 2.707 2.332l1.714 5.974s1.351.123 1.37.123h4.093c1.074 0 2.019.871 2.019 1.945v3.834c0 .37-.289.668-.656.668a.666.666 0 0 1-.664-.668v-3.37h-.685v9.947c0 .492-.404.89-.895.89s-.89-.399-.89-.89v-5.32h-.699v5.32a.893.893 0 0 1-1.785 0V22.537c-.87-.248-2.053-.584-2.31-.642c-.011-.003-.017-.009-.029-.012c-.289-.074-.531-.264-.618-.553l-1.611-5.868l-.821-.002v17.17c0 .702-.575 1.269-1.277 1.269a1.268 1.268 0 0 1-1.267-1.269zm22.54 5.762a7.77 7.77 0 0 1-1.867 5.05l-8.371 8.89c-.831.782-1.034 1.475-1.034 2.524v1.618h-9.112l-.01-3.851c0-1.467-.12-3.427 1.715-5.349L48.508 36.61a2.015 2.015 0 0 1 2.936 2.758l-5.123 5.488c-.332.389-.894 1.123-1.173 2.022c-.151.467-.193.922-.202 1.444h1.649c.006-.372.034-.671.123-.948c.161-.518.483-.985.724-1.285l5.2-5.708a3.406 3.406 0 0 0 1.012-2.41c-.001-1.347-.81-2.587-2.151-3.198V24.97a2.534 2.534 0 0 1 2.538-2.523a2.523 2.523 0 0 1 2.522 2.523v13.425z"
                />
              </svg>
            )
          }
        ]
      },
      // {
      //   title: 'Business Plan',
      //   children: [
      //     {
      //       title: 'Business Plan board',
      //       path: PATH_DASHBOARD.project.businessPlan.edition.canvas,
      //       icon: (
      //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      //           <path
      //             fill="currentColor"
      //             d="M7.5 2v3H2v-.5A2.5 2.5 0 0 1 4.5 2h3Zm1 0v8H14V4.5A2.5 2.5 0 0 0 11.5 2h-3Zm5.5 9H8.5v3h3a2.5 2.5 0 0 0 2.5-2.5V11Zm-6.5 3V6H2v5.5A2.5 2.5 0 0 0 4.5 14h3Z"
      //           />
      //         </svg>
      //       )
      //     }
      //   ]
      // },
      // MANAGEMENT : USER
      {
        title: 'prévisionnel financier',
        children: [
          {
            title: "chiffre d'affaires",
            path: PATH_DASHBOARD.project.financialForecasts.financialForecast.revenue,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">
                <path
                  fill="currentColor"
                  d="M2048 640v640h-768v512H128v128H0V0h128v128h1408v512h512zM128 256v384h1280V256H128zm1024 1408v-384H128v384h1024zm768-512V768H128v384h1792z"
                />
              </svg>
            )
          },
          {
            title: 'dépenses',
            path: PATH_DASHBOARD.project.financialForecasts.financialForecast.expenses,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v4h10V4H7m0 6v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2Z"
                />
              </svg>
            )
          },
          {
            title: 'salaires',
            path: PATH_DASHBOARD.project.financialForecasts.financialForecast.employees,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <g id="clarityEmployeeGroupSolid0" fill="currentColor">
                  <ellipse cx="18" cy="11.28" rx="4.76" ry="4.7" />
                  <path d="M10.78 11.75h.48v-.43a6.7 6.7 0 0 1 3.75-6a4.62 4.62 0 1 0-4.21 6.46Zm13.98-.47v.43h.48A4.58 4.58 0 1 0 21 5.29a6.7 6.7 0 0 1 3.76 5.99Zm-2.47 5.17a21.45 21.45 0 0 1 5.71 2a2.71 2.71 0 0 1 .68.53H34v-3.42a.72.72 0 0 0-.38-.64a18 18 0 0 0-8.4-2.05h-.66a6.66 6.66 0 0 1-2.27 3.58ZM6.53 20.92A2.76 2.76 0 0 1 8 18.47a21.45 21.45 0 0 1 5.71-2a6.66 6.66 0 0 1-2.27-3.55h-.66a18 18 0 0 0-8.4 2.05a.72.72 0 0 0-.38.64V22h4.53Zm14.93 5.77h5.96v1.4h-5.96z" />
                  <path d="M32.81 21.26h-6.87v-1a1 1 0 0 0-2 0v1H22v-2.83a20.17 20.17 0 0 0-4-.43a19.27 19.27 0 0 0-9.06 2.22a.76.76 0 0 0-.41.68v5.61h7.11v6.09a1 1 0 0 0 1 1h16.17a1 1 0 0 0 1-1V22.26a1 1 0 0 0-1-1Zm-1 10.36H17.64v-8.36h6.3v.91a1 1 0 0 0 2 0v-.91h5.87Z" />
                </g>
              </svg>
            )
          },
          {
            title: 'investissements',
            path: PATH_DASHBOARD.project.financialForecasts.financialForecast.investments,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2 11l2.807-3.157A4 4 0 0 1 7.797 6.5H8m-6 13h5.5l4-3s.81-.547 2-1.5c2.5-2 0-5.166-2.5-3.5C8.964 12.857 7 14 7 14"
                  />
                  <path d="M8 13.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm4.5-1.99l.01-.011m-9.01.011l.01-.011"
                  />
                </g>
              </svg>
            )
          },
          {
            title: 'financements',
            path: PATH_DASHBOARD.project.financialForecasts.financialForecast.finance,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M2 28h28v2H2zm25-17a1 1 0 0 0 1-1V7a1 1 0 0 0-.66-.94l-11-4a1 1 0 0 0-.68 0l-11 4A1 1 0 0 0 4 7v3a1 1 0 0 0 1 1h1v13H4v2h24v-2h-2V11zM6 7.7l10-3.64L26 7.7V9H6zM18 24h-4V11h4zM8 11h4v13H8zm16 13h-4V11h4z"
                />
              </svg>
            )
          },

          {
            title: 'compte de résultats',
            path: PATH_DASHBOARD.project.financialForecasts.visualisation.incomeStatement,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.172 3.172C3 4.343 3 6.229 3 10v4c0 3.771 0 5.657 1.172 6.828C5.343 22 7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172C21 19.657 21 17.771 21 14v-4c0-3.771 0-5.657-1.172-6.828C18.657 2 16.771 2 13 2h-2C7.229 2 5.343 2 4.172 3.172ZM8 9.25a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Zm0 4a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5H8Z"
                  clipRule="evenodd"
                />
              </svg>
            )
          },
          {
            title: 'bilan',
            path: PATH_DASHBOARD.project.financialForecasts.visualisation.balanceSheet,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5h-8q-1.775 0-2.888 1.113T9 9v6q0 1.775 1.113 2.888T13 19h8q0 .825-.588 1.413T19 21H5Zm8-4q-.825 0-1.413-.588T11 15V9q0-.825.588-1.413T13 7h7q.825 0 1.413.588T22 9v6q0 .825-.588 1.413T20 17h-7Zm3-3.5q.65 0 1.075-.425T17.5 12q0-.65-.425-1.075T16 10.5q-.65 0-1.075.425T14.5 12q0 .65.425 1.075T16 13.5Z"
                />
              </svg>
            )
          },
          {
            title: 'plan de financement',
            path: PATH_DASHBOARD.project.financialForecasts.visualisation.financialPlan,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">
                <path
                  fill="currentColor"
                  d="M128 256v384h1920v128H128v1152H0V128h2048v128H128zm128 640h128v128H256V896zm256 0h128v128H512V896zm256 0h128v128H768V896zm256 0h128v128h-128V896zm256 0h128v128h-128V896zm256 0h128v128h-128V896zm256 0h128v128h-128V896zM256 1408h128v128H256v-128zm256 0h128v128H512v-128zm256 0h128v128H768v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zM256 1152h128v128H256v-128zm256 0h128v128H512v-128zm256 0h128v128H768v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128zM256 1664h128v128H256v-128zm256 0h128v128H512v-128zm256 0h128v128H768v-128zm256 0h128v128h-128v-128zm256 0h128v128h-128v-128z"
                />
              </svg>
            )
          },
          {
            title: 'trésorerie',
            path: PATH_DASHBOARD.project.financialForecasts.visualisation.treasury,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g fill="currentColor">
                  <path d="M15 13v1H1.5l-.5-.5V0h1v13h13Z" />
                  <path d="M13 3.207L7.854 8.354h-.708L5.5 6.707l-3.646 3.647l-.708-.708l4-4h.708L7.5 7.293l5.146-5.147h.707l2 2l-.707.708L13 3.207Z" />
                </g>
              </svg>
            )
          }
        ]
      }
    ]
  }
];
export const sidebarAppDisplay = [
  // Finance
  // ----------------------------------------------------------------------
  {
    subheader: 'Financement',
    items: [
      {
        title: 'Les aides financières',
        children: [
          {
            title: 'Les aides financières',
            path: PATH_DASHBOARD.finance.aid,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                <g
                  id="galaSearch0"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="none"
                  strokeMiterlimit="4"
                  strokeWidth="16"
                >
                  <path
                    id="galaSearch1"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeOpacity="1"
                    d="m 89.074145,145.23139 -68.17345,68.17344"
                  />
                  <path
                    id="galaSearch2"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeOpacity="1"
                    d="M 111.27275,167.42999 43.099304,235.60344"
                  />
                  <path
                    id="galaSearch3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m 43.099305,235.60344 a 15.696788,15.696788 0 0 1 -22.19861,0"
                  />
                  <path
                    id="galaSearch4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m 20.900695,213.40483 a 15.696788,15.696788 0 0 0 0,22.19861"
                  />
                  <path
                    id="galaSearch5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M 240.65575,86.483932 A 70.635544,70.635544 0 0 1 170.0202,157.11948 70.635544,70.635544 0 0 1 99.384659,86.483932 70.635544,70.635544 0 0 1 170.0202,15.848389 70.635544,70.635544 0 0 1 240.65575,86.483932 Z"
                  />
                  <path
                    id="galaSearch6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="1"
                    d="m 89.074145,145.23139 22.198605,22.1986"
                  />
                  <path
                    id="galaSearch7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="1"
                    d="m 100.17344,156.33068 19.89988,-19.89987"
                  />
                  <path
                    id="galaSearch8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="1"
                    d="m 70.126446,164.17908 22.198606,22.1986"
                  />
                  <path
                    id="galaSearch9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M 209.26216,86.483936 A 39.241967,39.241967 0 0 1 170.0202,125.7259"
                  />
                </g>
              </svg>
            )
          }
        ]
      }
    ]
  },
  // Les Formalité
  // ----------------------------------------------------------------------
  {
    subheader: 'Les Formalités Playground',
    items: [
      {
        title: 'Statut juridique',
        children: [
          {
            title: 'Statut juridique',
            path: PATH_DASHBOARD.legal.status,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                <path
                  fill="currentColor"
                  d="M.295 27.581a6.457 6.457 0 0 0 12.805 0H.295zM35.182 40.58a1 1 0 0 1-.998 1.003H15.528c-.548 0-1-.45-1-1.003a.998.998 0 0 1 1-.993h18.655c.552 0 .999.444.999.993zm-20.545 1.514h20.437v2.887H14.637zM36.9 27.581a6.457 6.457 0 0 0 6.402 5.626a6.452 6.452 0 0 0 6.399-5.626H36.9zm12.449-2.009l-5.243-7.222h2.803c.682 0 1.231-.559 1.231-1.25c0-.685-.55-1.238-1.231-1.238H32.061a7.353 7.353 0 0 0-5.634-4.732V7.233c0-.693-.556-1.246-1.245-1.246L25.066 6l-.116-.013a1.24 1.24 0 0 0-1.243 1.246v3.895a7.348 7.348 0 0 0-5.632 4.732H3.224c-.677 0-1.229.553-1.229 1.238c0 .692.552 1.25 1.229 1.25h2.675L.655 25.57H0v1.334h13.398V25.57h-.658l-5.242-7.22h12.169c0-.282.031-.559.073-.824c.043-.125.072-.252.072-.383a5.316 5.316 0 0 1 3.895-3.933v13.697h-.052c-.107 5.152-2.558 9.645-6.194 12.17h15.214c-3.637-2.525-6.086-7.018-6.199-12.17h-.048V13.21a5.315 5.315 0 0 1 3.894 3.933c.004.131.031.258.075.383c.04.266.065.542.065.824h12.042l-5.244 7.222h-.654v1.334H50v-1.334h-.651zm-43.184 0H1.98l4.185-5.765v5.765zm1.071 0v-5.765l4.185 5.765H7.236zm35.532 0h-4.187l4.187-5.765v5.765zm1.066 0v-5.765l4.19 5.765h-4.19zM7.941 14.124a1.243 1.243 0 0 1-2.485 0c0-.686.558-1.246 1.245-1.246c.684-.001 1.24.56 1.24 1.246zm36.604-.066c0 .691-.556 1.239-1.242 1.239a1.234 1.234 0 0 1-1.242-1.239a1.243 1.243 0 1 1 2.484 0z"
                />
              </svg>
            )
          }
        ]
      },
      {
        title: 'Fiscalité',
        children: [
          {
            title: 'Fiscalité',
            path: PATH_DASHBOARD.legal.taxes,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.91 5.5H1.09c-.56 0-.8-.61-.36-.9L6.64.73a.71.71 0 0 1 .72 0l5.91 3.87c.44.29.2.9-.36.9Z" />
                  <rect width="13" height="2.5" x=".5" y="11" rx=".5" />
                  <path d="M2 5.5V11m2.5-5.5V11M7 5.5V11m2.5-5.5V11M12 5.5V11" />
                </g>
              </svg>
            )
          }
        ]
      },
      {
        title: 'Sécurité sociale',
        children: [
          {
            title: 'Sécurité sociale',
            path: PATH_DASHBOARD.legal.socialSecurity,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
                <path
                  fill="currentColor"
                  d="M55.568.649H8.997C4.433.649.721 4.361.721 8.927v46.566c0 4.566 3.712 8.28 8.276 8.28h46.571c4.563 0 8.277-3.714 8.277-8.28V8.927c0-4.565-3.714-8.278-8.277-8.278zM44.017 17.05a1.518 1.518 0 1 1-.002 3.036a1.518 1.518 0 0 1 .002-3.036zM33.27 7.396a2.164 2.164 0 0 1 0 4.327a2.164 2.164 0 0 1 0-4.327zM21.536 7.38c1.212 0 2.197.974 2.197 2.176a2.186 2.186 0 0 1-2.197 2.178a2.185 2.185 0 0 1-2.194-2.178c0-1.202.981-2.176 2.194-2.176zm6.916 45.245l-.01 3.851H19.33v-1.618c0-1.049-.203-1.742-1.034-2.524l-8.372-8.89a7.775 7.775 0 0 1-1.867-5.05V24.969a2.523 2.523 0 0 1 2.522-2.523a2.534 2.534 0 0 1 2.538 2.523v9.803c-1.341.611-2.151 1.85-2.151 3.198c0 .897.358 1.751 1.012 2.41l5.2 5.707c.242.3.563.766.724 1.285c.089.277.117.576.123.948h1.649c-.009-.522-.051-.977-.202-1.444c-.279-.899-.841-1.632-1.173-2.022l-5.123-5.488a2.015 2.015 0 0 1 2.935-2.758l10.622 10.666c1.835 1.923 1.715 3.883 1.715 5.349zm5.573-19.993v-9.769h-.938v9.769c0 .702-.568 1.269-1.269 1.269c-.7 0-1.274-.567-1.274-1.269v-17.17l-.755.002l-1.656 5.781a.792.792 0 0 1-.142.3a.864.864 0 0 1-.762.368a.865.865 0 0 1-.764-.373a.81.81 0 0 1-.13-.269l-1.664-5.807l-.817-.002l2.431 10.161h-2.134v7.218a1.08 1.08 0 0 1-1.082 1.078a1.076 1.076 0 0 1-1.074-1.078v-7.218h-.911v7.218c0 .594-.486 1.078-1.08 1.078a1.076 1.076 0 0 1-1.075-1.078v-7.218h-2.172l2.457-10.161l-.82.002l-1.684 5.868c-.127.449-.63.697-1.122.556c-.493-.142-.801-.57-.637-1.134l1.728-6.021c.69-2.406 2.707-2.332 2.707-2.332h4.293s2.012-.074 2.706 2.332l.844 2.942l.846-2.942c.69-2.406 2.706-2.332 2.706-2.332h5.548s2.017-.074 2.707 2.332l1.714 5.974s1.351.123 1.37.123h4.093c1.074 0 2.019.871 2.019 1.945v3.834c0 .37-.289.668-.656.668a.666.666 0 0 1-.664-.668v-3.37h-.685v9.947c0 .492-.404.89-.895.89s-.89-.399-.89-.89v-5.32h-.699v5.32a.893.893 0 0 1-1.785 0V22.537c-.87-.248-2.053-.584-2.31-.642c-.011-.003-.017-.009-.029-.012c-.289-.074-.531-.264-.618-.553l-1.611-5.868l-.821-.002v17.17c0 .702-.575 1.269-1.277 1.269a1.268 1.268 0 0 1-1.267-1.269zm22.54 5.762a7.77 7.77 0 0 1-1.867 5.05l-8.371 8.89c-.831.782-1.034 1.475-1.034 2.524v1.618h-9.112l-.01-3.851c0-1.467-.12-3.427 1.715-5.349L48.508 36.61a2.015 2.015 0 0 1 2.936 2.758l-5.123 5.488c-.332.389-.894 1.123-1.173 2.022c-.151.467-.193.922-.202 1.444h1.649c.006-.372.034-.671.123-.948c.161-.518.483-.985.724-1.285l5.2-5.708a3.406 3.406 0 0 0 1.012-2.41c-.001-1.347-.81-2.587-2.151-3.198V24.97a2.534 2.534 0 0 1 2.538-2.523a2.523 2.523 0 0 1 2.522 2.523v13.425z"
                />
              </svg>
            )
          }
        ]
      }
    ]
  },
  // Secteur d'activité
  // ----------------------------------------------------------------------
  {
    subheader: "Secteur d'activité",
    items: [
      {
        title: "Secteur d'activité",
        children: [
          {
            title: "Secteur d'activité",
            path: PATH_DASHBOARD.sector.activityAggregate,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                  d="M176 416v64M80 32h192a32 32 0 0 1 32 32v412a4 4 0 0 1-4 4H48h0V64a32 32 0 0 1 32-32Zm240 160h112a32 32 0 0 1 32 32v256h0h-160h0V208a16 16 0 0 1 16-16Z"
                />
                <path
                  fill="currentColor"
                  d="M98.08 431.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm80 240a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm80 320a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Zm0-80a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79Z"
                />
                <ellipse
                  cx="256"
                  cy="176"
                  fill="currentColor"
                  rx="15.95"
                  ry="16.03"
                  transform="rotate(-45 255.99 175.996)"
                />
                <path
                  fill="currentColor"
                  d="M258.08 111.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79ZM400 400a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm0-80a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm0-80a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm-64 160a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm0-80a16 16 0 1 0 16 16a16 16 0 0 0-16-16Zm0-80a16 16 0 1 0 16 16a16 16 0 0 0-16-16Z"
                />
              </svg>
            )
          }
        ]
      }
    ]
  }
  // ----------------------------------------------------------------------
];
export default sidebarSolutionsDisplay;
