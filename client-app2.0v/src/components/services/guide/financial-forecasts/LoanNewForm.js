import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createLoan, updateLoan } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const currency = require('currency.js');

const euro = (value) =>
  currency(value, {
    symbol: '€',
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: ' ',
    decimal: ',',
    precision: 2
  });

const LOAN_CATEGORIES = ['Prêt bancaire', "Prêt d'honneur", 'Subvention', 'Autre prêt'];
const MONTHS = [
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
const YEARS = ['Année 1', 'Année 2', 'Année 3'];

// ----------------------------------------------------------------------

LoanNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLoan: PropTypes.object,
  setListLoans: PropTypes.func.isRequired
};

export default function LoanNewForm({ isEdit, currentLoan, setListLoans }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);

  const NewLoanSchema = Yup.object().shape({
    type_of_external_fund: Yup.string().required('requis'),
    bank_loan_name: Yup.string().required('requis'),
    amount_loan: Yup.string().required('requis'),
    year_of_loan_disbursement: Yup.string().required('requis'),
    month_of_loan_disbursement: Yup.string().required('requis'),
    loan_rate: Yup.string().when('type_of_external_fund', (partition) =>
      partition !== 'Subvention' ? Yup.string().required('requis') : Yup.string()
    ),
    loan_duration: Yup.string().required('requis'),
    amount_monthly_payments: Yup.string().required('requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentLoan?.project_id || '',
      type_of_external_fund: currentLoan?.type_of_external_fund || '',
      bank_loan_name: currentLoan?.bank_loan_name || '',
      amount_loan: currentLoan?.amount_loan || '',
      year_of_loan_disbursement: currentLoan?.year_of_loan_disbursement || '',
      month_of_loan_disbursement: currentLoan?.month_of_loan_disbursement || '',
      loan_rate: currentLoan?.loan_rate || '',
      loan_duration: currentLoan?.loan_duration || '',
      amount_monthly_payments: currentLoan?.amount_monthly_payments || ''
    },
    validationSchema: NewLoanSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = { ...values };
        payload.project_id = work.id;

        payload.amount_loan = values.amount_loan.toString();
        payload.loan_rate = values.loan_rate.toString();
        payload.loan_duration = values.loan_duration.toString();

        if (isEdit) {
          payload.id = currentLoan.id;
          dispatch(updateLoan(work.id, payload));
        } else {
          dispatch(createLoan(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListLoans(true);
        // navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const computeAmountOfMonthlyPayment = () => {
    let a = values.amount_loan;
    let b = values.loan_rate;
    let c = values.loan_duration;
    if (a !== '' && b !== '' && c !== '') {
      a = parseInt(a, 10);
      b = parseFloat(b, 10) / 100;
      c = parseInt(c, 10);
      if (b === 0) {
        const v = c !== 0 ? a / c : 0;
        setFieldValue('amount_monthly_payments', euro(v).format());
        return;
      }
      const monthlyRate = b / 12;
      const e = (1 + monthlyRate) ** c;
      const n = a * monthlyRate * e;
      const d = e - 1;
      const v = d === 0 ? 0 : n / d;
      setFieldValue('amount_monthly_payments', euro(v).format());
    }
  };

  useEffect(() => {
    computeAmountOfMonthlyPayment();
  }, [values.amount_loan]);

  useEffect(() => {
    computeAmountOfMonthlyPayment();
  }, [values.loan_rate]);

  useEffect(() => {
    computeAmountOfMonthlyPayment();
  }, [values.loan_duration]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <TextField
                    select
                    fullWidth
                    label="Type de financement externe"
                    error={Boolean(touched.type_of_external_fund && errors.type_of_external_fund)}
                    helperText={touched.type_of_external_fund && errors.type_of_external_fund}
                    value={values.type_of_external_fund}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('type_of_external_fund', event.target.value);
                    }}
                  >
                    {LOAN_CATEGORIES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Card>
                <Card sx={{ p: 3 }}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Intitulé du financement"
                    {...getFieldProps('bank_loan_name')}
                    error={Boolean(touched.bank_loan_name && errors.bank_loan_name)}
                    helperText={touched.bank_loan_name && errors.bank_loan_name}
                  />
                  {values.type_of_external_fund === 'Prêt bancaire' && (
                    <InformationBox>
                      <p>
                        Le prêt bancaire professionnel a pour objectif de vous permettre de réaliser certains
                        investissements nécessaires au démarrage de votre activité ou à son développement. Pour obtenir
                        un <b>prêt bancaire professionnel</b>, vous avez besoin d'avoir un apport personnel suffisant.
                        Sans cela, vous n'avez quasiment aucune chance d'obtenir une réponse positive à votre demande de
                        financement. Vous obtiendrez d'avantage d'explications ici :{' '}
                        <a
                          href="https://www.lecoindesentrepreneurs.fr/pourcentage-apports-personnels-pret-bancaire-professionnel/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Prêt bancaire et pourcentage d'apports personnels
                        </a>
                        .
                      </p>
                    </InformationBox>
                  )}
                  {values.type_of_external_fund === "Prêt d'honneur" && (
                    <>
                      <InformationBox>
                        <p>
                          En principe, ce type de prêt est accordé au créateur d'entreprise directement. Ensuite, il est
                          apporté en capital social ou en compte courant d'associé. Toutefois, si vous souhaitez
                          intégrer le prêt d'honneur dans votre prévisionnel, vous pouvez l'ajouter en tant que prêt
                          d'honneur.
                        </p>
                      </InformationBox>
                      <InformationBox>
                        <p>
                          Le <b>prêt d’honneur</b> est un dispositif proposé, sous conditions, par{' '}
                          <b>France Initiative</b> et <b>Réseau Entreprendre</b> qui permet d’obtenir un financement
                          pour constituer ou renforcer les fonds propres d’une entreprise. Il s'agit d'un prêt à taux
                          zéro qui a vocation à renforcer les fonds propres du créateur d'entreprise pour faciliter
                          l'obtention d'un prêt bancaire. Pour plus d'informations :{' '}
                          <a
                            href="https://www.lecoindesentrepreneurs.fr/le-pret-dhonneur-aide-aux-entrepreneurs/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Le fonctionnement du prêt d'honneur
                          </a>
                          .
                        </p>
                        <p>
                          <b>BPI France</b> propose également un prêt d'honneur, baptisé le "prêt d'honneur solidaire".
                          Vous découvrirez le fonctionnement de ce financement ici :{' '}
                          <a
                            href="https://www.lecoindesentrepreneurs.fr/pret-honneur-solidaire-ph/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Le prêt d'honneur solidaire
                          </a>
                          .
                        </p>
                      </InformationBox>
                    </>
                  )}
                </Card>
              </Stack>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label={
                      values.type_of_external_fund === 'Subvention'
                        ? 'Montant de la subvention'
                        : 'Montant du financement'
                    }
                    {...getFieldProps('amount_loan')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.amount_loan && errors.amount_loan)}
                    helperText={touched.amount_loan && errors.amount_loan}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    select
                    fullWidth
                    label="Année de versement du financement"
                    error={Boolean(touched.year_of_loan_disbursement && errors.year_of_loan_disbursement)}
                    helperText={touched.year_of_loan_disbursement && errors.year_of_loan_disbursement}
                    value={values.year_of_loan_disbursement}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('year_of_loan_disbursement', event.target.value);
                    }}
                  >
                    {YEARS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Mois de versement du financement"
                    error={Boolean(touched.month_of_loan_disbursement && errors.month_of_loan_disbursement)}
                    helperText={touched.month_of_loan_disbursement && errors.month_of_loan_disbursement}
                    value={values.month_of_loan_disbursement}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('month_of_loan_disbursement', event.target.value);
                    }}
                  >
                    {MONTHS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Card>
              {values.type_of_external_fund !== 'Subvention' && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Taux annuel du prêt (en %)"
                      {...getFieldProps('loan_rate')}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.loan_rate && errors.loan_rate)}
                      helperText={touched.loan_rate && errors.loan_rate}
                    />
                  </Stack>
                </Card>
              )}
              {values.type_of_external_fund === "Prêt d'honneur" && (
                <Card sx={{ p: 3 }}>
                  <InformationBox>
                    <p>Le prêt d’honneur est un prêt à taux zéro.</p>
                  </InformationBox>
                </Card>
              )}
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Durée du prêt (en mois)"
                    type="number"
                    {...getFieldProps('loan_duration')}
                    error={Boolean(touched.loan_duration && errors.loan_duration)}
                    helperText={touched.loan_duration && errors.loan_duration}
                  />
                  <TextField
                    fullWidth
                    label="Montant des mensualités à titre indicatif"
                    {...getFieldProps('amount_monthly_payments')}
                    error={Boolean(touched.amount_monthly_payments && errors.amount_monthly_payments)}
                    helperText={touched.amount_monthly_payments && errors.amount_monthly_payments}
                  />
                </Stack>
              </Card>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={() => setListLoans(true)}
                  sx={{ mr: 1.5 }}
                >
                  Retour
                </Button>
                {isCreator && (
                  <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
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
