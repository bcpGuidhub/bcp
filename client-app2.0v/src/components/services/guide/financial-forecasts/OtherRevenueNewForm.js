import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createRevenueSource, updateRevenueSource } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const SOURCE_TYPE = ['Produit financier', "Autre produit d'exploitation"];
const YEARS_REVENUE = ['Année 1', 'Année 2', 'Année 3'];
const MONTH_REVENUE = [
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
const VAT_RATES = ['20%', '10%', '8,5%', '5,5%', '2,1%', '0%'];

// ----------------------------------------------------------------------

OtherRevenueNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRevenueSource: PropTypes.object,
  setListOtherIncome: PropTypes.func.isRequired
};

export default function OtherRevenueNewForm({ isEdit, currentRevenueSource, setListOtherIncome }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const NewOtherRevenueSchema = Yup.object().shape({
    name: Yup.string().required('Nom du produit est requis'),
    source_type: Yup.string().required('Nature du produit est requis'),
    amount_excluding_taxes: Yup.string().default('0'),
    year: Yup.string().required('Année du produit est requis'),
    month: Yup.string().required('Mois du produit est requis'),
    vat_rate: Yup.string().default('0%')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentRevenueSource?.project_id || '',
      name: currentRevenueSource?.name || '',
      source_type: currentRevenueSource?.source_type || '',
      amount_excluding_taxes: currentRevenueSource?.amount_excluding_taxes || '',
      year: currentRevenueSource?.year || '',
      month: currentRevenueSource?.month || '',
      vat_rate: currentRevenueSource?.vat_rate || ''
    },
    validationSchema: NewOtherRevenueSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;
        payload.amount_excluding_taxes = payload.amount_excluding_taxes.toString();
        if (isEdit) {
          payload.id = currentRevenueSource.id;
          dispatch(updateRevenueSource(work.id, payload));
        } else {
          dispatch(createRevenueSource(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListOtherIncome(true);
        // navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    if (values.source_type === 'Produit financier') {
      setFieldValue('vat_rate', '0%');
    }
  }, [values.source_type, setFieldValue]);
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
                    label="Nom du produit"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <InformationBox>
                    <p>
                      Cet outil vous permet d'ajouter dans votre prévisionnel des produits d'une autre nature que votre
                      chiffre d'affaires prévisionnel. Ces produits peuvent correspondre à :{' '}
                    </p>
                    <ul>
                      <li>des produits financiers (intérêts, dividendes reçus par l'entreprise...)</li>
                      <li>des autres produits d'exploitation</li>
                    </ul>
                  </InformationBox>
                </Stack>
              </Card>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <div>
                    <TextField
                      select
                      fullWidth
                      label="Nature du produit"
                      error={Boolean(touched.source_type && errors.source_type)}
                      helperText={touched.source_type && errors.source_type}
                      value={values.source_type}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('source_type', event.target.value);
                      }}
                    >
                      {SOURCE_TYPE.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <InformationBox>
                      <p>
                        Cette information nous permet de budgétiser précisément votre chiffre d'affaires dans votre
                        tableau de trésorerie mensuel. Si vous choisissez <strong>Mensualisée</strong>, vous saisissez
                        votre chiffre d'affaires annuel et il sera divisé par 12. Si vous choisissez{' '}
                        <strong> Personnalisée</strong>, vous saisissez votre chiffre d'affaires mois par mois.
                      </p>
                    </InformationBox>
                  </div>
                </Card>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Montant hors taxes (en euros)"
                    {...getFieldProps('amount_excluding_taxes')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.amount_excluding_taxes && errors.amount_excluding_taxes)}
                    helperText={touched.amount_excluding_taxes && errors.amount_excluding_taxes}
                  />
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    select
                    fullWidth
                    label="Année du produit"
                    error={Boolean(touched.year && errors.year)}
                    helperText={touched.year && errors.year}
                    value={values.year}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('year', event.target.value);
                    }}
                  >
                    {YEARS_REVENUE.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Mois du produit"
                    error={Boolean(touched.month && errors.month)}
                    helperText={touched.month && errors.month}
                    value={values.month}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('month', event.target.value);
                    }}
                  >
                    {MONTH_REVENUE.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  {values.source_type !== 'Produit financier' && (
                    <TextField
                      select
                      fullWidth
                      label="Taux de TVA sur le produit"
                      error={Boolean(touched.vat_rate && errors.vat_rate)}
                      helperText={touched.vat_rate && errors.vat_rate}
                      value={values.vat_rate}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('vat_rate', event.target.value);
                      }}
                    >
                      {VAT_RATES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Stack>
              </Card>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={() => setListOtherIncome(true)}
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
