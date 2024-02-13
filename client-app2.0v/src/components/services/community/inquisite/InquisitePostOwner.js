import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fDateTime } from '../../../../utils/formatTime';
import { InquisitePostOwnerAccountId, InquisitePostOwnerReputation } from '..';

// ----------------------------------------------------------------------
InquisitePostOwner.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostOwner({ post, ...other }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="column">
        <Box>
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            Demandée{' '}
            {formatDistanceToNowStrict(new Date(post.revisions[0].posted), {
              addSuffix: true,
              locale: fr
            })}
          </Typography>
        </Box>
        <Box
          display="flex"
          sx={{ justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap' }}
        >
          <InquisitePostOwnerAccountId post={post} />
          <InquisitePostOwnerReputation post={post} />
        </Box>
      </Stack>
    </Box>
  );
}
