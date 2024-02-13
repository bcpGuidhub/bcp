import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { InquisitePostFlag } from '..';
// ----------------------------------------------------------------------
// http://localhost:3001/inquist/post/0f25322b-9651-11ed-bfe3-0242ac1a000a
InquisitePostEdit.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostEdit({ post, ...other }) {
  const navigate = useNavigate();

  // There are too many pending edits on Stack Overflow. Please try again later.

  const handleEdit = () => {
    navigate(`${PATH_DASHBOARD.inquist.root}/posts/${post.id}/edit`);
  };

  useEffect(() => {}, []);
  return (
    <Stack direction="row" sx={{ mt: 2 }}>
      <Button color="info" size="small" onClick={handleEdit}>
        Modifier
      </Button>
      <InquisitePostFlag post={post} />
    </Stack>
  );
}
