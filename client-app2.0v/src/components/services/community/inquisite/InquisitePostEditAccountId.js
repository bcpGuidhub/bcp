import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';
// utils
import mockData from '../../../../utils/mock-data';
// ----------------------------------------------------------------------
InquisitePostEditAccountId.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquisitePostEditAccountId({ post, ...other }) {
  const currentPostRevision = post.revisions.slice(-1)[0];

  const author = post.revision_authors?.find((author) => author.author_id === currentPostRevision.author_id);
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
