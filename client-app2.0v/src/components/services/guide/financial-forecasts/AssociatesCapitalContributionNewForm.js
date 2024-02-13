import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { InformationBox } from '..';
import {
  createAssociateCapitalContribution,
  updateAssociateCapitalContribution
} from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const CAPITAL_CONTRIBUTION_TYPE = ["Apport en compte courant d'associé", "Remboursement de compte courant d'associé"];
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

AssociatesCapitalContributionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAssociatesCapitalContribution: PropTypes.object,
  setListAssociatesCapitalContributions: PropTypes.func.isRequired
};

export default function AssociatesCapitalContributionNewForm({
  isEdit,
  currentAssociatesCapitalContribution,
  setListAssociatesCapitalContributions
}) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);

  const NewAssociatesCapitalContributionSchema = Yup.object().shape({
    type_of_operation: Yup.string().required(),
    associate_capital_contribution_amount: Yup.string().required(),
    year_of_contribution_repayment: Yup.string().required(),
    month_of_contribution_repayment: Yup.string().required()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentAssociatesCapitalContribution?.project_id || '',
      type_of_operation: currentAssociatesCapitalContribution?.type_of_operation || '',
      associate_capital_contribution_amount:
        currentAssociatesCapitalContribution?.associate_capital_contribution_amount || '',
      year_of_contribution_repayment: currentAssociatesCapitalContribution?.year_of_contribution_repayment || '',
      month_of_contribution_repayment: currentAssociatesCapitalContribution?.month_of_contribution_repayment || ''
    },
    validationSchema: NewAssociatesCapitalContributionSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;

        if (isEdit) {
          payload.id = currentAssociatesCapitalContribution.id;
          dispatch(updateAssociateCapitalContribution(work.id, payload));
        } else {
          dispatch(createAssociateCapitalContribution(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListAssociatesCapitalContributions(true);
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
                  <InformationBox>
                    Un <strong>apport en compte courant d'associé</strong> est une avance de trésorerie effectuée par un
                    associé à la société. Cet apport n'entre pas dans la composition du capital social, il s'agit d'une
                    dette financière pour l'entreprise. Les modalités de remboursement de l'apport sont librement
                    définies.
                    <p>
                      <u>Attention</u> : le solde d'un compte courant d'associé ne doit pas être négatif lorsque
                      l'associé est une personne physique
                    </p>
                    <p>
                      Enfin, une convention de compte courant d'associé doit encadrer juridiquement le fonctionnement
                      des avances de trésorerie. Pour obtenir plus d'informations :{' '}
                      <a
                        href="https://www.lecoindesentrepreneurs.fr/convention-de-compte-courant-dassocie/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        la convention de compte courant d'associé
                      </a>
                    </p>
                  </InformationBox>
                  <TextField
                    select
                    fullWidth
                    label="Nature de l'opération"
                    error={Boolean(touched.type_of_operation && errors.type_of_operation)}
                    helperText={touched.type_of_operation && errors.type_of_operation}
                    value={values.type_of_operation}
                    onChange={(event) => {
                      event.preventDefault();
                      setFieldValue('type_of_operation', event.target.value);
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
              <>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      placeholder="0.00"
                      label={
                        values.type_of_operation === "Remboursement de compte courant d'associé"
                          ? 'Montant du remboursement'
                          : "Montant de l'apport"
                      }
                      {...getFieldProps('associate_capital_contribution_amount')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(
                        touched.associate_capital_contribution_amount && errors.associate_capital_contribution_amount
                      )}
                      helperText={
                        touched.associate_capital_contribution_amount && errors.associate_capital_contribution_amount
                      }
                      onChange={(e) => {
                        setFieldValue('associate_capital_contribution_amount', e.target.value.replace(/\D/, ''));
                      }}
                    />
                  </Stack>
                </Card>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Année de l'apport ou du remboursement"
                      error={Boolean(touched.year_of_contribution_repayment && errors.year_of_contribution_repayment)}
                      helperText={touched.year_of_contribution_repayment && errors.year_of_contribution_repayment}
                      value={values.year_of_contribution_repayment}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('year_of_contribution_repayment', event.target.value);
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
                      label="Mois de l'apport ou du remboursement"
                      error={Boolean(touched.month_of_contribution_repayment && errors.month_of_contribution_repayment)}
                      helperText={touched.month_of_contribution_repayment && errors.month_of_contribution_repayment}
                      value={values.month_of_contribution_repayment}
                      onChange={(event) => {
                        event.preventDefault();
                        setFieldValue('month_of_contribution_repayment', event.target.value);
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
                    onClick={() => setListAssociatesCapitalContributions(true)}
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
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
