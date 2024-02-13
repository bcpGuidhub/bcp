import { Stepper, Step, Box, StepLabel, Button, Stack, TextField, Typography, FormHelperText } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { fData } from '../../../../utils/formatNumber';
import Label from '../../../Label';
import { QuillEditor } from '../../../editor';
import { UploadAvatar } from '../../../upload';

const steps = ['Nom', 'E-mail et rôle', 'Avatar', 'Détails du rôle'];

NewStakeholderMobile.propTypes = {
  errors: PropTypes.object,
  values: PropTypes.object,
  touched: PropTypes.object,
  getFieldProps: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired
};
export default function NewStakeholderMobile({ errors, values, touched, getFieldProps, setFieldValue, handleDrop }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => step === 2;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("Vous ne pouvez pas sauter une étape qui n'est pas facultative.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => setActiveStep(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel sx={{ color: '#fff !important' }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>Toutes les étapes sont terminées</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button sx={{ color: '#fff !important' }} onClick={handleReset}>
              Réinitialiser
            </Button>
          </Box>
        </>
      ) : (
        <>
          {activeStep === 0 && (
            <Stack direction="row" spacing={1}>
              <TextField
                sx={{ color: '#fff !important' }}
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
          )}
          {activeStep === 1 && (
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                label="Adresse e-mail"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                label="Rôle"
                {...getFieldProps('role')}
                error={Boolean(touched.role && errors.role)}
                helperText={touched.role && errors.role}
              />
            </Stack>
          )}
          {activeStep === 2 && (
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
          )}
          {activeStep === 3 && (
            <Box>
              <QuillEditor
                sx={{
                  border: 'none',
                  borderRadius: 0
                }}
                id="post-content"
                value={values.role_details}
                onChange={(val) => setFieldValue('role_details', val)}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Arriéré
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Passer
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <LoadingButton type="submit" variant="contained">
                Enregistrer
              </LoadingButton>
            ) : (
              <Button onClick={handleNext}>Suivant</Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
