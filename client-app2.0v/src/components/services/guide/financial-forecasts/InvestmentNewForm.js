import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createInvestment, updateInvestment } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import Label from '../../../Label';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const INVESTMENT_TYPE = ['Investissement incorporel', 'Investissement corporel', 'Investissement financier'];
const CONTRIBUTION_OPTIONS = ['Non', 'Oui'];
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
const DURATIONS = [
  '12',
  '24',
  '36',
  '48',
  '60',
  '72',
  '84',
  '96',
  '108',
  '120',
  '180',
  '240',
  '300',
  '360',
  '480',
  '600',
  'Non amortissable'
];
// ----------------------------------------------------------------------

InvestmentNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentInvestment: PropTypes.object,
  setListInvestments: PropTypes.func.isRequired
};

export default function InvestmentNewForm({ isEdit, currentInvestment, setListInvestments }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const vatBaseRegime = work.project_legal_status.company_vat_regime === 'Franchise en base de TVA';

  const NewInvestmentSchema = Yup.object().shape({
    investment_name: Yup.string().required(),
    investment_type: Yup.string().required(),
    investment_amount_tax_included: Yup.string().default('0'),
    year_of_purchase: Yup.string(),
    month_of_purchase: Yup.string(),
    duration: Yup.string(),
    vat_rate_on_investment: Yup.string().default('0%').required('Taux de TVA sur la dépense est requis'),
    contribution: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentInvestment?.project_id || '',
      investment_name: currentInvestment?.investment_name || '',
      investment_type: currentInvestment?.investment_type || '',
      investment_amount_tax_included: currentInvestment?.investment_amount_tax_included || '0',
      year_of_purchase: currentInvestment?.year_of_purchase || '',
      month_of_purchase: currentInvestment?.month_of_purchase || '',
      duration: currentInvestment?.duration || '',
      vat_rate_on_investment: currentInvestment?.vat_rate_on_investment || '0%',
      contribution: currentInvestment?.contribution || ''
    },
    validationSchema: NewInvestmentSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;

        if (isEdit) {
          payload.id = currentInvestment.id;
          dispatch(updateInvestment(work.id, payload));
        } else {
          dispatch(createInvestment(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListInvestments(true);
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
    if (values.investment_type === 'Investissement financier') {
      setFieldValue('duration', 'Non amortissable');
    }
  }, [values.investment_type, setFieldValue]);

  useEffect(() => {
    if (values.contribution === 'Oui') {
      setFieldValue('vat_rate_on_investment', '0%');
    }
  }, [values.contribution, setFieldValue]);

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
                      label="Quelle est la nature de l'investissement ?"
                      error={Boolean(touched.investment_type && errors.investment_type)}
                      helperText={touched.investment_type && errors.investment_type}
                      value={values.investment_type}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('investment_type', event.target.value);
                      }}
                    >
                      {INVESTMENT_TYPE.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Card>
                <Card sx={{ p: 3 }}>
                  <div>
                    <TextField
                      select
                      fullWidth
                      label="S'agit-il d'un apport en nature ?"
                      error={Boolean(touched.contribution && errors.contribution)}
                      helperText={touched.contribution && errors.contribution}
                      value={values.contribution}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('contribution', event.target.value);
                      }}
                    >
                      {CONTRIBUTION_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Card>
                {values.contribution === 'Oui' && (
                  <InformationBox>
                    <p>
                      Un apport en capital sera généré automatiquement pour le même montant, la même année et le même
                      mois.
                    </p>
                    {/* <ul>
                    <li>
                      Un investissement incorporel est un actif non monétaire sans substance physique (un logiciel, un
                      brevet, une marque, un site internet, un fonds de commerce...).
                    </li>
                    <li>
                      Un investissement corporel est un actif physique (un véhicule, une machine, du gros matériel, du
                      mobilier, un immeuble...).
                    </li>
                    <li>
                      Un investissement financier est un actif financier durable (une caution, des actions ou des parts
                      sociales d'une autre société...).
                    </li>
                  </ul> */}
                  </InformationBox>
                )}
              </Stack>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box sx={{ p: 1 }}>
                    <Label
                      variant="filled"
                      color="warning"
                      sx={{ overflowWrap: 'break-word', display: 'inline', whiteSpace: 'break-spaces' }}
                    >
                      Un apport en nature est un bien, autre que de l'argent, apporté par un entrepreneur au capital de
                      son entreprise. Cet apport peut être réalisé lors de la création de l'entreprise (en "Année 1",
                      "Mois 1") ou ultérieurement, à l'occasion d'une augmentation de capital social.
                    </Label>
                  </Box>
                  <TextField
                    fullWidth
                    label="Nom de l'investissement"
                    {...getFieldProps('investment_name')}
                    error={Boolean(touched.investment_name && errors.investment_name)}
                    helperText={touched.investment_name && errors.investment_name}
                  />
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Montant hors taxes de l'investissement"
                    {...getFieldProps('investment_amount_tax_included')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.investment_amount_tax_included && errors.investment_amount_tax_included)}
                    helperText={touched.investment_amount_tax_included && errors.investment_amount_tax_included}
                    onChange={(e) => {
                      setFieldValue('investment_amount_tax_included', e.target.value.replace(/\D/, ''));
                    }}
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
                    label="Année de l'opération"
                    error={Boolean(touched.year_of_purchase && errors.year_of_purchase)}
                    helperText={touched.year_of_purchase && errors.year_of_purchase}
                    value={values.year_of_purchase}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('year_of_purchase', event.target.value);
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
                    label="Mois de l'opération"
                    error={Boolean(touched.month_of_purchase && errors.month_of_purchase)}
                    helperText={touched.month_of_purchase && errors.month_of_purchase}
                    value={values.month_of_purchase}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('month_of_purchase', event.target.value);
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
              {values.investment_type !== 'Investissement financier' && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Durée d'utilisation (en mois)"
                      error={Boolean(touched.duration && errors.duration)}
                      helperText={touched.duration && errors.duration}
                      value={values.duration}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('duration', event.target.value);
                      }}
                    >
                      {DURATIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Card>
              )}
              {values.investment_type === 'Investissement financier' && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="Durée d'utilisation (en mois)"
                      {...getFieldProps('duration')}
                    />
                  </Stack>
                </Card>
              )}
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <InformationBox>
                    <p>
                      En comptabilité, les investissements sont amortis sur leur durée réelle d'utilisation. Voici
                      quelques durées données à titre indicatif :
                    </p>
                    <ul>
                      {[
                        'Véhicule : entre 4 et 5 ans',
                        'Matériel : entre 7 et 10 ans',
                        'Matériel de bureau : entre 5 et 10 ans',
                        'Matériel informatique : 3 ans',
                        'Bâtiment : 20 ans au minimum'
                      ].map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                    <p>
                      Certains investissements ne sont pas amortissables. C'est notamment le cas des investissements
                      financiers, des terrains, de fonds de commerce et des droits au bail.
                    </p>
                  </InformationBox>
                </Stack>
              </Card>
              {values.contribution === 'Non' && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {vatBaseRegime && (
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Taux de TVA sur l'investissement"
                        {...getFieldProps('vat_rate_on_investment')}
                      />
                    )}
                    {!vatBaseRegime && (
                      <TextField
                        select
                        fullWidth
                        label="Taux de TVA sur l'investissement"
                        error={Boolean(touched.vat_rate_on_investment && errors.vat_rate_on_investment)}
                        helperText={touched.vat_rate_on_investment && errors.vat_rate_on_investment}
                        value={values.vat_rate_on_investment}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('vat_rate_on_investment', event.target.value);
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
              )}
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={() => setListInvestments(true)}
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
