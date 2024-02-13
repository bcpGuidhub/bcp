import PropTypes from 'prop-types';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
// material
import {
  Alert,
  Card,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
// hooks
import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../routes/paths';
//
import { MIconButton } from '../@material-extend';

// ----------------------------------------------------------------------
ProjectStakeholderAuthNewForm.propTypes = {
  token: PropTypes.string.isRequired
};

export default function ProjectStakeholderAuthNewForm({ token }) {
  const { authStakeholder } = useAuth();
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const ProjectStakeholderAuthSchema = Yup.object().shape({
    password: Yup.string()
      .min(9, 'Trop court!')
      .required('Mot de passe requis')
      .matches(/[@_!#$%^&*()<>?/|}{~:]/, 'Contient au moins un symbole parmi [@_!#$%^&*()<>?/|}{~:]')
      .matches(/\d+/, 'Contient au moins un chiffre 0 à 9')
      .matches(/[a-zA-Z]/, 'Contient au moins une lettre'),
    confirm_password: Yup.string()
      .min(9, 'Trop court!')
      .required('Confirmation Mot de passe requis')
      .matches(/[@_!#$%^&*()<>?/|}{~:]/, 'Contient au moins un symbole parmi [@_!#$%^&*()<>?/|}{~:]')
      .matches(/\d+/, 'Contient au moins un chiffre 0 à 9')
      .matches(/[a-zA-Z]/, 'Contient au moins une lettre')
    // rgdp_consent: Yup.bool()
    //   .oneOf([true], 'Accepter les conditions générales est requis')
    //   .required('Accepter les conditions générales est requis'),
    // cgu_consent: Yup.bool()
    //   .oneOf([true], 'Accepter les conditions générales est requis')
    //   .required('Accepter les conditions générales est requis')
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
      // rgdp_consent: false,
      // cgu_consent: false
    },
    validationSchema: ProjectStakeholderAuthSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        if (values.password !== values.confirm_password) {
          if (isMountedRef.current) {
            setSubmitting(false);
            setErrors({ afterSubmit: 'password must match' });
          }
          return;
        }

        await authStakeholder(values.password, token);
        enqueueSnackbar('Your account added password success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        navigate(PATH_AUTH.verifyStakeholder);
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Mot de passe"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
              <TextField
                fullWidth
                autoComplete="confirm_password"
                type={showPassword ? 'text' : 'password'}
                label="Mot de passe"
                {...getFieldProps('confirm_password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.confirm_password && errors.confirm_password}
              />
            </Stack>
          </Card>
          {/* <Stack>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('rgdp_consent')} name="rgdp_consent" />}
              label="J’accepte la politique de confidentialité."
            />

            {touched.rgdp_consent && errors.rgdp_consent && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.rgdp_consent}
              </FormHelperText>
            )}
          </Stack>
          <Stack>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('cgu_consent')} name="cgu_consent" />}
              label="J'ai lu et j'accepte les conditions générales d'utilisation du
              site."
            />

            {touched.cgu_consent && errors.cgu_consent && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.cgu_consent}
              </FormHelperText>
            )}
          </Stack> */}
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Valider
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
