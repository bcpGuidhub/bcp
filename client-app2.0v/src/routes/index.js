import { lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
import AuthGuard from '../guards/AuthGuard';
// guards
import GuestGuard from '../guards/GuestGuard';
import OnboardingGuard from '../guards/OnboardingGuard';
import DashboardLayout from '../layouts/dashboard';
import ProjectSidebar from '../layouts/dashboard/ProjectSidebar';
import AppSidebar from '../layouts/dashboard/AppSidebar';

// providers
import { ChatWebSocketProvider } from '../contexts/ChatWebSocketContext';
import { InquistWebSocketProvider } from '../contexts/InquistWebSocketContext';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'se-connecter',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      )
    },
    {
      path: 'inscription',
      element: <Register />
    },
    { path: 'mot-de-passe/oubli', element: <ResetPassword /> },
    { path: 'mot-de-passe/oubli/stakeholder', element: <ResetStakeholderPassword /> },

    {
      path: 'confirmer-email',
      element: (
        <OnboardingGuard>
          <VerifyCode />
        </OnboardingGuard>
      )
    },
    {
      path: 'confirmer-email-stakeholder',
      element: (
        <OnboardingGuard>
          <VerifyStakeholderCode />
        </OnboardingGuard>
      )
    },
    {
      path: 'reinitialiser/mot-de-passe',
      element: <RenewPassword />
    },
    {
      path: 'stakeholder/reinitialiser/mot-de-passe',
      element: <RenewStakeholderPassword />
    },
    // Stakeholders
    { path: 'invitee/auth', element: <AuthStakeholder /> },
    // conseil routes
    {
      path: 'conseils',
      element: (
        <AuthGuard>
          <ChatWebSocketProvider>
            <InquistWebSocketProvider>
              <DashboardLayout />
              <GeneralLecture />
            </InquistWebSocketProvider>
          </ChatWebSocketProvider>
        </AuthGuard>
      )
    },
    // conseil routes
    {
      path: 'outils',
      element: (
        <AuthGuard>
          <ChatWebSocketProvider>
            <InquistWebSocketProvider>
              <DashboardLayout />
              <AppSidebar />
            </InquistWebSocketProvider>
          </ChatWebSocketProvider>
        </AuthGuard>
      ),
      children: [
        {
          element: <GeneralAppSpace />
        }
      ]
    },
    // User Routes
    {
      path: 'user',
      element: (
        <AuthGuard>
          <ChatWebSocketProvider>
            <InquistWebSocketProvider>
              <DashboardLayout />
              <UserAdmin />
            </InquistWebSocketProvider>
          </ChatWebSocketProvider>
        </AuthGuard>
      )
    },
    // hub
    {
      path: 'hub',
      element: (
        <ChatWebSocketProvider>
          <InquistWebSocketProvider>
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          </InquistWebSocketProvider>
        </ChatWebSocketProvider>
      ),
      children: [
        { element: <Navigate to="/hub/messenger" replace /> },
        {
          path: 'messenger',
          element: <Messenger />
        },
        { path: 'messenger/new', element: <Messenger /> },
        { path: 'messenger/:conversationKey', element: <Messenger /> }
      ]
    },
    // Project Routes
    {
      path: 'project',
      element: (
        <AuthGuard>
          <ChatWebSocketProvider>
            <InquistWebSocketProvider>
              <DashboardLayout />
              <ProjectSidebar />
            </InquistWebSocketProvider>
          </ChatWebSocketProvider>
        </AuthGuard>
      ),
      children: [
        { element: <GeneralApp /> },
        // { path: 'new', element: <CreateProject /> },
        { path: ':id/edit', element: <CreateProject /> },
        // run project tests
        { path: ':id/test_suite', element: <CreatorProjectTestSuite /> },
        // business activity
        {
          path: 'activity-sector/aggregate',
          element: <ActivitySector />
        },
        // finance
        {
          path: 'finance',
          children: [
            {
              path: 'aid',
              element: <FinancialAid />
            }
          ]
        },
        // legal-formalities
        {
          path: 'legal-formalities',
          children: [
            { path: 'legal-status', element: <LegalStatusFormalities /> },
            {
              path: 'tax-status',
              element: <TaxStatusFormalities />
            },
            {
              path: 'social-security-status',
              element: <SocialSecurityFormalities />
            },
            { path: 'legal-status-form', element: <LegalStatusForm /> },
            {
              path: 'tax-status-form',
              element: <TaxStatusForm />
            },
            {
              path: 'social-security-status-form',
              element: <SocialSecurityForm />
            }
          ]
        },

        // project management
        // {
        //   path: 'faire-son-business-plan',
        //   children: [{ path: 'board', element: <BusinessPlanBoard /> }]
        // },
        {
          path: 'faire-son-previsionnel-financier',
          children: [
            {
              path: 'completez-votre-previsionnel-financier',
              children: [
                {
                  element: (
                    <Navigate
                      to="/project/faire-son-previsionnel-financier/completez-votre-previsionnel-financier/chiffre-d-affaires"
                      replace
                    />
                  )
                },
                { path: 'chiffre-d-affaires', element: <FinancialForecastRevenue /> },
                { path: 'depenses', element: <FinancialForecastExpenses /> },
                { path: 'salaires', element: <FinancialForecastEmployees /> },
                { path: 'investissements', element: <FinancialForecastInvestment /> },
                { path: 'financements', element: <FinancialForecastFinances /> }
              ]
            },
            {
              path: 'graphique',
              children: [
                { path: 'compte-de-resultat', element: <IncomeStatementVisualisation /> },
                { path: 'bilan', element: <BalanceSheet /> },
                { path: 'plan-de-financement', element: <FinancialPlan /> },
                { path: 'tresorerie', element: <Treasury /> }
              ]
            }
          ]
        }
      ]
    },
    // Inquist
    {
      path: 'inquist',
      element: (
        <ChatWebSocketProvider>
          <InquistWebSocketProvider>
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          </InquistWebSocketProvider>
        </ChatWebSocketProvider>
      ),
      children: [
        {
          path: 'browse',
          element: <Inquisite />
        },
        {
          path: 'new',
          element: <InquisiteNew />
        },
        { path: 'posts/:id', element: <PostedInquisite /> },
        { path: 'posts/:id/edit', element: <InquisiteNew /> },
        { path: 'posts/:postId/answers/:answerId/edit', element: <InquisitePostAnswerEdit /> }
      ]
    },

    // Board room
    {
      path: 'board-room',
      element: (
        <ChatWebSocketProvider>
          <InquistWebSocketProvider>
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          </InquistWebSocketProvider>
        </ChatWebSocketProvider>
      ),
      children: [{ element: <BusinessPlanBoard /> }]
    },
    {
      path: '/',
      element: <Register />
    }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const AuthStakeholder = Loadable(lazy(() => import('../pages/AuthStakeholder')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const ResetStakeholderPassword = Loadable(lazy(() => import('../pages/authentication/ResetStakeholderPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
const VerifyStakeholderCode = Loadable(lazy(() => import('../pages/authentication/VerifyStakeholderCode')));
const RenewPassword = Loadable(lazy(() => import('../pages/authentication/RenewPassword')));
const RenewStakeholderPassword = Loadable(lazy(() => import('../pages/authentication/RenewStakeholderPassword')));
// Project
const CreateProject = Loadable(lazy(() => import('../pages/service/projects/CreateProject')));
// Run project tests
const CreatorProjectTestSuite = Loadable(lazy(() => import('../pages/service/projects/project_test_suite/creator')));
// Finance
const FinancialAid = Loadable(lazy(() => import('../pages/service/projects/finance/FinancialAid')));
// Legal Formalities
const LegalStatusFormalities = Loadable(lazy(() => import('../pages/service/projects/legal-formalities/LegalStatus')));
const TaxStatusFormalities = Loadable(lazy(() => import('../pages/service/projects/legal-formalities/TaxStatus')));
const SocialSecurityFormalities = Loadable(
  lazy(() => import('../pages/service/projects/legal-formalities/SocialSecurityStatus'))
);
const LegalStatusForm = Loadable(lazy(() => import('../pages/service/projects/legal-formalities/LegalStatusForm')));
const TaxStatusForm = Loadable(lazy(() => import('../pages/service/projects/legal-formalities/TaxForm')));
const SocialSecurityForm = Loadable(
  lazy(() => import('../pages/service/projects/legal-formalities/SocialSecurityForm'))
);
// Business Activity
const ActivitySector = Loadable(lazy(() => import('../pages/service/projects/business-sector/ActivitySector')));
const Messenger = Loadable(lazy(() => import('../components/services/community/messenger/Messenger')));
// Inquisitions
const Inquisite = Loadable(lazy(() => import('../components/services/community/inquisite/Inquisite')));
const InquisiteNew = Loadable(lazy(() => import('../components/services/community/inquisite/InquisiteNew')));
const PostedInquisite = Loadable(lazy(() => import('../components/services/community/inquisite/PostedInquisite')));
const InquisitePostAnswerEdit = Loadable(
  lazy(() => import('../components/services/community/inquisite/InquisitePostAnswerEdit'))
);
// ------ Faire son prévisionnel financier -----
// const FinancialForecastDashboard = Loadable(
//   lazy(() => import('../pages/service/projects/financial-forecast/Dashboard'))
// );
const FinancialForecastRevenue = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/Revenue')));
const FinancialForecastExpenses = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/Expenses')));
const FinancialForecastEmployees = Loadable(
  lazy(() => import('../pages/service/projects/financial-forecast/Employees'))
);
const FinancialForecastInvestment = Loadable(
  lazy(() => import('../pages/service/projects/financial-forecast/Investments'))
);
const FinancialForecastFinances = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/Finances')));
const IncomeStatementVisualisation = Loadable(
  lazy(() => import('../pages/service/projects/financial-forecast/IncomeStatementVisualisation'))
);
const BalanceSheet = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/BalanceSheet')));
const FinancialPlan = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/FinancialPlan')));
const Treasury = Loadable(lazy(() => import('../pages/service/projects/financial-forecast/Treasury')));
// ------ Business Plan -----
const BusinessPlanBoard = Loadable(lazy(() => import('../pages/service/projects/business_strategy/board')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralAppSpace = Loadable(lazy(() => import('../pages/dashboard/GeneralAppSpace')));
const GeneralLecture = Loadable(lazy(() => import('../pages/service/lecture/GeneralLecture')));
const UserAdmin = Loadable(lazy(() => import('../pages/dashboard/UserAdmin')));
