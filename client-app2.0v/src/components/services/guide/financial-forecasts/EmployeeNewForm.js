import AlarmIcon from '@mui/icons-material/Alarm';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import debounce from 'lodash.debounce';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createEmployee, updateEmployee } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import { COTISATION_API } from '../../../../utils/axios';
import Label from '../../../Label';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const CONTRACT_TYPES = ['CDI', 'CDD'];

const MONTH_OF_HIRE = [
  'Mois 1',
  'Mois 2',
  'Mois 3',
  'Mois 4',
  'Mois 5',
  'Mois 6',
  'Mois 7',
  'Mois 8',
  'Mois 9',
  'Mois 10',
  'Mois 11',
  'Mois 12'
];
const YEAR_OF_HIRE = ['Année 1', 'Année 2', 'Année 3'];

const MONTH_MAPPING_CHART = {
  'Mois 1': 12,
  'Mois 2': 11,
  'Mois 3': 10,
  'Mois 4': 9,
  'Mois 5': 8,
  'Mois 6': 7,
  'Mois 7': 6,
  'Mois 8': 5,
  'Mois 9': 4,
  'Mois 10': 3,
  'Mois 11': 2,
  'Mois 12': 1
};

const YEAR_ORDERING = { 'Année 1': 1, 'Année 2': 2, 'Année 3': 3 };

// ----------------------------------------------------------------------

function employeeSituation(options) {
  return {
    net_salary: {
      CDD: {
        situation: {
          'contrat salarié . CDD': 'oui',
          'contrat salarié . rémunération . brut de base': options.gross_monthly_remuneration
        }
      },
      CDI: {
        situation: {
          'contrat salarié . CDI': 'oui',
          'contrat salarié . rémunération . brut de base': options.gross_monthly_remuneration
        }
      },
      evaluate: 'contrat salarié . rémunération . net'
    },
    employer_contributions: {
      CDD: {
        situation: {
          'contrat salarié . CDD': 'oui',
          'contrat salarié . rémunération . brut de base': options.gross_monthly_remuneration
        }
      },
      CDI: {
        situation: {
          'contrat salarié . CDI': 'oui',
          'contrat salarié . rémunération . brut de base': options.gross_monthly_remuneration
        }
      },
      evaluate: 'contrat salarié . cotisations . patronales'
    }
  };
}

// ----------------------------------------------------------------------

EmployeeNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentEmployee: PropTypes.object,
  setListEmployees: PropTypes.func.isRequired
};

export default function EmployeeNewForm({ isEdit, currentEmployee, setListEmployees }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const [loadingNetSalary, setLoadingNetSalary] = useState(false);
  const [missingContractType, setMissingContractType] = useState(false);
  const [loadingEmployeeContribution, setLoadingEmployeeContribution] = useState(false);
  const [computingCotisation, setComputingCotisation] = useState(false);

  const NewEmployeeSchema = Yup.object().shape({
    post: Yup.string().required('Intitulé du poste du salarié est requis'),
    contract_type: Yup.string().required('Type de contrat de travail est requis'),
    contract_duration: Yup.string().when('contract_type', (type) =>
      type === 'CDD' ? Yup.string().required('Durée du contrat (en mois) est requis') : Yup.string()
    ),
    gross_monthly_remuneration: Yup.string().required('Montant de la rémunération brute mensuelle (en euros)'),
    year_of_hire: Yup.string().required("Année de l'embauche est requis"),
    date_of_hire: Yup.string().required("Mois de l'embauche est requis"),
    salary_brute_year_1: Yup.string(),
    salary_brute_year_2: Yup.string(),
    salary_brute_year_3: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentEmployee?.project_id || '',
      post: currentEmployee?.post || '',
      contract_type: currentEmployee?.contract_type || '',
      contract_duration: currentEmployee?.contract_duration || '',
      gross_monthly_remuneration: currentEmployee?.gross_monthly_remuneration || '',
      year_of_hire: currentEmployee?.year_of_hire || '',
      date_of_hire: currentEmployee?.date_of_hire || '',
      salary_brute_year_1: currentEmployee?.salary_brute_year_1 || '',
      salary_brute_year_2: currentEmployee?.salary_brute_year_2 || '',
      salary_brute_year_3: currentEmployee?.salary_brute_year_3 || '',
      net_monthly_remuneration: currentEmployee?.net_monthly_remuneration || '',
      employer_contributions: currentEmployee?.employer_contributions || ''
    },
    validationSchema: NewEmployeeSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;
        payload.net_monthly_remuneration = payload.net_monthly_remuneration.toString();
        payload.gross_monthly_remuneration = payload.gross_monthly_remuneration.toString();
        payload.employer_contributions = payload.employer_contributions.toString();
        computeAnnualBrute();
        if (payload.contract_type === 'CDI') {
          payload.contract_duration = 'indefinite';
        }
        if (isEdit) {
          payload.id = currentEmployee.id;
          dispatch(updateEmployee(work.id, payload));
        } else {
          dispatch(createEmployee(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListEmployees(true);
        // navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const computeEmployeeOnCDI = (year) => {
    let result;
    if (values.year_of_hire === year) {
      result = MONTH_MAPPING_CHART[values.date_of_hire] * values.gross_monthly_remuneration;
    } else if (YEAR_ORDERING[values.year_of_hire] < YEAR_ORDERING[year]) {
      result = 12 * values.gross_monthly_remuneration;
    } else {
      result = 0;
    }
    return result;
  };

  const computeEmployeeOnCDD = (year) => {
    const yearSpace = { 'Année 1': 2, 'Année 2': 1, 'Année 3': 0 };
    const duration = parseInt(values.contract_duration, 10);
    const yearDiff = yearSpace[values.year_of_hire] - yearSpace[year];
    if (values.year_of_hire === year) {
      const p = MONTH_MAPPING_CHART[values.date_of_hire];
      if (p < duration) {
        return p * values.gross_monthly_remuneration;
      }
      return duration * values.gross_monthly_remuneration;
    }
    if (YEAR_ORDERING[values.year_of_hire] < YEAR_ORDERING[year]) {
      const p = MONTH_MAPPING_CHART[values.date_of_hire];
      const o = p + 12 * yearDiff;
      if (o <= duration) {
        return 12 * values.gross_monthly_remuneration;
      }
      const r = o - 12;
      if (r > duration) {
        return 0;
      }
      return (duration - r) * values.gross_monthly_remuneration;
    }
    return 0;
  };

  const computeAnnualBrute = () => {
    const yearLabel = {
      year_1: 'Année 1',
      year_2: 'Année 2',
      year_3: 'Année 3'
    };
    ['year_1', 'year_2', 'year_3'].forEach((year) => {
      const key = `salary_brute_${year}`;
      if (values.contract_type === 'CDI') {
        values[key] = computeEmployeeOnCDI(yearLabel[year]).toString();
      }
      if (values.contract_type === 'CDD') {
        values[key] = computeEmployeeOnCDD(yearLabel[year]).toString();
      }
    });
  };

  const computeEmployeeSituation = () => {
    if (values.contract_type === '' || values.gross_monthly_remuneration === '') {
      if (values.contract_type === '') {
        setMissingContractType(true);
      }
      setLoadingNetSalary(false);
      setLoadingEmployeeContribution(false);
      setComputingCotisation(false);
      return;
    }
    const options = {
      gross_monthly_remuneration: values.gross_monthly_remuneration
    };
    const situations = employeeSituation(options);
    let situation;

    if (values.contract_type === 'CDI') {
      situation = situations.net_salary.CDI;
    }
    if (values.contract_type === 'CDD') {
      situation = situations.net_salary.CDD;
    }
    COTISATION_API.post(`cotisations/employees/net-cotisation`, situation).then((response) => {
      const { cotisation } = response.data;
      setLoadingNetSalary(false);
      setLoadingEmployeeContribution(false);
      setComputingCotisation(false);
      setFieldValue('net_monthly_remuneration', cotisation.net);
      setFieldValue('employer_contributions', cotisation.patronales);
    });
  };

  const debouncedcomputeEmployeeSituation = debounce(() => computeEmployeeSituation(), 1000);

  useEffect(() => {
    if (values.contract_type !== '') {
      setMissingContractType(false);
      setLoadingNetSalary(true);
      setLoadingEmployeeContribution(true);
      setComputingCotisation(true);
      debouncedcomputeEmployeeSituation();
    }
  }, [values.contract_type]);
  useEffect(() => {
    if (values.gross_monthly_remuneration !== '') {
      setLoadingNetSalary(true);
      setLoadingEmployeeContribution(true);
      setComputingCotisation(true);
      debouncedcomputeEmployeeSituation();
    }
  }, [values.gross_monthly_remuneration]);
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Intitulé du poste du salarié"
                    {...getFieldProps('post')}
                    error={Boolean(touched.post && errors.post)}
                    helperText={touched.post && errors.post}
                  />
                </Stack>
              </Card>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <div>
                    {missingContractType && (
                      <Box sx={{ p: 1 }}>
                        <Label
                          variant="filled"
                          color="error"
                          sx={{ overflowWrap: 'break-word', display: 'inline', whiteSpace: 'break-spaces' }}
                        >
                          Ces valeurs sont obligatoires pour faire le calcul : Montant mensuel des cotisations
                          patronales et Montant de la rémunération nette mensuelle
                        </Label>
                      </Box>
                    )}
                    <TextField
                      select
                      fullWidth
                      label="Type de contrat de travail"
                      error={Boolean(touched.contract_type && errors.contract_type)}
                      helperText={touched.contract_type && errors.contract_type}
                      value={values.contract_type}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('contract_type', event.target.value);
                      }}
                    >
                      {CONTRACT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Card>
              </Stack>
              {values.contract_type === 'CDD' && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      placeholder="0.00"
                      label="Durée du contrat (en mois)"
                      {...getFieldProps('contract_duration')}
                      type="number"
                      error={Boolean(touched.contract_duration && errors.contract_duration)}
                      helperText={touched.contract_duration && errors.contract_duration}
                      onChange={(e) => {
                        setFieldValue('contract_duration', e.target.value.replace(/\D/, ''));
                      }}
                    />
                  </Stack>
                </Card>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Montant de la rémunération brute mensuelle (en euros)"
                    {...getFieldProps('gross_monthly_remuneration')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.gross_monthly_remuneration && errors.gross_monthly_remuneration)}
                    helperText={touched.gross_monthly_remuneration && errors.gross_monthly_remuneration}
                    onChange={(e) => {
                      setFieldValue('gross_monthly_remuneration', e.target.value);
                    }}
                  />
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {loadingNetSalary && isCreator && (
                    <LoadingButton loading loadingPosition="start" startIcon={<AlarmIcon />} variant="outlined">
                      loading
                    </LoadingButton>
                  )}

                  {!loadingNetSalary && (
                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="Montant de la rémunération nette mensuelle (en euros)"
                      {...getFieldProps('net_monthly_remuneration')}
                    />
                  )}
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {loadingEmployeeContribution && isCreator && (
                    <LoadingButton loading loadingIndicator="Loading..." variant="outlined">
                      loading
                    </LoadingButton>
                  )}
                  {!loadingEmployeeContribution && (
                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="Montant mensuel des cotisations patronales (en euros)"
                      {...getFieldProps('employer_contributions')}
                    />
                  )}
                </Stack>
                <InformationBox>
                  <p>
                    Les informations ont été calculées automatiquement en collaboration avec un simulateur de
                    cotisations sociales proposé par l'Urssaf. La taxe d'apprentissage et la contribution à la formation
                    professionnelle sont également calculées et intégrées dans votre compte de résultat sur la ligne
                    Impôts et taxes.
                  </p>
                </InformationBox>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    select
                    fullWidth
                    label="Année de l'embauche"
                    error={Boolean(touched.year_of_hire && errors.year_of_hire)}
                    helperText={touched.year_of_hire && errors.year_of_hire}
                    value={values.year_of_hire}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('year_of_hire', event.target.value);
                    }}
                  >
                    {YEAR_OF_HIRE.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Mois de l'embauche"
                    error={Boolean(touched.date_of_hire && errors.date_of_hire)}
                    helperText={touched.date_of_hire && errors.date_of_hire}
                    value={values.date_of_hire}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('date_of_hire', event.target.value);
                    }}
                  >
                    {MONTH_OF_HIRE.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Card>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={() => setListEmployees(true)}
                  sx={{ mr: 1.5 }}
                  disabled={computingCotisation}
                >
                  Retour
                </Button>
                {isCreator && (
                  <LoadingButton
                    disabled={computingCotisation}
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    {!isEdit ? 'Enregistrer' : 'Enregistrer les modifications'}
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
