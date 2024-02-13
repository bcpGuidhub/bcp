import PropTypes from 'prop-types';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, Typography, DialogActions } from '@mui/material';
//
import { DialogAnimate } from '../../../animate';
import Markdown from '../../../Markdown';
import Scrollbar from '../../../Scrollbar';
import EmptyContent from '../../../EmptyContent';

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
  title: PropTypes.string,
  cover: PropTypes.string
};

function PreviewHero({ title, cover }) {
  return (
    <Container>
      <Typography sx={{ typography: 'h4' }}>{title}</Typography>
    </Container>
  );
}

InquisiteNewQuetionReview.propTypes = {
  formik: PropTypes.object.isRequired,
  openPreview: PropTypes.bool,
  onClosePreview: PropTypes.func
};

export default function InquisiteNewQuetionReview({ formik, openPreview, onClosePreview }) {
  const { values, handleSubmit, isSubmitting, isValid } = formik;
  const { title, description } = values;
  const hasContent = title || description;
  const hasHero = title;

  return (
    <DialogAnimate fullScreen open={openPreview} onClose={onClosePreview}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Prévisualiser
        </Typography>
        <LoadingButton variant="contained" onClick={onClosePreview}>
          Annuler
        </LoadingButton>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Publiez votre question
        </LoadingButton>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PreviewHero title={title} />}
          <Container>
            <Box sx={{ mt: 5, mb: 10 }}>
              <Markdown children={description} />
            </Box>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent title="Vide" />
      )}
    </DialogAnimate>
  );
}
