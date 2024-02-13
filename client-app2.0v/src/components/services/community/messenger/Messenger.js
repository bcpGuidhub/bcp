import { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import debounce from 'lodash.debounce';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  LinearProgress,
  Typography,
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../Page';
import { EmbeddedMessenger, MessengerSidebar, MessengerWindow } from '.';

import useWebSocket from '../../../../hooks/useChatWebSocket';
import useInquistWebSocket from '../../../../hooks/useInquistWebSocket';
import { ProjectActivitySector, ProjectAddress } from '../../../_dashboard/general-app';
import API from '../../../../utils/axios';
import { hasProjects } from '../../../../redux/slices/user';
import { UploadAvatar } from '../../../upload';
import { fData } from '../../../../utils/formatNumber';
import { resetActiveConversation, resetConversationMessages } from '../../../../redux/slices/messenger';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { isProjectSelected } from '../../../../redux/slices/project';

Messenger.propTypes = {
  embedded: PropTypes.bool,
  onClose: PropTypes.func
};

export default function Messenger({ embedded, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const { themeStretch } = useSettings();
  const timerIdRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [place, setPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoCompletePlace, setAutoCompletePlace] = useState([]);
  const {
    webSocket: websocketMessenger,
    getConversations,
    getContacts,
    leaveConversation,
    sendMessage
  } = useWebSocket();
  const { projects, isLoading: isLoadingProjects } = useSelector((state) => state.user);
  const { activeConversationId, messages } = useSelector((state) => state.messenger);
  const handleClose = () => {
    setOpen(false);
  };

  const NewProjectSchema = Yup.object().shape({
    activity_sector: Yup.string().required("le secteur d'activité est requis")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      activity_sector: '',
      profile_image: '',
      searchable_address: ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
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
        setIsLoading(true);
        const response = await API.post(`v1/user/activity_sector/new`, formData);
        const project = JSON.stringify(response.data);
        localStorage.removeItem('selected_project');
        localStorage.setItem('selected_project', project);
        enqueueSnackbar('Create success', { variant: 'success' });
        setIsLoading(false);
        resetForm();
        setSubmitting(false);
        dispatch(hasProjects());
        dispatch(isProjectSelected());
        window.location.reload(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
        setIsLoading(false);
      }
    }
  });

  const { errors, values, handleSubmit, setFieldValue, touched } = formik;

  const handleChangeActivitySector = (event, newValue) => {
    setFieldValue('activity_sector', newValue);
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

  const handlePlaceChange = async (e) => {
    if (e && e.target.value) {
      setPlace(e.target.value);
    }
  };

  const handleOnSelectPlace = (e, newValue) => {
    if (newValue && typeof newValue !== 'undefined') {
      setFieldValue('searchable_address', newValue);
    }
  };

  const debouncedHandlePlaceChange = useCallback(debounce(handlePlaceChange, 1000), []);

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => () => debouncedHandlePlaceChange.cancel(), []);

  useEffect(async () => {
    if (place && place !== '') {
      const res = await fetchPlace();
      if (res.error) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return;
      }
      if (res.features) {
        const n = res.features.map((place) => place.place_name);
        setAutoCompletePlace(n);
      }
    }
  }, [place]);

  useEffect(() => {
    if (projects) {
      if (websocketMessenger && (websocketMessenger.readyState === 0 || websocketMessenger.readyState === 1)) {
        const pollingCallback = () => {
          getConversations();
          getContacts();
        };

        const startPolling = () => {
          timerIdRef.current = setInterval(pollingCallback, 3000);
        };

        startPolling();
        const stopPolling = () => {
          clearInterval(timerIdRef.current);
        };

        return () => {
          stopPolling();
        };
      }
    }
  }, [projects, websocketMessenger]);

  useEffect(() => {
    if (projects) {
      if (websocketMessenger && (websocketMessenger.readyState === 0 || websocketMessenger.readyState === 1)) {
        getConversations();
        getContacts();
      }
    }
  }, [projects, websocketMessenger]);

  useEffect(() => {
    if (!projects) {
      setOpen(true);
    }
  }, [projects]);

  useEffect(() => {
    if (isLoadingProjects === false) {
      setIsLoadingComplete(true);
    }
  }, [isLoadingProjects]);

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.hub.new) {
      if (activeConversationId) {
        leaveConversation(activeConversationId);
        dispatch(resetActiveConversation());
      }

      if (messages.length > 0) {
        dispatch(resetConversationMessages());
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (activeConversationId && typeof activeConversationId !== 'undefined' && activeConversationId !== '') {
      navigate(PATH_DASHBOARD.hub.conversation.replace(':conversationKey', activeConversationId));
    }
  }, [activeConversationId]);

  return (
    <>
      {isLoadingComplete && (
        <>
          {projects && (
            <>
              {embedded ? (
                <>
                  <EmbeddedMessenger onClose={onClose} />
                </>
              ) : (
                <Page title="GuidHub Community">
                  <Card
                    sx={{
                      bottom: '0px',
                      top: '54px',
                      right: '0px',

                      [theme.breakpoints.up('lg')]: {
                        left: 76
                      },
                      [theme.breakpoints.down('lg')]: {
                        left: 0
                      },
                      // height: '92vh',
                      display: 'flex',
                      borderRadius: 0,
                      position: 'fixed'
                    }}
                  >
                    <MessengerSidebar />
                    <MessengerWindow />
                  </Card>
                </Page>
              )}
            </>
          )}
          {!projects && (
            <Dialog
              open={open}
              fullScreen
              onClose={handleClose}
              fullWidth
              sx={{
                '& .MuiDialog-paper': {
                  backgroundSize: 'cover',
                  backgroundImage: `url("/static/illustrations/Team growing lightbulb plant.jpg")`,
                  boxShadow: 'inset 0 0 0 2000px rgba(216, 233, 231, 0.6)'
                }
              }}
            >
              <Box>
                <DialogTitle
                  sx={{
                    [theme.breakpoints.up('md')]: {
                      fontSize: '2rem'
                    }
                  }}
                >
                  Bienvenue sur Guidhub, faites votre premier pas pour rejoindre la plateforme des créateurs
                </DialogTitle>
              </Box>

              <DialogContent
                sx={{
                  mt: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isLoading && (
                  <>
                    <Box sx={{ minWidth: 35 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 16 16">
                        <path
                          fill="currentColor"
                          d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5zM13 14H2V2h11v12zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5zM7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1z"
                        />
                      </svg>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Card sx={{ p: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Guidhub bcp crée votre profil</Typography>
                      </Card>
                    </Box>
                  </>
                )}
                {!isLoading && (
                  <Box>
                    <FormikProvider value={formik}>
                      <Form noValidate autoComplete="off">
                        <Card sx={{ py: 2.5, px: 3, textAlign: 'center', mb: 4, mt: 4 }}>
                          <DialogContentText sx={{ fonSize: '1.6rem', color: '#001E3C', fontWeight: 'bold' }}>
                            Complétez votre profil, ajoutez une photo de profil
                          </DialogContentText>
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
                                Taille d'image autorisée *.jpeg, *.jpg, *.png, *.gif
                                <br /> Taille {fData(3145728)}
                              </Typography>
                            }
                          />

                          <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {touched.profile_image && errors.profile_image}
                          </FormHelperText>

                          <DialogContentText sx={{ fonSize: '1.6rem', color: '#001E3C', fontWeight: 'bold' }}>
                            Quel est le secteur d'activité qui vous intéresse ?
                          </DialogContentText>
                          <ProjectActivitySector
                            field={values.activity_sector}
                            handleChange={handleChangeActivitySector}
                          />
                          <DialogContentText sx={{ fonSize: '1.6rem', color: '#001E3C', fontWeight: 'bold' }}>
                            Lieu ?
                          </DialogContentText>

                          <ProjectAddress
                            handleChangePlace={debouncedHandlePlaceChange}
                            onSelectPlace={handleOnSelectPlace}
                            autoCompletePlace={autoCompletePlace}
                            projectSearchableAddress={values.searchable_address}
                          />
                        </Card>
                      </Form>
                    </FormikProvider>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                {!isLoading && (
                  <Button onClick={handleSubmit} variant="contained">
                    Rejoignez la communauté
                  </Button>
                )}
                {isLoading && (
                  <Button disabled variant="contained">
                    en cours d'exécution
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
    </>
  );
}
