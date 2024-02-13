// material
import {
  Container,
  Divider,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Badge,
  CardHeader,
  IconButton,
  CardActions,
  List,
  ListItem,
  Stack,
  Icon
} from '@mui/material';
import { useState, useEffect } from 'react';
import FeedIcon from '@mui/icons-material/Feed';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SearchIcon from '@mui/icons-material/Search';
// material
import { styled, useTheme } from '@mui/material/styles';

// import { Box, Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
// components
import Page from '../../components/Page';
import {
  InviteStakeholder,
  ProjectBuild,
  ProjectTestPhase,
  ProjectSimulationPhase,
  ProjectFinancialForecast
} from '../../components/_dashboard/general-app';
import useSettings from '../../hooks/useSettings';
// hooks
import { useDispatch, useSelector } from '../../redux/store';
import { fNumber } from '../../utils/formatNumber';
import { COTISATION_API } from '../../utils/axios';
import { getProjectFinancialForecast, getProjectLegalStatus } from '../../redux/slices/project';
import useAuth from '../../hooks/useAuth';
import { NewStakeHolder } from '../../components/services/project_business_plan';
import Logo from '../../components/Logo';
import SelectProject from '../../layouts/dashboard/SelectProject';

import { SeoIllustration, InquistIllustration } from '../../assets';
import { PATH_DASHBOARD } from '../../routes/paths';

const optionsMixedChart = {
  chart: {
    height: 350,
    type: 'bar',
    stacked: false,
    width: '100%'
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#333']
    }
  },
  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100]
    }
  },
  labels: ['Année 1', 'Année 2', 'Année 3'],
  markers: {
    size: 0
  },
  xaxis: {
    type: 'category',
    labels: {
      style: {
        colors: ['#2578a1', '#fe6113', '#2578a1'],
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 900,
        cssClass: 'apexcharts-xaxis-label'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Montant(€)',
      style: {
        color: '#2578a1',
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 900,
        cssClass: 'apexcharts-xaxis-label'
      }
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (seriesName) => fNumber(seriesName),
      title: {
        formatter: () => ''
      }
    }
  },
  legend: {
    fontSize: '14px',
    fontFamily: 'Helvetica, Arial',
    fontWeight: 700
  },
  title: {
    text: "Résultat / Chiffre d'affaires",
    align: 'center',
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#2578a1'
    }
  }
};

const quickAccessTools = [
  // Finance
  // ----------------------------------------------------------------------
  {
    subheader: 'Financement',
    items: [
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
  },
  // Les Formalité
  // ----------------------------------------------------------------------
  {
    subheader: 'Les Formalités Playground',
    items: [
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
      },
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
      },
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
  },
  // Secteur d'activité
  // ----------------------------------------------------------------------
  {
    subheader: "Secteur d'activité",
    items: [
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
  // ----------------------------------------------------------------------
];
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// ----------------------------------------------------------------------

AppWelcomeCommunityMessager.propTypes = {
  displayName: PropTypes.string
};

function AppWelcomeCommunityMessager({ displayName }) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 2 }
        }}
      >
        <Typography gutterBottom variant="h4">
          Welcome back,
          <br /> {!displayName ? '...' : displayName}!
        </Typography>

        <Badge
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          color="secondary"
          badgeContent={<MessageIcon sx={{ width: '10px', height: '10px' }} />}
        >
          <Button
            variant="contained"
            to={PATH_DASHBOARD.hub.root}
            component={RouterLink}
            sx={{ textTransform: 'none !important' }}
          >
            Rejoignez le chat Messenger de votre communauté de secteur d'activité
          </Button>
        </Badge>
      </CardContent>

      <SeoIllustration
        sx={{
          // p: 3,
          width: 360
          // margin: { xs: 'auto', md: 'inherit' }
        }}
      />
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

AppWelcomeCommunityQuestionAnswer.propTypes = {
  displayName: PropTypes.string
};

function AppWelcomeCommunityQuestionAnswer({ displayName }) {
  return (
    <RootStyle sx={{ backgroundColor: '#d8e9e7' }}>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          mb: 1
        }}
      >
        <Button
          to={PATH_DASHBOARD.inquist.browse}
          component={RouterLink}
          sx={{ mb: 1, backgroundColor: '#001E3C', color: '#fff', p: '5px' }}
        >
          <Typography sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Hi {!displayName ? '...' : displayName}! ,
            <br /> Rejoignez la communauté de questions/réponses modérées pour les créateurs d'entreprise.
          </Typography>
        </Button>

        <Badge
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          color="secondary"
          badgeContent={<QuestionAnswerIcon sx={{ width: '10px', height: '10px' }} />}
        >
          <Button variant="contained" to={PATH_DASHBOARD.inquist.browse} component={RouterLink}>
            Trouvez la meilleure réponse à votre question, aidez les autres à répondre à la leur
          </Button>
        </Badge>
      </CardContent>
      {/* 
      <Box component={Card} sx={{ m: 1 }}>
        <List>
          <ListItem sx={{ pt: '4px', pb: '4px', fontWeight: 'bold' }}>Community Moderated Q/A</ListItem>
          <ListItem sx={{ pt: '4px', pb: '4px', fontWeight: 'bold' }}>for business creators</ListItem>
          <ListItem sx={{ pt: '4px', pb: '4px', fontWeight: 'bold' }}>Pros and Business owners</ListItem>
        </List>
      </Box> */}
    </RootStyle>
  );
}

// ----------------------------------------------------------------------
export default function GeneralApp() {
  const theme = useTheme();
  const isMobile = theme.breakpoints.down('md');
  const { themeStretch } = useSettings();
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const isCreator = accountType !== 'stakeholder';
  const { account } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const { projects } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [netResult, setNetResult] = useState({
    year_1: 0,
    year_2: 0,
    year_3: 0
  });
  const [percent, setPercent] = useState({
    year_1: 0,
    year_2: 0,
    year_3: 0
  });
  const [plotData, setPlotData] = useState(null);

  const handleClickOpen = (f) => {
    setOpen(f);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (work.id) {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
      dispatch(getProjectFinancialForecast(work.id, apiPrefix));
    }
  }, []);

  useEffect(() => {
    if (work.aggregateFinancialProvisions) {
      const storedSelectedProject = localStorage.getItem('selected_project');
      const payload = {
        ...work.aggregateFinancialProvisions,
        project_details: { ...JSON.parse(storedSelectedProject) },
        project_legal_status: { ...work.project_legal_status }
      };
      COTISATION_API.post(`cotisations/disbursements`, payload)
        .then((response) => {
          const { tables } = response.data;
          const income = tables.income_statement;
          const treasury = tables.treasury.rows;
          const treasuryResult = [
            treasury[0][treasury[0].length - 1],
            treasury[1][treasury[1].length - 1],
            treasury[2][treasury[2].length - 1]
          ];
          const netResult = income.rows.find((row) => row.field === "Résultat de l'exercice");

          setNetResult({
            year_1: Math.floor(netResult.year_1),
            year_2: Math.floor(netResult.year_2),
            year_3: Math.floor(netResult.year_3)
          });
          setPercent({
            year_1: 0,
            year_2:
              ((Math.floor(netResult.year_2) - Math.floor(netResult.year_1)) / Math.floor(netResult.year_2)) * 100,
            year_3: ((Math.floor(netResult.year_3) - Math.floor(netResult.year_2)) / Math.floor(netResult.year_3)) * 100
          });
          const ca = income.rows.find((row) => row.field === "Chiffre d'affaires");
          const s = income.rows.find((row) => row.field === "Total des charges d'exploitation");
          const t = income.rows.find((row) => row.field === 'Charges financières');
          const u = income.rows.find((row) => row.field === 'Impôts sur les bénéfices');
          const financialCharges = [
            Math.floor(s.year_1 + t.year_1 + u.year_1),
            Math.floor(s.year_2 + t.year_2 + u.year_2),
            Math.floor(s.year_3 + t.year_3 + u.year_3)
          ];
          const plotData = [];
          plotData.push({
            name: "Chiffre d'affaires",
            type: 'bar',
            data: [ca.year_1, ca.year_2, ca.year_3]
          });
          plotData.push({
            name: 'Trésorerie',
            type: 'bar',
            data: [
              Math.floor(treasuryResult[0].month_12),
              Math.floor(treasuryResult[1].month_12),
              Math.floor(treasuryResult[2].month_12)
            ]
          });
          plotData.push({
            name: 'Charges',
            type: 'bar',
            data: financialCharges
          });
          setPlotData(plotData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [work.aggregateFinancialProvisions]);
  return (
    <Page title="Ecosystem | Guidhub">
      <Box sx={{ pt: '112px', pl: 4, pr: 4 }}>
        <Grid container spacing={3} sx={{ justifyContent: 'space-around' }}>
          <Grid item xs={12}>
            <Box display="flex">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '150px'
                }}
              >
                <Logo />
              </Box>
              <Box>
                <Typography
                  typography="h3"
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 400
                  }}
                >
                  Bienvenue
                </Typography>
              </Box>{' '}
            </Box>
          </Grid>
          {!projects && (
            <Grid item xs={12}>
              <ProjectBuild displayName={account?.first_name} />
            </Grid>
          )}
          {projects?.length > 0 && !work.id && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" sx={{ mt: 8 }}>
                <Box>
                  <Typography typography="h4"> Vous travaillez dans </Typography>
                </Box>
                <Box>
                  <SelectProject projects={projects} />
                </Box>
              </Box>
            </Grid>
          )}
          {isCreator && projects?.length > 0 && work.id && (
            <>
              {/* <Grid item xs={12} md={5}>
                <AppWelcomeCommunityMessager displayName={account?.first_name} />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppWelcomeCommunityQuestionAnswer displayName={account?.first_name} />
              </Grid> */}

              <Grid item xs={12}>
                <InviteStakeholder handleClickOpen={handleClickOpen} />
              </Grid>
            </>
          )}
        </Grid>
        {projects?.length > 0 && work.id && (
          <>
            <Box sx={{ mt: 6, mb: 2 }}>
              <Box>
                <Typography sx={{ typography: 'h5' }}>Résumé du créateur </Typography>
              </Box>
              <Divider />
            </Box>

            <div
              style={{
                borderRadius: '12px 12px 12px 12px',
                position: 'relative',
                outline: '0px',
                margin: 'auto',
                // display: 'flex',
                // justifycontent: 'center',
                padding: '24px',
                backgroundColor: '#D8E9E7',
                border: '1px solid rgba(218, 224, 231, 0.08)',
                minHeight: '40vh'
              }}
            >
              <div style={{ height: '100%' }}>
                <Accordion
                  sx={{ minHeight: 'calc(40vh/3)' }}
                  expanded={expanded === 'panel1'}
                  onChange={handleChange('panel1')}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ backgroundColor: '#D8E9E7' }} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    {!isMobile && (
                      <Typography
                        sx={{ width: '33%', flexShrink: 0, color: '#001E3C', fontWeight: 'Bold', fontSize: '1.5rem' }}
                      >
                        Construire
                      </Typography>
                    )}
                    <Typography sx={{ color: '#001E3C', fontWeight: 'Bold' }}>Détails du résumé du projet</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 10 }}>
                      <ProjectFinancialForecast isLoading={isLoading} netResult={netResult} percent={percent} />
                      {plotData && (
                        <Box sx={{ mt: 4 }}>
                          <Chart options={optionsMixedChart} series={plotData} type="bar" width="100%" height="420px" />
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{ minHeight: 'calc(40vh/3)' }}
                  expanded={expanded === 'panel2'}
                  onChange={handleChange('panel2')}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ backgroundColor: '#D8E9E7' }} />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    {!isMobile && (
                      <Typography
                        sx={{ width: '33%', flexShrink: 0, color: '#001E3C', fontWeight: 'Bold', fontSize: '1.5rem' }}
                      >
                        Test
                      </Typography>
                    )}
                    <Typography sx={{ color: '#001E3C', fontWeight: 'Bold' }}>Cas de test du projet</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ProjectTestPhase />
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{ minHeight: 'calc(40vh/3)' }}
                  expanded={expanded === 'panel3'}
                  onChange={handleChange('panel3')}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ backgroundColor: '#D8E9E7' }} />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    {!isMobile && (
                      <Typography
                        sx={{ width: '33%', flexShrink: 0, color: '#001E3C', fontWeight: 'Bold', fontSize: '1.5rem' }}
                      >
                        Simulation
                      </Typography>
                    )}
                    <Typography sx={{ color: '#001E3C', fontWeight: 'Bold' }}>
                      Résumé de la simulation et de l'analyse du projet
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ProjectSimulationPhase />
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </>
        )}

        {projects?.length > 0 && work.id && (
          <Grid container spacing={3} sx={{ justifyContent: 'space-around' }}>
            <Grid item xs={12}>
              <Box sx={{ mt: 6, mb: 2 }}>
                <Box>
                  <Typography sx={{ typography: 'h5' }}>Accès rapide</Typography>
                </Box>
                <Divider />
                <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap' }}>
                  {quickAccessTools.map((tool) => {
                    const { items } = tool;
                    return items.map((item) => (
                      <Box key={item.title} sx={{ m: 1 }}>
                        <Box
                          component={RouterLink}
                          to={item.path}
                          sx={{
                            border: '1px solid #dadce0',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            display: 'inline-flex',
                            flexShrink: '0',
                            height: '86px',
                            width: '256px',
                            textDecoration: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Box
                            sx={{
                              height: '86px',
                              width: '256px',
                              paddingLeft: '12px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'nowrap' }}>
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  color: '#3c4043',
                                  display: 'flex',
                                  flex: '0 0 32px',
                                  justifyContent: 'center'
                                }}
                              >
                                {item.icon}
                              </Box>
                              <Box sx={{ paddingRight: 1 }}>
                                <Typography sx={{ typography: 'subtitle1', color: '#3c4043' }}>{item.title}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ));
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <NewStakeHolder handleAddStakeholder={handleClickOpen} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Page>
  );
}
