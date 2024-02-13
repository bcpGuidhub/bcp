import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Card, MenuItem, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { updateProjectLegalStatus } from '../../../../redux/slices/project';
import { useDispatch } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const LEGAL_OPTIONS = ['Je ne sais pas encore', 'Entreprise individuelle', 'EIRL', 'EURL', 'SARL', 'SASU', 'SAS'];

// ----------------------------------------------------------------------
Legal.propTypes = {
  id: PropTypes.string.isRequired,
  legalFormalities: PropTypes.object.isRequired
};

export default function Legal({ id, legalFormalities }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const theme = useTheme();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [initialState, setInitialState] = useState({
    legal_status_idea: legalFormalities?.legal_status_idea || '',
    id,
    tax_system: legalFormalities?.tax_system || 'IR',
    company_vat_regime: legalFormalities?.company_vat_regime || 'Franchise en base de TVA',
    management_stake: legalFormalities?.management_stake || '',
    social_security_scheme: legalFormalities?.social_security_scheme || ''
  });
  const LegalStatusSchema = Yup.object().shape({
    legal_status_idea: Yup.string().required('statut juridique est manquant')
  });

  const preValidation = (values) => {
    if (values.legal_status_idea === 'SARL') {
      values.management_stake = values.management_stake === '' ? 'La gérance est majoritaire' : values.management_stake;
      values.social_security_scheme =
        values.social_security_scheme === '' || values.management_stake === 'La gérance est majoritaire'
          ? 'Sécurité sociale des indépendants'
          : 'Régime général de la sécurité sociale';
    } else if (['Entreprise individuelle', 'EIRL', 'EURL', 'SASU'].includes(values.legal_status_idea)) {
      if (values.legal_status_idea === 'Entreprise individuelle') {
        values.tax_system = 'IR';
      }
      if (values.legal_status_idea === 'SASU') {
        if (values.tax_system !== 'IR' || values.tax_system !== 'IS') {
          values.tax_system = 'IS';
        }
        values.social_security_scheme = 'Régime général de la sécurité sociale';
      } else {
        values.social_security_scheme = 'Sécurité sociale des indépendants';
      }
    } else {
      values.social_security_scheme = 'Régime général de la sécurité sociale';
    }
  };

  const formik = useFormik({
    initialValues: initialState,
    enableReinitialize: true,
    validationSchema: LegalStatusSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        preValidation(values);
        if (values.legal_status_idea === '') {
          enqueueSnackbar('Aucune valeur sélectionnée', { variant: 'info' });
          return;
        }
        dispatch(updateProjectLegalStatus(id, values));
        enqueueSnackbar('Vos changements ont été enregistrés', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, handleBlur } = formik;

  useEffect(() => {
    setInitialState({ ...initialState, ...legalFormalities });
  }, [legalFormalities]);

  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            select
            fullWidth
            label="Statut juridique"
            error={Boolean(touched.legal_status_idea && errors.legal_status_idea)}
            helperText={touched.legal_status_idea && errors.legal_status_idea}
            value={values.legal_status_idea}
            onChange={(event) => {
              event.preventDefault();
              setFieldValue('legal_status_idea', event.target.value);
            }}
            onBlur={handleBlur}
            name="legal_status_idea"
          >
            {LEGAL_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {isCreator && (
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 4, [theme.breakpoints.down('sm')]: { mt: 1 } }}
            >
              valider
            </LoadingButton>
          )}
        </Form>
      </FormikProvider>
    </>
  );
}
