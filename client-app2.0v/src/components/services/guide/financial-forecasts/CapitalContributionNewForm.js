import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createCapitalContribution, updateCapitalContribution } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const CAPITAL_CONTRIBUTION_TYPE = ['Apport en numéraire', 'Apport en nature'];
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

CapitalContributionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCapitalContribution: PropTypes.object,
  setListCapitalContributions: PropTypes.func.isRequired
};

export default function CapitalContributionNewForm({
  isEdit,
  currentCapitalContribution,
  setListCapitalContributions
}) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);

  const NewCapitalContributionSchema = Yup.object().shape({
    type_capital_contribution: Yup.string().required("Type d'apport en capital est requis"),
    contribution_amount: Yup.string().when('type_capital_contribution', (partition) =>
      partition === 'Apport en numéraire' ? Yup.string().required() : Yup.string()
    ),
    year_of_contribution: Yup.string().when('type_capital_contribution', (partition) =>
      partition === 'Apport en numéraire' ? Yup.string().required() : Yup.string()
    ),
    month_of_contribution: Yup.string().when('type_capital_contribution', (partition) =>
      partition === 'Apport en numéraire' ? Yup.string().required() : Yup.string()
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentCapitalContribution?.project_id || '',
      type_capital_contribution: currentCapitalContribution?.type_capital_contribution || '',
      contribution_amount: currentCapitalContribution?.contribution_amount || '',
      year_of_contribution: currentCapitalContribution?.year_of_contribution || '',
      month_of_contribution: currentCapitalContribution?.month_of_contribution || ''
    },
    validationSchema: NewCapitalContributionSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;

        if (isEdit) {
          payload.id = currentCapitalContribution.id;
          dispatch(updateCapitalContribution(work.id, payload));
        } else {
          dispatch(createCapitalContribution(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListCapitalContributions(true);
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
              <Card sx={{ p: 3 }}>
                <div>
                  <TextField
                    select
                    fullWidth
                    label="Type d'apport en capital"
                    error={Boolean(touched.type_capital_contribution && errors.type_capital_contribution)}
                    helperText={touched.type_capital_contribution && errors.type_capital_contribution}
                    value={values.type_capital_contribution}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('type_capital_contribution', event.target.value);
                    }}
                  >
                    {CAPITAL_CONTRIBUTION_TYPE.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Card>
              {values.type_capital_contribution === 'Apport en nature' && (
                <>
                  <InformationBox>
                    <strong>
                      Pour ajouter un apport en nature, vous devez vous rendre sur la page "Investissements". L'apport
                      en nature est ensuite généré automatiquement.
                    </strong>
                  </InformationBox>
                  <InformationBox>
                    <p>
                      Un <b>apport en capital</b> peut prendre la forme d'un apport en numéraire ou d'un apport en
                      nature. Ils n'ont pas vocation à être récupérés. Dans les sociétés, ces apports donnent droit, en
                      contrepartie, à des actions ou des parts sociales.
                    </p>
                  </InformationBox>
                </>
              )}
              {values.type_capital_contribution === 'Apport en numéraire' && (
                <>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <InformationBox>
                        <p>
                          Les apports en numéraire correspondent aux apports de sommes d'argent effectués au capital de
                          l'entreprise.
                        </p>
                      </InformationBox>
                      <TextField
                        fullWidth
                        placeholder="0.00"
                        label="Montant de l'apport"
                        {...getFieldProps('contribution_amount')}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                          type: 'number'
                        }}
                        error={Boolean(touched.contribution_amount && errors.contribution_amount)}
                        helperText={touched.contribution_amount && errors.contribution_amount}
                        onChange={(e) => {
                          setFieldValue('contribution_amount', e.target.value.replace(/\D/, ''));
                        }}
                      />
                    </Stack>
                  </Card>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        select
                        fullWidth
                        label="Année de l'apport"
                        error={Boolean(touched.year_of_contribution && errors.year_of_contribution)}
                        helperText={touched.year_of_contribution && errors.year_of_contribution}
                        value={values.year_of_contribution}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('year_of_contribution', event.target.value);
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
                        label="Mois de l'apport"
                        error={Boolean(touched.month_of_contribution && errors.month_of_contribution)}
                        helperText={touched.month_of_contribution && errors.month_of_contribution}
                        value={values.month_of_contribution}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('month_of_contribution', event.target.value);
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
                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      type="button"
                      color="inherit"
                      variant="outlined"
                      size="large"
                      onClick={() => setListCapitalContributions(true)}
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
                </>
              )}
              {values.type_capital_contribution !== 'Apport en numéraire' && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    type="button"
                    color="inherit"
                    variant="outlined"
                    size="large"
                    onClick={() => setListCapitalContributions(true)}
                    sx={{ mr: 1.5 }}
                  >
                    Retour
                  </Button>
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
