import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Box, Grid, Card, Stack, Switch, TextField, FormControlLabel, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { UploadAvatar } from '../../../upload';
// utils
import { fData } from '../../../../utils/formatNumber';
//
import countries from '../countries';
import { useDispatch, useSelector } from '../../../../redux/store';
import { updateProfile } from '../../../../redux/slices/user';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { account, profileUpdateSuccess, profileUpdateError, error } = useSelector((state) => state.user);
  const UpdateaccountSchema = Yup.object().shape({
    // displayName: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: account?.first_name || '',
      last_name: account?.last_name || '',
      email: account?.email,
      profile_image: account?.profile_image,
      telephone: account?.telephone
      // country: account.country,
      // address: account.address,
      // state: account.state,
      // city: account.city,
      // zipCode: account.zipCode,
      // about: account.about,
      // isPublic: account.isPublic
    },

    validationSchema: UpdateaccountSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([k, v]) => {
        if (k === 'profile_image') {
          if (v && v.file) {
            formData.append(k, v.file);
            const ext = v.file.name.substring(v.file.name.lastIndexOf('.') + 1);
            formData.append('content_type_ext', `image/${ext}`);
          }
          return;
        }
        formData.append(k, v);
      });
      dispatch(updateProfile(formData));
    }
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setSubmitting,
    setErrors
  } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('profile_image', {
          file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );
  useEffect(() => {
    if (profileUpdateError) {
      enqueueSnackbar('Update error', { variant: 'error' });
    }
    if (isMountedRef.current) {
      setErrors({ afterSubmit: error.code });
      setSubmitting(false);
    }
  }, [profileUpdateError]);

  useEffect(() => {
    if (profileUpdateSuccess) {
      enqueueSnackbar('Update success', { variant: 'success' });
    }
    if (isMountedRef.current) {
      setSubmitting(false);
    }
  }, [profileUpdateSuccess]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 2.5, px: 3, textAlign: 'center' }}>
              <UploadAvatar
                accept="image/*"
                file={values.profile_image}
                maxSize={3145728}
                onDrop={handleDrop}
                error={Boolean(touched.profile_image && errors.profile_image)}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {touched.profile_image && errors.profile_image}
              </FormHelperText>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Prenom" {...getFieldProps('first_name')} />
                  <TextField fullWidth label="Nom" {...getFieldProps('last_name')} />
                  <TextField fullWidth disabled label="Email Address" {...getFieldProps('email')} />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="telephone" {...getFieldProps('telephone')} />
                </Stack>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  // {...(Object.keys(touched).length === 0 ? { disabled: Object.keys(touched).length === 0 } : null)}
                >
                  Enregistrer les changements
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
