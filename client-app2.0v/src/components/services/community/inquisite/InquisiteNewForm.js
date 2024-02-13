import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { useEffect, useRef, useState } from 'react';
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
  FormControl,
  IconButton,
  InputAdornment
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Cancel, Tag } from '@mui/icons-material';
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
import InquisiteNewQuetionReview from './InquisiteNewQuetionReview';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
const Tags = ({ tag, handleDelete }) => (
  <Box
    sx={{
      background: '#283240',
      height: '100%',
      display: 'flex',
      padding: '0.4rem',
      margin: '0 0.5rem 0 0',
      justifyContent: 'center',
      alignContent: 'center',
      color: '#ffffff'
    }}
  >
    <Stack direction="row" gap={1}>
      <Typography>{tag.label}</Typography>
      <Cancel
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          handleDelete(tag);
        }}
      />
    </Stack>
  </Box>
);

InputTags.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object
};

function InputTags({ setFieldValue, values }) {
  const tagRef = useRef();
  const [tags, setTags] = useState(values.tags || []);
  const handleDelete = (tag) => {
    const newtags = tags.filter((val) => val.label !== tag.label);
    setTags(newtags);
  };
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagRef.current.value && tagRef.current.value !== '') {
      const similarTag = tags.filter((tag) => tag.label === tagRef.current.value);
      if (similarTag.length === 0) {
        const newTags = [...tags, { label: tagRef.current.value }];
        setTags(newTags);
        setFieldValue('tags', newTags);
      }
    }
    tagRef.current.value = '';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TextField
        inputRef={tagRef}
        fullWidth
        rows={4}
        multiline
        variant="standard"
        size="small"
        sx={{ margin: '1rem 0' }}
        margin="none"
        placeholder={tags.length < 5 ? 'Saisir des «mots clés»' : ''}
        InputProps={{
          startAdornment: (
            <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
              {tags.map((tag, index) => (
                <Tags tag={tag} handleDelete={handleDelete} key={index} />
              ))}
            </Box>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" onClick={handleAddTag} endIcon={<PostAddIcon />}>
                Ajouter «mots clés»
              </Button>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
}

const TAGS_OPTION = [
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  }
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------
const TITLE_REGEX = /\bbest\b|\bworst\b|\bhardest\b|\byour?\b|\bfavou?rite\b/g;

InquisiteNewForm.propTypes = {
  onSend: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  post: PropTypes.object,
  tags: PropTypes.array,
  revisions: PropTypes.array
};

export default function InquisiteNewForm({ onSend, isEdit, post, tags, revisions }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };
  const currentPostRevision = isEdit ? post.revisions.slice(-1)[0] : {};

  const NewInquisiteSchema = Yup.object().shape({
    title: Yup.string()
      .required('Le titre est requis')
      .test(
        'validInquistTitle',
        `La question que vous posez semble subjective et est susceptible d'être fermée`,
        (value) => !TITLE_REGEX.test(value)
      ),
    description: Yup.string().min(30).required('Une description est requise'),
    tags: Yup.array()
      .min(1, 'Veuillez saisir au moins un mot-clé')
      .max(5, 'Ajouter 5 mots-clés')
      .required('Veuillez saisir au moins un mot-clé')
  });

  const formik = useFormik({
    initialValues: {
      title: currentPostRevision?.title || '',
      description: currentPostRevision?.description || '',
      tags: tags || [],
      publish: !isEdit,
      summary: isEdit ? currentPostRevision.summary : ''
    },
    validationSchema: NewInquisiteSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEdit && (values.summary === '' || typeof values.summary === 'undefined')) {
          enqueueSnackbar('Champ récapitulatif obligatoire', { variant: 'error' });
          return;
        }
        if (isEdit) {
          values = { ...values, aggregate_id: post.id };
        }
        await onSend(values);
        resetForm();
        setFieldValue('tags', []);
        handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Publié', { variant: 'success' });
        // navigate(`${PATH_DASHBOARD.inquist.post}`.replace(':id', post.id));
        navigate(PATH_DASHBOARD.inquist.browse);
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

  return (
    <>
      {isEdit && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Alert variant="outlined" severity="info" sx={{ mb: 2, mt: 2 }}>
              <Stack spacing={2}>
                <Typography sx={{ typography: 'subtitle1' }}>
                  Votre modification sera placée dans une file d'attente jusqu'à ce qu'elle soit examinée par des pairs.
                </Typography>
                <Typography sx={{ typography: 'subtitle1' }}>
                  Nous acceptons les modifications qui rendent le message plus facile à comprendre et plus précieux pour
                  les lecteurs. Étant donné que les membres de la communauté examinent les modifications, essayez de
                  rendre le message nettement meilleur que la façon dont vous l'avez trouvé, par exemple en corrigeant
                  la grammaire ou en ajoutant des éléments supplémentaires, ressources et hyperliens.
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
      )}

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <Card sx={{ p: 3 }}>
                  <LabelStyle>Titre</LabelStyle>
                  {!isEdit && (
                    <Typography sx={{ typography: 'subtitle2' }}>
                      Soyez spécifique et formulez votre question compréhensible à d’autres personnes.
                    </Typography>
                  )}
                  <TextField
                    fullWidth
                    label="Titre"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  {!isEdit && (
                    <Alert variant="outlined" severity="info" sx={{ mb: 2, mt: 2 }}>
                      Votre titre doit résumer le problème.
                    </Alert>
                  )}
                </Card>
                <Card sx={{ p: 3 }}>
                  <div>
                    {isEdit ? (
                      <LabelStyle>Description</LabelStyle>
                    ) : (
                      <>
                        <LabelStyle>Décrivez votre problème en détail</LabelStyle>
                        <Typography sx={{ typography: 'subtitle2' }}>
                          Poser le problème et développer en détail le sujet de votre titre.
                        </Typography>
                      </>
                    )}
                    <QuillEditor
                      id="inquisite-description"
                      value={values.description}
                      onChange={(val) => setFieldValue('description', val)}
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                        {touched.description && errors.description}
                      </FormHelperText>
                    )}

                    {!isEdit && (
                      <Alert variant="outlined" severity="info" sx={{ mb: 2, mt: 2 }}>
                        Expliquez dans quelles circonstances vous avez rencontré ce problème et les freins ou
                        difficultés que vous avez rencontré à le résoudre avant.
                      </Alert>
                    )}
                    <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral', mt: 2 }}>
                      <CardHeader title="Prévisualiser ta description" />
                      <Box sx={{ p: 3 }}>
                        <Markdown children={values.description} />
                      </Box>
                    </Card>
                  </div>
                </Card>
                {isEdit && (
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
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack>
                {isEdit && (
                  <Card sx={{ p: 3, mb: 2 }}>
                    <CardHeader title="Commentaire modifié" />
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
                )}
                <Card sx={{ p: 3, mb: 2 }}>
                  <Stack spacing={3}>
                    {/* {!isEdit && (
                      <div>
                        <FormControlLabel
                          control={<Switch {...getFieldProps('publish')} checked={values.publish} />}
                          label="Publish"
                          labelPlacement="start"
                          sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                        />
                      </div>
                    )} */}
                    <LabelStyle>Mots-clés</LabelStyle>
                    {!isEdit && (
                      <Typography sx={{ typography: 'body2' }}>
                        Ajouter 5 mots-clés pour décrire le sujet de votre question. Commencer à écrire pour voir les
                        suggestions.
                      </Typography>
                    )}
                    <InputTags values={values} setFieldValue={setFieldValue} />
                    {/* <Autocomplete
                      multiple
                      freeSolo
                      value={values.tags}
                      onChange={(event, newValue) => {
                        setFieldValue('tags', newValue);
                      }}
                      getOptionLabel={(option) => option.label}
                      options={TAGS_OPTION.map((option) => option)}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Stack direction="column" spacing={1}>
                            <Stack direction="row" spacing={2}>
                              <Button
                                component="span"
                                variant="outlined"
                                color="info"
                                size="small"
                                sx={{
                                  pl: '4px',
                                  pr: '4px',
                                  fontSize: '9px'
                                }}
                              >
                                {option.label}
                              </Button>
                              <Typography sx={{ typography: 'caption' }}>{option.score}</Typography>
                            </Stack>

                            <Typography sx={{ typography: 'caption' }}> {option.description}</Typography>
                          </Stack>
                        </Box>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.label} size="small" label={option.label} />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} label="Tags" />}
                    /> */}
                    {touched.tags && errors.tags && (
                      <Alert variant="outlined" severity="error" sx={{ mb: 2, mt: 2 }}>
                        Ajouter 5 mots-clés.
                      </Alert>
                    )}
                  </Stack>
                </Card>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                {isEdit ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      type="button"
                      color="inherit"
                      variant="outlined"
                      size="large"
                      onClick={handleOpenPreview}
                      sx={{ width: '45%' }}
                    >
                      Prévisualiser
                    </Button>
                    <LoadingButton
                      sx={{ width: '45%' }}
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                    >
                      Publiez votre question
                    </LoadingButton>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>

      <InquisiteNewQuetionReview formik={formik} openPreview={open} onClosePreview={handleClosePreview} />
    </>
  );
}
