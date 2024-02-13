import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { Box, Fab, Stack } from '@mui/material';

// ----------------------------------------------------------------------
InquistPoseQuestionBar.propTypes = {
  onPoseQuestion: PropTypes.func.isRequired
};

export default function InquistPoseQuestionBar({ onPoseQuestion }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Box>
        <Fab disabled variant="extended">
          <Icon icon="fluent:notebook-question-mark-24-regular" />
          Toutes les questions
        </Fab>
      </Box>
      <Box>
        <Fab variant="extended" onClick={onPoseQuestion}>
          <Icon icon="fluent:calligraphy-pen-question-mark-20-regular" />
          Poser une question
        </Fab>
      </Box>
    </Stack>
  );
}
