import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { formatDistance, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Grid,
  Box,
  Typography,
  Pagination,
  Select,
  Stack,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
  InputLabel,
  ButtonGroup,
  Divider,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  CircularProgress,
  LinearProgress,
  useMediaQuery
} from '@mui/material';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { makeStyles } from '@mui/styles';
import Scrollbar from '../../../Scrollbar';
import { useSelector, useDispatch } from '../../../../redux/store';
import { getAid } from '../../../../redux/slices/finance';
import LoadingScreen from '../../../LoadingScreen';
import { dateIsValid } from '../../../../utils/formatNumber';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const ITEM_HEIGHT = 94;
const useStyles = makeStyles({
  layered_filters: {
    // "backgroundColor": blue[100],
    // "backgroundColor": "#335f78",
    backgroundColor: '#ffffff'
  },
  layered_filter_open: {
    'list-style': 'none'
  },
  layered_filters_wrap: {
    'padding-left': '10px',
    'padding-right': '10px',
    'max-width': '1200px',
    'margin-left': 'auto',
    'margin-right': 'auto'
  },
  layered_filter_facet: {
    'margin-bottom': '10px'
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
    'margin-right': '10px',
    'margin-bottom': '10px'
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
    'border-right': '1px solid #DDD',
    borderRadius: '0'
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
    'align-items': 'center',
    height: '25px'
  },
  location_input: {
    margin: '0 0 0px 5px',
    font: 'inherit',
    'max-width': 'calc(100% - 21px)',
    border: '0',
    display: 'block',
    'padding-top': '2px',
    'padding-left': '0',
    height: '20px',
    color: '#111',
    'vertical-align': 'middle',
    'font-size': '14px'
  },
  result_header_container: {
    'padding-left': '35px',
    'padding-right': '35px',
    background: 'white'
  },
  result_header: {
    'border-bottom': '1px solid #DDD',
    'border-top': '1px solid #DDD'
  },
  result_header_title: {
    padding: '1em 0',
    'text-align': 'left',
    margin: '0 0 0.5em 0',
    'font-size': '1.5em',
    'font-weight': '700',
    'border-bottom': '0'
  },
  result_header_meta: {
    'padding-left': '25px',
    height: '100%',
    '@media (min-width: 768px)': {
      'padding-top': '0px',
      'padding-left': '5px',
      'padding-right': '5px',
      '-webkit-align-items': 'center',
      '-ms-flex-align': 'center',
      'align-items': 'center'
    }
  },
  result_count: {
    'margin-bottom': '0',
    'font-size': '0.85em',
    padding: '34px 3px',
    'text-align': 'center'
  },
  aid_description: {
    paddingTop: '0px',
    padding: '10px 23px',
    'text-align': 'justify'
  },
  aid_details: {
    '&:hover': {
      background: '#efefef',
      'text-decoration': 'none !important',
      color: '#0a3055',
      cursor: 'pointer'
    }
  },
  logo: {
    'margin-left': 'auto',
    'margin-right': 'auto',
    display: 'block',
    borderRadius: '40px',
    border: '1px solid #fff'
  },
  load_more_btn: {
    backgroundColor: '#fe6113',
    color: '#FFF'
  },
  outer_container: {
    backgroundColor: '#efefef'
  },
  nav: {
    'padding-top': '2rem',
    'margin-left': '3rem'
  },
  page_title: {
    'text-align': 'left',
    padding: '0.8em 0 0.8em 0px',
    'border-bottom': '1px solid #DDD'
  },
  block_content: {
    'margin-bottom': '0px',
    'padding-bottom': '15px',
    color: '#333',
    'font-size': '0.95em',
    'line-height': '1.4em',
    float: 'left',
    width: '100%'
  },
  title: {
    'font-size': '1.2em',
    'font-weight': '600',
    'line-height': '1.4em',
    color: '#0c3b65',
    padding: '10px 5px',
    background: '#F5F5F5',
    'margin-bottom': '10px'
  },
  description: {
    'padding-right': '10px'
  },
  title_right_side: {
    'border-bottom': '1px solid #DDD',
    padding: '20px 20px',
    'margin-bottom': '0',
    'align-items': 'center',
    'font-size': '1.6em'
  },
  right_block_content: {
    'border-bottom': '1px solid #DDD',
    padding: '20px 20px',
    'margin-bottom': '0'
  },
  contact_item: {
    'padding-top': '20px',
    'padding-bottom': '12px'
  },
  contact_info_item_address: {
    'padding-bottom': '15px'
  },
  contact_info_item_tel: {
    'margin-bottom': '0',
    'font-size': '0.9em',
    'line-height': '1.4em'
  },
  aid_name: {
    'font-size': '1.05em',
    'line-height': '1.4em',
    'padding-right': '5px',
    'font-weight': '900'
  },
  icon_expired_aid: {
    color: '#f44336',
    display: 'flex',
    opacity: '0.9',
    padding: '7px 0',
    'font-size': '22px',
    'margin-right': '12px'
  },
  expired_aid_message: {
    padding: '8px 0',
    color: 'rgb(97, 26, 21)',
    backgroundColor: 'rgb(253, 236, 234)'
  },
  aid_footer: {
    'margin-top': '3rem'
  },
  aid_update: {
    color: '#0c3b65',
    'font-size': '1.2em'
  }
});

// ----------------------------------------------------------------------

AidResponse.propTypes = {
  zone: PropTypes.string,
  aidResources: PropTypes.array.isRequired,
  aidCount: PropTypes.string.isRequired,
  pageCount: PropTypes.number.isRequired,
  selectedPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  handleChangeLocation: PropTypes.func.isRequired,
  geographicalDepartments: PropTypes.array.isRequired,
  selectedLocation: PropTypes.func.isRequired,
  queryLocation: PropTypes.func.isRequired
};

export default function AidResponse({
  zone,
  aidResources,
  aidCount,
  pageCount,
  selectedPage,
  page,
  handleChangeLocation,
  geographicalDepartments,
  selectedLocation,
  queryLocation
}) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobileMd = useMediaQuery(theme.breakpoints.down('md'));
  const [showAid, setShowAid] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({});
  const [aidObj, setAidObj] = useState({});

  const { isLoading, aid, isFiltering } = useSelector((state) => state.finance);
  const { work } = useSelector((state) => state.project);
  const handleSelectChange = (evt) => {
    const contact = contacts.find((c) => c.value === evt.target.value);
    setContact(contact);
  };

  const handleGetAid = (id) => {
    dispatch(getAid(work.id, id, apiPrefix));
    setShowAid(true);
  };

  useEffect(() => {
    if (aid.aid && typeof aid.aid !== 'undefined' && aid.aid.contact) {
      setAidObj(aid.aid);
      setContacts(aid.aid.contact.map((c) => ({ ...c, label: c.cnt_nom, value: c.cnt_nom })));
    }
  }, [aid.aid]);

  return (
    <>
      {!isMobileMd && (
        <div style={{ margin: '20px', padding: '20px', background: '#fff' }}>
          <Pagination count={pageCount} color="primary" onChange={selectedPage} page={page} />
        </div>
      )}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack spacing={2} sx={{ m: 1 }}>
          <Box sx={{ [theme.breakpoints.up('md')]: { mt: 2, mb: 4 }, display: 'flex' }}>
            {!isMobileMd && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <span>
                  <strong>{aidCount} Aides</strong> correspondent à votre recherche
                </span>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Autocomplete
                fullWidth
                loading
                loadingText={<CircularProgress size={12} color="info" />}
                multiple
                id="tags-outlined"
                options={geographicalDepartments}
                onInputChange={(e, v) => handleChangeLocation(v)}
                getOptionLabel={(option) => option.ter_libelle}
                filterSelectedOptions
                onChange={(option, value) => {
                  value.map((v) => selectedLocation(option, v));
                }}
                renderInput={(params) => <TextField {...params} label="Filtrer par : Localisation" />}
              />
            </Box>
          </Box>
          {isFiltering ? (
            <Box sx={{ width: '100%' }}>
              <LinearProgress color="info" />
            </Box>
          ) : (
            geographicalDepartments.length > 0 && (
              <Box sx={{ mt: 2, mb: 4, display: 'flex' }}>
                <ButtonGroup orientation="horizontal" variant="contained">
                  {geographicalDepartments.map((l, i) => (
                    <Button
                      key={i}
                      onClick={(e) => {
                        selectedLocation(e, l);
                      }}
                      sx={{ fontSize: '0.4rem' }}
                    >
                      {l.ter_libelle}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            )
          )}
          <Scrollbar
            sx={{
              height: 94 * 10
              // [theme.breakpoints.up('lg')]: {
              //   height: 94 * 10
              // },
              // [theme.breakpoints.down('lg')]: { height: 98 * 10 }
              // [theme.breakpoints.down('md')]: { height: 270 * 10 },
              // [theme.breakpoints.down('sm')]: { height: 360 * 10 }
            }}
          >
            {/* {aidResources.slice((page - 1) * 10, page * 10).map((aid, i) => ( */}
            {aidResources.map((aid, i) => (
              <div
                key={i}
                className={classes.aid_details}
                style={{
                  margin: '10px',
                  textDecoration: 'none',
                  borderRadius: '40px',
                  color: theme.palette.info.light
                }}
                onClick={() => {
                  handleGetAid(aid.id_aid);
                }}
                onKeyPress={() => {
                  handleGetAid(aid.id_aid);
                }}
                role="button"
                tabIndex={0}
              >
                <Grid
                  container
                  className={classes.aid_details}
                  sx={{
                    // [theme.breakpoints.up('md')]: { m: 1 },
                    backgroundColor: '#fff',
                    padding: '24px 24px',
                    borderRadius: '10px',
                    border: '1px solid #fff'
                  }}
                >
                  <Grid item md={2}>
                    <Box
                      sx={{
                        borderRadius: '40px',
                        border: '1px solid #ccc',
                        background: '#fff'
                      }}
                    >
                      {aid.cache_indexation &&
                        aid.cache_indexation.financeurs &&
                        aid.cache_indexation.financeurs[0] &&
                        aid.cache_indexation.financeurs[0].id_file && (
                          <img
                            alt=""
                            src={`https://aides-entreprises.fr/logos/thumbs/${aid.cache_indexation.financeurs[0].id_file}`}
                            className={classes.logo}
                          />
                        )}
                      {/*  */}
                    </Box>
                  </Grid>
                  <Grid item md={10}>
                    <Box
                      style={{
                        height: '100%'
                      }}
                    >
                      <h4
                        className={classes.aid_description}
                        dangerouslySetInnerHTML={{
                          __html: aid.aid_nom
                        }}
                        style={{
                          color: theme.palette.text.primary
                        }}
                      />
                      <Box
                        style={{
                          padding: '0px 23px'
                        }}
                      >
                        <Box
                          m={1}
                          sx={{
                            padding: '5px 15px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: '1px solid',
                            color: theme.palette.primary.main
                          }}
                        >
                          <Typography variant="body1">
                            Date fin:{' '}
                            {dateIsValid(new Date(aid.date_fin)) ? (
                              <strong style={{ color: theme.palette.info.dark }}>
                                {formatDistance(subDays(new Date(aid.date_fin), 3), new Date(), {
                                  addSuffix: true,
                                  locale: fr
                                })}{' '}
                              </strong>
                            ) : (
                              '-'
                            )}
                          </Typography>
                        </Box>
                        <Box
                          m={1}
                          sx={{
                            padding: '5px 15px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: '1px solid',
                            color: theme.palette.primary.dark
                          }}
                        >
                          <Typography variant="subtitle1">
                            effectif: <strong style={{ color: theme.palette.info.dark }}>{aid.effectif}</strong>
                          </Typography>
                        </Box>
                        <Box
                          m={1}
                          sx={{
                            padding: '5px 15px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: '1px solid',
                            color: theme.palette.primary.light
                          }}
                        >
                          <Typography variant="subtitle1">
                            age entreprise:{' '}
                            <strong style={{ color: theme.palette.info.dark }}>{aid.age_entreprise}</strong>
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        component="div"
                        className={classes.aid_description}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: aid.aid_objet
                          }}
                        />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Scrollbar>
        </Stack>
      )}

      <Dialog
        open={showAid}
        maxWidth="lg"
        onClose={() => {
          setShowAid(false);
        }}
        fullWidth
      >
        <DialogContent>
          <div className={classes.outer_container}>
            <div
              style={{
                backgroundColor: '#ffffff',
                marginTop: '4rem',
                paddingLeft: '5px',
                paddingRight: '5px'
              }}
            >
              <div className={classes.root}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    md={8}
                    style={{
                      borderRight: '1px solid #DDD'
                    }}
                  >
                    <div className={classes.page_title}>
                      <h1 className={classes.aid_name}>{aidObj.aid_nom}</h1>
                      {aidObj.status === 0 && (
                        <>
                          <div className={classes.icon_expired_aid}>
                            <ErrorOutlineIcon />
                          </div>
                          <div className={classes.expired_aid_message}> Status de l’aide : supprimé</div>
                        </>
                      )}
                      {aidObj.status === 2 && (
                        <>
                          <div className={classes.icon_expired_aid}>
                            <ErrorOutlineIcon />
                          </div>
                          <div className={classes.expired_aid_message}>
                            {' '}
                            Status de l’aide : désactivée ou en cours de rédaction
                          </div>
                        </>
                      )}
                    </div>
                    <article>
                      <h3 className={classes.title}>Objectifs</h3>
                      <div className={classes.description}>
                        <p dangerouslySetInnerHTML={{ __html: aidObj.aid_objet }} />
                      </div>
                    </article>
                    <article>
                      <h3 className={classes.title}>Opérations éligibles</h3>
                      <div
                        className={classes.description}
                        dangerouslySetInnerHTML={{
                          __html: aidObj.aid_operations_el
                        }}
                      />
                    </article>
                    <article>
                      <h3 className={classes.title}>Bénéficiaire</h3>
                      <div
                        className={classes.description}
                        dangerouslySetInnerHTML={{
                          __html: aidObj.aid_benef
                        }}
                      />
                    </article>
                    <article>
                      <h3 className={classes.title}>Montant</h3>
                      <div
                        className={classes.description}
                        dangerouslySetInnerHTML={{
                          __html: aidObj.aid_montant
                        }}
                      />
                    </article>
                    <article>
                      <h3 className={classes.title}>Conditions</h3>
                      <div
                        className={classes.description}
                        dangerouslySetInnerHTML={{
                          __html: aidObj.aid_conditions
                        }}
                      />
                    </article>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <aside>
                      <h3 className={classes.title_right_side}>
                        <span>Financeur</span>
                      </h3>
                      {aidObj.financeurs &&
                        aidObj.financeurs.map((f) => (
                          <div className={classes.right_block_content}>
                            <a target="_blank" href={f.org_site} rel="noreferrer">
                              <img
                                alt=""
                                src={`https://aides-entreprises.fr/logos/thumbs/${f.id_file}`}
                                className={classes.logo}
                              />
                            </a>
                            <p>- {f.org_nom}</p>
                          </div>
                        ))}
                    </aside>
                    <aside>
                      <h3 className={classes.title_right_side}>
                        <span>Contact</span>
                      </h3>
                      <div>
                        <InputLabel>Choisir une région</InputLabel>
                        <Select
                          value={contact.value}
                          onChange={handleSelectChange}
                          label="Choisir une région"
                          sx={{ width: '100%' }}
                        >
                          {contacts.map((contact, i) => (
                            <MenuItem key={i} value={contact.value}>
                              {contact.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </aside>
                    {Object.keys(contact).length !== 0 && (
                      <div className={classes.right_block_content}>
                        <div className={classes.contact_item}>
                          <p>
                            <span>{contact.cnt_nom}</span>
                            <br />
                            <span>Service : </span>
                            <span>{contact.cnt_service}</span>
                          </p>
                          <address className={classes.contact_info_item_address}>
                            {contact.cnt_rue} - {contact.cnt_cp} {contact.cnt_ville}
                          </address>
                          <p className={classes.contact_info_item_tel}>
                            <strong>Tel : </strong>
                            <span>{contact.cnt_telephone}</span>
                          </p>
                          <p className={classes.contact_info_item_site}>
                            <a target="_blank" href={contact.cnt_site} rel="noreferrer">
                              {contact.cnt_site}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    <aside>
                      <h3 className={classes.title_right_side}>
                        <span>Source de l'information</span>
                      </h3>
                      <div className={classes.right_block_content}>
                        <ul>
                          {aidObj.complements &&
                            aidObj.complements.source &&
                            aidObj.complements.source.map((s, i) => (
                              <li key={i}>
                                {s.texte}
                                <br />
                                <p>
                                  <a href={s.lien} target="_blank" rel="noreferrer">
                                    &gt; cliquer ici
                                  </a>
                                </p>
                                <p>&nbsp;</p>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </aside>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <div className={classes.aid_footer}>
                      <p className={classes.aid_update}>
                        Mise à jour le <span>{aidObj.horodatage}</span>
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAid(false);
            }}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
