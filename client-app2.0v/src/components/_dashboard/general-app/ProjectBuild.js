import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { useSnackbar } from 'notistack';
// material
import { styled } from '@mui/material/styles';
import { useCallback, useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Sheet } from '@mui/joy';
import { Stepper, Step, StepContent, StepLabel, Typography } from '@mui/material';
import ProjectType from './ProjectType';
import ProjectAddress from './ProjectAddress';
import ProjectActivitySector from './ProjectActivitySector';
import ProjectAdvancementStage from './ProjectAdvancementStage';
import { useDispatch, useSelector } from '../../../redux/store';
import { createProject } from '../../../redux/slices/project';
import ProjectName from './ProjectName';
import Logo from '../../Logo';
import SelectProject from '../../../layouts/dashboard/SelectProject';
import { hasProjects } from '../../../redux/slices/user';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  zIndex: 999,
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

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

ProjectBuild.propTypes = {
  displayName: PropTypes.string
};

export default function ProjectBuild({ displayName }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [projectType, setProjectType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectActivitySector, setProjectActivitySector] = useState('');
  const [projectAdvancementStage, setProjectAdvancementStage] = useState('');
  const [place, setPlace] = useState('');
  const [autoCompletePlace, setAutoCompletePlace] = useState([]);
  const [projectSearchableAddress, setProjectSearchableAddress] = useState('');
  const [errMissingField, setErrMissingFields] = useState(false);
  const { onCreateProjectSuccess, work } = useSelector((state) => state.project);
  const { projects } = useSelector((state) => state.user);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChangeProjectType = (event) => {
    setProjectType(event.target.value);
  };

  const handleChangeProjectName = (event) => {
    setProjectName(event.target.value);
  };

  const handleChangeAdvancementStage = (event, newValue) => {
    setProjectAdvancementStage(newValue);
  };

  const handleChangeActivitySector = (event, newValue) => {
    setProjectActivitySector(newValue);
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
    setPlace(e.target.value);
  };

  const debouncedHandlePlaceChange = useCallback(debounce(handlePlaceChange, 1000), []);

  const handleOnSelectPlace = (e, newValue) => {
    if (newValue && typeof newValue !== 'undefined') {
      setProjectSearchableAddress(newValue);
    }
  };

  const handleProjectBuild = () => {
    const data = {
      project_name: projectName,
      type_project: projectType,
      searchable_address: projectSearchableAddress,
      activity_sector: projectActivitySector,
      project_advancement_stage: projectAdvancementStage
    };
    const emptyFields = Object.keys(data).filter((k) => data[k] === '');
    if (emptyFields.length > 0) {
      setErrMissingFields(true);
      return;
    }
    setErrMissingFields(false);
    dispatch(createProject(data));
  };

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => () => debouncedHandlePlaceChange.cancel(), []);

  useEffect(async () => {
    if (place && typeof place !== 'undefined' && place !== '') {
      const res = await fetchPlace();
      if (res.error) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return;
      }
      if (res.features) {
        setAutoCompletePlace(res.features.map((place) => place.place_name));
      }
    }
  }, [place]);

  useEffect(() => {
    if (onCreateProjectSuccess) {
      enqueueSnackbar('your project build was a success', { variant: 'success' });
      dispatch(hasProjects());
    }
  }, [onCreateProjectSuccess]);

  return (
    <RootStyle>
      <CardContent>
        <Typography gutterBottom sx={{ typography: 'h3' }}>
          Bienvenue {!displayName ? '...' : displayName}!
        </Typography>
        <Typography gutterBottom sx={{ typography: 'h5' }}>
          Votre guide de démarrage rapide de votre premier projet sur guidhub!
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel optional={index === 4 ? <Typography variant="caption">Last step</Typography> : null}>
                {step.label}
              </StepLabel>
              <StepContent>
                {index === 0 && <ProjectName field={projectName} handleChange={handleChangeProjectName} />}
                {index === 1 && <ProjectType field={projectType} handleChange={handleChangeProjectType} />}
                {index === 2 && (
                  <ProjectAddress
                    handleChangePlace={debouncedHandlePlaceChange}
                    onSelectPlace={handleOnSelectPlace}
                    autoCompletePlace={autoCompletePlace}
                    projectSearchableAddress={projectSearchableAddress}
                  />
                )}
                {index === 3 && (
                  <ProjectActivitySector field={projectActivitySector} handleChange={handleChangeActivitySector} />
                )}
                {index === 4 && (
                  <ProjectAdvancementStage
                    field={projectAdvancementStage}
                    handleChange={handleChangeAdvancementStage}
                  />
                )}
                <Box sx={{ mt: 3 }}>
                  <Button disabled={index === 0} onClick={handleBack}>
                    Arriéré
                  </Button>
                  <Button variant="contained" onClick={index === steps.length - 1 ? handleProjectBuild : handleNext}>
                    {index === steps.length - 1 ? 'Enregistrer' : 'Valider'}
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

        {errMissingField && (
          <Typography gutterBottom variant="body2" sx={{ color: 'red' }}>
            Champ manquant, vérifiez si tous les champs obligatoires sont remplis.
          </Typography>
        )}
      </CardContent>
    </RootStyle>
  );
}
