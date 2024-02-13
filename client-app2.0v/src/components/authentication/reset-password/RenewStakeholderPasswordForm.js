import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
// material
import { Alert, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
//
import { MIconButton } from '../../@material-extend';

export default function RenewStakeholderPasswordForm() {
  const { renewStakeholderPassword } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const RenewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(9, 'Trop court!')
      .required('Mot de passe requis')
      .matches(/[@_!#$%^&*()<>?/|}{~:]/, 'Contient au moins un symbole parmi [@_!#$%^&*()<>?/|}{~:]')
      .matches(/\d+/, 'Contient au moins un chiffre 0 à 9')
      .matches(/[a-zA-Z]/, 'Contient au moins une lettre')
  });

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: RenewPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await renewStakeholderPassword(values.password);
        enqueueSnackbar('votre mot de passe a été modifié avec succès', {
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
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
      navigate(PATH_AUTH.login);
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Confirmer
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
