import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useTheme } from '@mui/material/styles';
import { uniqBy } from 'lodash';
import { Icon } from '@iconify/react';
// material
import BottomNavigation from '@mui/material/BottomNavigation';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Container,
  Grid,
  Button,
  Menu,
  MenuItem,
  Card,
  Divider,
  Box,
  Stack,
  Typography,
  Drawer,
  useMediaQuery
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppBar from '@mui/material/AppBar';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {
  getFinancialAid,
  clearFinancialAid,
  getGeographicalDepartments,
  startLoading,
  filterFinancialAid
} from '../../../../redux/slices/finance';
// components
import Page from '../../../../components/Page';
import {
  Projects,
  Profiles,
  FinanceNature,
  AidRestrictionZone,
  AidResponse
} from '../../../../components/services/finance';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../../redux/store';

import { projects, profiles, natureOfFinancing, aidZone, financers } from '../../../../utils/aid_meta_data';
import Scrollbar from '../../../../components/Scrollbar';
import { MHidden } from '../../../../components/@material-extend';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  paper: {},
  control: {},
  layered_filters: {
    // "backgroundColor": blue[100],
    backgroundColor: '#335f78'
  },
  layered_filter_open: {
    'list-style': 'none'
  },
  layered_filters_wrap: {
    display: 'flex',
    'padding-left': '10px',
    'padding-right': '10px'
    // 'backgroundColor': 'rgb(8,48,85)'
  },
  layered_filter_facet: {
    'margin-bottom': '10px'
  },
  title: {
    margin: '0',
    padding: '12px 0',
    'font-size': '1.2em',
    'line-height': '1.3em',
    color: '#FFF',
    cursor: 'pointer'
  },
  icon_plus_round: {
    'margin-right': '5px',
    display: 'inline-flex',
    height: '1em',
    width: '1em',
    'align-self': 'center',
    top: '0em',
    position: 'relative'
  },
  values: {
    display: 'flex',
    '-webkit-flex-direction': 'row',
    '-ms-flex-direction': 'row',
    'flex-direction': 'row',
    '-webkit-flex-wrap': 'wrap',
    '-ms-flex-wrap': 'wrap',
    'flex-wrap': 'wrap',
    '-webkit-justify-content': 'flex-start',
    '-ms-flex-pack': 'start',
    'justify-content': 'flex-start',
    '-webkit-align-content': 'center',
    '-ms-flex-line-pack': 'center',
    'align-content': 'center',
    '-webkit-align-items': 'stretch',
    '-ms-flex-align': 'stretch',
    'align-items': 'stretch',
    'list-style': 'none',
    'margin-top': '10px'
  },
  layered_input: {
    'margin-right': '10px',
    'margin-bottom': '10px',
    'max-width': '210px'
  },
  value_query: {
    padding: '10px 15px',
    height: '100%',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFF',
    'text-decoration': 'none',
    'font-size': '0.9em',
    'line-height': '1em',
    display: 'flex',
    '-webkit-flex-direction': 'column',
    '-ms-flex-direction': 'column',
    'flex-direction': 'column',
    '-webkit-flex-wrap': 'nowrap',
    '-ms-flex-wrap': 'nowrap',
    'flex-wrap': 'nowrap',
    '-webkit-justify-content': 'center',
    '-ms-flex-pack': 'center',
    'justify-content': 'center',
    '-webkit-align-content': 'center',
    '-ms-flex-line-pack': 'center',
    'align-content': 'center',
    '-webkit-align-items': 'flex-start',
    '-ms-flex-align': 'start',
    'align-items': 'flex-start',
    cursor: 'pointer',
    '&:hover': {
      'text-decoration': 'none'
    }
  },
  current_filters: {
    color: '#FFF',
    display: 'flex',
    '-webkit-flex-direction': 'row',
    '-ms-flex-direction': 'row',
    'flex-direction': 'row',
    '-webkit-flex-wrap': 'wrap',
    '-ms-flex-wrap': 'wrap',
    'flex-wrap': 'wrap',
    '-webkit-justify-content': 'flex-start',
    '-ms-flex-pack': 'start',
    'justify-content': 'flex-start',
    '-webkit-align-content': 'center',
    '-ms-flex-line-pack': 'center',
    'align-content': 'center',
    '-webkit-align-items': 'flex-start',
    '-ms-flex-align': 'start',
    'align-items': 'flex-start'
  },
  filter_title: {
    color: '#FFF',
    padding: '10px 10px 8px 10px',
    'margin-right': '10px',
    'font-size': '1.1em',
    'margin-top': '5px',
    'margin-bottom': '0',
    'line-height': '50px'
  },
  filter: {
    display: 'inline-block',
    'margin-right': '10px'
    // 'margin-bottom': '10px'
  },
  filter_query: {
    display: 'block',
    padding: '10px 15px',
    backgroundColor: '#1b4163',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#FFF',
    'text-decoration': 'none',
    'font-size': '0.9em',
    '&:hover': {
      'text-decoration': 'none'
    }
  },
  remove_filter_icon: {
    'margin-left': '5px'
  },
  query_options: {
    padding: '10px 44px 14px 24px;',
    'text-align': 'left',
    border: 'none',
    outline: 'none',
    'font-weight': 'bold',
    'box-shadow': 'none',
    backgroundColor: '#FFF',
    '-webkit-flex': '1 1 auto',
    '-ms-flex': '1 1 auto',
    flex: '1 1 auto',
    'justify-content': 'space-between'
  },
  query_by_location: {
    padding: '5px 6px 6px 11px',
    display: 'flex',
    '-webkit-flex-direction': 'row',
    '-ms-flex-direction': 'row',
    'flex-direction': 'row',
    '-webkit-flex-wrap': 'nowrap',
    '-ms-flex-wrap': 'nowrap',
    'flex-wrap': 'nowrap',
    '-webkit-justify-content': 'flex-start',
    '-ms-flex-pack': 'start',
    'justify-content': 'flex-start',
    '-webkit-align-content': 'center',
    '-ms-flex-line-pack': 'center',
    'align-content': 'center',
    '-webkit-align-items': 'center',
    '-ms-flex-align': 'center',
    'align-items': 'center'
  },
  location_input: {
    margin: '0 0 0px 5px',
    font: 'inherit',
    'max-width': 'calc(100% - 21px)',
    border: '0',
    display: 'block',
    'padding-top': '2px',
    'padding-left': '0',
    height: '34px',
    color: '#111',
    'vertical-align': 'middle',
    'font-size': '14px',
    '&:focus': {
      outline: 'none'
    }
  },
  separator: {
    height: '150px',
    background: '#efefef',
    width: '100%'
  }
});

// ----------------------------------------------------------------------
const initialState = {
  selectedProject: '',
  selectedIndex: '',
  anchorEl: null,
  query: [],
  zone: '',
  page: 1,
  aid_query: {},
  zoneLabel: ''
};
const drawerWidth = 240;
export default function FinancialAid() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const classes = useStyles();

  const dispatch = useDispatch();
  const isMobileMd = useMediaQuery(theme.breakpoints.down('md'));
  const { aid } = useSelector((state) => state.finance);
  const { work } = useSelector((state) => state.project);

  const { geographicalDepartments, aidResources, aidCount } = aid;
  const [aidSearchState, setAidSearchState] = useState({ ...initialState });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenKeywordSearch, setMobileOpenKeywordSearch] = useState(false);
  const [value, setValue] = useState(-1);

  const displayProjectCategories = (e, project) => {
    e.preventDefault();
    if (aidSearchState.selectedProject === project.categorie.id_proj) {
      setAidSearchState({ ...aidSearchState, selectedProject: '' });
    } else {
      setAidSearchState({ ...aidSearchState, selectedProject: project.categorie.id_proj });
    }
  };

  const showIndex = (e, categorie) => {
    e.preventDefault();
    if (categorie === aidSearchState.selectedIndex) {
      setAidSearchState({ ...aidSearchState, selectedIndex: '', anchorEl: e.currentTarget });
      return;
    }
    if (categorie === 'financing') {
      setAidSearchState({ ...aidSearchState, selectedIndex: categorie, anchorEl: e.currentTarget });
      return;
    }
    setAidSearchState({ ...aidSearchState, selectedIndex: categorie });
  };

  const handleCloseFinancers = () => {
    setAidSearchState({ ...aidSearchState, anchorEl: null });
  };

  const selectFinancer = (e, financer) => {
    appendQuery(e, 'financeur', financer.org_nom, financer.id_org);
    handleCloseFinancers();
  };

  const appendQuery = (e, resource, name, id) => {
    e.preventDefault();
    e.stopPropagation();
    const data = {
      resource,
      name,
      id
    };
    const query = uniqBy(aidSearchState.query.concat(data), 'id');
    // setAidSearchState({ ...aidSearchState, query, page: 1, selectedIndex: '' });
    setAidSearchState({ ...aidSearchState, query, page: 1 });
  };

  const removeQuery = (e, q) => {
    const query = aidSearchState.query.filter((el) => el.id !== q.id);
    setAidSearchState({ ...aidSearchState, query, page: 1 });
  };

  const handleChangeLocation = (v) => {
    if (v !== '') {
      queryLocation(v);
    }
  };

  const queryLocation = useCallback(
    debounce((query) => dispatch(getGeographicalDepartments(work.id, query, apiPrefix)), 1000),
    []
  );

  const selectedLocation = (e, v) => {
    const l = typeof v === 'undefined' || v === null ? '' : v;

    setAidSearchState({
      ...aidSearchState,
      zone: l === '' ? l : l.id_ter,
      zoneLabel: l === '' ? l : l.ter_libelle,
      page: 1
    });
  };

  const selectedPage = (e, p) => setAidSearchState({ ...aidSearchState, page: p });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handlePrevPage = (e) => {
    const prevPage = aidSearchState.page - 1 <= 0 ? 1 : aidSearchState.page - 1;
    selectedPage(e, prevPage);
  };

  const handleNextPage = (e) => selectedPage(e, aidSearchState.page + 1);

  const handleDrawerToggleKeywordSearch = () => setMobileOpenKeywordSearch(!mobileOpenKeywordSearch);

  const renderDrawer = () => (
    <Grid item xs={12} lg={12} sx={{ backgroundColor: '#fff' }}>
      <Stack spacing={2} sx={{ mt: '20px' }}>
        <Stack>
          <Box
            sx={{
              pt: 2,
              pb: 2,
              borderBottom: '1px solid #DDD'
            }}
          >
            <Typography variant="subtitle1" align="center">
              Financement par
            </Typography>
          </Box>
        </Stack>
        <Stack>
          <Button
            className={classes.query_options}
            onClick={(e) => {
              showIndex(e, 'projects');
            }}
            startIcon={<Icon icon="ant-design:project-filled" />}
          >
            <span>Projet</span>
            <ExpandMoreIcon />
          </Button>
          {aidSearchState.selectedIndex === 'projects' && (
            <Scrollbar sx={{ height: '400px' }}>
              <Projects
                projects={projects}
                displayProjectCategories={displayProjectCategories}
                selectedProject={aidSearchState.selectedProject}
                appendQuery={appendQuery}
              />
            </Scrollbar>
          )}
        </Stack>
        <Stack>
          <Button
            className={classes.query_options}
            onClick={(e) => {
              showIndex(e, 'profiles');
            }}
            startIcon={<Icon icon="carbon:user-profile-alt" />}
          >
            <span>Profil</span>
            <ExpandMoreIcon />
          </Button>

          {aidSearchState.selectedIndex === 'profiles' && <Profiles profiles={profiles} appendQuery={appendQuery} />}
        </Stack>
        <Stack>
          <Button
            className={classes.query_options}
            onClick={(e) => {
              showIndex(e, 'nature_of_financing');
            }}
            startIcon={<Icon icon="iconoir:plug-type-l" />}
          >
            <span>Nature de l'aide</span>
            <ExpandMoreIcon />
          </Button>
          {aidSearchState.selectedIndex === 'nature_of_financing' && (
            <FinanceNature natureOfFinancing={natureOfFinancing} appendQuery={appendQuery} />
          )}
        </Stack>
        <Stack>
          <Button
            className={classes.query_options}
            onClick={(e) => {
              showIndex(e, 'aid_restrictions');
            }}
            startIcon={<Icon icon="carbon:skill-level-advanced" />}
          >
            <span>Niveau</span>
            <ExpandMoreIcon />
          </Button>
          {aidSearchState.selectedIndex === 'aid_restrictions' && (
            <AidRestrictionZone aidZone={aidZone} appendQuery={appendQuery} />
          )}
        </Stack>
        <Stack>
          <Button
            className={classes.query_options}
            onClick={(e) => {
              showIndex(e, 'financing');
            }}
            startIcon={<Icon icon="icon-park-twotone:financing" />}
          >
            <span>Financeur</span>
            <ExpandMoreIcon />
          </Button>
          {aidSearchState.selectedIndex === 'financing' && (
            <Menu
              id="simple-menu"
              anchorEl={aidSearchState.anchorEl}
              keepMounted
              open={Boolean(aidSearchState.anchorEl)}
              onClose={handleCloseFinancers}
            >
              {financers.map((f, i) => (
                <MenuItem
                  key={i}
                  onClick={(e) => {
                    selectFinancer(e, f);
                  }}
                >
                  {f.org_nom}
                </MenuItem>
              ))}
            </Menu>
          )}
        </Stack>
      </Stack>
    </Grid>
  );

  const renderKeywordSearch = () => (
    <Card elevation={6} sx={{ backgroundColor: '#fff', mt: '20px', width: 'calc(100% - 10px)' }}>
      <Stack spacing={2} direction={isMobileMd ? 'column' : 'row'}>
        <Typography sx={{ p: 2 }} variant="subtitle1">
          Keywords
        </Typography>
        <Divider orientation="vertical" sx={{ height: '55px', backgroundColor: theme.palette.background.neutral }} />
        <div className={classes.layered_filters_wrap}>
          <div className={classes.current_filters}>
            <ul
              style={{
                listStyle: 'none',
                flex: '1 1 auto'
              }}
            >
              {aidSearchState.query.length > 0 && (
                <>
                  {aidSearchState.query.map((q, i) => (
                    <li className={classes.filter} key={i}>
                      <Button
                        onClick={(e) => {
                          removeQuery(e, q);
                        }}
                        variant="outlined"
                        color="info"
                        endIcon={<CloseIcon />}
                        sx={{ pt: '1px', pb: '1px', fontSize: '0.7rem' }}
                      >
                        {q.name}
                      </Button>
                    </li>
                  ))}
                </>
              )}
              {aidSearchState.zone && (
                <li className={classes.filter}>
                  <Button
                    onClick={(e) => {
                      setAidSearchState({ ...aidSearchState, zone: '', zoneLabel: '' });
                    }}
                    variant="outlined"
                    color="info"
                    endIcon={<CloseIcon />}
                    sx={{ pt: '1px', pb: '1px', fontSize: '0.7rem' }}
                  >
                    {aidSearchState.zoneLabel}
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Stack>
    </Card>
  );
  const renderKeywordSearchMobile = () => (
    <Stack spacing={2} direction="column">
      <Typography sx={{ p: 2, color: '#fff' }} variant="subtitle1">
        Keywords
      </Typography>
      <div className={classes.layered_filters_wrap}>
        <div className={classes.current_filters}>
          <ul
            style={{
              listStyle: 'none',
              flex: '1 1 auto'
            }}
          >
            {aidSearchState.query.length > 0 && (
              <>
                {aidSearchState.query.map((q, i) => (
                  <li className={classes.filter} key={i}>
                    <Button
                      onClick={(e) => {
                        removeQuery(e, q);
                      }}
                      variant="outlined"
                      color="info"
                      endIcon={<CloseIcon />}
                      sx={{ pt: '1px', pb: '1px', fontSize: '0.7rem' }}
                    >
                      {q.name}
                    </Button>
                  </li>
                ))}
              </>
            )}
            {aidSearchState.zone && (
              <li className={classes.filter}>
                <Button
                  onClick={(e) => {
                    setAidSearchState({ ...aidSearchState, zone: '', zoneLabel: '' });
                  }}
                  variant="outlined"
                  color="info"
                  endIcon={<CloseIcon />}
                  sx={{ pt: '1px', pb: '1px', fontSize: '0.7rem' }}
                >
                  {aidSearchState.zoneLabel}
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Stack>
  );

  useEffect(() => {
    if (aidSearchState.query.length > 0) {
      dispatch(startLoading());
      dispatch(getFinancialAid(work.id, aidSearchState.query, 0, aidSearchState.zone, apiPrefix));
    } else {
      dispatch(clearFinancialAid());
    }
  }, [aidSearchState.query]);

  useEffect(() => {
    dispatch(filterFinancialAid(work.id, aidSearchState.query, 0, aidSearchState.zone, apiPrefix));
  }, [aidSearchState.zone]);

  useEffect(() => {
    dispatch(startLoading());
    dispatch(getFinancialAid(work.id, aidSearchState.query, aidSearchState.page - 1, aidSearchState.zone, apiPrefix));
  }, [aidSearchState.page]);

  return (
    <Page title="Aides Financement | Guidhub">
      <Stack
        spacing={2}
        sx={{
          backgroundColor: '#D8E9E7',
          bottom: '0px',
          top: '54px',
          right: '0px',
          [theme.breakpoints.up('lg')]: {
            // left: 280
            left: 66
          },
          [theme.breakpoints.down('lg')]: {
            left: 0
          },
          position: 'fixed'
        }}
      >
        <MHidden width="mdUp">
          <Drawer
            anchor="right"
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                [theme.breakpoints.down('md')]: { marginTop: '54px' },
                // marginTop: '116px',
                marginTop: '54px',
                height: '100%',
                backgroundColor: 'rgb(0, 30, 60)',
                borderColor: 'rgba(30, 73, 118, 0.7)',
                backgroundImage: `radial-gradient(at 51% 52%, rgba(19, 47, 76, 0.5) 0px, transparent 50%),
               radial-gradient(at 80% 0%, rgb(19, 47, 76) 0px, transparent 50%),
                radial-gradient(at 0% 95%, rgb(19, 47, 76) 0px, transparent 50%),
               radial-gradient(at 0% 5%, rgb(19, 47, 76) 0px, transparent 25%),
                radial-gradient(at 93% 85%, rgba(30, 73, 118, 0.8) 0px, transparent 50%),
                 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }
            }}
          >
            {renderDrawer()}
          </Drawer>
        </MHidden>
        <Card
          sx={{
            [theme.breakpoints.up('md')]: { display: 'flex' },
            backgroundColor: 'rgba(145, 158, 171, 0.12)',
            height: '100%',
            borderRadius: '0px'
          }}
        >
          <MHidden width="mdDown">
            <Stack spacing={2} sx={{ mt: '20px', ml: '10px', mb: '10px', backgroundColor: '#fff' }}>
              <Stack>
                <Box
                  sx={{
                    pt: 2,
                    pb: 2,
                    borderBottom: '1px solid #DDD'
                  }}
                >
                  <Typography variant="subtitle1" align="center">
                    Financement par
                  </Typography>
                </Box>
              </Stack>
              <Stack>
                <Button
                  className={classes.query_options}
                  onClick={(e) => {
                    showIndex(e, 'projects');
                  }}
                  startIcon={<Icon icon="ant-design:project-filled" />}
                >
                  <span>Projet</span>
                  <ExpandMoreIcon />
                </Button>
                {aidSearchState.selectedIndex === 'projects' && (
                  <Scrollbar sx={{ height: '400px' }}>
                    <Projects
                      projects={projects}
                      displayProjectCategories={displayProjectCategories}
                      selectedProject={aidSearchState.selectedProject}
                      appendQuery={appendQuery}
                    />
                  </Scrollbar>
                )}
              </Stack>
              <Stack>
                <Button
                  className={classes.query_options}
                  onClick={(e) => {
                    showIndex(e, 'profiles');
                  }}
                  startIcon={<Icon icon="carbon:user-profile-alt" />}
                >
                  <span>Profil</span>
                  <ExpandMoreIcon />
                </Button>

                {aidSearchState.selectedIndex === 'profiles' && (
                  <Profiles profiles={profiles} appendQuery={appendQuery} />
                )}
              </Stack>
              <Stack>
                <Button
                  className={classes.query_options}
                  onClick={(e) => {
                    showIndex(e, 'nature_of_financing');
                  }}
                  startIcon={<Icon icon="iconoir:plug-type-l" />}
                >
                  <span>Nature de l'aide</span>
                  <ExpandMoreIcon />
                </Button>
                {aidSearchState.selectedIndex === 'nature_of_financing' && (
                  <FinanceNature natureOfFinancing={natureOfFinancing} appendQuery={appendQuery} />
                )}
              </Stack>
              <Stack>
                <Button
                  className={classes.query_options}
                  onClick={(e) => {
                    showIndex(e, 'aid_restrictions');
                  }}
                  startIcon={<Icon icon="carbon:skill-level-advanced" />}
                >
                  <span>Niveau</span>
                  <ExpandMoreIcon />
                </Button>
                {aidSearchState.selectedIndex === 'aid_restrictions' && (
                  <AidRestrictionZone aidZone={aidZone} appendQuery={appendQuery} />
                )}
              </Stack>
              <Stack>
                <Button
                  className={classes.query_options}
                  onClick={(e) => {
                    showIndex(e, 'financing');
                  }}
                  startIcon={<Icon icon="icon-park-twotone:financing" />}
                >
                  <span>Financeur</span>
                  <ExpandMoreIcon />
                </Button>
                {aidSearchState.selectedIndex === 'financing' && (
                  <Menu
                    id="simple-menu"
                    anchorEl={aidSearchState.anchorEl}
                    keepMounted
                    open={Boolean(aidSearchState.anchorEl)}
                    onClose={handleCloseFinancers}
                  >
                    {financers.map((f, i) => (
                      <MenuItem
                        key={i}
                        onClick={(e) => {
                          selectFinancer(e, f);
                        }}
                      >
                        {f.org_nom}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Stack>
            </Stack>
          </MHidden>
          <MHidden width="mdUp">
            <Drawer
              anchor="right"
              variant="temporary"
              open={mobileOpenKeywordSearch}
              onClose={handleDrawerToggleKeywordSearch}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  [theme.breakpoints.down('md')]: { marginTop: '54px' },
                  // marginTop: '116px',
                  marginTop: '54px',
                  height: '100%',
                  backgroundColor: 'rgb(0, 30, 60)',
                  borderColor: 'rgba(30, 73, 118, 0.7)',
                  backgroundImage: `radial-gradient(at 51% 52%, rgba(19, 47, 76, 0.5) 0px, transparent 50%),
               radial-gradient(at 80% 0%, rgb(19, 47, 76) 0px, transparent 50%),
                radial-gradient(at 0% 95%, rgb(19, 47, 76) 0px, transparent 50%),
               radial-gradient(at 0% 5%, rgb(19, 47, 76) 0px, transparent 25%),
                radial-gradient(at 93% 85%, rgba(30, 73, 118, 0.8) 0px, transparent 50%),
                 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }
              }}
            >
              {renderKeywordSearchMobile()}
            </Drawer>
          </MHidden>
          {aidCount > 0 && (
            <Box sx={{ [theme.breakpoints.up('md')]: { ml: '15px' }, flexGrow: 1 }}>
              <MHidden width="mdDown">{renderKeywordSearch()}</MHidden>

              <AidResponse
                zone={aidSearchState.zone}
                aidResources={aidResources}
                aidCount={aidCount}
                pageCount={Math.ceil(aidCount / 10)}
                selectedPage={selectedPage}
                page={aidSearchState.page}
                handleChangeLocation={handleChangeLocation}
                geographicalDepartments={geographicalDepartments}
                selectedLocation={selectedLocation}
                queryLocation={queryLocation}
              />
            </Box>
          )}
        </Card>
        <MHidden width="mdUp">
          <Box>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction value={1} onClick={handleDrawerToggle} label="Menu" icon={<MenuIcon />} />
              <BottomNavigationAction label="précédente" onClick={handlePrevPage} icon={<ChevronLeftIcon />} />
              <BottomNavigationAction label="suivante" onClick={handleNextPage} icon={<NavigateNextIcon />} />
              <BottomNavigationAction
                label="Mots clés"
                onClick={handleDrawerToggleKeywordSearch}
                icon={<FilterListIcon />}
              />
            </BottomNavigation>
          </Box>
        </MHidden>
      </Stack>
    </Page>
  );
}
