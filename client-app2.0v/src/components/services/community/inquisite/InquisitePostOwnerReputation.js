import { Button, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
// http://localhost:3001/inquist/post/0f25322b-9651-11ed-bfe3-0242ac1a000a
InquisitePostOwnerReputation.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostOwnerReputation({ post, ...other }) {
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
