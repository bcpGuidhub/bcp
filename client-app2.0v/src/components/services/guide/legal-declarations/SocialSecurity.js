import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { InformationBox } from '..';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Block } from '../../../../pages/components-overview/Block';
import { updateProjectLegalStatus } from '../../../../redux/slices/project';
import { useDispatch } from '../../../../redux/store';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = ['Mensuellement', 'Trimestriellement'];

DeclarePayCotisations.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  microEntrepriseDeclarePayCotisations: PropTypes.string.isRequired
};

export function DeclarePayCotisations({
  touched,
  errors,
  values,
  setFieldValue,
  microEntrepriseDeclarePayCotisations
}) {
  return (
    <TextField
      select
      fullWidth
      error={Boolean(touched.microEntrepriseDeclarePayCotisations && errors.microEntrepriseDeclarePayCotisations)}
      helperText={touched.microEntrepriseDeclarePayCotisations && errors.microEntrepriseDeclarePayCotisations}
      value={
        values.microEntrepriseDeclarePayCotisations
          ? values.microEntrepriseDeclarePayCotisations
          : microEntrepriseDeclarePayCotisations
      }
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('microEntrepriseDeclarePayCotisations', event.target.value);
      }}
    >
      {PAYMENT_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ----------------------------------------------------------------------

const ACRE_OPTIONS = ['Oui', 'Non'];

ACRE.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  microEntrepriseAccreExemption: PropTypes.string.isRequired
};

export function ACRE({ touched, errors, values, setFieldValue, microEntrepriseAccreExemption }) {
  return (
    <TextField
      select
      fullWidth
      label="ACRE"
      error={Boolean(touched.microEntrepriseAccreExemption && errors.microEntrepriseAccreExemption)}
      helperText={touched.microEntrepriseAccreExemption && errors.microEntrepriseAccreExemption}
      value={
        values.microEntrepriseAccreExemption ? values.microEntrepriseAccreExemption : microEntrepriseAccreExemption
      }
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('microEntrepriseAccreExemption', event.target.value);
      }}
    >
      {ACRE_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ----------------------------------------------------------------------

const SARL_SHAREHOLDER_OPTIONS = [
  'La gérance est majoritaire',
  'La gérance est égalitaire',
  'La gérance est minoritaire',
  'Les gérants ne sont pas associés'
];
SARLShareHolderSelection.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  managementStake: PropTypes.string.isRequired
};

export function SARLShareHolderSelection({ touched, errors, values, setFieldValue, managementStake }) {
  return (
    <TextField
      select
      fullWidth
      label="Pourcentage de participation"
      error={Boolean(touched.managementStake && errors.managementStake)}
      helperText={touched.managementStake && errors.managementStake}
      value={values.managementStake ? values.managementStake : managementStake}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('managementStake', event.target.value);
      }}
    >
      {SARL_SHAREHOLDER_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' }
};

SocialSecurity.propTypes = {
  id: PropTypes.string.isRequired,
  legalStatus: PropTypes.string.isRequired,
  socialSecurityScheme: PropTypes.string.isRequired,
  helperInformation: PropTypes.object.isRequired,
  managementStake: PropTypes.string.isRequired,
  microEntrepriseAccreExemption: PropTypes.string.isRequired,
  microEntrepriseDeclarePayCotisations: PropTypes.string.isRequired
};

export default function SocialSecurity({
  id,
  legalStatus,
  socialSecurityScheme,
  managementStake,
  microEntrepriseAccreExemption,
  microEntrepriseDeclarePayCotisations,
  helperInformation
}) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [initialState, setInitialState] = useState({
    id,
    microEntrepriseDeclarePayCotisations,
    microEntrepriseAccreExemption,
    socialSecurityScheme,
    managementStake
  });

  const SocialSecuritySystemSchema = Yup.object().shape({
    socialSecurityScheme: Yup.string(),
    managementStake: Yup.string(),
    microEntrepriseAccreExemption: Yup.string(),
    microEntrepriseDeclarePayCotisations: Yup.string()
  });
  const formik = useFormik({
    initialValues: initialState,
    enableReinitialize: true,
    validationSchema: SocialSecuritySystemSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        if (values.socialSecurityScheme === '') {
          enqueueSnackbar('Aucune valeur sélectionnée', { variant: 'info' });
          return;
        }
        dispatch(
          updateProjectLegalStatus(id, {
            id,
            micro_entreprise_declare_pay_cotisations:
              values.microEntrepriseDeclarePayCotisations || microEntrepriseDeclarePayCotisations,
            micro_entreprise_accre_exemption: values.microEntrepriseAccreExemption || microEntrepriseAccreExemption,
            social_security_scheme: socialSecurityScheme,
            management_stake: values.managementStake || managementStake
          })
        );
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

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue } = formik;

  useEffect(() => {
    setInitialState({
      ...initialState,
      id,
      legalStatus,
      socialSecurityScheme,
      managementStake,
      microEntrepriseAccreExemption,
      microEntrepriseDeclarePayCotisations
    });
  }, [
    id,
    legalStatus,
    socialSecurityScheme,
    managementStake,
    microEntrepriseAccreExemption,
    microEntrepriseDeclarePayCotisations
  ]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Block title="Statut juridique de votre entreprise" sx={{ style }}>
            <TextField disabled fullWidth label={legalStatus} variant="filled" defaultValue={legalStatus} />
          </Block>
          <Block title="Votre régime de sécurité sociale" sx={{ style }}>
            {legalStatus && (
              <InformationBox>
                <Typography sx={{ color: 'text.secondary' }} variant="h4" gutterBottom>
                  {helperInformation[legalStatus]}
                </Typography>
              </InformationBox>
            )}
            <TextField
              disabled
              fullWidth
              label={socialSecurityScheme}
              variant="filled"
              defaultValue={socialSecurityScheme}
            />
          </Block>
          {legalStatus === 'SARL' && (
            <Block title="Quel est le pourcentage de participation de la gérance ?" sx={{ style }}>
              <SARLShareHolderSelection
                managementStake={managementStake}
                touched={touched}
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
              />
            </Block>
          )}
          {socialSecurityScheme === 'Régime micro-social' && (
            <>
              <Block title="Bénéficiez-vous de l’exonération ACRE ?" sx={{ style }}>
                <ACRE
                  microEntrepriseAccreExemption={microEntrepriseAccreExemption}
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <InformationBox>
                  <p>
                    L'ACRE, Aide à la Création et à la Reprise d'Entreprise, consiste en une exonération partielle de
                    charges sociales en début d'activité (les 12 premiers mois). Vous êtes éligible à l'ACRE si vous
                    créez ou reprenez une activité économique industrielle, commerciale, artisanale, agricole ou
                    libérale, sous forme d'entreprise individuelle ou de société, à condition d'en exercer effectivement
                    le contrôle.
                  </p>
                  <p>
                    Pour plus d'informations à propos de cette aide :{' '}
                    <a href="" target="_blank">
                      L'ACRE
                    </a>{' '}
                    (source : service-public.fr)
                  </p>
                </InformationBox>
              </Block>
              <Block
                title="Comment souhaitez-vous déclarer et payer vos cotisations
                sociales ?"
                sx={{ style }}
              >
                <DeclarePayCotisations
                  microEntrepriseDeclarePayCotisations={microEntrepriseDeclarePayCotisations}
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Block>
            </>
          )}
        </Stack>
        {isCreator && (
          <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 4 }}>
            valider
          </LoadingButton>
        )}
      </Form>
    </FormikProvider>
  );
}
