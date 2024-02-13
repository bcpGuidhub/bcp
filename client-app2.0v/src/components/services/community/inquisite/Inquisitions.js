import { useState } from 'react';
import { Stack } from '@mui/material';
import { orderBy, random } from 'lodash';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InquisiteCard } from '..';
// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

// const SkeletonLoad = (
//   <Grid container spacing={3} sx={{ mt: 2 }}>
//     {[...Array(4)].map((_, index) => (
//       <Grid item xs={12} md={3} key={index}>
//         <Skeleton variant="rectangular" width="100%" sx={{ height: 200, borderRadius: 2 }} />
//         <Box sx={{ display: 'flex', mt: 1.5 }}>
//           <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
//           <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
//         </Box>
//       </Grid>
//     ))}
//   </Grid>
// );
// ----------------------------------------------------------------------

Inquistions.propTypes = {
  posts: PropTypes.array
};

export default function Inquistions({ posts }) {
  const [filters, setFilters] = useState('latest');
  const sortedPosts = applySort(posts, filters);
  const postsLength = posts ? posts.length : 0;
  return (
    <InfiniteScroll
      // next={onScroll}
      // hasMore={hasMore}
      // loader={SkeletonLoad}
      dataLength={postsLength}
      style={{ overflow: 'inherit' }}
    >
      <Stack spacing={3}>
        {sortedPosts.map((post, index) => (
          <InquisiteCard key={post.id} inquist={post} index={index} />
        ))}
      </Stack>
    </InfiniteScroll>
  );
}
