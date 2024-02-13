import * as Yup from 'yup';
import { Box, FormHelperText, MenuItem, Select, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MobileStepper from '@mui/material/MobileStepper';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import React, { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Form, FormikProvider, useFormik } from 'formik';
import { Button as TestButton } from '@mui/joy';
import Label from '../../Label';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 400,
    flexGrow: 1,
    width: '100%'
  },
  root_questionnaire: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%'
      // height: theme.spacing(16),
    }
  },
  guide_objective: {
    fontSize: '1.4rem',
    fontWeight: '900'
  },
  formControl: {
    // margin: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0)
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  },
  mobile_container: {
    '@media (max-width: 480px)': {
      marginLeft: '0',
      marginRight: '0',
      paddingLeft: '0',
      paddingRight: '0'
    }
  },
  approximatif_text: {
    color: '#2d2d2d',
    fontSize: '1.4rem',
    fontWeight: '900'
  },
  access_details_secondary: {
    color: '#fff',
    'font-size': '1.3rem',
    padding: '0.5rem 1.5rem',
    'background-color': '#2578a1',
    'border-color': '#2578a1',
    '&:active': {
      'background-color': '#2578a1ba !important',
      'border-color': '#2578a1 !important'
    },
    '&:hover': {
      'background-color': '#2578a1ba',
      'border-color': '#2578a1'
    }
  },
  btn_text: {
    'margin-top': '1rem',
    'font-size': '1.2rem'
  },
  display_score: { 'flex-grow': 2, 'align-self': 'center' },
  smiley_face_container: {
    'flex-grow': 4,
    'align-self': 'center'
  },
  access_details: {
    color: '#fff',
    'font-size': '1.3rem',
    padding: '0.5rem 1.5rem',
    'border-color': '#FE6320',
    'background-color': '#FE6320',
    '&:active': {
      'background-color': '#fe6320bd !important',
      'border-color': '#FE6320 !important'
    },
    '&:hover': {
      'border-color': '#FE6320',
      'background-color': '#fe6320bd'
    }
  },
  listed_points: {
    'font-size': '1.2rem',
    color: '#2d2d2d',
    margin: '12px 12px',
    'text-align': 'left'
  },
  selected_icon: {
    position: 'absolute',
    top: '14px',
    right: '0px',
    width: '30px',
    height: '30px',
    'box-shadow': '0px 10px 13px -7px #3a9134, 5px 5px 15px 5px rgb(0 0 0 / 0%)',
    'z-index': '1000',
    'font-size': '1.25rem',
    'align-items': 'center',
    'flex-shrink': '0',
    'border-radius': '50%',
    background: 'white',
    'justify-content': 'center'
  },
  MuiListItem: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'flex-start',
    'padding-left': '16px',
    'padding-right': '16px',
    'padding-top': '8px',
    'padding-bottom': '8px'
  }
}));

const nameStepMapping = {
  legal_status_idea: 0,
  company_vat_regime: 1,
  micro_entreprise_declare_pay_cotisations: 2,
  micro_entreprise_accre_exemption: 3,
  micro_entreprise_activity_category: 4
};

MicroEntrepriseTest.propTypes = {
  legalFormalities: PropTypes.object.isRequired
};

export default function MicroEntrepriseTest({ legalFormalities }) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [helperText, setHelperText] = useState('');
  const [activityInfoRequired, setActivityInfoRequired] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const c = prevActiveStep + 1;
      return c;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const c = prevActiveStep - 1;
      return c;
    });
  };

  useEffect(() => {
    if (['Autre activité commerciale', 'Autre activité artisanale', 'Start-up'].includes(legalFormalities.sector)) {
      setActivityInfoRequired(true);
    }
  }, []);

  const NewMicroTestSchema = Yup.object().shape({
    legal_status_idea: Yup.string().required(''),
    company_vat_regime: Yup.string().required(''),
    micro_entreprise_declare_pay_cotisations: Yup.string().required(''),
    micro_entreprise_accre_exemption: Yup.string().required(''),
    micro_entreprise_activity_category: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      legal_status_idea: legalFormalities.legal_status_idea || '',
      company_vat_regime: legalFormalities.company_vat_regime || '',
      micro_entreprise_declare_pay_cotisations: legalFormalities.micro_entreprise_declare_pay_cotisations || '',
      micro_entreprise_accre_exemption: legalFormalities.micro_entreprise_accre_exemption || '',
      micro_entreprise_activity_category: legalFormalities.micro_entreprise_activity_category || ''
    },
    validationSchema: NewMicroTestSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = submitTest();
        if (payload) {
          legalFormalities.runTestPayload(payload);
        }
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const submitTest = () => {
    const missing = Object.keys(values).filter((f) => values[f] === '');
    const i = missing.indexOf('micro_entreprise_activity_category');
    if (i > -1) {
      if (activityInfoRequired) {
        setActiveStep(nameStepMapping.micro_entreprise_activity_category);
        setHelperText('Tous les champs doivent être sélectionnés.');
        return null;
      }
      missing.splice(i, 1);
    }

    if (missing.length > 0) {
      const k = missing[0];
      setActiveStep(nameStepMapping[k]);
      setHelperText('Tous les champs doivent être sélectionnés.');
      return null;
    }

    const data = {
      social_security_scheme: 'Régime micro-social',
      tax_system: 'Micro-entreprise',
      ...values
    };
    return data;
  };

  const handleChange = (options) => (event) => {
    setFieldValue(options.name, options.value);
    setHelperText('');
  };

  const handleSelect = (name) => (event) => {
    setFieldValue(name, event.target.value);
    setHelperText('');
  };

  return (
    <>
      {errors && Object.keys(errors).length > 0 && (
        <Box
          sx={{
            mt: 6,
            [theme.breakpoints.down('md')]: { mt: 0 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Label
            variant="filled"
            color="error"
            sx={{
              textTransform: 'uppercase',
              width: '100%',
              height: '40px',
              borderRadius: 0
            }}
          >
            Tous les champs doivent être sélectionnés.
          </Label>
        </Box>
      )}
      <FormikProvider value={formik}>
        <Form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{
            marginTop: '70px',
            [theme.breakpoints.down('md')]: { marginTop: '10px' }
          }}
        >
          <div className={classes.root_questionnaire}>
            {activeStep === 0 && (
              <Typography
                sx={{ color: 'common.white', typography: 'h5', [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' } }}
              >
                Quel est le statut juridique de votre micro-entreprise ?
              </Typography>
            )}
            {activeStep === 0 && (
              <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                <Grid
                  item
                  xs={5}
                  sm={5}
                  sx={{
                    position: 'relative'
                    // [theme.breakpoints.down('md')]: {pt: '0 !important'}
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={1}
                    p={1}
                    bgcolor="background.paper"
                    className={classes.mobile_container}
                    alignContent="center"
                    sx={{
                      flex: '1 1 0%',
                      [theme.breakpoints.up('md')]: { height: 200 },
                      [theme.breakpoints.down('md')]: { height: 100 },
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                      border: 'solid 1px #2272b7'
                    }}
                    onClick={handleChange({
                      name: 'legal_status_idea',
                      value: 'Entreprise individuelle'
                    })}
                  >
                    <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                      <Typography
                        sx={{
                          p: 2,
                          color: 'common.white',
                          typography: 'h5',
                          [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' }
                        }}
                      >
                        Entreprise individuelle
                      </Typography>
                    </Box>
                  </Box>
                  {values.legal_status_idea === 'Entreprise individuelle' && (
                    <CheckCircleOutlineIcon
                      className={classes.selected_icon}
                      style={{
                        color: 'green'
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={5}
                  sm={5}
                  sx={{
                    position: 'relative'
                    // [theme.breakpoints.down('md')]: { pt: '0 !important' }
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={1}
                    p={1}
                    bgcolor="background.paper"
                    className={classes.mobile_container}
                    alignContent="center"
                    sx={{
                      flex: '1 1 0%',
                      [theme.breakpoints.up('md')]: { height: 200 },
                      [theme.breakpoints.down('md')]: { height: 100 },
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                      border: 'solid 1px #2272b7'
                    }}
                    onClick={handleChange({
                      name: 'legal_status_idea',
                      value: 'EIRL'
                    })}
                  >
                    <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                      <Typography
                        className={classes.approximatif_amount}
                        variant="h4"
                        sx={{ p: 2, [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' } }}
                      >
                        EIRL
                      </Typography>
                    </Box>
                  </Box>
                  {values.legal_status_idea === 'EIRL' && (
                    <CheckCircleOutlineIcon
                      className={classes.selected_icon}
                      style={{
                        color: 'green'
                      }}
                    />
                  )}
                </Grid>
                <FormHelperText style={{ color: 'rgb(246 3 87)', fontSize: '1.2rem' }}>{helperText}</FormHelperText>
              </Grid>
            )}
            {activeStep === 1 && (
              <Typography
                sx={{ color: 'common.white', [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' } }}
                variant="h4"
              >
                Quel est le régime de TVA de votre micro-entreprise ?
              </Typography>
            )}
            {activeStep === 1 && (
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Régime de TVA</InputLabel>
                <Select
                  sx={{ color: '#fff' }}
                  value={values.company_vat_regime}
                  onChange={handleSelect('company_vat_regime')}
                  label="Régime de TVA de votre"
                >
                  <MenuItem value="Franchise en base de TVA">Franchise en base de TVA</MenuItem>
                  <MenuItem value="Réel simplifié">Réel simplifié</MenuItem>
                  <MenuItem value="Réel normal">Réel normal</MenuItem>
                </Select>
                <FormHelperText style={{ color: 'rgb(246 3 87)', fontSize: '1.2rem' }}>{helperText}</FormHelperText>
              </FormControl>
            )}
            {activeStep === 2 && (
              <Typography
                sx={{ color: 'common.white', [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' } }}
                variant="h4"
              >
                Comment souhaitez-vous déclarer et payer vos cotisations sociales ?
              </Typography>
            )}
            {activeStep === 2 && (
              <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                <Grid
                  item
                  xs={5}
                  sm={5}
                  sx={{
                    position: 'relative'
                    // [theme.breakpoints.down('md')]: { pt: '0 !important' }
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={1}
                    p={1}
                    bgcolor="background.paper"
                    className={classes.mobile_container}
                    alignContent="center"
                    sx={{
                      flex: '1 1 0%',
                      [theme.breakpoints.up('md')]: { height: 200 },
                      [theme.breakpoints.down('md')]: { height: 100 },
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                      border: 'solid 1px #2272b7'
                    }}
                    onClick={handleChange({
                      name: 'micro_entreprise_declare_pay_cotisations',
                      value: 'Mensuellement'
                    })}
                  >
                    <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                      <Typography
                        sx={{
                          color: 'common.white',
                          typography: 'h5',
                          [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' }
                        }}
                      >
                        Mensuellement
                      </Typography>
                    </Box>
                  </Box>
                  {values.micro_entreprise_declare_pay_cotisations === 'Mensuellement' && (
                    <CheckCircleOutlineIcon
                      className={classes.selected_icon}
                      style={{
                        color: 'green'
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={5}
                  sm={5}
                  sx={{
                    position: 'relative'
                    //  [theme.breakpoints.down('md')]: { padding: '0 !important' }
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={1}
                    p={1}
                    bgcolor="background.paper"
                    className={classes.mobile_container}
                    alignContent="center"
                    sx={{
                      flex: '1 1 0%',
                      [theme.breakpoints.up('md')]: { height: 200 },
                      [theme.breakpoints.down('md')]: { height: 100 },
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                      border: 'solid 1px #2272b7'
                    }}
                    onClick={handleChange({
                      name: 'micro_entreprise_declare_pay_cotisations',
                      value: 'Trimestriellement'
                    })}
                  >
                    <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                      <Typography
                        sx={{
                          color: 'common.white',
                          typography: 'h5',
                          [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' }
                        }}
                      >
                        Trimestriellement
                      </Typography>
                    </Box>
                  </Box>{' '}
                  {values.micro_entreprise_declare_pay_cotisations === 'Trimestriellement' && (
                    <CheckCircleOutlineIcon
                      className={classes.selected_icon}
                      style={{
                        color: 'green'
                      }}
                    />
                  )}
                </Grid>
                <FormHelperText style={{ color: 'rgb(246 3 87)', fontSize: '1.2rem' }}>{helperText}</FormHelperText>
              </Grid>
            )}
            {activeStep === 3 && (
              <Typography
                sx={{ color: 'common.white', [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' } }}
                variant="h4"
              >
                Bénéficiez-vous de l’exonération ACRE ?
              </Typography>
            )}
            {activeStep === 3 && (
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Exonération ACRE</InputLabel>
                <Select
                  sx={{ color: '#fff' }}
                  value={values.micro_entreprise_accre_exemption}
                  onChange={handleSelect('micro_entreprise_accre_exemption')}
                  label="Bénéficiez-vous de l’exonération ACRE ?"
                >
                  <MenuItem value="oui">Oui</MenuItem>
                  <MenuItem value="non">Non</MenuItem>
                </Select>
                <FormHelperText style={{ color: 'rgb(246 3 87)', fontSize: '1.2rem' }}>{helperText}</FormHelperText>
                <Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' }
                    }}
                  >
                    L'ACRE, Aide à la Création et à la Reprise d'Entreprise, consiste en une exonération partielle de
                    charges sociales en début d'activité (les 12 premiers mois). Vous êtes éligible à l'ACRE si vous
                    créez ou reprenez une activité économique industrielle, commerciale, artisanale, agricole ou
                    libérale, sous forme d'entreprise individuelle ou de société, à condition d'en exercer effectivement
                    le contrôle.
                  </Typography>
                  <Typography
                    sx={{
                      [theme.breakpoints.down('sm')]: { fontSize: '3.5vw' }
                    }}
                  >
                    Pour plus d'informations à propos de cette aide :{' '}
                    <a href="" target="_blank">
                      L'ACRE
                    </a>{' '}
                    (source : service-public.fr)
                  </Typography>
                </Box>
              </FormControl>
            )}
            {activeStep === 4 && (
              <>
                <Typography sx={{ color: 'common.white' }} variant="h4">
                  Quelle est la nature de votre catégorie d’activité ?
                </Typography>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={3}
                  style={{ position: 'relative' }}
                >
                  <Grid item xs={12} sm={6}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      m={1}
                      p={1}
                      bgcolor="background.paper"
                      className={classes.mobile_container}
                      alignContent="center"
                      style={{
                        flex: '1 1 0%',
                        height: 200,
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                        border: 'solid 1px #2272b7',
                        borderRadius: 4
                      }}
                      onClick={handleChange({
                        name: 'micro_entreprise_activity_category',
                        value: 'Vente de marchandises'
                      })}
                    >
                      <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                        <Typography sx={{ color: 'common.white', typography: 'h5' }}>Vente de marchandises</Typography>
                      </Box>
                    </Box>
                    {values.micro_entreprise_activity_category === 'Vente de marchandises' && (
                      <CheckCircleOutlineIcon
                        className={classes.selected_icon}
                        style={{
                          color: 'green'
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ position: 'relative' }}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      m={1}
                      p={1}
                      bgcolor="background.paper"
                      className={classes.mobile_container}
                      alignContent="center"
                      style={{
                        flex: '1 1 0%',
                        height: 200,
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 54px 49px -26px rgb(183 197 211 / 59%)',
                        border: 'solid 1px #2272b7',
                        borderRadius: 4
                      }}
                      onClick={handleChange({
                        name: 'micro_entreprise_activity_category',
                        value: 'Prestation de services et autre'
                      })}
                    >
                      <Box p={1} bgcolor="background.paper" className={classes.mobile_container}>
                        <Typography sx={{ color: 'common.white', typography: 'h5' }}>
                          Prestation de services et autre
                        </Typography>
                      </Box>
                    </Box>
                    {values.micro_entreprise_activity_category === 'Prestation de services et autre' && (
                      <CheckCircleOutlineIcon
                        className={classes.selected_icon}
                        style={{
                          color: 'green'
                        }}
                      />
                    )}
                  </Grid>
                  <FormHelperText style={{ color: 'rgb(246 3 87)', fontSize: '1.2rem' }}>{helperText}</FormHelperText>
                </Grid>
              </>
            )}
          </div>
          <MobileStepper
            variant="progress"
            steps={activityInfoRequired ? 5 : 4}
            position="static"
            activeStep={activeStep}
            className={classes.root}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activityInfoRequired ? activeStep === 4 : activeStep === 3}
              >
                Suivant
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                Précédent
              </Button>
            }
          />
          <Box
            sx={{
              flexGrow: 1,
              mt: 5,
              [theme.breakpoints.down('md')]: { mt: 1 },
              position: 'fixed',
              bottom: '56px',
              right: 0
            }}
          >
            {/* <Typography sx={{ typography: 'h5', color: 'common.white' }}>Test Results: </Typography> */}

            <TestButton
              variant="soft"
              type="submit"
              loading={isSubmitting}
              endDecorator={<KeyboardArrowRight />}
              sx={{
                borderRadius: 0,
                color: theme.palette.success.darker
              }}
            >
              Tester
            </TestButton>
          </Box>
        </Form>
      </FormikProvider>
    </>
  );
}
