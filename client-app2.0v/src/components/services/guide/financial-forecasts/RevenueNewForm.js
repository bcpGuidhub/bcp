import { LoadingButton } from '@mui/lab';
import {
  Button,
  ButtonGroup,
  Card,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createRevenue, updateRevenue } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const REVENUE_PARTITION_OPTIONS = ['Mensualisée', 'Personnalisée'];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const VAT_RATES = ['20%', '10%', '8,5%', '5,5%', '2,1%', '0%'];
const DELAYS = ['0 jour', '30 jours', '60 jours'];

// ----------------------------------------------------------------------
const strToIntSum = (field, values) => {
  const months = [
    'month_1_amount',
    'month_2_amount',
    'month_3_amount',
    'month_4_amount',
    'month_5_amount',
    'month_6_amount',
    'month_7_amount',
    'month_8_amount',
    'month_9_amount',
    'month_10_amount',
    'month_11_amount',
    'month_12_amount'
  ];
  return months.reduce((acc, k) => {
    let v = values[field][k];
    if (v === '') {
      v = '0';
    }
    acc += parseInt(v, 10);
    return acc;
  }, 0);
};
RevenueNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRevenue: PropTypes.object,
  setListRevenues: PropTypes.func.isRequired
};

export default function RevenueNewForm({ isEdit, currentRevenue, setListRevenues }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState('year_1');
  const { work } = useSelector((state) => state.project);
  const NewRevenueSchema = Yup.object().shape({
    revenue_label: Yup.string().required("Intitulé du chiffre d'affaires est requis"),
    revenue_partition: Yup.string().required("Répartition du chiffre d'affaires sur l'année est requis"),
    annual_amount_tax_excluded_year_1: Yup.string().default('0'),
    annual_amount_tax_excluded_year_2: Yup.string().default('0'),
    annual_amount_tax_excluded_year_3: Yup.string().default('0'),
    year_1: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    year_2: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    year_3: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    inventory_linked_revenue: Yup.bool().required('Ce champ est obligatoire'),
    percentage_margin: Yup.string(),
    valuation_of_starting_stock: Yup.string().default('0'),
    mean_valuation_of_stock: Yup.string().default('0'),
    vat_rate_revenue: Yup.string().required('Taux de TVA sur les ventes est requis'),
    vat_rate_on_purchases: Yup.string(),
    customer_payment_deadline: Yup.string().required('Délai de paiement des clients est requis'),
    supplier_payment_deadline: Yup.string()
  });

  const revenueYear = (revenueYears, year) => revenueYears.filter((ry) => ry.year === year)[0];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentRevenue?.project_id || '',
      revenue_label: currentRevenue?.revenue_label || '',
      revenue_partition: currentRevenue?.revenue_partition || '',
      annual_amount_tax_excluded_year_1: currentRevenue?.annual_amount_tax_excluded_year_1 || '0',
      annual_amount_tax_excluded_year_2: currentRevenue?.annual_amount_tax_excluded_year_2 || '0',
      annual_amount_tax_excluded_year_3: currentRevenue?.annual_amount_tax_excluded_year_3 || '0',
      inventory_linked_revenue: Boolean(currentRevenue?.inventory_linked_revenue === 'Oui'),
      percentage_margin: currentRevenue?.percentage_margin || '',
      valuation_of_starting_stock: currentRevenue?.valuation_of_starting_stock || '0',
      mean_valuation_of_stock: currentRevenue?.mean_valuation_of_stock || '0',
      vat_rate_revenue: currentRevenue?.vat_rate_revenue || '',
      vat_rate_on_purchases: currentRevenue?.vat_rate_on_purchases || '',
      customer_payment_deadline: currentRevenue?.customer_payment_deadline || '',
      supplier_payment_deadline: currentRevenue?.supplier_payment_deadline || '',
      year_1: {
        month_1_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_1_amount || '',
        month_2_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_2_amount || '',
        month_3_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_3_amount || '',
        month_4_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_4_amount || '',
        month_5_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_5_amount || '',
        month_6_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_6_amount || '',
        month_7_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_7_amount || '',
        month_8_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_8_amount || '',
        month_9_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_9_amount || '',
        month_10_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_10_amount || '',
        month_11_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_11_amount || '',
        month_12_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_1')?.month_12_amount || ''
      },
      year_2: {
        month_1_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_1_amount || '',
        month_2_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_2_amount || '',
        month_3_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_3_amount || '',
        month_4_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_4_amount || '',
        month_5_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_5_amount || '',
        month_6_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_6_amount || '',
        month_7_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_7_amount || '',
        month_8_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_8_amount || '',
        month_9_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_9_amount || '',
        month_10_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_10_amount || '',
        month_11_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_11_amount || '',
        month_12_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_2')?.month_12_amount || ''
      },
      year_3: {
        month_1_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_1_amount || '',
        month_2_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_2_amount || '',
        month_3_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_3_amount || '',
        month_4_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_4_amount || '',
        month_5_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_5_amount || '',
        month_6_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_6_amount || '',
        month_7_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_7_amount || '',
        month_8_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_8_amount || '',
        month_9_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_9_amount || '',
        month_10_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_10_amount || '',
        month_11_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_11_amount || '',
        month_12_amount: revenueYear(currentRevenue?.revenue_years || [], 'year_3')?.month_12_amount || ''
      },
      revenue_years: currentRevenue?.revenue_years || []
    },
    validationSchema: NewRevenueSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = { ...values };
        payload.project_id = work.id;
        payload.inventory_linked_revenue = values.inventory_linked_revenue ? 'Oui' : 'Non';

        if (values.revenue_partition === 'Personnalisée') {
          payload.annual_amount_tax_excluded_year_1 = strToIntSum('year_1', values).toString();
          payload.annual_amount_tax_excluded_year_2 = strToIntSum('year_2', values).toString();
          payload.annual_amount_tax_excluded_year_3 = strToIntSum('year_3', values).toString();

          const years = ['year_1', 'year_2', 'year_3'].map((year) => ({
            year,
            ...revenueYear(currentRevenue?.revenue_years || [], year),
            ...values[year]
          }));
          payload.revenue_years = years;
        }
        if (isEdit) {
          payload.id = currentRevenue.id;
          dispatch(updateRevenue(payload));
        } else {
          dispatch(createRevenue(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListRevenues(true);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    if (values.revenue_partition === 'Personnalisée') {
      setSelectedYear('year_1');
    }
  }, [values.revenue_partition]);

  useEffect(() => {
    if (values.revenue_partition === 'Personnalisée') {
      setSelectedYear('year_1');
    }
  }, [values.revenue_partition]);

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
                    label="Intitulé du chiffre d'affaires"
                    {...getFieldProps('revenue_label')}
                    error={Boolean(touched.revenue_label && errors.revenue_label)}
                    helperText={touched.revenue_label && errors.revenue_label}
                  />
                  <InformationBox>
                    <p>
                      Il s'agit de préciser l'intitulé exact de la catégorie de chiffre d'affaires que vous souhaitez
                      ajouter dans votre prévisionnel. Par exemple : Ventes de produits, Missions de conseils...{' '}
                    </p>
                  </InformationBox>
                </Stack>
              </Card>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <div>
                    <TextField
                      select
                      fullWidth
                      label="Répartition du chiffre d'affaires sur l'année"
                      error={Boolean(touched.revenue_partition && errors.revenue_partition)}
                      helperText={touched.revenue_partition && errors.revenue_partition}
                      value={values.revenue_partition}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('revenue_partition', event.target.value);
                      }}
                    >
                      {REVENUE_PARTITION_OPTIONS.map((option) => (
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
                  <Stack spacing={3}>
                    {values.revenue_partition === 'Mensualisée' && (
                      <>
                        {['année 1', 'année 2', 'année 3'].map((year, i) => (
                          <TextField
                            key={year}
                            fullWidth
                            placeholder="0.00"
                            label={`Montant annuel hors taxes en ${year} (en euros)`}
                            {...getFieldProps(`annual_amount_tax_excluded_year_${i + 1}`)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">€</InputAdornment>,
                              type: 'number'
                            }}
                            error={Boolean(
                              touched[`annual_amount_tax_excluded_year_${i + 1}`] &&
                                errors[`annual_amount_tax_excluded_year_${i + 1}`]
                            )}
                            helperText={
                              touched[`annual_amount_tax_excluded_year_${i + 1}`] &&
                              errors[`annual_amount_tax_excluded_year_${i + 1}`]
                            }
                            onChange={(e) => {
                              setFieldValue(
                                `annual_amount_tax_excluded_year_${i + 1}`,
                                e.target.value.replace(/\D/, '')
                              );
                            }}
                          />
                        ))}
                      </>
                    )}
                    {values.revenue_partition === 'Personnalisée' && (
                      <>
                        <ButtonGroup fullWidth size="large" variant="contained">
                          {['année 1', 'année 2', 'année 3'].map((year, i) => (
                            <Button
                              key={year}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedYear(`year_${i + 1}`);
                              }}
                            >
                              {year}
                            </Button>
                          ))}
                        </ButtonGroup>
                        {MONTHS.map((month) => (
                          <TextField
                            key={month}
                            fullWidth
                            placeholder="0.00"
                            label={`Montant Mois ${month}`}
                            {...getFieldProps(values[`${selectedYear}`][`month_${month}_amount`])}
                            value={values[`${selectedYear}`][`month_${month}_amount`]}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">€</InputAdornment>,
                              type: 'number'
                            }}
                            name={`${selectedYear}.month_${month}_amount`}
                            onChange={(e) => {
                              setFieldValue(`${selectedYear}.month_${month}_amount`, e.target.value.replace(/\D/, ''));
                            }}
                          />
                        ))}
                      </>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...getFieldProps('inventory_linked_revenue')}
                        checked={values.inventory_linked_revenue}
                      />
                    }
                    label="Avez-vous des achats directement liés à votre chiffre
                    d'affaires ?"
                    sx={{ mt: 2 }}
                  />
                  <InformationBox>
                    <p>
                      Ces achats correspondent aux achats de marchandises, de matériaux ou de matières premières
                      directement liés à l'exercice de votre activité. Ici, vous ne devez pas tenir compte des frais
                      généraux. En principe, vous devez répondre "Oui" si vous avez une activité de ventes, de négoce,
                      de production, ou une activité artisanale.
                    </p>
                  </InformationBox>
                </Stack>
              </Card>
              {values.inventory_linked_revenue && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="0.00"
                        label="Pourcentage de marge (%)"
                        {...getFieldProps('percentage_margin')}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          type: 'text'
                        }}
                        onChange={(event) => {
                          const v = Number.isNaN(parseInt(event.target.value.replace(/\D/, ''), 10))
                            ? 0
                            : parseInt(event.target.value.replace(/\D/, ''), 10);
                          const pV = v > 100 ? v % 100 : v;
                          setFieldValue('percentage_margin', pV.toString());
                        }}
                        error={Boolean(touched.percentage_margin && errors.percentage_margin)}
                        helperText={touched.percentage_margin && errors.percentage_margin}
                      />
                      <InformationBox>
                        Le taux de marge se calcule comme suit : [ ( chiffre d'affaires - achats consommés ) / chiffre
                        d’affaires ] * 100. Exemple : vous vendez un produit 100 € sur lequel vous réalisez une marge de
                        80%. Cela signifie que vous achetez le produit 20 €. Cette information nous permet de budgétiser
                        vos achats de marchandises ou de matières premières.
                      </InformationBox>
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="0.00"
                        label="Montant hors taxes en euros de votre stock de départ"
                        {...getFieldProps('valuation_of_starting_stock')}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                          type: 'number'
                        }}
                        error={Boolean(touched.valuation_of_starting_stock && errors.valuation_of_starting_stock)}
                        helperText={touched.valuation_of_starting_stock && errors.valuation_of_starting_stock}
                        onChange={(event) =>
                          setFieldValue('valuation_of_starting_stock', event.target.value.replace(/\D/, ''))
                        }
                      />
                      <InformationBox>
                        <p>
                          Si vous avez besoin d'un stock de départ pour démarrer votre activité, il convient d'en
                          budgétiser le montant dans votre prévisionnel. Si vous n'avez pas de stock de départ, indiquez
                          "0" dans la case ci-dessus.
                        </p>
                      </InformationBox>
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="0.00"
                        label="Montant hors taxes en euros de votre stock moyen"
                        {...getFieldProps('mean_valuation_of_stock')}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                          type: 'number'
                        }}
                        error={Boolean(touched.mean_valuation_of_stock && errors.mean_valuation_of_stock)}
                        helperText={touched.mean_valuation_of_stock && errors.mean_valuation_of_stock}
                        onChange={(event) =>
                          setFieldValue('mean_valuation_of_stock', event.target.value.replace(/\D/, ''))
                        }
                      />
                      <InformationBox>
                        <p>
                          Le stock moyen correspond au stock de marchandises, de matériaux et/ou de matières premières
                          que vous devez avoir régulièrement en stock. Dans votre prévisionnel, il s'agit de votre stock
                          régulier en cours d'année. Si vous n'avez pas de stock minimum, indiquez "0" dans la case
                          ci-dessus.
                        </p>
                      </InformationBox>
                    </div>
                  </Stack>
                </Card>
              )}
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    select
                    fullWidth
                    label="Taux de TVA sur les ventes"
                    error={Boolean(touched.vat_rate_revenue && errors.vat_rate_revenue)}
                    helperText={touched.vat_rate_revenue && errors.vat_rate_revenue}
                    value={values.vat_rate_revenue}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('vat_rate_revenue', event.target.value);
                    }}
                  >
                    {VAT_RATES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Délai de paiement des clients"
                    error={Boolean(touched.customer_payment_deadline && errors.customer_payment_deadline)}
                    helperText={touched.customer_payment_deadline && errors.customer_payment_deadline}
                    value={values.customer_payment_deadline}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('customer_payment_deadline', event.target.value);
                    }}
                  >
                    {DELAYS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  {values.inventory_linked_revenue && (
                    <>
                      <TextField
                        select
                        fullWidth
                        label="Taux de TVA sur les achats"
                        error={Boolean(touched.vat_rate_on_purchases && errors.vat_rate_on_purchases)}
                        helperText={touched.vat_rate_on_purchases && errors.vat_rate_on_purchases}
                        value={values.vat_rate_on_purchases}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('vat_rate_on_purchases', event.target.value);
                        }}
                      >
                        {VAT_RATES.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        label="Délai de paiement des fournisseurs"
                        error={Boolean(touched.supplier_payment_deadline && errors.supplier_payment_deadline)}
                        helperText={touched.supplier_payment_deadline && errors.supplier_payment_deadline}
                        value={values.supplier_payment_deadline}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('supplier_payment_deadline', event.target.value);
                        }}
                      >
                        {DELAYS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>{' '}
                    </>
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
                  onClick={() => setListRevenues(true)}
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
