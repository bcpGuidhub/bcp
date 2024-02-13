import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useSnackbar } from 'notistack';
import { Sheet } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';

import { LoadingButton } from '@mui/lab';
import { Button, Stepper, Step, StepContent, StepLabel, Box, Card, Grid, Typography } from '@mui/material';

import { PATH_DASHBOARD } from '../../../routes/paths';
import { useDispatch, useSelector } from '../../../redux/store';
import { createProject } from '../../../redux/slices/project';
import {
  ProjectActivitySector,
  ProjectAddress,
  ProjectAdvancementStage,
  ProjectName,
  ProjectType
} from '../general-app';
import API from '../../../utils/axios';
import { hasProjects } from '../../../redux/slices/user';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Nom du projet'
  },
  {
    label: 'Quelle est la nature de votre projet entrepreneurial ?'
  },
  {
    label: 'Lieu du projet'
  },
  {
    label: "Quelle est l'activité de votre future entreprise ?"
  },
  {
    label: "Quel est votre stade d'avancement dans votre projet ?"
  }
];

ProjectNewForm.propTypes = {
  isEdit: PropTypes.bool
};

export default function ProjectNewForm({ isEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentProject = null;
  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [place, setPlace] = useState('');
  const [autoCompletePlace, setAutoCompletePlace] = useState([]);

  const { onCreateProjectSuccess } = useSelector((state) => state.project);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const fetchPlace = async () => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?proximity=ip&access_token=${process.env.REACT_APP_MAP_API_KEY}`
      );
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    } catch (err) {
      return { error: 'Unable to retrieve places' };
    }
  };

  const handlePlaceChange = async (e) => {
    if (e && e.target.value) {
      setPlace(e.target.value);
    }
  };

  const debouncedHandlePlaceChange = useCallback(debounce(handlePlaceChange, 1000), []);

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => () => debouncedHandlePlaceChange.cancel(), []);

  useEffect(async () => {
    const res = await fetchPlace();
    if (res.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
      return;
    }
    if (res.features) {
      setAutoCompletePlace(res.features.map((place) => place.place_name));
    }
  }, [place]);

  const NewProjectSchema = Yup.object().shape({
    project_name: Yup.string().required('Le nom est requis'),
    type_project: Yup.string().required('Le type de projet est requis'),
    searchable_address: Yup.string().required("L'adresse est requise"),
    activity_sector: Yup.string().required("Le secteur d'activité est requis"),
    project_advancement_stage: Yup.string().required('Champ requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_name: currentProject?.project_name || '',
      type_project: currentProject?.type_project || '',
      searchable_address: currentProject?.searchable_address || '',
      activity_sector: currentProject?.activity_sector || '',
      project_advancement_stage: currentProject?.project_advancement_stage || ''
    },
    validationSchema: NewProjectSchema,
    validator: () => ({}),
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await API.post(`v1/user/projects/new`, values);
        enqueueSnackbar(!isEdit ? 'Créé' : 'Mis à jour', { variant: 'success' });
        resetForm();
        setSubmitting(false);
        dispatch(hasProjects());
        navigate(PATH_DASHBOARD.project.root);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const handleOnSelectPlace = (e, newValue) => {
    if (newValue && typeof newValue !== 'undefined') {
      setFieldValue('searchable_address', newValue);
    }
  };

  const handleChangeProjectType = (event) => {
    setFieldValue('type_project', event.target.value);
  };

  const handleChangeProjectName = (event) => {
    setFieldValue('project_name', event.target.value);
  };

  const handleChangeAdvancementStage = (event, newValue) => {
    if (newValue) {
      setFieldValue('project_advancement_stage', newValue);
    }
  };

  const handleChangeActivitySector = (event, newValue) => {
    setFieldValue('activity_sector', newValue);
  };

  const { errors, values, handleSubmit, isSubmitting, setFieldValue, touched } = formik;

  useEffect(() => {
    if (onCreateProjectSuccess) {
      enqueueSnackbar(!isEdit ? 'Créé' : 'Mis à jour', { variant: 'success' });
      navigate(PATH_DASHBOARD.project.root);
    }
  }, [onCreateProjectSuccess]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={index === 4 ? <Typography variant="caption">Dernière étape</Typography> : null}
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      {index === 0 && (
                        <ProjectName field={values.project_name} handleChange={handleChangeProjectName} />
                      )}
                      {index === 1 && (
                        <ProjectType field={values.type_project} handleChange={handleChangeProjectType} />
                      )}
                      {index === 2 && (
                        <ProjectAddress
                          handleChangePlace={debouncedHandlePlaceChange}
                          onSelectPlace={handleOnSelectPlace}
                          autoCompletePlace={autoCompletePlace}
                          projectSearchableAddress={values.searchable_address}
                        />
                      )}
                      {index === 3 && (
                        <ProjectActivitySector
                          field={values.activity_sector}
                          handleChange={handleChangeActivitySector}
                        />
                      )}
                      {index === 4 && (
                        <ProjectAdvancementStage
                          field={values.project_advancement_stage}
                          handleChange={handleChangeAdvancementStage}
                        />
                      )}
                      <Box sx={{ mt: 3 }}>
                        {index === steps.length - 1 && (
                          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Enregistrer
                          </LoadingButton>
                        )}
                        {index < steps.length - 1 && (
                          <Button variant="contained" onClick={handleNext}>
                            Valider
                          </Button>
                        )}
                        <Button disabled={index === 0} onClick={handleBack}>
                          Arriéré
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {activeStep === steps.length && (
                <Sheet sx={{ p: 3, mt: 3, bgcolor: 'grey.50012' }}>
                  <Typography paragraph>Toutes les étapes sont terminées</Typography>
                  <Button onClick={handleReset}>Réinitialiser</Button>
                </Sheet>
              )}

              {isSubmitting &&
                Object.keys(errors).length > 0 &&
                Object.keys(errors).map((error) => (
                  <Box key={error}>
                    touched[error] && (
                    <Typography gutterBottom variant="body2" sx={{ color: 'red' }}>
                      Champ manquant, vérifiez si tous les champs obligatoires sont remplis.
                    </Typography>
                    )
                  </Box>
                ))}
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
