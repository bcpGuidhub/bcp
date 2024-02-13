import { Avatar, Box, Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';
// utils
import mockData from '../../../../utils/mock-data';
// ----------------------------------------------------------------------
InquisitePostOwnerAccountId.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostOwnerAccountId({ post, ...other }) {
  const initialRevision = post.revisions.slice(0, 1)[0];

  const author = post.revision_authors?.find((author) => author.author_id === initialRevision.author_id);
  return (
    <>
      <Avatar
        alt={`${author?.first_name}.${author?.last_name}`}
        src={author?.profile_image === '' ? mockData.image.avatar(0) : author?.profile_image}
        sx={{ width: 48, height: 48 }}
      />
    </>
  );
}
