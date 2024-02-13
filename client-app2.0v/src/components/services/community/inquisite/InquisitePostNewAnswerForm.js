import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, FormHelperText, Alert, Box, CardHeader } from '@mui/material';
//
import Markdown from '../../../Markdown';
import { QuillEditor } from '../../../editor';
//
// ----------------------------------------------------------------------

InquisitePostNewAnswerForm.propTypes = {
  post: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired
};

export default function InquisitePostNewAnswerForm({ post, onSend }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewInquisitePostNewAnswerSchema = Yup.object().shape({
    post: Yup.string().min(30).required('Une description est requise')
  });

  const formik = useFormik({
    initialValues: {
      aggregate_id: post.id,
      post: '',
      publish: true
    },
    validationSchema: NewInquisitePostNewAnswerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSend(values);
        resetForm();
        handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Réponse publiée', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Stack spacing={1}>
              <Card sx={{ p: 3 }}>
                <div>
                  <Typography sx={{ typography: 'h5', mt: 2, mb: 2 }}>Votre Réponse</Typography>

                  <QuillEditor
                    id="inquisite-post"
                    value={values.post}
                    onChange={(val) => setFieldValue('post', val)}
                    error={Boolean(touched.post && errors.post)}
                  />
                  {touched.post && errors.post && (
                    <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                      {touched.post && errors.post}
                    </FormHelperText>
                  )}

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Alert variant="outlined" severity="info">
                      <Typography sx={{ mt: 1, mb: 1 }}>Merci d'avoir répondu à une question!</Typography>
                      <ul>
                        <li>
                          Assurez-vous de répondre à la question. Fournissez des détails et partagez vos recherches!
                        </li>
                      </ul>

                      <Typography sx={{ mt: 1, mb: 1 }}>Mais évitez …</Typography>
                      <ul>
                        <li>De demander de l'aide, des éclaircissements ou répondre à d'autres réponses.</li>
                        <li>
                          De faire des déclarations fondées sur une opinion ; soutenez les avec des références ou une
                          expérience personnelle.
                        </li>
                      </ul>
                    </Alert>
                  </Box>
                  <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral' }}>
                    <CardHeader title="Prévisualiser votre Réponse" />
                    <Box sx={{ p: 3 }}>
                      <Markdown children={values.post} />
                    </Box>
                  </Card>
                </div>
              </Card>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, mb: 4 }}>
          <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
            Publiez votre réponse
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}
