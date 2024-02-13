import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { Divider, Collapse } from '@mui/material';
import CommentList from './CommentList';
//

// ----------------------------------------------------------------------

Review.propTypes = {
  reviews: PropTypes.array
};

export default function Review({ reviews }) {
  const [reviewBox, setReviewBox] = useState(false);

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  return (
    <>
      <CommentList reviews={reviews} />
    </>
  );
}
