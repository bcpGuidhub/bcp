import { Box, Sheet } from '@mui/joy';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import { orderBy } from 'lodash';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import {
  Button,
  Card,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  Drawer,
  Toolbar,
  IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import BottomNavigation from '@mui/material/BottomNavigation';
import MenuIcon from '@mui/icons-material/Menu';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AppBar from '@mui/material/AppBar';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { updateProjectRecommendedLegalStatus } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import { ButtonAnimate } from '../../../animate';
import legalStatusRankStore from './blob';
import { MHidden } from '../../../@material-extend';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const drawerWidth = 240;

const LegalLabel = styled(Typography)(({ theme }) => ({
  fontWeight: '700',
  lineHeight: '32px',
  fontSize: '20px',
  [theme.breakpoints.down('lg')]: { fontSize: '1.6vw', lineHeight: 1.5 },
  [theme.breakpoints.up('lg')]: { fontSize: '1vw', lineHeight: 1.5 }
}));

const LegalMeritStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '20px',
  textAlign: 'left',
  // padding: theme.spacing(2),
  lineHeight: '2.1rem',
  '&:hover': {
    boxShadow: '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'
  },
  [theme.breakpoints.down('lg')]: { fontSize: '1.6vw', lineHeight: 1.5 },
  [theme.breakpoints.up('lg')]: { fontSize: '1vw', lineHeight: 1.5 }
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  setAssociates: PropTypes.func.isRequired,
  associates: PropTypes.string.isRequired
};

function Nav({ setAssociates, associates }) {
  const theme = useTheme();
  return (
    <Stack>
      <Box display="flex" flexDirection="column">
        <Box p={1}>
          <Typography variant="h3" component="h3" sx={{ fontSize: '1.1rem !important' }}>
            Combien de participants
          </Typography>
        </Box>
      </Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        {['single_creator', 'multiple_creator'].map((c) => (
          <Box key={c}>
            <Checkbox
              label={c === 'single_creator' ? 'Un seul participant' : 'Plusieurs participants'}
              checked={associates === c}
              // to demonstrate the focus outline
              // slotProps={{ action: { className: checkboxClasses.focusVisible } }}
              onChange={() => setAssociates(c)}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function ListCriteria({ legalStatusRankStore, selectedIndex, handleQuery, selectedLabel, associates }) {
  const theme = useTheme();
  return (
    <Stack spacing={1}>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Box p={1}>
          <Typography variant="h3" component="h3" sx={{ fontSize: '1.1rem !important' }}>
            Sélection des critères :
          </Typography>
        </Box>
      </Box>
      <Divider />
      {legalStatusRankStore[associates].meta_queries.map((label, i) => (
        <ListItem key={i} button selected={selectedIndex === i} onClick={(event) => handleQuery(event, i, label)}>
          <ListItemIcon>
            {selectedLabel(label) && (
              <CheckIcon
                sx={{
                  color: '#fe6320',
                  fontSize: '1.7rem'
                }}
              />
            )}
            {!selectedLabel(label) && <InboxIcon />}
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={{
              '& .MuiTypography-root': {
                // fontSize: '1.5vw',
                // [theme.breakpoints.up('xl')]: { fontSize: '0.7vw' },
                // [theme.breakpoints.up('lg')]: { fontSize: '1vw' },
                // [theme.breakpoints.up('sm')]: { fontSize: '1.5vw' },
                // [theme.breakpoints.down('sm')]: { fontSize: '3vw' },
                lineHeight: 1
              }
            }}
          />
        </ListItem>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------
CompareLegalStatus.propTypes = {
  legalStatusRankStore: PropTypes.object.isRequired,
  queryResults: PropTypes.object.isRequired,
  associates: PropTypes.string.isRequired
};

function CompareLegalStatus({ legalStatusRankStore, associates, queryResults }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const sortedQueryResults = orderBy(
    queryResults.status,
    [
      function (o) {
        return o.rank;
      }
    ],
    ['desc']
  );

  return (
    <>
      {sortedQueryResults.length > 0 && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-evenly">
            {sortedQueryResults &&
              sortedQueryResults.map((text, m) => (
                <Box key={`status--${m}`} m={1} p={1} display="flex" flexDirection="row" justifyContent="space-evenly">
                  <Card sx={{ ...(!isMobile && { mt: 4, mb: 4, p: 2 }), ...(isMobile && { p: 1 }) }}>
                    <Box>
                      {text.legal_label === 'Entreprise individuelle' && (
                        <LegalLabel variant="subtitle1">Statut: EI / EIRL</LegalLabel>
                      )}
                      {text.legal_label !== 'Entreprise individuelle' && (
                        <LegalLabel variant="subtitle1">Statut: {text.legal_label}</LegalLabel>
                      )}
                    </Box>
                    <Box>
                      <LegalLabel variant="subtitle1">
                        Score :
                        {new Array(text.rank).fill(0).map((k, x) => (
                          <StarIcon
                            key={x}
                            style={{
                              color: 'rgb(254, 99, 30)'
                            }}
                          />
                        ))}
                      </LegalLabel>
                    </Box>
                    <Divider />
                    <Box p={1}>
                      <LegalMeritStyle
                        variant="subtitle1"
                        dangerouslySetInnerHTML={{
                          __html: text.legal_merit
                        }}
                      />
                    </Box>
                  </Card>
                </Box>
              ))}
            {queryResults.status && (
              <Tooltip title={queryResults.meta_description} arrow>
                <InfoIcon sx={{ color: '#fff' }} />
              </Tooltip>
            )}
          </Box>
        </Grid>
      )}
      {sortedQueryResults.length === 0 && (
        <Grid item sm={12} md={12} lg={12} xl={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              p: 2,
              mt: 4,
              mb: 4,
              minWidth: 320,
              minHeight: 400,
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="subtitle1" sx={{ color: '#fff' }}>
              Aucun critère sélectionné
            </Typography>
          </Box>
        </Grid>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

QueryList.propTypes = {
  queryList: PropTypes.array,
  removeQueryLabel: PropTypes.func
};

function QueryList({ queryList, removeQueryLabel }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Box sx={{ ...(!isMobile && { mt: 1, mb: 1, p: 1 }) }}>
      <Typography
        variant="h3"
        component="h3"
        sx={{ color: '#fff', fontSize: isMobile ? '3vw' : '1.1rem !important', ...(!isMobile && { mt: 1 }) }}
      >
        Critères retenus :
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          flexWrap: 'wrap',
          p: 1,
          m: 1
        }}
      >
        <Stack spacing={1} sx={{ width: '100%' }} direction="row">
          {queryList.length > 0 &&
            queryList.map((q, i) => (
              <Button
                key={`${q}--${i}`}
                onClick={(e) => {
                  removeQueryLabel(e, q);
                }}
                variant="outlined"
                color="info"
                endIcon={<CancelIcon />}
                sx={{ pt: '1px', pb: '1px', fontSize: '0.7rem' }}
              >
                {q}
              </Button>
            ))}
        </Stack>
      </Box>
      {queryList.length === 0 && (
        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
          Aucun résultat
        </Typography>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

RecommendedLegalStatus.propTypes = {
  recommendedLegalStatus: PropTypes.string
};

function RecommendedLegalStatus({ recommendedLegalStatus }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Box sx={{ ...(!isMobile && { mt: 4, mb: 4, p: 2 }) }}>
      <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
        <Typography
          variant="h3"
          component="h3"
          sx={{ color: '#fff', fontSize: isMobile ? '3vw' : '1.1rem !important' }}
        >
          Statut juridique le plus approprié :
        </Typography>
        {recommendedLegalStatus === '' && <Typography style={{ color: '#fff' }}>Aucun résultat</Typography>}
        {recommendedLegalStatus !== '' && (
          <Typography
            variant="h3"
            component="h3"
            sx={{ fontSize: isMobile ? '3vw' : '1.1rem !important', ...(!isMobile && { mt: 4 }), color: '#fff' }}
          >
            {recommendedLegalStatus}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function LegalHelper() {
  const { accountType } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobileSm = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [value, setValue] = useState(1);
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const projectLegal = work.project_legal_status || {};
  const [statusScore, setStatusScore] = useState({});
  const [recommendedLegalStatus, setRecommendedLegalStatus] = useState('');
  const [associates, setAssociates] = useState('single_creator');
  const [queryResults, setQueryResults] = useState({});
  const [queryList, setQueryList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileOpenKeywordSearch, setMobileOpenKeywordSearch] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerToggleKeywordSearch = () => setMobileOpenKeywordSearch(!mobileOpenKeywordSearch);

  const handleQuery = (event, index, label) => {
    event.preventDefault();
    if (queryList.includes(label)) {
      return;
    }
    const data = legalStatusRankStore[associates].meta_data.find((d) => d.meta_label === label);
    setQueryResults(data);
    setSelectedIndex(index);
    setQueryList([...queryList, label]);
    const dupStatusScore = { ...statusScore };
    data.status.forEach((status) => {
      dupStatusScore[status.legal_label] += status.rank;
    });

    setStatusScore(dupStatusScore);
    const bestLegalChoice = Object.keys(dupStatusScore).reduce((acc, key) =>
      dupStatusScore[acc] >= dupStatusScore[key] ? acc : key
    );
    setRecommendedLegalStatus(bestLegalChoice);
  };
  const removeQueryLabel = (e, label) => {
    e.preventDefault();
    const qx = [...queryList.filter((e) => e !== label)];
    setQueryList(qx);
    if (qx.length === 0) {
      setQueryResults({});
    }
    const data = legalStatusRankStore[associates].meta_data.find((d) => d.meta_label === label);
    const dupStatusScore = { ...statusScore };
    data.status.forEach((status) => {
      dupStatusScore[status.legal_label] -= status.rank;
    });
    setStatusScore(dupStatusScore);
    const bestLegalChoice = Object.keys(dupStatusScore).reduce((acc, key) =>
      dupStatusScore[acc] >= dupStatusScore[key] ? acc : key
    );
    if (dupStatusScore[bestLegalChoice] <= 0) {
      setRecommendedLegalStatus('');
    } else {
      setRecommendedLegalStatus(bestLegalChoice);
    }
  };
  const save = (e) => {
    e.preventDefault();
    const data = {
      criteria_based_legal_status_idea: recommendedLegalStatus,
      user_legal_criteria: queryList,
      associates,
      legal_status_idea: recommendedLegalStatus,
      tax_system: '',
      company_vat_regime: '',
      management_stake: '',
      social_security_scheme: '',
      id: ''
    };
    const legal = work.project_legal_status || {};
    const taxSystem = legal.tax_system;
    const vatRegime = legal.company_vat_regime;
    const managementStake = legal.management_stake;
    const socialSecurityScheme = legal.social_security_scheme;
    data.tax_system = taxSystem === '' ? 'IR' : taxSystem;
    data.company_vat_regime = vatRegime === '' ? 'Franchise en base de TVA' : vatRegime;
    if (data.criteria_based_legal_status_idea === 'SARL') {
      data.management_stake = managementStake === '' ? 'La gérance est majoritaire' : managementStake;
      data.social_security_scheme =
        socialSecurityScheme === '' ? 'Sécurité sociale des indépendants' : socialSecurityScheme;
    } else if (['Entreprise individuelle', 'EIRL', 'EURL'].includes(data.criteria_based_legal_status_idea)) {
      data.social_security_scheme = 'Sécurité sociale des indépendants';
    } else {
      data.social_security_scheme = 'Régime général de la sécurité sociale';
    }
    data.id = work.id;
    enqueueSnackbar('Vos changements ont été enregistrés', { variant: 'success' });
    dispatch(updateProjectRecommendedLegalStatus(work.id, data));
  };

  useEffect(() => {
    setQueryResults({});
    setSelectedIndex(-1);
    const statusRank = legalStatusRankStore[associates].meta_status.reduce((acc, e) => {
      acc[e] = 0;
      return acc;
    }, {});
    if (associates === projectLegal.associates) {
      setRecommendedLegalStatus(projectLegal.criteria_based_legal_status_idea);
      setQueryList(projectLegal.user_legal_criteria);
      // initialise score
      projectLegal.user_legal_criteria.forEach((label) => {
        const data = legalStatusRankStore[projectLegal.associates].meta_data.find((d) => d.meta_label === label);
        data.status.forEach((status) => {
          statusRank[status.legal_label] += status.rank;
        });
      });
    } else {
      setRecommendedLegalStatus('');
      setQueryList([]);
    }
    setStatusScore(statusRank);
  }, [
    associates,
    projectLegal.associates,
    projectLegal.criteria_based_legal_status_idea,
    projectLegal.user_legal_criteria
  ]);

  useEffect(() => {
    const recommendedStatus = projectLegal.criteria_based_legal_status_idea;
    if (typeof recommendedStatus !== 'undefined' && recommendedStatus !== '' && recommendedStatus !== null) {
      setAssociates(projectLegal.associates);
      setRecommendedLegalStatus(recommendedStatus);
      setQueryList(projectLegal.user_legal_criteria);
    }
  }, [projectLegal]);

  const selectedLabel = (label) => queryList.includes(label);

  const renderDrawer = () => (
    <>
      <Box>
        <Nav setAssociates={setAssociates} associates={associates} />
      </Box>
      <ListCriteria
        legalStatusRankStore={legalStatusRankStore}
        selectedIndex={selectedIndex}
        handleQuery={handleQuery}
        selectedLabel={selectedLabel}
        associates={associates}
      />
    </>
  );

  const renderKeywordSearchMobile = () => (
    <Box
      sx={{
        width: '100%',
        p: 1
      }}
    >
      <RecommendedLegalStatus recommendedLegalStatus={recommendedLegalStatus} />
      <QueryList queryList={queryList} removeQueryLabel={removeQueryLabel} />
      {accountType !== 'stakeholder' && queryList.length > 0 && (
        <div>
          <ButtonAnimate sx={{ width: '100%' }} mediumClick onClick={save}>
            <Button variant="contained" size="large" sx={{ width: '100%' }}>
              Choisir ce statut juridique
            </Button>
          </ButtonAnimate>
        </div>
      )}
    </Box>
  );

  return (
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
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0px',
              flexGrow: 1
            }}
          >
            <Sheet
              sx={{
                background: 'none'
              }}
            >
              <CompareLegalStatus
                legalStatusRankStore={legalStatusRankStore}
                associates={associates}
                queryResults={queryResults}
              />
            </Sheet>
            <MHidden width="lgDown">{renderKeywordSearchMobile()}</MHidden>
          </Box>
        </Box>
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
              [theme.breakpoints.down('md')]: { marginTop: '54px' },
              // marginTop: '116px',
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
              [theme.breakpoints.down('md')]: { marginTop: '54px' },
              // marginTop: '116px',
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
      <MHidden width="lgUp">
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpenKeywordSearch}
          onClose={handleDrawerToggleKeywordSearch}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              [theme.breakpoints.down('md')]: { marginTop: '54px' },
              // marginTop: '116px',
              marginTop: '54px',
              height: 'calc(100% - 54px)',
              backgroundColor: '#D8E9E7'
            }
          }}
        >
          {renderKeywordSearchMobile()}
        </Drawer>
      </MHidden>
      <MHidden width="lgUp">
        <Box>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction value={1} onClick={handleDrawerToggle} label="critères" icon={<MenuIcon />} />
            <BottomNavigationAction
              label="Critères retenus"
              onClick={handleDrawerToggleKeywordSearch}
              icon={<FilterListIcon />}
            />
          </BottomNavigation>
        </Box>
      </MHidden>
    </Box>
  );
}
