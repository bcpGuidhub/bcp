import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { useSnackbar } from 'notistack';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
// material
import EditIcon from '@mui/icons-material/Edit';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import {
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Switch,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  Alert,
  Box,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardContent
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  LoadingButton
} from '@mui/lab';
//
import Markdown from '../../../Markdown';
import { QuillEditor } from '../../../editor';
//
import { fDateTime } from '../../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

InquisitePostAnswerEditForm.propTypes = {
  onSend: PropTypes.func.isRequired,
  post: PropTypes.object,
  answer: PropTypes.object
};

export default function InquisitePostAnswerEditForm({ onSend, post, answer }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const currentPostRevision = post.revisions.slice(-1)[0];
  const currentAnswerRevision = answer.revisions.slice(-1)[0];

  const NewInquisiteSchema = Yup.object().shape({
    body: Yup.string().min(30).required(),
    summary: Yup.string().min(15).required('un résumé expliquant votre modification est requis')
  });

  const formik = useFormik({
    initialValues: {
      aggregate_id: post.id,
      answer_id: answer.id,
      body: currentAnswerRevision.body,
      summary: ''
    },
    validationSchema: NewInquisiteSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSend(values);
        resetForm();
        handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Modification réussie', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.inquist.post}`.replace(':id', post.id));
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const handleEditCancel = () => {
    resetForm();
    setSubmitting(false);
    navigate(`${PATH_DASHBOARD.inquist.post}`.replace(':id', post.id));
  };
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    setSubmitting,
    resetForm
  } = formik;

  // const revisions = answer.revisions.map((rev) => ({ ...rev, icon: <EditIcon /> }));
  const revisions = answer.revisions.reduce((acc, revision) => {
    const author = answer.revision_authors.find((author) => author.author_id === revision.author_id);
    const r = {
      ...revision,
      ...author
    };
    acc.push(r);
    return acc;
  }, []);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Alert variant="outlined" severity="info" sx={{ mb: 2, mt: 2 }}>
            <Stack spacing={2}>
              <Typography sx={{ typography: 'subtitle1' }}>
                Votre modification sera placée dans une file d'attente jusqu'à ce qu'elle soit examinée par des pairs.
              </Typography>
              <Typography sx={{ typography: 'subtitle1' }}>
                Nous acceptons les modifications qui rendent la réponse plus facile à comprendre et plus précieuse pour
                les lecteurs. Parce que les membres de la communauté examinent les modifications, veuillez essayer de
                rendre la réponse nettement meilleure que celle que vous avez trouvée par exemple, en corrigeant la
                grammaire ou en ajoutant des ressources et des hyperliens supplémentaires.
              </Typography>
            </Stack>
          </Alert>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
                  Historique des révisions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Timeline position="alternate">
                  {revisions.map((revision) => (
                    <TimelineItem key={revision.id}>
                      <TimelineOppositeContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {formatDistanceToNowStrict(new Date(revision.posted), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color="info">
                          <EditIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper
                          sx={{
                            p: 1,
                            bgcolor: 'grey.50012'
                          }}
                        >
                          <Typography variant="subtitle2">
                            {revision.first_name}.{revision.last_name}
                          </Typography>
                          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {revision.first_name}.{revision.last_name}
                              </Typography> */}
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>
      </Grid>

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <Card sx={{ p: 3 }}>
                  <CardHeader title={currentPostRevision.title} />
                  <CardContent>{parse(currentPostRevision.description)}</CardContent>
                </Card>
                <Card sx={{ p: 3 }}>
                  <div>
                    {/* <LabelStyle>Answer</LabelStyle> */}

                    <QuillEditor
                      id="inquisite-description"
                      value={values.body}
                      onChange={(val) => setFieldValue('body', val)}
                      error={Boolean(touched.body && errors.body)}
                    />
                    {touched.body && errors.body && (
                      <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                        {touched.body && errors.body}
                      </FormHelperText>
                    )}
                    <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral', mt: 2 }}>
                      <CardHeader title="Prévisualiser Votre Réponse" />
                      <Box sx={{ p: 3 }}>
                        <Markdown children={values.body} />
                      </Box>
                    </Card>
                  </div>
                </Card>
                <Card sx={{ p: 3 }}>
                  <LabelStyle>Un bref résumé de vos modifications</LabelStyle>
                  <TextField
                    fullWidth
                    label="Résumé"
                    {...getFieldProps('summary')}
                    error={Boolean(touched.summary && errors.summary)}
                    helperText={touched.summary && errors.summary}
                  />
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack>
                <Card sx={{ p: 3, mb: 2 }}>
                  <CardHeader title="Comment modifier" />
                  <Divider />

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="Corriger les fautes de frappe ou les erreurs mineures" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="Clarifier le sens sans le changer" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="Ajouter des ressources ou des liens associés" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="Respectez toujours l’intention de l’auteur" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="N'utilisez pas Modifier pour répondre à l'auteur" />
                    </ListItem>
                  </List>
                </Card>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  sx={{ width: '45%' }}
                >
                  Enregistré
                </LoadingButton>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleEditCancel}
                  sx={{ mr: 1.5, width: '45%' }}
                >
                  Annuler
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
}
