import { Box, Grid, Input, LinearProgress, Sheet, Stack, Typography } from '@mui/joy';
import AppBar from '@mui/material/AppBar';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import { useSnackbar } from 'notistack';
import RadioGroup from '@mui/joy/RadioGroup';
import Button from '@mui/joy/Button';
import { Drawer, List, ListItem, useMediaQuery } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import MenuIcon from '@mui/icons-material/Menu';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GradingIcon from '@mui/icons-material/Grading';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { useTheme } from '@mui/styles';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from '../../../redux/store';
import {
  getProjectTestSuites,
  isSelectedProjectTestSuiteLabel,
  selectTestSuiteLabel,
  getProjectLegalStatus,
  getProjectFinancialForecast,
  fetchEmployees
} from '../../../redux/slices/project';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { COTISATION_API } from '../../../utils/axios';
import Label from '../../Label';
import { EmbeddedFiscalStatusDecisionTool, EmbeddedLegalStatusDecisionTool } from '../guide/legal-declarations';
import MicroEntrepriseTest from './MicroEntrepriseTest';
import MicroReelComparisonTool from './MicroReelComparisonTool';
import { MHidden } from '../../@material-extend';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
import useAuth from '../../../hooks/useAuth';

const currency = require('currency.js');

const euro = (value) =>
  currency(value, {
    symbol: '€',
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: ' ',
    decimal: ',',
    precision: 0
  });
const drawerWidth = 240;
const microEntrepriseActivityCategory = {
  trader: [
    'Bijouterie - Joaillerie',
    'Boucherie - Charcuterie',
    'Boulangerie - Pâtisserie',
    'Caviste',
    'Chocolaterie',
    'Cordonnerie',
    'Ébénisterie',
    'Fabrication de boissons alcoolisées',
    'Ferronnerie',
    'Fleuriste',
    'Fromagerie',
    'Hôtellerie',
    'Poissonnerie',
    'Restauration rapide à livrer ou à emporter',
    'Traiteur',
    'Verrerie',
    'Bar, café, débit de tabac',
    'Commerce de détail alimentaire',
    'Commerce de détail non alimentaire',
    'Commerce de gros',
    'E-commerce',
    "Galerie d'art",
    'Jardinerie',
    'Presse et publications périodiques',
    'Production industrielle',
    'Restauration traditionnelle',
    'Restauration rapide sur place'
  ],
  serviceProvider: [
    'Électricité',
    'Travaux publics',
    'Carrelage et sols',
    'Couverture',
    'Cuisiniste',
    'Crèche',
    'Déménagement',
    'Démolition',
    'Optique et lunetterie',
    'Institut de beauté',
    'Maçonnerie',
    'Menuiserie',
    'Paysagiste',
    'Spectacle vivant',
    'Peinture en bâtiment',
    'Salon de coiffure',
    'Transport léger de marchandises',
    'Transport lourd de marchandises',
    'Plâtrerie - Isolation',
    'Plomberie-chauffage',
    'Agence de sécurité',
    'Agence de voyage',
    'Agent commercial',
    'Agence immobilière',
    "Architecte d'intérieur",
    'Taxi',
    'VTC',
    'Diagnostic immobilier',
    'Services administratifs',
    'Entretien et réparation de véhicules',
    'Services à la personne',
    'Ambulance',
    'Agence de communication ou publicité',
    'Agence marketing',
    'Agence web',
    "Agent général d'assurance",
    'Architecte',
    'Auto-école',
    'Avocat',
    "Bureau d'études",
    'Cabinet de diététique',
    'Coach sportif',
    'Conseil et activités informatiques',
    'Consulting et conseil',
    'Courtage en assurance',
    'Courtage en financement',
    'Designer',
    'Enseignement privé',
    'Formation',
    'Géomètre-expert',
    'Graphiste',
    'Kinésithérapie',
    'Médecine',
    'Ostéopathie',
    'Pharmacie',
    'Vétérinaire',
    'Autre activité libérale'
  ],
  exception: ['Autre activité commerciale', 'Autre activité artisanale', 'Start-up']
};

function computeCompatibilityMicroRegime(microReel, project) {
  let sectorPlacement = null;
  if (microEntrepriseActivityCategory.exception.includes(project.activity_sector)) {
    if (project.project_legal_status.micro_entreprise_activity_category === 'Vente de marchandises') {
      sectorPlacement = 'trader';
    } else {
      sectorPlacement = 'serviceProvider';
    }
  } else if (microEntrepriseActivityCategory.trader.includes(project.activity_sector)) {
    sectorPlacement = 'trader';
  } else {
    sectorPlacement = 'serviceProvider';
  }

  const threshold = sectorPlacement === 'trader' ? 176200 : 72600;

  const conditions = {
    year_1: microReel.revenue_year_1 > threshold,
    year_2: microReel.revenue_year_2 > threshold,
    year_3: microReel.revenue_year_3 > threshold
  };
  const initial = ['year_1', 'year_2', 'year_3'];
  const actual = initial
    .map((year) => {
      if (conditions[year]) {
        return 'scenario 1';
      }
      return 'scenario 2';
    })
    .reduce(
      (acc, scenario, k) => {
        k += 1;
        acc[scenario].push(k);
        return acc;
      },
      { 'scenario 1': [], 'scenario 2': [] }
    );
  let responseScenario1 = null;
  let responseScenario2 = null;
  let responseScenario3 = null;

  Object.keys(actual).forEach((scenario) => {
    const len = actual[scenario].length;
    if (scenario === 'scenario 1') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario2 = `année ${actual[scenario][0]}`;
        } else if (len === 2 && actual[scenario].includes(1) && actual[scenario].includes(3)) {
          responseScenario2 = `année ${actual[scenario][0]} et année ${actual[scenario][1]}`;
        } else if (
          (actual[scenario].includes(1), actual[scenario].includes(2)) ||
          (actual[scenario].includes(2), actual[scenario].includes(3))
        ) {
          responseScenario1 = `Le montant de votre chiffre d'affaires dépasse les seuils du régime fiscal de la micro-entreprise pendant deux années consécutives, votre entreprise passera donc au régime réel d'imposition à compter de l'année qui suit ces deux années de dépassement.`;
        }
      }
    }
    if (scenario === 'scenario 2') {
      if (len >= 1) {
        if (len === 3) {
          responseScenario3 =
            "Le montant de votre chiffre d'affaires est systématiquement inférieur aux seuils du régime fiscal de la micro-entreprise. Vous pouvez donc bénéficier de ce régime d'imposition en année 1, année 2 et année 3.";
        }
      }
    }
  });
  return (
    <Sheet
      sx={{
        mt: 8,
        borderRadius: '12px',
        backgroundColor: '#001E3C',
        // padding: '20px 20px',
        borderColor: '#132F4C',
        color: 'rgb(248, 248, 242)'
      }}
    >
      <Box>
        {responseScenario1 && (
          <Box p={1} m={1}>
            <Typography component="div" variant="p" sx={{ color: 'common.white' }}>
              situation actuelle
            </Typography>
            <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
              {responseScenario1}
            </Typography>
          </Box>
        )}
        {responseScenario2 && (
          <Box p={1} m={1}>
            <Typography component="div" variant="p" sx={{ color: 'common.white' }}>
              situation actuelle
            </Typography>
            <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
              Le montant de votre chiffre d'affaires dépasse les seuils du régime fiscal de la micro-entreprise en{' '}
              <strong style={{ color: '#fe6116' }}>{responseScenario2}</strong>. Toutefois, comme votre entreprise ne
              dépasse pas les seuils sur deux années consécutives, elle ne sera pas obligée de passer au régime réel
              d'imposition.
            </Typography>
          </Box>
        )}
        {responseScenario3 && (
          <Box p={1} m={1}>
            <Typography component="div" variant="p" sx={{ color: 'common.white' }}>
              situation actuelle
            </Typography>
            <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
              {responseScenario3}
            </Typography>
          </Box>
        )}
      </Box>
    </Sheet>
  );
}

function ComputeRecommendationFinancialSecurityMargin(runningTestSuite, selectedOptions, treasury) {
  const theme = useTheme();
  const conditions = {
    year_1: Object.keys(treasury.monthly_year_1).every((k) => treasury.monthly_year_1[k] >= 0),
    year_2: Object.keys(treasury.monthly_year_2).every((k) => treasury.monthly_year_2[k] >= 0),
    year_3: Object.keys(treasury.monthly_year_3).every((k) => treasury.monthly_year_3[k] >= 0)
  };
  const response = {
    year_1: Object.keys(treasury.monthly_year_1).every(
      (k) =>
        treasury.year_1_disbursement_average *
          (parseInt(
            selectedOptions[runningTestSuite][0][
              'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
            ],
            10
          ) || 0) <
        treasury.monthly_year_1[k]
    ),
    year_2: Object.keys(treasury.monthly_year_2).every(
      (k) =>
        treasury.year_2_disbursement_average *
          (parseInt(
            selectedOptions[runningTestSuite][0][
              'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
            ],
            10
          ) || 0) <
        treasury.monthly_year_2[k]
    ),
    year_3: Object.keys(treasury.monthly_year_3).every(
      (k) =>
        treasury.year_3_disbursement_average *
          (parseInt(
            selectedOptions[runningTestSuite][0][
              'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
            ],
            10
          ) || 0) <
        treasury.monthly_year_3[k]
    )
  };
  const initial = ['year_1', 'year_2', 'year_3'];
  const actual = initial
    .map((year) => {
      if (conditions[year]) {
        if (response[year]) {
          return 'scenario 1';
        }
        return 'scenario 2';
      }
      return 'scenario 3';
    })
    .reduce(
      (acc, scenario, k) => {
        k += 1;
        acc[scenario].push(k);
        return acc;
      },
      { 'scenario 1': [], 'scenario 2': [], 'scenario 3': [] }
    );

  let responseScenario1 = null;
  let responseScenario2 = null;
  let responseScenario3 = null;
  Object.keys(actual).forEach((scenario) => {
    const len = actual[scenario].length;
    if (scenario === 'scenario 1') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario1 = `En année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario1 = `En années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario1 = `En années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
    if (scenario === 'scenario 2') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario2 = `En année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario2 = `En années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario2 = `En années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
    if (scenario === 'scenario 3') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario3 = `En année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario3 = `En années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario3 = `En années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={{ [theme.breakpoints.down('md')]: { p: 0 } }}
    >
      {responseScenario1 && (
        <Box>
          <Typography component="div" variant="p">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3" sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              {responseScenario1}
            </strong>{' '}
            , votre solde de trésorerie mensuel est{' '}
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              systématiquement supérieur{' '}
            </strong>
            au montant de la marge de sécurité financière dont vous avez besoin. Cela signifie que vous disposez d'une
            marge de manoeuvre financière pour gérer quelques imprévus (un retard de paiement, une dépense
            supplémentaire, un démarrage de l'activité plus lent que prévu...). Cette sécurité est importante.
          </Typography>
        </Box>
      )}
      {responseScenario2 && (
        <Box>
          <Typography component="div" variant="p">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3" sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              {responseScenario2}
            </strong>{' '}
            , votre solde de trésorerie mensuel est{' '}
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              parfois inférieur{' '}
            </strong>
            au montant de la marge de sécurité financière dont vous avez besoin. Votre marge de maneouvre financière
            risque de ne pas être suffisante pour gérer tout imprévu (un retard de paiement, une dépense supplémentaire,
            un démarrage de l'activité plus lent que prévu...). L'insuffisance de trésorerie est la principale cause de
            défaillance d'entreprise. Sans marge de maneouvre suffisante, un imprévu peut rapidement engendrer des
            difficultés financières et vous placer en situation de découvert. Pour réduire le risque de vous retrouver
            dans ce type de situation, nous vous conseillons d'apporter, dans la mesure du possible, d'avantage de
            moyens financiers dans votre projet.
          </Typography>
        </Box>
      )}
      {responseScenario3 && (
        <Box>
          <Typography component="div" variant="p">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3" sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              {responseScenario3}{' '}
            </strong>
            , votre solde de trésorerie mensuel est{' '}
            <strong
              style={{
                color: '#fe6116'
              }}
            >
              parfois négatif
            </strong>
            . Vous vous retrouvez donc en situation de découvert bancaire au niveau de votre entreprise. Il est
            important d'identifier la source de ce problème dans votre prévisionnel, puis d'ajuster votre projet pour
            éviter de vous retrouver dans cette situation.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function computeRecommendationInitialFinancingPlan(
  theme,
  runningTestSuite,
  selectedOptions,
  project,
  treasuryMonthlyYear1,
  personalDeposits
) {
  const response = selectedOptions[runningTestSuite][0]['Avez-vous déjà avancé au niveau de votre financement ?'];
  const conditionOnTreasury = Object.keys(treasuryMonthlyYear1).every((k) => treasuryMonthlyYear1[k] >= 0);
  let situation = null;
  let responseText = null;
  if (project.type_project === "Un projet de création d'entreprise") {
    if (personalDeposits > 0.25) {
      situation = 'good';
    } else if (personalDeposits <= 0.25 && personalDeposits >= 0.15) {
      situation = 'fair';
    } else {
      situation = 'bad';
    }
  }
  if (project.type_project === "Un projet de reprise d'entreprise") {
    if (personalDeposits > 0.2) {
      situation = 'good';
    } else if (personalDeposits <= 0.2 && personalDeposits >= 0.1) {
      situation = 'fair';
    } else {
      situation = 'bad';
    }
  }
  if (response === "J'ai obtenu mon accord de financement") {
    if (conditionOnTreasury) {
      responseText = `<p>Vous avez obtenu votre accord de financement, la faisabilité financière de votre projet est donc validé. Votre plan de financement est 
      <strong style="color:#fe6116">
      équilibré
      </strong>. Sur les 12 premiers mois d'activité, votre trésorerie est systématiquement <strong style="color:#fe6116">
    positive
    </strong>. Cela signifie que le montage financier de votre projet est cohérent.</p>`;
    } else {
      responseText = `<p>Vous avez obtenu votre accord de financement, la faisabilité financière de votre projet est donc <strong style="color:#fe6116">
    validé
    </strong>. Par contre, sur les 12 premiers mois d'activité, votre trésorerie <strong style="color:#fe6116">
  n'est pas systématiquement positive
  </strong>. Cela peut notamment s'expliquer par un déséquilibre entre les besoins financiers et les ressources mobilisées pour votre projet.</p>`;
    }
  }
  if (
    response === "Mon dossier est en cours d'étude auprès d'une ou de plusieurs banques" ||
    response === "Je n'ai pas encore commencé mes démarches"
  ) {
    if (conditionOnTreasury && situation === 'good') {
      responseText = `Votre plan de financement est <strong style="color:#fe6116">
      équilibré
    </strong>. Sur les 12 premiers mois d'activité, votre trésorerie <strong style="color:#fe6116">
  est systématiquement positive
  </strong>. Cela signifie que le montage financier de votre projet est cohérent. Ensuite, votre pourcentage d'apports personnels est <strong style="color:#fe6116">
satisfaisant
</strong>. Avec un bon dossier, vous avez de grandes chances d'obtenir un accord de financement pour votre projet.</p>`;
    }
    if (conditionOnTreasury && situation === 'fair') {
      responseText = `<p>Votre plan de financement est <strong style="color:#fe6116">équilibré</strong>. Sur les 12 premiers mois d'activité, votre trésorerie <strong style="color:#fe6116">
    est systématiquement positive
    </strong>. Cela signifie que le montage financier de votre projet est cohérent. Par contre, le montant de vos apports personnels est un <strong style="color:#fe6116">peu juste</strong> par rapport au montant du financement global de votre projet. En l'état actuel, vos chances d'obtenir un accord de financement ne sont donc pas optimales. Il va falloir monter un bon dossier et capitaliser sur vos autres points forts. </p>`;
    }
    if (conditionOnTreasury && situation === 'bad') {
      responseText = `<p>Votre plan de financement est <strong style="color:#fe6116">équilibré</strong>. Sur les 12 premiers mois d'activité, votre trésorerie <strong style="color:#fe6116">
    est systématiquement positive
    </strong>. Cela signifie que le montage financier de votre projet est cohérent. Par contre, le montant de vos apports personnels est <strong style="color:#fe6116">
  insuffisant
  </strong> par rapport au montant du financement global de votre projet. Vous avez donc très peu de chance d'obtenir un accord de financement en l'état actuel. Nous vous conseillons de retravailler votre projet et de l'adapter par rapport à vos propres capacités financières.</p>`;
    }
    if (!conditionOnTreasury && situation === 'good') {
      responseText = `<p>Sur les 12 premiers mois d'activité, votre trésorerie <strong style="color:#fe6116">
    n'est pas systématiquement positive
    </strong>. Cela peut notamment s'expliquer par un déséquilibre entre les besoins financiers et les ressources mobilisées pour votre projet. Il est donc nécessaire de retravailler sur votre prévisionnel de trésorerie. Ensuite, votre pourcentage d'apports personnels est <strong style="color:#fe6116">
  satisfaisant
  </strong>. Avec un bon dossier, vous avez de grandes chances d'obtenir un accord de financement pour votre projet. </p>`;
    }
    if (!conditionOnTreasury && situation === 'fair') {
      responseText = `<p>Sur les 12 premiers mois d'activité, votre trésorerie  <strong style="color:#fe6116">
    n'est pas systématiquement positive
    </strong>. Cela peut notamment s'expliquer par un déséquilibre entre les besoins financiers et les ressources mobilisées pour votre projet. Ensuite, le montant de vos apports personnels est un peu juste par rapport au montant du financement global de votre projet. En l'état actuel, vos chances d'obtenir un accord de financement ne sont donc pas optimales. Tout d'abord, il convient de retravailler sur votre prévisionnel de trésorerie. Enfin, pour augmenter vos chances d'obtenir un accord de financement, vous allez devoir vous monter un bon dossier et capitaliser sur vos autres points forts. </p>`;
    }
    if (!conditionOnTreasury && situation === 'bad') {
      responseText = `<p>Sur les 12 premiers mois d'activité, votre trésorerie 
      <strong style="color:#fe6116" >
n'est pas systématiquement positive
</strong>. Cela peut notamment s'expliquer par un déséquilibre entre les besoins financiers et les ressources mobilisées pour votre projet. De plus, le montant de vos apports personnels est insuffisant par rapport au montant du financement global de votre projet. Vous avez donc très peu de chance d'obtenir un accord de financement en l'état actuel. Nous vous conseillons de retravailler votre projet et de l'adapter par rapport à vos propres capacités financières.</p>`;
    }
  }
  return (
    <Box>
      {responseText && (
        <Box>
          <Typography component="div" variant="p" sx={{ [theme.breakpoints.down('md')]: { fontSize: '3.5vw' } }}>
            situation actuelle
          </Typography>
          <Typography variant="p" component="div" sx={{ [theme.breakpoints.down('md')]: { fontSize: '3.5vw' } }}>
            {parse(responseText)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function computeRecommendationMatchFinancialNeedsDirector(
  runningTestSuite,
  selectedOptions,
  projectLegal,
  incomeSituation
) {
  const response1 =
    selectedOptions[runningTestSuite][0][
      'Quel est le montant du revenu annuel minimum dont vous avez besoin pour être dans une situation financière personnelle confortable ?'
    ];
  const response2 =
    selectedOptions[runningTestSuite][1][
      'Quel est le montant annuel de vos autres revenus (en dehors de votre nouveau projet) ?'
    ];

  const variableR = parseInt(response1 - response2, 10);
  if (projectLegal.tax_system === 'IR') {
    let responseScenario1 = null;
    if (
      variableR < incomeSituation.year_1 ||
      variableR < incomeSituation.year_2 ||
      variableR < incomeSituation.year_3
    ) {
      const initial = ['year_1', 'year_2', 'year_3'];
      const actual = initial
        .map((year) => {
          if (variableR < incomeSituation[year]) {
            return 'scenario 1';
          }
          return null;
        })
        .reduce(
          (acc, scenario, k) => {
            if (scenario) {
              k += 1;
              acc[scenario].push(k);
            }
            return acc;
          },
          { 'scenario 1': [] }
        );
      const len = actual['scenario 1'].length;

      if (len >= 1) {
        if (len === 1) {
          responseScenario1 = `en année ${actual['scenario 1'][0]}`;
        } else if (len === 2) {
          responseScenario1 = `en années ${actual['scenario 1'][0]} et ${actual['scenario 1'][1]}`;
        } else {
          responseScenario1 = `en années ${actual['scenario 1'][0]}, ${actual['scenario 1'][1]} et ${actual['scenario 1'][2]}`;
        }
      }
    }

    return (
      <Box>
        {variableR >= incomeSituation.year_1 &&
          variableR >= incomeSituation.year_2 &&
          variableR >= incomeSituation.year_3 && (
            <Box p={1} m={1}>
              <Typography component="div" variant="p" className="actual_state">
                situation actuelle
              </Typography>
              <Typography variant="h3" component="h3">
                <>
                  Sur les trois années de prévision, la somme de votre résultat net prévisionnel et de vos autres
                  revenus annuels est{' '}
                  <strong
                    style={{
                      color: '#fe6116'
                    }}
                  >
                    supérieure
                  </strong>{' '}
                  au montant du revenu annuel minimum dont vous avez besoin à titre personnel. À ce niveau, la
                  faisabilité de votre projet est donc{' '}
                  <strong
                    style={{
                      color: '#fe6116'
                    }}
                  >
                    satisfaisante
                  </strong>
                  .
                </>
              </Typography>
            </Box>
          )}
        {(variableR < incomeSituation.year_1 ||
          variableR < incomeSituation.year_2 ||
          variableR < incomeSituation.year_3) && (
          <Box p={1} m={1}>
            <Typography component="div" variant="p">
              situation actuelle
            </Typography>
            <Typography variant="h3" component="h3">
              <>
                La somme de votre résultat net prévisionnel{' '}
                <strong
                  style={{
                    color: '#fe6116'
                  }}
                >
                  {responseScenario1}
                </strong>{' '}
                et de vos autres revenus annuels est{' '}
                <strong
                  style={{
                    color: '#fe6116'
                  }}
                >
                  inférieure
                </strong>{' '}
                au montant du revenu annuel minimum dont vous avez besoin à titre personnel. Nous vous conseillons
                d'examiner la compatibilité entre votre projet et vos besoins financiers personnel avant de lancer votre
                projet.
              </>
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  const initial = ['year_1', 'year_2', 'year_3'];
  const actual = initial
    .map((year) => {
      const key = `director_salary_${year}`;
      if (variableR >= incomeSituation[key]) {
        if (incomeSituation[year] < 0) {
          return 'scenario 1';
        }
        return 'scenario 2';
      }
      if (incomeSituation[year] < 0) {
        return 'scenario 3';
      }
      return 'scenario 4';
    })
    .reduce(
      (acc, scenario, k) => {
        k += 1;
        acc[scenario].push(k);
        return acc;
      },
      { 'scenario 1': [], 'scenario 2': [], 'scenario 3': [], 'scenario 4': [] }
    );

  let responseScenario1 = null;
  let responseScenario2 = null;
  let responseScenario3 = null;
  let responseScenario4 = null;

  Object.keys(actual).forEach((scenario) => {
    const len = actual[scenario].length;
    if (scenario === 'scenario 1') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario1 = `en année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario1 = `en années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario1 = `en années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
    if (scenario === 'scenario 2') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario2 = `en année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario2 = `en années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario2 = `en années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
    if (scenario === 'scenario 3') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario3 = `en année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario3 = `en années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario3 = `en années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
    if (scenario === 'scenario 4') {
      if (len >= 1) {
        if (len === 1) {
          responseScenario4 = `en année ${actual[scenario][0]}`;
        } else if (len === 2) {
          responseScenario4 = `en années ${actual[scenario][0]} et ${actual[scenario][1]}`;
        } else {
          responseScenario4 = `en années ${actual[scenario][0]}, ${actual[scenario][1]} et ${actual[scenario][2]}`;
        }
      }
    }
  });

  return (
    <Box>
      {responseScenario1 && (
        <Box p={1} m={1}>
          <Typography component="div" variant="p" className="actual_state">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3">
            <>
              La somme des rémunérations incluses dans votre prévisionnel{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario1}
              </strong>{' '}
              et de vos autres revenus annuels est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                inférieure
              </strong>{' '}
              au montant du revenu annuel minimum dont vous avez besoin à titre personnel. De plus, votre résultat net
              prévisionnel est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                négatif
              </strong>{' '}
              <strong>{responseScenario1}</strong>. En l'état actuel, vous n'êtes donc en mesure d'augmenter le montant
              de votre rémunération{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario1}
              </strong>
              , au risque d'accroître votre déficit. Nous vous conseillons d'examiner la compatibilité entre votre
              projet et vos besoins financiers personnel avant de lancer votre projet.
            </>
          </Typography>
        </Box>
      )}
      {responseScenario2 && (
        <Box p={1} m={1}>
          <Typography component="div" variant="p" className="actual_state">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3">
            <>
              La somme des rémunérations incluses dans votre prévisionnel{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario2}
              </strong>{' '}
              et de vos autres revenus annuels est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                inférieure{' '}
              </strong>{' '}
              au montant du revenu annuel minimum dont vous avez besoin à titre personnel. Toutefois, votre résultat net
              prévisionnel est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                positif
              </strong>{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario2}
              </strong>
              . Vous avez donc peut-être la possiblité d'augmenter le montant de votre rémunération, dans la limite des
              capacités de votre entreprise, pour atteindre le niveau de revenu donc vous avez besoin.
            </>
          </Typography>
        </Box>
      )}
      {responseScenario3 && (
        <Box p={1} m={1}>
          <Typography component="div" variant="p" className="actual_state">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3">
            <>
              La somme des rémunérations incluses dans votre prévisionnel{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario3}
              </strong>{' '}
              et de vos autres revenus annuels est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                supérieure
              </strong>{' '}
              au montant du revenu annuel minimum dont vous avez besoin à titre personnel. Par contre, le résultat net
              prévisionnel{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario3}
              </strong>{' '}
              est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                négatif
              </strong>
              . Nous vous conseillons d'examiner votre prévisionnel pour valider la faisabilité de votre projet à ce
              niveau.
            </>
          </Typography>
        </Box>
      )}
      {responseScenario4 && (
        <Box p={1} m={1}>
          <Typography component="div" variant="p" className="actual_state">
            situation actuelle
          </Typography>
          <Typography variant="h3" component="h3">
            <>
              La somme des rémunérations incluses dans votre prévisionnel{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario4}
              </strong>{' '}
              et de vos autres revenus annuels est{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                supérieure
              </strong>{' '}
              au montant du revenu annuel minimum dont vous avez besoin à titre personnel. À ce niveau, la faisabilité
              de votre projet est donc satisfaisante. De plus, votre résultat étant{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                positif
              </strong>{' '}
              <strong
                style={{
                  color: '#fe6116'
                }}
              >
                {responseScenario4}
              </strong>
              , vous disposez même d'une marge de manoeuvre pour accroître vos revenus en cas de besoin.
            </>
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function computeMicroReelTaxRegime(runningTestSuite, selectedOptions, microReel, projectLegal, project) {
  let sectorPlacement = null;

  if (microEntrepriseActivityCategory.exception.includes(project.activity_sector)) {
    if (projectLegal.micro_entreprise_activity_category === 'Vente de marchandises') {
      sectorPlacement = 'trader';
    } else {
      sectorPlacement = 'serviceProvider';
    }
  } else if (microEntrepriseActivityCategory.trader.includes(project.activity_sector)) {
    sectorPlacement = 'trader';
  } else {
    sectorPlacement = 'serviceProvider';
  }

  return (
    <MicroReelComparisonTool
      runningTestSuite={runningTestSuite}
      selectedOptions={selectedOptions}
      microReel={microReel}
      sectorPlacement={sectorPlacement}
    />
  );
}

function computeRecommendation(theme, projectLegal, employees, directors, selectedOptions, runningTestSuite) {
  const response = selectedOptions[runningTestSuite][0]["Quel dispositif d'aide Pôle emploi pensez-vous choisir ?"];
  const fiscal = projectLegal.tax_system;
  const employee = projectLegal.social_security_scheme === 'Régime général de la sécurité sociale';
  const directorSalaryFirst2yrs = directors.some(
    (director, _) =>
      parseInt(director.net_compensation_year_1, 10) > 0 && parseInt(director.net_compensation_year_2, 10) > 0
  );

  return (
    <>
      {response === "Le maintien des allocations d'aide au retour à l'emploi" && (
        <Box>
          <Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Sécurité sociale des indépendants et imposition des bénéfices à l'IR :
            </Typography>
            <Box>
              {fiscal === 'IR' && !employee && (
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  situation actuelle
                </Typography>
              )}
              <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                Attention, étant donné que vous serez affilié à la sécurité sociale des indépendants et que vous avez
                choisi l'IR au niveau de l'imposition des bénéfices de votre entreprise, vous ne pourrez pas obtenir le
                maintien intégral de vos allocations. Une régularisation de vos allocations sera également opérée
                lorsque vos revenus définitifs seront déclarés à l'administration. Le maintien intégral des allocations
                est uniquement possible à la double condition suivante : vous créez une entreprise à l'impôt sur les
                sociétés (IS) et vous ne vous versez pas de rémunération.
              </Typography>
            </Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Régime général de la sécurité sociale et imposition des bénéfices à l'IR :
            </Typography>
            <Box>
              {fiscal === 'IR' && employee && (
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  situation actuelle
                </Typography>
              )}
              <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                En principe, vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise.
                Étant donné que vous n'êtes pas affilié à la sécurité sociale des indépendants, votre revenu servant de
                base de calcul de vos cotisations sociales ne correspond pas à votre bénéfice professionnel. Pour
                obtenir le maintien de vos allocations, vous devez signaler votre création d'entreprise auprès de votre
                agence Pôle emploi. En fournissant un procès-verbal de non-rémunération de vos fonctions de dirigeant,
                vous pourrez obtenir le maintien intégral du versement de vos allocations.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Pas de rémunération du dirigeant les 24 premiers mois et imposition des bénéfices à l'IS :
            </Typography>
            <Box>
              {fiscal === 'IS' && !directorSalaryFirst2yrs && (
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  situation actuelle
                </Typography>
              )}
              <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela,
                vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. En fournissant un
                procès-verbal de non-rémunération de vos fonctions de dirigeant, vous pourrez obtenir le maintien
                intégral du versement de vos allocations.
              </Typography>
            </Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Rémunération du dirigeant sur les 24 premiers mois et imposition des bénéfices à l'IS :
            </Typography>
            <Box>
              {fiscal === 'IS' && directorSalaryFirst2yrs && (
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  situation actuelle
                </Typography>
              )}
              <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela,
                vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. Étant donné que vous
                comptez vous octroyer une rémunération, le maintien du versement de vos allocations sera partiel, voire
                suspendu, en fonction du montant de votre rémunération.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {response === "Le versement en capital d'une partie de mes droits (ARCE)" && (
        <Box>
          <Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Pas de salaires dirigeant:
            </Typography>
            <Box>
              <Box>
                {!directorSalaryFirst2yrs && (
                  <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                    situation actuelle
                  </Typography>
                )}
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  Nous avons remarqué, dans votre prévisionnel, que vous n'avez pas prévu de vous rémunérer. Attention,
                  en choisissant le versement en capital, vous ne percevrez plus vos allocations mensuelles. Avant de
                  valider ce choix, êtes-vous certain de pouvoir subvenir à vos besoins personnels avec vos économies
                  et/ou vos autres revenus ? Enfin, pour obtenir le versement en capital, vous devez remplir un
                  formulaire de demande d'ARCE et le transmettre à Pôle emploi, et justifier la création de votre
                  entreprise (en fournissant un extrait K-Bis par exemple).
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
              Salaires dirigeant prévus:
            </Typography>
            <Box>
              <Box>
                {directorSalaryFirst2yrs && (
                  <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                    situation actuelle
                  </Typography>
                )}
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}>
                  Nous avons remarqué, dans votre prévisionnel, que vous avez prévu de vous rémunérer. Vous aurez donc
                  un revenu régulier qui compensera l'absence de versement de vos allocations mensuelles (étant donné
                  que l'option pour l'ARCE entraîne l'arrêt de l'indemnisation mensuelle). Enfin, pour obtenir le
                  versement en capital, vous devez remplir un formulaire de demande d'ARCE et le transmettre à Pôle
                  emploi, et justifier la création de votre entreprise (en fournissant un extrait K-Bis par exemple).
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

function computeRecommendationSocialSecuritySystemContributions(
  runningTestSuite,
  projectLegal,
  testSuite,
  testSuiteCondition
) {
  const fiscal = projectLegal?.tax_system;
  const textA = testSuite[runningTestSuite].recommendation.response.IR;
  const textB = testSuite[runningTestSuite].recommendation.response.IS;
  if (typeof fiscal === 'undefined' || fiscal === '') {
    return (
      <>
        <Typography variant="p" component="div">
          Ces informations sont nécessaires pour avoir une recommandation précise :
        </Typography>
        {testSuiteCondition[runningTestSuite] && testSuiteCondition[runningTestSuite].conditions && (
          <List>
            {testSuiteCondition[runningTestSuite].conditions.map((e) => (
              <ListItem key={e.label}>
                <span> * </span>
                <Typography variant="p" component="div">
                  {e.label}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  }
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" m={4} p={1}>
      {fiscal === 'IR' && (
        <Box>
          <Typography variant="h3" component="h3">
            IR:
          </Typography>
          <Box display="flex" flexDirection="column" justifyContent="center" m={4} p={1}>
            <Box p={1}>
              <Typography component="div" variant="p" className="actual_state">
                situation actuelle
              </Typography>
              <Typography variant="h3" component="h3">
                {parse(textA)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {fiscal === 'IS' && (
        <Box>
          <Typography variant="h3" component="h3">
            IS:
          </Typography>
          <Box display="flex" flexDirection="column" justifyContent="center" m={4} p={1}>
            <Box p={1}>
              {fiscal === 'IS' && (
                <Typography component="div" variant="p" className="actual_state">
                  situation actuelle
                </Typography>
              )}
              <Typography variant="h3" component="h3">
                {parse(textB)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function computeRecommendationSocialSecuritySystemContributionsDirectors(
  directors,
  selectedOptions,
  runningTestSuite,
  testSuite,
  testSuiteCondition
) {
  const response =
    selectedOptions[runningTestSuite][0][
      "Allez-vous bénéficier du maintien de vos allocations d'aide au retour à l'emploi ?"
    ];
  const answer = response === 'Oui';
  const noDirectorSalary3yrs = directors.some(
    (director, _) =>
      parseInt(director.net_compensation_year_1, 10) <= 0 &&
      parseInt(director.net_compensation_year_2, 10) <= 0 &&
      parseInt(director.net_compensation_year_3, 10) <= 0
  );
  const noDirectorSalary2yrs = directors.some(
    (director, _) =>
      parseInt(director.net_compensation_year_1, 10) <= 0 &&
      parseInt(director.net_compensation_year_2, 10) <= 0 &&
      parseInt(director.net_compensation_year_3, 10) > 0
  );
  const noDirectorSalary1yrs = directors.some(
    (director, _) =>
      parseInt(director.net_compensation_year_1, 10) <= 0 &&
      parseInt(director.net_compensation_year_2, 10) > 0 &&
      parseInt(director.net_compensation_year_3, 10) > 0
  );
  const directorSalary = directors.some(
    (director, _) =>
      parseInt(director.net_compensation_year_1, 10) > 0 ||
      parseInt(director.net_compensation_year_2, 10) > 0 ||
      parseInt(director.net_compensation_year_3, 10) > 0
  );
  const currentState = {
    state_a: noDirectorSalary3yrs && !answer,
    state_b: noDirectorSalary3yrs && answer,
    state_c: noDirectorSalary2yrs && !answer,
    state_d: noDirectorSalary2yrs && answer,
    state_e: noDirectorSalary1yrs && !answer,
    state_f: noDirectorSalary1yrs && answer,
    state_g: directorSalary
  };
  let textWhenSalary;
  if (currentState.state_g) {
    const yearLabel = {
      year_1: 'année 1',
      year_2: 'année 2',
      year_3: 'année 3'
    };
    const preYears = directors
      .map((director) =>
        Object.keys(yearLabel).filter((year) => {
          const key = `net_compensation_${year}`;
          return parseInt(director[key], 10) > 0;
        })
      )
      .flat();

    const postYears = [];
    preYears.forEach((element) => {
      if (!postYears.includes(element)) {
        postYears.push(yearLabel[element]);
      }
    });
    textWhenSalary = `Nous avons remarqué que vous avez prévu de vous verser une rémunération dans le cadre de vos fonctions de dirigeant en ${postYears.join(
      ', '
    )}. Vous serez donc affilié au régime général de la sécurité sociale. Pour chaque versement de rémunération, un bulletin de paie devra être établi. Les cotisations sociales seront déclarées et de payées aux organismes sociaux, mensuellement ou trimestriellement, en effectuant déclaration sociale nominative.`;
  }
  const recommendation = testSuite[runningTestSuite].recommendation.response;
  if (
    typeof response === 'undefined' ||
    response === '' ||
    (!noDirectorSalary3yrs && !noDirectorSalary2yrs && !noDirectorSalary1yrs && !directorSalary)
  ) {
    return (
      <Box>
        <Typography variant="p" component="div">
          Ces informations sont nécessaires pour avoir une recommandation précise :
        </Typography>
        {testSuiteCondition[runningTestSuite] && testSuiteCondition[runningTestSuite].conditions && (
          <List>
            {testSuiteCondition[runningTestSuite].conditions.map((e) => (
              <ListItem>
                <span> * </span>
                <Typography variant="p" component="div">
                  {e.label}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  }
  return (
    <List>
      {Object.keys(currentState).map(
        (key) =>
          currentState[key] === true && (
            <ListItem key={key}>
              <Box display="flex" flexDirection="column" justifyContent="center" m={4} p={1}>
                <Box p={1}>
                  <Typography component="div" variant="p" className="actual_state">
                    situation actuelle
                  </Typography>
                  {key === 'state_a' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1, année 2 et année 3 :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(recommendation['Pas de salaires pour le dirigeant en année 1, année 2 et année 3 :'])}
                      </Typography>
                    </>
                  )}
                  {key === 'state_b' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1, année 2 et année 3 + Le maintien des allocations
                        d'aide au retour à l'emploi :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(
                          recommendation[
                            "Pas de salaires pour le dirigeant en année 1, année 2 et année 3 + Le maintien des allocations d'aide au retour à l'emploi : "
                          ]
                        )}
                      </Typography>
                    </>
                  )}
                  {key === 'state_c' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1 et année 2 :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(recommendation['Pas de salaires pour le dirigeant en année 1 et année 2 : '])}
                      </Typography>
                    </>
                  )}
                  {key === 'state_d' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1 et année 2 + Le maintien des allocations d'aide au
                        retour à l'emploi :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(
                          recommendation[
                            "Pas de salaires pour le dirigeant en année 1 et année 2 + Le maintien des allocations d'aide au retour à l'emploi : "
                          ]
                        )}
                      </Typography>
                    </>
                  )}
                  {key === 'state_e' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1 :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(recommendation['Pas de salaires pour le dirigeant en année 1 : '])}
                      </Typography>
                    </>
                  )}
                  {key === 'state_f' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Pas de salaires pour le dirigeant en année 1 + Le maintien des allocations d'aide au retour à
                        l'emploi :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(
                          recommendation[
                            "Pas de salaires pour le dirigeant en année 1 + Le maintien des allocations d'aide au retour à l'emploi : "
                          ]
                        )}
                      </Typography>
                    </>
                  )}
                  {key === 'state_g' && (
                    <>
                      <Typography variant="h3" component="h3">
                        Salaires pour le dirigeant :
                      </Typography>
                      <Typography variant="h3" component="h3">
                        {parse(textWhenSalary)}{' '}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </ListItem>
          )
      )}
    </List>
  );
}

export default function PlayGroundTestUi() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const theme = useTheme();
  const { isCollapse } = useCollapseDrawer();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobileSm = useMediaQuery(theme.breakpoints.down('lg'));
  const [caseValue, setCaseValue] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [displayMicroReelTaxRegime, setDisplayMicroReelTaxRegime] = useState(false);
  const [displayLegalTool, setDisplayLegalTool] = useState(false);
  const [displayFiscalTool, setDisplayFiscalTool] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { work, isLoading } = useSelector((state) => state.project);
  const [runningTestSuite, setRunningTestSuite] = useState(null);
  const [testCaseSatisfied, setTestCaseSatisfied] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [runningTest, setRunningTest] = useState(false);
  const [missingField, setMissingField] = useState(false);
  const [microReel, setMicroReel] = useState({
    revenue_year_1: '',
    revenue_year_2: '',
    revenue_year_3: '',
    cotisation_social_year_1: '',
    cotisation_social_year_2: '',
    cotisation_social_year_3: '',
    net_result_year_1: '',
    net_result_year_2: '',
    net_result_year_3: '',
    reel_revenue_year_1: '',
    reel_revenue_year_2: '',
    reel_revenue_year_3: '',
    reel_cotisation_social_year_1: '',
    reel_cotisation_social_year_2: '',
    reel_cotisation_social_year_3: '',
    reel_net_result_year_1: '',
    reel_net_result_year_2: '',
    reel_net_result_year_3: '',
    revenue_collected: {}
  });
  const [callingApi, setCallingApi] = useState(false);
  const [treasury, setTreasury] = useState({
    monthly_year_1: '',
    monthly_year_2: '',
    monthly_year_3: '',
    year_1: '',
    year_2: '',
    year_3: '',
    year_1_disbursement_average: '',
    year_2_disbursement_average: '',
    year_3_disbursement_average: ''
  });
  const [financialSituation, setFinancialSituation] = useState({
    loans_year_1: '',
    partner_contributions_year_1: '',
    capital_contributions_year_1: '',
    treasury_year_1: '',
    personal_deposits: '',
    treasury_monthly_year_1: ''
  });
  const [microLegalFormalities, setMicroLegalFormalities] = useState({});
  const [incomeSituation, setIncomeSituation] = useState({
    year_1: '',
    year_2: '',
    year_3: '',
    director_salary_year_1: '',
    director_salary_year_2: '',
    director_salary_year_3: ''
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTestCase = (e, label) => {
    selectedOptions[runningTestSuite] = selectedOptions[runningTestSuite].map((field) => {
      const fk = Object.keys(field)[0];
      if (fk === label) {
        if (runningTestSuite === 'match_profitability_financial_needs_director') {
          const v = Number.isNaN(parseInt(e.target.value.replace(/\D/, ''), 10))
            ? 0
            : parseInt(e.target.value.replace(/\D/, ''), 10);
          field[label] = v.toString();
        } else {
          field[label] = e.target.value;
        }
        setCaseValue(field[label]);
      }
      return field;
    });
    setSelectedOptions(selectedOptions);
    if (missingField) {
      setMissingField(false);
    }
    if (runningTest) {
      setRunningTest(false);
    }
  };

  const handleMicroEntreprisePayload = (payload) => {
    setMicroLegalFormalities(payload);
    setValue(3);
    runTest();
  };

  const runTest = () => {
    setRunningTest(true);
  };

  const runLegalStatus = () => {
    navigate(PATH_DASHBOARD.legal.status);
  };

  const runFiscalStatus = () => {
    navigate(PATH_DASHBOARD.legal.taxes);
  };

  const directorSalaries = (directors) =>
    directors.some(
      (director, _) =>
        parseInt(director.net_compensation_year_1, 10) <= 0 &&
        parseInt(director.net_compensation_year_2, 10) <= 0 &&
        parseInt(director.net_compensation_year_3, 10) <= 0
    );

  useEffect(() => {
    dispatch(isSelectedProjectTestSuiteLabel());
  }, []);

  useEffect(() => {
    if (work.id && work.selectedTestSuiteLabel) {
      dispatch(getProjectTestSuites(work.id, apiPrefix));
      setRunningTestSuite(work.selectedTestSuiteLabel);
    }
    if (runningTest) {
      setRunningTest(false);
    }
    setTestCaseSatisfied(false);
  }, [work.selectedTestSuiteLabel]);

  useEffect(() => {
    if (work.testSuites) {
      const opts = Object.keys(work.testSuites.test_suite.test_suite[0].tests).reduce((acc, k) => {
        const tCase = work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[k];
        if (tCase && typeof tCase !== 'undefined') {
          acc[k] = tCase.questions.map((testCase) => ({
            [testCase.label]: ''
          }));
        }
        return acc;
      }, {});

      setSelectedOptions(opts);
    }
  }, [work.testSuites]);

  useEffect(() => {
    if (runningTest) {
      const timeoutID = setTimeout(() => {
        if (
          runningTestSuite !== 'compatibility_micro_regime' &&
          runningTestSuite !== 'social_security_system_contributions'
        ) {
          const fields = selectedOptions[runningTestSuite];
          const allFieldsAnswered = fields.every((f) => Object.entries(f)[0][1] !== '');
          if (!allFieldsAnswered) {
            setMissingField(true);
            setTestCaseSatisfied(false);
            setRunningTest(false);
            return;
          }
        }
        if (runningTestSuite === 'compatibility_micro_regime') {
          setMissingField(false);
          setTestCaseSatisfied(true);
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            ...work.aggregateFinancialProvisions,
            project_details: { ...JSON.parse(storedSelectedProject) },
            project_legal_status: { ...work.project_legal_status, ...microLegalFormalities }
          };

          COTISATION_API.post('cotisations/micro-reel-tax-regime', payload)
            .then((response) => {
              /* eslint-disable camelcase */
              const { micro, reel, revenue_collected } = response.data;
              const revenue = micro.rows.find((row) => row.field === "Chiffre d'affaires");
              const cotisations = micro.rows.find((row) => row.field === 'Cotisations sociales des dirigeants');
              const netResult = micro.rows.find((row) => row.field === "Résultat de l'exercice");
              const revenueReel = reel.rows.find((row) => row.field === "Chiffre d'affaires");
              const cotisationsReel = reel.rows.find((row) => row.field === 'Cotisations sociales des dirigeants');
              const netResultReel = reel.rows.find((row) => row.field === "Résultat de l'exercice");
              setMicroReel({
                revenue_year_1: revenue.year_1,
                revenue_year_2: revenue.year_2,
                revenue_year_3: revenue.year_3,
                cotisation_social_year_1: cotisations.year_1,
                cotisation_social_year_2: cotisations.year_2,
                cotisation_social_year_3: cotisations.year_3,
                net_result_year_1: netResult.year_1,
                net_result_year_2: netResult.year_2,
                net_result_year_3: netResult.year_3,
                reel_revenue_year_1: revenueReel.year_1,
                reel_revenue_year_2: revenueReel.year_2,
                reel_revenue_year_3: revenueReel.year_3,
                reel_cotisation_social_year_1: cotisationsReel.year_1,
                reel_cotisation_social_year_2: cotisationsReel.year_2,
                reel_cotisation_social_year_3: cotisationsReel.year_3,
                reel_net_result_year_1: netResultReel.year_1,
                reel_net_result_year_2: netResultReel.year_2,
                reel_net_result_year_3: netResultReel.year_3,
                revenue_collected
              });
              setCallingApi(false);
              setRunningTest(false);
            })
            .catch((error) => {
              enqueueSnackbar('error running this test', { variant: 'error' });
              setCallingApi(false);
              setRunningTest(false);
            });
        } else if (runningTestSuite === 'financial_security_margin') {
          setMissingField(false);
          setTestCaseSatisfied(true);
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            ...work.aggregateFinancialProvisions,
            project_details: { ...JSON.parse(storedSelectedProject) },
            project_legal_status: { ...work.project_legal_status }
          };
          COTISATION_API.post('cotisations/disbursements', payload)
            .then((response) => {
              const { tables } = response.data;
              const { treasury } = tables;
              const disbursements = {
                year_1: treasury.rows[0].find((row) => row.field === 'DÉCAISSEMENTS'),
                year_2: treasury.rows[1].find((row) => row.field === 'DÉCAISSEMENTS'),
                year_3: treasury.rows[2].find((row) => row.field === 'DÉCAISSEMENTS')
              };
              const total = {
                year_1: treasury.rows[0].find((row) => row.field === 'SOLDE'),
                year_2: treasury.rows[1].find((row) => row.field === 'SOLDE'),
                year_3: treasury.rows[2].find((row) => row.field === 'SOLDE')
              };
              const disbursementsAverages = {
                year_1:
                  Object.keys(disbursements.year_1)
                    .filter((f) => f.startsWith('month_'))
                    .reduce((acc, k) => {
                      acc += disbursements.year_1[k];
                      return acc;
                    }, 0) / 12,
                year_2:
                  Object.keys(disbursements.year_2)
                    .filter((f) => f.startsWith('month_'))
                    .reduce((acc, k) => {
                      acc += disbursements.year_2[k];
                      return acc;
                    }, 0) / 12,
                year_3:
                  Object.keys(disbursements.year_3)
                    .filter((f) => f.startsWith('month_'))
                    .reduce((acc, k) => {
                      acc += disbursements.year_3[k];
                      return acc;
                    }, 0) / 12
              };
              setTreasury({
                monthly_year_1: Object.keys(total.year_1)
                  .filter((f) => f.startsWith('month_'))
                  .reduce((acc, k) => {
                    acc[k] = total.year_1[k];
                    return acc;
                  }, {}),
                monthly_year_2: Object.keys(total.year_2)
                  .filter((f) => f.startsWith('month_'))
                  .reduce((acc, k) => {
                    acc[k] = total.year_2[k];
                    return acc;
                  }, {}),
                monthly_year_3: Object.keys(total.year_3)
                  .filter((f) => f.startsWith('month_'))
                  .reduce((acc, k) => {
                    acc[k] = total.year_3[k];
                    return acc;
                  }, {}),
                year_1: total.year_1.month_12,
                year_2: total.year_2.month_12,
                year_3: total.year_3.month_12,
                year_1_disbursement_average: disbursementsAverages.year_1,
                year_2_disbursement_average: disbursementsAverages.year_2,
                year_3_disbursement_average: disbursementsAverages.year_3
              });
              setCallingApi(false);
              setRunningTest(false);
            })
            .catch((error) => {
              enqueueSnackbar('error running this test', { variant: 'error' });
              setCallingApi(false);
              setRunningTest(false);
            });
        } else if (runningTestSuite === 'initial_financing_plan') {
          setMissingField(false);
          setTestCaseSatisfied(true);
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            ...work.aggregateFinancialProvisions,
            project_details: {
              project: { ...JSON.parse(storedSelectedProject) },
              project_legal_status: { ...work.project_legal_status }
            }
          };

          COTISATION_API.post('cotisations/financial-situation', payload)
            .then((response) => {
              const { tables } = response.data;
              const treasuryYear1Acc = tables.treasury[0].find((row) => row.field === 'SOLDE');
              setFinancialSituation({
                loans_year_1: tables.loans.year_1,
                partner_contributions_year_1: tables.partner_contributions[0].liability_net,
                capital_contributions_year_1: tables.capital_contributions[0].liability_net,
                treasury_year_1: tables.financial_review.treasury_year_1,
                personal_deposits: tables.financial_review.personal_deposits,
                treasury_monthly_year_1: Object.keys(treasuryYear1Acc)
                  .filter((f) => f.startsWith('month_'))
                  .reduce((acc, k) => {
                    acc[k] = treasuryYear1Acc[k];
                    return acc;
                  }, {})
              });
              setCallingApi(false);
              setRunningTest(false);
            })
            .catch((error) => {
              setCallingApi(false);
              setRunningTest(false);
            });
        } else if (runningTestSuite === 'match_profitability_financial_needs_director') {
          setMissingField(false);
          setTestCaseSatisfied(true);
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            ...work.aggregateFinancialProvisions,
            project_details: {
              project: { ...JSON.parse(storedSelectedProject) },
              project_legal_status: { ...work.project_legal_status }
            }
          };

          COTISATION_API.post(`cotisations/income-situation`, payload)
            .then((response) => {
              const { tables } = response.data;
              const income = tables.income_statement;
              const salaries = income.rows.find((row) => row.field === 'Salaires nets des dirigeants');
              const netResult = income.rows.find((row) => row.field === "Résultat de l'exercice");
              setIncomeSituation({
                year_1: netResult.year_1,
                year_2: netResult.year_2,
                year_3: netResult.year_3,
                director_salary_year_1: salaries.year_1,
                director_salary_year_2: salaries.year_2,
                director_salary_year_3: salaries.year_3
              });
              setCallingApi(false);
              setRunningTest(false);
            })
            .catch((error) => {});
        } else if (runningTestSuite === 'micro_reel_tax_regime') {
          setMissingField(false);
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            ...work.aggregateFinancialProvisions,
            project_details: { ...JSON.parse(storedSelectedProject) },
            project_legal_status: { ...work.project_legal_status, ...microLegalFormalities }
          };
          COTISATION_API.post(`cotisations/micro-reel-tax-regime`, payload)
            .then((response) => {
              const { micro, reel, revenue_collected } = response.data;
              const revenue = micro.rows.find((row) => row.field === "Chiffre d'affaires");
              const cotisations = micro.rows.find((row) => row.field === 'Cotisations sociales des dirigeants');
              const netResult = micro.rows.find((row) => row.field === "Résultat de l'exercice");
              const revenueReel = reel.rows.find((row) => row.field === "Chiffre d'affaires");
              const cotisationsReel = reel.rows.find((row) => row.field === 'Cotisations sociales des dirigeants');
              const netResultReel = reel.rows.find((row) => row.field === "Résultat de l'exercice");
              setMicroReel({
                revenue_year_1: revenue.year_1,
                revenue_year_2: revenue.year_2,
                revenue_year_3: revenue.year_3,
                cotisation_social_year_1: cotisations.year_1,
                cotisation_social_year_2: cotisations.year_2,
                cotisation_social_year_3: cotisations.year_3,
                net_result_year_1: netResult.year_1,
                net_result_year_2: netResult.year_2,
                net_result_year_3: netResult.year_3,
                reel_revenue_year_1: revenueReel.year_1,
                reel_revenue_year_2: revenueReel.year_2,
                reel_revenue_year_3: revenueReel.year_3,
                reel_cotisation_social_year_1: cotisationsReel.year_1,
                reel_cotisation_social_year_2: cotisationsReel.year_2,
                reel_cotisation_social_year_3: cotisationsReel.year_3,
                reel_net_result_year_1: netResultReel.year_1,
                reel_net_result_year_2: netResultReel.year_2,
                reel_net_result_year_3: netResultReel.year_3,
                revenue_collected
              });
              setCallingApi(false);
              setRunningTest(false);
              setTestCaseSatisfied(true);
            })
            .catch((error) => {
              setCallingApi(false);
              setRunningTest(false);
            });
        } else {
          setMissingField(false);
          setTestCaseSatisfied(true);
          setRunningTest(false);
        }
      }, 1000);

      return () => clearTimeout(timeoutID);
    }
  }, [runningTest]);

  useEffect(() => {
    if (runningTestSuite === 'choice_legal_status' || runningTestSuite === 'social_security_system_contributions') {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
    }
    if (runningTestSuite === 'pole_emploi_aid_scheme_for_business_creation') {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
      dispatch(fetchEmployees(work.id, apiPrefix));
    }
    if (runningTestSuite === 'social_security_system_contributions_directors') {
      dispatch(fetchEmployees(work.id, apiPrefix));
    }

    if (
      runningTestSuite === 'compatibility_micro_regime' ||
      runningTestSuite === 'financial_security_margin' ||
      runningTestSuite === 'initial_financing_plan' ||
      runningTestSuite === 'match_profitability_financial_needs_director' ||
      runningTestSuite === 'micro_reel_tax_regime'
    ) {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
      dispatch(getProjectFinancialForecast(work.id, apiPrefix));
    }
    if (runningTest) {
      setRunningTest(false);
    }
    setTestCaseSatisfied(false);
  }, [runningTestSuite]);

  useEffect(() => {
    if (runningTestSuite === 'compatibility_micro_regime') {
      if (work.project_legal_status) {
        const data = {
          legal_status_idea:
            work.project_legal_status.legal_status_idea !== 'Entreprise individuelle' &&
            work.project_legal_status.legal_status_idea !== 'EIRL'
              ? ''
              : work.project_legal_status.legal_status_idea,
          company_vat_regime: work.project_legal_status.company_vat_regime,
          micro_entreprise_declare_pay_cotisations: work.project_legal_status.micro_entreprise_declare_pay_cotisations,
          micro_entreprise_accre_exemption: work.project_legal_status.micro_entreprise_accre_exemption,
          micro_entreprise_activity_category: work.project_legal_status.micro_entreprise_activity_category,
          sector: work.activity_sector
        };
        setMicroLegalFormalities(data);
        if (
          typeof work.project_legal_status.legal_status_idea !== 'undefined' &&
          work.project_legal_status.legal_status_idea !== ''
        ) {
          setDisplayLegalTool(false);
        } else if (
          typeof work.project_legal_status.legal_status_idea === 'undefined' ||
          work.project_legal_status.legal_status_idea === ''
        ) {
          setDisplayLegalTool(true);
        }
      }
    }
  }, [work.project_legal_status]);

  const renderTestSuiteCondition = () => (
    <>
      {runningTestSuite &&
        work.testSuites &&
        typeof work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite] !==
          'undefined' && (
          <Box
            sx={{
              flexGrow: 1
              // margin: 'auto',
              // display: 'flex'
              // alignItems: 'center'
            }}
          >
            {!isMobile && (
              <Typography sx={{ typography: 'h5', color: 'common.white', mb: 1 }}>Conditions préalables: </Typography>
            )}
            <Sheet
              sx={{
                height: '100%',
                // borderRadius: '12px',
                backgroundColor: '#001E3C',
                // padding: '20px 20px',
                borderColor: '#132F4C',
                color: 'rgb(248, 248, 242)'
              }}
            >
              {!displayLegalTool &&
                !displayFiscalTool &&
                !(runningTestSuite === 'compatibility_micro_regime' && microLegalFormalities.legal_status_idea) && (
                  <Box sx={{ mb: 1 }}>
                    {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[
                      runningTestSuite
                    ].conditions.map((condition) => (
                      <Box key={condition.label}>
                        <Typography
                          // sx={{ [theme.breakpoints.down('lg')]: { fontSize: '3.5vw' } }}
                          key={condition.label}
                        >
                          {condition.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              {runningTestSuite === 'compatibility_micro_regime' &&
                microLegalFormalities.legal_status_idea &&
                !displayLegalTool && (
                  <MicroEntrepriseTest
                    legalFormalities={{
                      runTestPayload: handleMicroEntreprisePayload,
                      ...microLegalFormalities
                    }}
                  />
                )}
              {runningTestSuite === 'choice_legal_status' && work.project_legal_status && (
                <Box>
                  <Label
                    variant="filled"
                    color="info"
                    sx={{
                      textTransform: 'uppercase'
                    }}
                  >
                    {work.project_legal_status?.legal_status_idea}
                  </Label>
                </Box>
              )}
              {(runningTestSuite === 'choice_legal_status' ||
                runningTestSuite === 'compatibility_micro_regime' ||
                runningTestSuite === 'match_profitability_financial_needs_director' ||
                runningTestSuite === 'pole_emploi_aid_scheme_for_business_creation') && (
                <Box
                  sx={{
                    display: 'flex',
                    p: 1,
                    flexWrap: 'wrap',
                    [theme.breakpoints.down('md')]: { mt: 0 },
                    flexDirection: 'column'
                  }}
                >
                  <>
                    {!work.project_legal_status && (
                      <Label
                        variant="filled"
                        color="error"
                        sx={{
                          textTransform: 'uppercase'
                        }}
                      >
                        Failed to run Test - Missing Legal status
                      </Label>
                    )}
                    {(!isMobileSm || (displayLegalTool && isMobileSm)) && (
                      <Box>
                        <EmbeddedLegalStatusDecisionTool
                          legalFormalities={{
                            ...(work.project_legal_status ? work.project_legal_status : {})
                          }}
                        />
                        <Button
                          variant="soft"
                          endDecorator={<KeyboardArrowRight />}
                          onClick={runLegalStatus}
                          sx={{
                            mt: 1,
                            [theme.breakpoints.down('md')]: { mt: 1 },
                            color:
                              !runningTest && missingField ? theme.palette.error.main : theme.palette.success.darker
                          }}
                        >
                          Tester notre outil de recommandation juridique
                        </Button>
                      </Box>
                    )}
                    {isMobileSm &&
                      !displayLegalTool &&
                      work.project_legal_status &&
                      typeof work.project_legal_status.legal_status_idea !== 'undefined' &&
                      work.project_legal_status.legal_status_idea !== '' && (
                        <Box
                          sx={{
                            position: 'fixed',
                            bottom: '56px',
                            left: 0
                          }}
                        >
                          <Button
                            variant="soft"
                            startDecorator={<KeyboardArrowLeft />}
                            onClick={() => {
                              setDisplayFiscalTool(false);
                              setDisplayLegalTool(true);
                            }}
                            sx={{
                              mt: 8,
                              [theme.breakpoints.down('md')]: { mt: 1 },
                              borderRadius: 0
                            }}
                          >
                            Modify legal status
                          </Button>
                        </Box>
                      )}
                  </>
                </Box>
              )}
              {(runningTestSuite === 'match_profitability_financial_needs_director' ||
                runningTestSuite === 'social_security_system_contributions' ||
                runningTestSuite === 'pole_emploi_aid_scheme_for_business_creation') && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    mt: 4,
                    [theme.breakpoints.down('lg')]: { mt: 1 },
                    flexDirection: 'column'
                  }}
                >
                  <>
                    {!work.project_legal_status && (
                      <Label
                        variant="filled"
                        color="error"
                        sx={{
                          textTransform: 'uppercase'
                        }}
                      >
                        Impossible de tester – Statut fiscal manquant
                      </Label>
                    )}
                    {displayFiscalTool && (
                      <Box>
                        <EmbeddedFiscalStatusDecisionTool
                          legalFormalities={{
                            ...(work.project_legal_status ? work.project_legal_status : {})
                          }}
                          activitySector={work.activity_sector}
                        />
                        <Button
                          variant="soft"
                          endDecorator={<KeyboardArrowRight />}
                          onClick={runFiscalStatus}
                          sx={{
                            mt: 8,
                            [theme.breakpoints.down('lg')]: { mt: 1 },
                            color:
                              !runningTest && missingField ? theme.palette.error.main : theme.palette.success.darker
                          }}
                        >
                          Tester notre outil de recommandation fiscal
                        </Button>
                      </Box>
                    )}
                    {!displayFiscalTool && (
                      <Box
                        sx={{
                          ...(isMobile && { position: 'fixed', bottom: '56px', right: 0 })
                        }}
                      >
                        <Button
                          variant="soft"
                          endDecorator={<KeyboardArrowRight />}
                          onClick={() => {
                            setDisplayLegalTool(false);
                            setDisplayFiscalTool(true);
                          }}
                          sx={{
                            mt: 8,
                            [theme.breakpoints.down('md')]: { mt: 1 },
                            borderRadius: 0
                          }}
                        >
                          Modify Fiscal status
                        </Button>
                      </Box>
                    )}
                    {displayFiscalTool && (
                      <Box
                        sx={{
                          ...(isMobile && { position: 'fixed', bottom: '56px', right: 0 })
                        }}
                      >
                        <Button
                          variant="soft"
                          endDecorator={<KeyboardArrowRight />}
                          onClick={() => {
                            setDisplayFiscalTool(false);
                          }}
                          sx={{
                            mt: 8,
                            [theme.breakpoints.down('md')]: { mt: 1 },
                            borderRadius: 0
                          }}
                        >
                          Echec du choix fiscal
                        </Button>
                      </Box>
                    )}
                  </>
                </Box>
              )}
              {typeof work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].dependency !== 'undefined' &&
                work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].dependency &&
                Object.keys(work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].dependency).length > 0 &&
                !displayLegalTool &&
                !displayFiscalTool && (
                  <Box
                    sx={{
                      p: 4,
                      [theme.breakpoints.down('lg')]: {
                        p: 0
                      }
                    }}
                  >
                    {Object.entries(work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].dependency).map(
                      ([k, v]) =>
                        v.map((d) => (
                          <Checkbox
                            sx={{
                              color: 'common.white'
                            }}
                            key={d.field}
                            label={d.field}
                            defaultChecked
                            variant="solid"
                            size="lg"
                          />
                        ))
                    )}
                  </Box>
                )}
            </Sheet>
          </Box>
        )}
    </>
  );

  const renderSupportText = () => {
    if (
      runningTestSuite === 'choice_legal_status' &&
      (!work.project_legal_status ||
        typeof work.project_legal_status === 'undefined' ||
        work.project_legal_status.legal_status_idea === '')
    ) {
      return null;
    }
    if (
      work.testSuites &&
      work.testSuites.test_suite_support.test_suite_follow_up[0].tests[runningTestSuite] &&
      work.testSuites.test_suite_support.test_suite_follow_up[0].tests[runningTestSuite].text
    ) {
      return (
        <Box
          sx={{
            flexGrow: 1
          }}
        >
          <Sheet
            sx={{
              mt: 1,
              borderRadius: '12px',
              backgroundColor: '#001E3C',
              padding: '10px 10px',
              borderColor: '#132F4C',
              color: 'rgb(248, 248, 242)'
            }}
          >
            {runningTestSuite !== 'choice_legal_status' &&
              Object.entries(
                work.testSuites.test_suite_support.test_suite_follow_up[0].tests[runningTestSuite].text
              ).map(([k, v]) => (
                <Box
                  sx={{
                    [theme.breakpoints.down('md')]: {
                      fontSize: '2.8vw'
                    }
                  }}
                  key={k}
                  dangerouslySetInnerHTML={{
                    __html: v
                  }}
                />
              ))}

            {runningTestSuite === 'choice_legal_status' && work.project_legal_status && (
              <Box
                sx={{
                  [theme.breakpoints.down('md')]: {
                    fontSize: '2.8vw'
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    work.testSuites.test_suite_support.test_suite_follow_up[0].tests[runningTestSuite].text[
                      work.project_legal_status.legal_status_idea
                    ]
                }}
              />
            )}
          </Sheet>
        </Box>
      );
    }
    return null;
  };

  const renderTestResult = () => (
    <Box sx={{ height: '100%' }}>
      {runningTestSuite === 'accumulation_professional_income_retirement_pension' &&
        Object.entries(selectedOptions[runningTestSuite][0])[0][1] !== '' &&
        Object.entries(selectedOptions[runningTestSuite][1])[0][1] !== '' && (
          <div
            dangerouslySetInnerHTML={{
              __html:
                work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].recommendation.response[
                  Object.entries(selectedOptions[runningTestSuite][0])[0][1]
                ][Object.entries(selectedOptions[runningTestSuite][1])[0][1]]
            }}
          />
        )}
      {runningTestSuite === 'authorizations_installation_conditions_exercise_professional_activity' &&
        Object.entries(selectedOptions[runningTestSuite][0])[0][1] !== '' && (
          <div
            dangerouslySetInnerHTML={{
              __html:
                work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].recommendation.response[
                  Object.entries(selectedOptions[runningTestSuite][0])[0][1]
                ]
            }}
          />
        )}
      {runningTestSuite === 'choice_legal_status' && (
        <>
          {Object.entries(selectedOptions[runningTestSuite][0])[0][1] === "Vous n'arrivez pas à faire votre choix" && (
            <Button
              variant="soft"
              endDecorator={<KeyboardArrowRight />}
              onClick={runLegalStatus}
              sx={{
                mt: 8,
                color: !runningTest && missingField ? theme.palette.error.main : theme.palette.success.darker
              }}
            >
              Continuer avec notre outil de recommandation juridique
            </Button>
          )}
          <div
            dangerouslySetInnerHTML={{
              __html:
                work.testSuites.test_suite.test_suite[0].tests[runningTestSuite].recommendation.response[
                  Object.entries(selectedOptions[runningTestSuite][0])[0][1]
                ]
            }}
          />
        </>
      )}
      {runningTestSuite === 'compatibility_micro_regime' && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label}>
                {condition.label === "Chiffre d'affaires en année 1, année 2 et année 3: " && (
                  <>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 1 : {euro(microReel.revenue_year_1).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 2 : {euro(microReel.revenue_year_2).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 3 : {euro(microReel.revenue_year_3).format()}
                    </Typography>
                  </>
                )}
              </Box>
            )
          )}
        </>
      )}
      {runningTestSuite === 'compatibility_micro_regime' && computeCompatibilityMicroRegime(microReel, work)}
      {runningTestSuite === 'financial_security_margin' && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label}>
                {condition.label === 'Montant total de vos décaissements mensuel moyen :' && (
                  <>
                    <Typography key={condition.label}>{condition.label}</Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116',
                        padding: 0,
                        margin: 0
                      }}
                    >
                      Année 1 : {euro(treasury.year_1_disbursement_average).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        padding: 0,
                        margin: 0,
                        color: '#fe6116'
                      }}
                    >
                      Année 2 : {euro(treasury.year_2_disbursement_average).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        padding: 0,
                        margin: 0,
                        color: '#fe6116'
                      }}
                    >
                      Année 3 : {euro(treasury.year_3_disbursement_average).format()}
                    </Typography>
                  </>
                )}
              </Box>
            )
          )}
        </>
      )}
      {runningTestSuite === 'financial_security_margin' && selectedOptions[runningTestSuite] && (
        <Stack>
          <Typography variant="p" component="div">
            Montant de votre marge de sécurité financière :
          </Typography>
          <Typography
            variant="p"
            component="div"
            style={{
              color: '#fe6116',
              padding: 0,
              margin: 0
            }}
          >
            Année 1 :{' '}
            {euro(
              treasury.year_1_disbursement_average *
                (parseInt(
                  selectedOptions[runningTestSuite][0][
                    'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
                  ],
                  10
                ) || 0)
            ).format()}
          </Typography>
          <Typography
            variant="p"
            component="div"
            style={{
              color: '#fe6116',
              padding: 0,
              margin: 0
            }}
          >
            Année 2 :{' '}
            {euro(
              treasury.year_2_disbursement_average *
                (parseInt(
                  selectedOptions[runningTestSuite][0][
                    'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
                  ],
                  10
                ) || 0)
            ).format()}
          </Typography>
          <Typography
            variant="p"
            component="div"
            style={{
              color: '#fe6116',
              padding: 0,
              margin: 0
            }}
          >
            Année 3 :{' '}
            {euro(
              treasury.year_3_disbursement_average *
                (parseInt(
                  selectedOptions[runningTestSuite][0][
                    'De quelle marge de sécurité financière avez-vous besoin pour votre projet ? '
                  ],
                  10
                ) || 0)
            ).format()}
          </Typography>
        </Stack>
      )}
      {runningTestSuite === 'financial_security_margin' &&
        ComputeRecommendationFinancialSecurityMargin(runningTestSuite, selectedOptions, treasury)}
      {runningTestSuite === 'initial_financing_plan' && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label}>
                <>
                  <Typography key={condition.label} sx={{ [theme.breakpoints.down('md')]: { fontSize: '3vw' } }}>
                    {condition.label}
                  </Typography>
                  {condition.label ===
                    "Montant des prêts en année 1 (prêts bancaires, autres prêts, prêts d'honneur): " && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        Année 1 : {euro(financialSituation.loans_year_1).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Montant des apports en capital en année 1: ' && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        Année 1 : {euro(financialSituation.capital_contributions_year_1).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === "Montant des apports en compte courant d'associé en année 1: " && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        Année 1 : {euro(financialSituation.partner_contributions_year_1).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === "Type de projet (création ou reprise d'entreprise): " && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        {work.type_project}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Trésorerie année 1: ' && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        {euro(financialSituation.treasury_year_1).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === "Le pourcentage d'apports personnels: " && (
                    <>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '3vw' }
                        }}
                      >
                        {Math.floor(financialSituation.personal_deposits * 100)} '%'
                      </Typography>
                    </>
                  )}
                </>
              </Box>
            )
          )}
        </>
      )}
      {runningTestSuite === 'initial_financing_plan' && computeProjectFunding()}
      {runningTestSuite === 'initial_financing_plan' &&
        computeRecommendationInitialFinancingPlan(
          theme,
          runningTestSuite,
          selectedOptions,
          work,
          financialSituation.treasury_monthly_year_1,
          financialSituation.personal_deposits
        )}
      {runningTestSuite === 'match_profitability_financial_needs_director' && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label} sx={{ m: 4 }}>
                <>
                  {condition.label === 'Le statut juridique choisi pour votre entreprise ' && (
                    <>
                      <Typography key={condition.label}>{condition.label}</Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        {work.project_legal_status?.legal_status_idea}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Résultat net' && (
                    <>
                      <Typography key={condition.label}>{condition.label}</Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 1 : {euro(incomeSituation.year_1).format()}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 2 : {euro(incomeSituation.year_2).format()}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 3 : {euro(incomeSituation.year_3).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Salaires du dirigeant' && (
                    <>
                      <Typography key={condition.label}>{condition.label}</Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 1 : {euro(incomeSituation.director_salary_year_1).format()}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 2 : {euro(incomeSituation.director_salary_year_2).format()}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        Année 3 : {euro(incomeSituation.director_salary_year_3).format()}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Régime fiscal' && (
                    <>
                      <Typography key={condition.label}>{condition.label}</Typography>
                      <Typography
                        variant="p"
                        component="div"
                        style={{
                          color: '#fe6116'
                        }}
                      >
                        {work.project_legal_status?.tax_system}
                      </Typography>
                    </>
                  )}
                </>
              </Box>
            )
          )}
        </>
      )}
      {runningTestSuite === 'match_profitability_financial_needs_director' &&
        computeRecommendationMatchFinancialNeedsDirector(
          runningTestSuite,
          selectedOptions,
          work.project_legal_status,
          incomeSituation
        )}
      {runningTestSuite === 'micro_reel_tax_regime' && isMobile && !displayMicroReelTaxRegime && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label} sx={{ m: 4 }}>
                <Typography key={condition.label}>{condition.label}</Typography>
                {condition.label === 'Cotisations sociales en année 1, année 2 et année 3' && (
                  <Box>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 1 : {euro(microReel.cotisation_social_year_1).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 2 : {euro(microReel.cotisation_social_year_2).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 3 : {euro(microReel.cotisation_social_year_3).format()}
                    </Typography>
                  </Box>
                )}
                {condition.label === 'Résultat net en année 1, année 2 et année 3' && (
                  <Box>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 1 : {euro(microReel.net_result_year_1).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 2 : {euro(microReel.net_result_year_2).format()}
                    </Typography>
                    <Typography
                      variant="p"
                      component="div"
                      style={{
                        color: '#fe6116'
                      }}
                    >
                      Année 3 : {euro(microReel.net_result_year_3).format()}
                    </Typography>
                  </Box>
                )}
              </Box>
            )
          )}
        </>
      )}
      {isMobile && runningTestSuite === 'micro_reel_tax_regime' && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '56px',
            left: 0
          }}
        >
          <Button
            variant="soft"
            startDecorator={<KeyboardArrowLeft />}
            onClick={() => {
              setDisplayMicroReelTaxRegime(!displayMicroReelTaxRegime);
            }}
            sx={{
              mt: 8,
              [theme.breakpoints.down('md')]: { mt: 1 },
              borderRadius: 0
            }}
          >
            {!displayMicroReelTaxRegime && 'Comparer'}
            {displayMicroReelTaxRegime && 'Echec'}
          </Button>
        </Box>
      )}
      {isMobile &&
        runningTestSuite === 'micro_reel_tax_regime' &&
        displayMicroReelTaxRegime &&
        computeMicroReelTaxRegime(runningTestSuite, selectedOptions, microReel, work.project_legal_status, work)}
      {!isMobile &&
        runningTestSuite === 'micro_reel_tax_regime' &&
        computeMicroReelTaxRegime(runningTestSuite, selectedOptions, microReel, work.project_legal_status, work)}
      {runningTestSuite === 'pole_emploi_aid_scheme_for_business_creation' && (
        <>
          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[runningTestSuite].conditions.map(
            (condition) => (
              <Box key={condition.label} sx={{ m: 4, [theme.breakpoints.down('md')]: { m: 0 } }}>
                <>
                  {condition.label === 'Régime fiscal' && (
                    <>
                      <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }} key={condition.label}>
                        {condition.label}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '2.5vw' }
                        }}
                      >
                        {work.project_legal_status?.tax_system}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Sécurité sociale du dirigeant' && (
                    <>
                      <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }} key={condition.label}>
                        {condition.label}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '2.5vw' }
                        }}
                      >
                        {work.project_legal_status?.social_security_scheme}
                      </Typography>
                    </>
                  )}
                  {condition.label === 'Salaires du dirigeant' && (
                    <>
                      <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }} key={condition.label}>
                        {condition.label}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        sx={{
                          color: '#fe6116',
                          [theme.breakpoints.down('md')]: { fontSize: '2.5vw' }
                        }}
                      >
                        {directorSalaries(work.directors) ? 'oui' : 'non'}
                      </Typography>
                    </>
                  )}
                </>
              </Box>
            )
          )}
        </>
      )}
      {runningTestSuite === 'pole_emploi_aid_scheme_for_business_creation' &&
        computeRecommendation(
          theme,
          work.project_legal_status,
          work.employees,
          work.directors,
          selectedOptions,
          runningTestSuite
        )}
      {runningTestSuite === 'social_security_system_contributions_directors' &&
        computeRecommendationSocialSecuritySystemContributionsDirectors(
          work.directors,
          selectedOptions,
          runningTestSuite,
          work.testSuites.test_suite.test_suite[0].tests,
          work.testSuites.test_suite_conditions.test_suite_conditions[0].tests
        )}
      {runningTestSuite === 'social_security_system_contributions' &&
        computeRecommendationSocialSecuritySystemContributions(
          runningTestSuite,
          work.project_legal_status,
          work.testSuites.test_suite.test_suite[0].tests,
          work.testSuites.test_suite_conditions.test_suite_conditions[0].tests
        )}
    </Box>
  );

  const computeProjectFunding = () => {
    let nodeText = null;
    if (
      selectedOptions[runningTestSuite][0]['Avez-vous déjà avancé au niveau de votre financement ?'] ===
        "Je n'ai pas encore commencé mes démarches" ||
      selectedOptions[runningTestSuite][0]['Avez-vous déjà avancé au niveau de votre financement ?'] ===
        "Mon dossier est en cours d'étude auprès d'une ou de plusieurs banques"
    ) {
      if (work.type_project === "Un projet de création d'entreprise") {
        if (financialSituation.personal_deposits > 0.25) {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est satisfaisante</strong> par rapport aux exigences des banques.</p>`;
        } else if (financialSituation.personal_deposits <= 0.25 && financialSituation.personal_deposits >= 0.15) {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est un peu juste</strong> par rapport aux exigences des banques.</p>`;
        } else {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est insuffisante</strong> par rapport aux exigences des banques.</p>`;
        }
      }
      if (work.type_project === "Un projet de reprise d'entreprise") {
        if (financialSituation.personal_deposits > 0.2) {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est satisfaisante</strong> par rapport aux exigences des banques.</p>`;
        } else if (financialSituation.personal_deposits <= 0.2 && financialSituation.personal_deposits >= 0.1) {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est un peu juste</strong> par rapport aux exigences des banques.</p>`;
        } else {
          nodeText = `<p>Votre quotité d'apports personnels <strong style="color:#fe6116">est insuffisante</strong> par rapport aux exigences des banques.</p>`;
        }
      }

      if (nodeText) {
        return (
          <Box>
            <Box>
              <Typography component="div" variant="p" sx={{ [theme.breakpoints.down('md')]: { fontSize: '3.5vw' } }}>
                situation actuelle
              </Typography>
              <Typography variant="p" component="div" sx={{ [theme.breakpoints.down('md')]: { fontSize: '3.5vw' } }}>
                {parse(nodeText)}
              </Typography>
            </Box>
          </Box>
        );
      }
    }

    return null;
  };

  const renderTestSuite = () => (
    <>
      {runningTestSuite &&
        work.testSuites &&
        work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite] && (
          <Box
            sx={{
              flexGrow: 1
            }}
          >
            <Typography sx={{ typography: 'h5', color: 'common.white', [theme.breakpoints.up('lg')]: { mt: 4.5 } }}>
              Tests:{' '}
            </Typography>
            <Sheet
              sx={{
                borderRadius: '12px',
                backgroundColor: '#001E3C',
                padding: '5px 5px',
                borderColor: '#132F4C',
                color: 'rgb(248, 248, 242)'
              }}
            >
              {runningTestSuite !== 'match_profitability_financial_needs_director' &&
                work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite].questions.map(
                  (testCase, i) => (
                    <FormControl key={testCase.label} sx={{ m: 4 }}>
                      <FormLabel sx={{ color: 'common.white' }}>{testCase.label}</FormLabel>
                      <RadioGroup defaultValue="outlined" name="radio-buttons-group">
                        {testCase.responses.map((c) => (
                          <Radio
                            sx={{ color: 'common.white' }}
                            key={c}
                            value={c}
                            label={c}
                            variant="outlined"
                            onChange={(e) => handleTestCase(e, testCase.label)}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )
                )}
              {runningTestSuite === 'match_profitability_financial_needs_director' &&
                work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite].questions.map(
                  (testCase, i) => (
                    <FormControl key={testCase.label} sx={{ m: 4 }}>
                      <FormLabel sx={{ color: 'common.white' }}>{testCase.label}</FormLabel>
                      <Input
                        placeholder="Montant"
                        startDecorator="€"
                        sx={{ width: 300 }}
                        onChange={(e) => handleTestCase(e, testCase.label)}
                      />
                    </FormControl>
                  )
                )}
            </Sheet>
          </Box>
        )}
      {renderSupportText()}

      <Box
        sx={{
          flexGrow: 1,
          mt: 4
        }}
      >
        {/* <Typography sx={{ typography: 'h5', color: 'common.white' }}>Test Results: </Typography> */}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', m: 2 }}>
          <Button
            variant="soft"
            endDecorator={<KeyboardArrowRight />}
            onClick={runTest}
            sx={{
              color: !runningTest && missingField ? theme.palette.error.main : theme.palette.success.darker
            }}
          >
            Tester
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: '100%' }}>
        <Sheet
          sx={{
            borderRadius: '12px',
            backgroundColor: '#001E3C',
            // padding: '20px 20px',
            borderColor: '#132F4C',
            color: 'rgb(248, 248, 242)',
            height: '100%'
          }}
        >
          {runningTest && <LinearProgress />}
          {!runningTest && missingField && (
            <Typography sx={{ color: theme.palette.error.main }}>Missing required fields </Typography>
          )}
          {testCaseSatisfied && renderTestResult()}
        </Sheet>
      </Box>
    </>
  );

  const renderCaseMobile = () => (
    <>
      {runningTestSuite &&
        work.testSuites &&
        work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite] && (
          <Box
            sx={{
              flexGrow: 1
            }}
          >
            <Sheet
              sx={{
                borderRadius: '12px',
                backgroundColor: '#001E3C',
                padding: '5px 5px',
                borderColor: '#132F4C',
                color: 'rgb(248, 248, 242)'
              }}
            >
              {runningTestSuite !== 'match_profitability_financial_needs_director' &&
                runningTestSuite === 'financial_security_margin' &&
                work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite].questions.map(
                  (testCase, i) => (
                    <FormControl key={testCase.label} sx={{ m: 4, [theme.breakpoints.down('md')]: { m: 1 } }}>
                      <FormLabel sx={{ color: 'common.white' }}>{testCase.label}</FormLabel>
                      <RadioGroup
                        sx={{ gap: 2, mb: 2, flexWrap: 'wrap', flexDirection: 'row' }}
                        onChange={(e) => handleTestCase(e, testCase.label)}
                      >
                        {testCase.responses.map((c) => (
                          <Sheet
                            key={c}
                            sx={{
                              backgroundColor: '#001E3C',
                              position: 'relative',
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              '--joy-focus-outlineOffset': '4px',
                              '--joy-palette-focusVisible': (theme) => theme.vars.palette.neutral.outlinedBorder,
                              [`& .${radioClasses.checked}`]: {
                                [`& .${radioClasses.label}`]: {
                                  fontWeight: 'lg'
                                },
                                [`& .${radioClasses.action}`]: {
                                  '--variant-borderWidth': '2px',
                                  borderColor: 'text.secondary'
                                }
                              },
                              [`& .${radioClasses.action}.${radioClasses.focusVisible}`]: {
                                outlineWidth: '2px'
                              }
                            }}
                          >
                            <Radio
                              overlay
                              disableIcon
                              checked={parseInt(caseValue, 10) === c}
                              sx={{ color: 'common.white', mt: 0 }}
                              key={c}
                              value={c}
                              label={c}
                            />
                          </Sheet>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )
                )}
              {runningTestSuite !== 'match_profitability_financial_needs_director' &&
                runningTestSuite !== 'financial_security_margin' &&
                work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite].questions.map(
                  (testCase, i) => (
                    <FormControl key={testCase.label} sx={{ m: 4 }}>
                      <FormLabel sx={{ color: 'common.white' }}>{testCase.label}</FormLabel>
                      <RadioGroup defaultValue="outlined" name="radio-buttons-group">
                        {testCase.responses.map((c) => (
                          <Radio
                            sx={{ color: 'common.white' }}
                            key={c}
                            value={c}
                            label={c}
                            variant="outlined"
                            onChange={(e) => handleTestCase(e, testCase.label)}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )
                )}
              {runningTestSuite === 'match_profitability_financial_needs_director' &&
                work.testSuites.test_suite_follow_up.test_suite_follow_up[0].tests[runningTestSuite].questions.map(
                  (testCase, i) => (
                    <FormControl key={testCase.label} sx={{ m: 4 }}>
                      <FormLabel sx={{ color: 'common.white' }}>{testCase.label}</FormLabel>
                      <Input
                        placeholder="Montant"
                        startDecorator="€"
                        sx={{ width: 300 }}
                        onChange={(e) => handleTestCase(e, testCase.label)}
                      />
                    </FormControl>
                  )
                )}
            </Sheet>
          </Box>
        )}
      {renderSupportText()}
    </>
  );

  const renderResultMobile = () => (
    <Box sx={{ height: '100%' }}>
      <Sheet
        sx={{
          borderRadius: '12px',
          backgroundColor: '#001E3C',
          padding: '5px 5px',
          borderColor: '#132F4C',
          color: 'rgb(248, 248, 242)',
          height: '100%'
        }}
      >
        {runningTest && <LinearProgress />}
        {!runningTest && missingField && (
          <Box
            sx={{
              p: 1
            }}
          >
            <Typography sx={{ color: theme.palette.error.main }}>
              Missing required fields, please check that all fields in cases are fulfilled
            </Typography>
          </Box>
        )}
        {testCaseSatisfied && renderTestResult()}
      </Sheet>
    </Box>
  );
  const renderDrawer = () => (
    <Sheet
      sx={{
        backgroundColor: '#D8E9E7'
      }}
    >
      {work.testSuites && (
        <div>
          <Divider />
          <List>
            {Object.entries(work.testSuites.test_suite.test_suite[0].tests).map(
              ([k, v]) =>
                k !== 'match_profitability_financial_needs' && (
                  <ListItem key={k} disablePadding>
                    <ListItemButton>
                      <Checkbox
                        sx={{
                          p: 1
                        }}
                        label={v.label}
                        checked={runningTestSuite === k}
                        onChange={() => {
                          setRunningTestSuite(k);
                          dispatch(selectTestSuiteLabel(k));
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
            )}
          </List>
        </div>
      )}
    </Sheet>
  );

  return (
    <>
      <Box
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          position: 'fixed',
          height: 'calc(100% - 110px)',
          [theme.breakpoints.down('lg')]: {
            width: '100%'
          },
          [theme.breakpoints.up('lg')]: {
            height: '100%',
            right: '240px'
            // ...(!isCollapse && {
            //   left: '280px'
            // })
            // width: 'calc(100% - 560px)'
          },
          // ...(!isCollapse && {
          //   left: '280px'
          // }),
          // ...(isCollapse &&
          //   isMobile && {
          //     left: '0px'
          //   }),
          // [theme.breakpoints.up('md')]: {
          //   width: 'calc(100% - 560px)'
          // },
          // [theme.breakpoints.up('lg')]: {
          //   width: 'calc(100% - 240px)'
          // },
          // width: isCollapse ? '100%' : 'calc(100% - 280px)',
          left: isMobile ? '0' : '340px',
          top: 54,
          backgroundColor: 'rgb(0, 30, 60)',
          borderColor: 'rgba(30, 73, 118, 0.7)',
          backgroundImage: `radial-gradient(at 51% 52%, rgba(19, 47, 76, 0.5) 0px, transparent 50%),
 radial-gradient(at 80% 0%, rgb(19, 47, 76) 0px, transparent 50%),
  radial-gradient(at 0% 95%, rgb(19, 47, 76) 0px, transparent 50%),
 radial-gradient(at 0% 5%, rgb(19, 47, 76) 0px, transparent 25%),
  radial-gradient(at 93% 85%, rgba(30, 73, 118, 0.8) 0px, transparent 50%),
   url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* <Box
          sx={{
            // [theme.breakpoints.up('lg')]: {
            //   width: 'calc(100% - 240px)'
            // },
            [theme.breakpoints.down('lg')]: {
              width: '100%'
            },
            height: '100%',
            borderRadius: '10px',
            backgroundColor: 'rgb(0, 30, 60)',
            borderColor: 'rgba(30, 73, 118, 0.7)',
            backgroundImage: `radial-gradient(at 51% 52%, rgba(19, 47, 76, 0.5) 0px, transparent 50%),
       radial-gradient(at 80% 0%, rgb(19, 47, 76) 0px, transparent 50%),
        radial-gradient(at 0% 95%, rgb(19, 47, 76) 0px, transparent 50%),
       radial-gradient(at 0% 5%, rgb(19, 47, 76) 0px, transparent 25%),
        radial-gradient(at 93% 85%, rgba(30, 73, 118, 0.8) 0px, transparent 50%),
         url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        > */}
        <Box
          flexDirection="row"
          sx={{
            height: '100%',
            flexGrow: 1,
            [theme.breakpoints.down('lg')]: {
              width: '100%'
            },
            display: 'flex'
          }}
        >
          {isLoading ? (
            <LinearProgress />
          ) : (
            <Box
              sx={{
                position: 'relative',
                [theme.breakpoints.down('lg')]: {
                  width: '100%'
                },
                width: '100%',
                height: '100%'
              }}
            >
              <MHidden width="lgDown">
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '0px',
                    flexGrow: 1,
                    p: 3
                    // width: { lg: `calc(100% - ${drawerWidth + 40}px)` }
                  }}
                >
                  {renderTestSuiteCondition()}
                  {renderTestSuite()}
                </Box>
              </MHidden>
              <MHidden width="lgUp">
                {value === 1 && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '0px',
                      flexGrow: 1
                      // p: 3
                    }}
                  >
                    {renderTestSuiteCondition()}
                  </Box>
                )}
                {value === 2 && (
                  <Box
                    sx={{
                      width: '100%',
                      // height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '0px',
                      flexGrow: 1
                      // p: 3
                    }}
                  >
                    {renderCaseMobile()}
                  </Box>
                )}
                {value === 3 && renderResultMobile()}
              </MHidden>
              <Drawer
                anchor="right"
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    marginTop: '54px',
                    height: 'calc(100% - 54px)',
                    backgroundColor: '#D8E9E7'
                  }
                }}
              >
                {renderDrawer()}
              </Drawer>
              <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    background: 'none',
                    marginTop: '54px',
                    height: 'calc(100% - 54px)',
                    backgroundColor: '#D8E9E7'
                  }
                }}
                open
              >
                {renderDrawer()}
              </Drawer>
            </Box>
          )}
        </Box>
        {/* </Box> */}
        <MHidden width="lgUp">
          <Box>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                if (newValue === 3) {
                  if (runningTestSuite !== 'compatibility_micro_regime') {
                    runTest();
                  }
                }
                setValue(newValue);
              }}
            >
              <BottomNavigationAction value={1} onClick={handleDrawerToggle} label="Tests" icon={<MenuIcon />} />
              <BottomNavigationAction label="Condition" icon={<GavelIcon />} />
              <BottomNavigationAction label="Case" icon={<BusinessCenterIcon />} />
              <BottomNavigationAction
                sx={{
                  color: !runningTest && missingField ? theme.palette.error.main : null
                }}
                label="Result"
                icon={<GradingIcon />}
              />
            </BottomNavigation>
          </Box>
        </MHidden>
      </Box>
    </>
  );
}
