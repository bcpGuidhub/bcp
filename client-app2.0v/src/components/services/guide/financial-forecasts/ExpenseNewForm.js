import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createExpense, updateExpense } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const EXPENSE_CATEGORIES = [
  'Equipement et outillage',
  'Matériel informatique',
  'Fournitures administratives',
  'Loyer immobilier',
  'Entretien',
  'Publicité',
  'Assurances',
  'Comptabilité',
  'Frais bancaires',
  'Prestations de services',
  'Location / Crédit-bail',
  'Frais du réseau (franchise, concession...)',
  'Frais de déplacements',
  'Impôts et taxes',
  'Autres dépenses'
];
const EXPENSE_PARTITION_OPTIONS = [
  'Mensuelle',
  'Trimestrielle',
  'Semestrielle',
  "Annuelle (début d'année)",
  "Annuelle (fin d'année)",
  'Ponctuelle'
];
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
const VAT_RATES = ['20%', '10%', '8,5%', '5,5%', '2,1%', '0%'];

// ----------------------------------------------------------------------

ExpenseNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentExpense: PropTypes.object,
  setListExpenses: PropTypes.func.isRequired
};

export default function ExpenseNewForm({ isEdit, currentExpense, setListExpenses }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const vatBaseRegime = work.project_legal_status.company_vat_regime === 'Franchise en base de TVA';

  const NewExpenseSchema = Yup.object().shape({
    expense_label: Yup.string().required('Nom de la dépense est requis'),
    expense_category: Yup.string().required('Catégorie de dépense est requis'),
    annual_amount_tax_inc_1: Yup.string().default('0'),
    annual_amount_tax_inc_2: Yup.string().default('0'),
    annual_amount_tax_inc_3: Yup.string().default('0'),
    expenditure_partition: Yup.string().required("Répartition de la dépense sur l'année"),
    one_time_payment_year: Yup.string().when('expenditure_partition', (partition) =>
      partition === 'Ponctuelle' ? Yup.string().required('Année de la dépense ponctuelle est requis') : Yup.string()
    ),
    one_time_payment_month: Yup.string().when('expenditure_partition', (partition) =>
      partition === 'Ponctuelle' ? Yup.string().required('Mois de la dépense ponctuelle est requis') : Yup.string()
    ),
    vat_rate_expenditure: Yup.string().default('0%').required('Taux de TVA sur la dépense est requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentExpense?.project_id || '',
      expense_label: currentExpense?.expense_label || '',
      expense_category: currentExpense?.expense_category || '',
      annual_amount_tax_inc_1: currentExpense?.annual_amount_tax_inc_1 || '0',
      annual_amount_tax_inc_2: currentExpense?.annual_amount_tax_inc_2 || '0',
      annual_amount_tax_inc_3: currentExpense?.annual_amount_tax_inc_3 || '0',
      expenditure_partition: currentExpense?.expenditure_partition || '',
      one_time_payment_year: currentExpense?.one_time_payment_year || '',
      one_time_payment_month: currentExpense?.one_time_payment_month || '',
      vat_rate_expenditure: currentExpense?.vat_rate_expenditure || ''
    },
    validationSchema: NewExpenseSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;

        if (isEdit) {
          payload.id = currentExpense.id;
          dispatch(updateExpense(work.id, payload));
        } else {
          dispatch(createExpense(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListExpenses(true);
        // navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <div>
                    <TextField
                      select
                      fullWidth
                      label="Catégorie de dépense"
                      error={Boolean(touched.expense_category && errors.expense_category)}
                      helperText={touched.expense_category && errors.expense_category}
                      value={values.expense_category}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('expense_category', event.target.value);
                      }}
                    >
                      {EXPENSE_CATEGORIES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Card>
              </Stack>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nom de la dépense"
                    {...getFieldProps('expense_label')}
                    error={Boolean(touched.expense_label && errors.expense_label)}
                    helperText={touched.expense_label && errors.expense_label}
                  />
                  <InformationBox>
                    <p>
                      Il s'agit de préciser l'intitulé de la charge externe que vous souhaitez ajouter dans votre
                      prévisionnel. Voici plusieurs exemples : eau, électricité, fournitures administratives, loyer
                      immobilier, entretien du matériel, location de véhicule, assurance professionnelle, frais de
                      comptabilité, frais d'avocat, dépenses de nettoyage, frais bancaires, frais de déplacement, frais
                      de sous-traitance...
                    </p>
                  </InformationBox>
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {['année 1', 'année 2', 'année 3'].map((year, i) => (
                    <TextField
                      key={year}
                      fullWidth
                      placeholder="0.00"
                      label={`Montant annuel hors taxes en ${year} (en euros)`}
                      {...getFieldProps(`annual_amount_tax_inc_${i + 1}`)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(
                        touched[`annual_amount_tax_inc_${i + 1}`] && errors[`annual_amount_tax_inc_${i + 1}`]
                      )}
                      helperText={touched[`annual_amount_tax_inc_${i + 1}`] && errors[`annual_amount_tax_inc_${i + 1}`]}
                      onChange={(e) => {
                        setFieldValue(`annual_amount_tax_inc_${i + 1}`, e.target.value.replace(/\D/, ''));
                      }}
                    />
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <div>
                  <TextField
                    select
                    fullWidth
                    label="Répartition de la dépense sur l'année"
                    error={Boolean(touched.expenditure_partition && errors.expenditure_partition)}
                    helperText={touched.expenditure_partition && errors.expenditure_partition}
                    value={values.expenditure_partition}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('expenditure_partition', event.target.value);
                    }}
                  >
                    {EXPENSE_PARTITION_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <InformationBox>
                    <p>
                      Cette information nous permet de budgétiser précisément le paiement de cette dépense dans votre
                      prévisionnel de trésorerie, qui est élaboré sur une échelle mensuelle.
                    </p>
                  </InformationBox>
                </div>
                <Stack spacing={3}>
                  {values.expenditure_partition === 'Ponctuelle' && (
                    <>
                      <TextField
                        select
                        fullWidth
                        label="Année de la dépense ponctuelle"
                        error={Boolean(touched.one_time_payment_year && errors.one_time_payment_year)}
                        helperText={touched.one_time_payment_year && errors.one_time_payment_year}
                        value={values.one_time_payment_year}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('one_time_payment_year', event.target.value);
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
                        label="Mois de la dépense ponctuelle"
                        error={Boolean(touched.one_time_payment_month && errors.one_time_payment_month)}
                        helperText={touched.one_time_payment_month && errors.one_time_payment_month}
                        value={values.one_time_payment_month}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('one_time_payment_month', event.target.value);
                        }}
                      >
                        {MONTHS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}
                </Stack>
              </Card>
              {!vatBaseRegime && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Taux de TVA sur la dépense"
                      error={Boolean(touched.vat_rate_expenditure && errors.vat_rate_expenditure)}
                      helperText={touched.vat_rate_expenditure && errors.vat_rate_expenditure}
                      value={values.vat_rate_expenditure}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('vat_rate_expenditure', event.target.value);
                      }}
                    >
                      {VAT_RATES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Card>
              )}
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={() => setListExpenses(true)}
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
