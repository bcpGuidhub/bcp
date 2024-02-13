import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
InquisitePostEditReputation.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostEditReputation({ post, ...other }) {
  // There are too many pending edits on Stack Overflow. Please try again later.
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const [authorRep, setAuthorRep] = useState(1);
  const author = post.revision_authors?.find((author) => author.author_id === post.revisions[0].author_id);

  useEffect(async () => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/community/reputation`, {
        params: { id: author.author_id }
      });
      if (response.data) {
        setAuthorRep(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Stack alignItems="center">
      <Button sx={{ typography: 'body1' }}>{`${author?.first_name}.${author?.last_name}`}</Button>
      <Typography sx={{ typography: 'body1' }}>{authorRep}</Typography>
    </Stack>
  );
}
