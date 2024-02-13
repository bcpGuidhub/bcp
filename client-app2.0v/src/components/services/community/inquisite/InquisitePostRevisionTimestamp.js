import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fDateTime } from '../../../../utils/formatTime';
import { InquisitePostEditAccountId, InquisitePostEditReputation } from '..';
// ----------------------------------------------------------------------
InquisitePostRevisionTimestamp.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostRevisionTimestamp({ post, ...other }) {
  const currentPostRevision = post.revisions.slice(-1)[0];
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="column">
        <Box>
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            édité{' '}
            {formatDistanceToNowStrict(new Date(currentPostRevision.posted), {
              addSuffix: true,
              locale: fr
            })}
          </Typography>
        </Box>
        <Box
          display="flex"
          sx={{ justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap' }}
        >
          <InquisitePostEditAccountId post={post} />
          <InquisitePostEditReputation post={post} />
        </Box>
      </Stack>
    </Box>
  );
}
