import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
import fakeRequest from '../../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
//
import Label from '../../../Label';
import { UploadAvatar } from '../../../upload';
import countries from '../../../_dashboard/user/countries';
import { QuillEditor } from '../../../editor';
import { useDispatch, useSelector } from '../../../../redux/store';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import {
  createProjectStakeholder,
  fetchProjectStakeholder,
  createProjectStakeholderProgress
} from '../../../../redux/slices/project';
import { MHidden } from '../../../@material-extend';
import NewStakeholderMobile from './NewStakeholderMobile';

// ----------------------------------------------------------------------

NewStakeHolder.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleAddStakeholder: PropTypes.func.isRequired
};

export default function NewStakeHolder({ isEdit, currentUser, handleAddStakeholder }) {
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { createStakeholderSuccess, createStakeholderError, error, work } = useSelector((state) => state.project);

  const NewStakeHolderSchema = Yup.object().shape({
    first_name: Yup.string().required('Le prénom est requis'),
    last_name: Yup.string().required('Le nom est requis'),
    email: Yup.string().required("L'e-mail est requis").email(),
    role: Yup.string().required('Le rôle est requis'),
    role_details: Yup.mixed().required('Les détails du rôle sont requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      role_details: currentUser?.role_details || '',
      profile_image: currentUser?.profile_image || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status || null,
      role: currentUser?.role || ''
    },
    validationSchema: NewStakeHolderSchema,
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
      dispatch(createProjectStakeholderProgress());
      dispatch(createProjectStakeholder(work.id, formData));
      handleAddStakeholder(false);
    }
  });

  useEffect(() => {
    if (createStakeholderError) {
      enqueueSnackbar('stakeholder create error', { variant: 'error' });
    }
    if (isMountedRef.current) {
      if (error) {
        setErrors({ afterSubmit: error.code });
      }

      setSubmitting(false);
    }
  }, [createStakeholderError]);

  useEffect(() => {
    if (createStakeholderSuccess) {
      enqueueSnackbar('stakeholder create success', { variant: 'success' });
    }
    if (isMountedRef.current) {
      setSubmitting(false);
    }
  }, [createStakeholderSuccess]);

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

  const mobileView = () => (
    <NewStakeholderMobile
      errors={errors}
      values={values}
      touched={touched}
      getFieldProps={getFieldProps}
      setFieldValue={setFieldValue}
      handleDrop={handleDrop}
    />
  );

  const largerScreenView = () => (
    <>
      <Grid container spacing={1} sx={{ p: 1 }}>
        <Grid item xs={12}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label="Prenom"
                {...getFieldProps('first_name')}
                error={Boolean(touched.first_name && errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
              <TextField
                fullWidth
                label="Nom"
                {...getFieldProps('last_name')}
                error={Boolean(touched.last_name && errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Stack>
            <Stack>
              <TextField
                fullWidth
                label="Adresse e-mail"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Stack>

            <Stack spacing={{ xs: 3, sm: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Rôle"
                  {...getFieldProps('role')}
                  error={Boolean(touched.role && errors.role)}
                  helperText={touched.role && errors.role}
                />
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ py: 2, px: 1 }}>
            {isEdit && (
              <Label
                color={(values.status === 0 && 'error') || (values.status === 1 && 'success')}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 0 && sentenceCase('mot de passe en attente')}
                {values.status === 1 && sentenceCase('vérifié')}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
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
                    Autorisé *.jpeg, *.jpg, *.png, *.gif
                    <br /> taille maximale de {fData(3145728)}
                  </Typography>
                }
              />
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {touched.profile_image && errors.profile_image}
              </FormHelperText>
            </Box>
            {/* 
          {isEdit && (
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  onChange={(event) => setFieldValue('status', event.target.checked ? 'banned' : 'active')}
                  checked={values.status !== 'active'}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Banned
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Apply disable account
                  </Typography>
                </>
              }
              sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
            />
          )} */}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Label
              color="info"
              sx={{
                width: '100%',
                borderRadius: 0,
                mt: 2,
                p: 2
              }}
            >
              Détails du rôle
            </Label>
            <QuillEditor
              id="compose-mail"
              sx={{
                border: 'none',
                borderRadius: 0
              }}
              value={values.role_details}
              onChange={(val) => setFieldValue('role_details', val)}
            />
          </Box>
        </Grid>
      </Grid>
      {Object.keys(errors).length === 0 && Object.keys(touched).length > 0 && (
        <Box sx={{ m: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Créer un partenaire' : 'Enregistrer les changements'}
          </LoadingButton>
        </Box>
      )}
    </>
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <MHidden width="mdDown">{largerScreenView()}</MHidden>
        <MHidden width="mdUp">{mobileView()}</MHidden>
      </Form>
    </FormikProvider>
  );
}
