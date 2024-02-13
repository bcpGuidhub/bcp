import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// material
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { thumbnails } from '../../../layouts/service/lecture/Lecture';
import { kViewsLikesFormatter } from '../../../utils/lectureViewFormat';
import { varScaleOutX } from '../../animate';
// ----------------------------------------------------------------------
const ThumbnailStyle = styled(Box)(() => ({
  position: 'relative',
  cursor: 'pointer'
  // height: 430,
  // maxHeight: 430
}));

const ThumbnailTitle = styled(Typography)(({ theme }) => ({
  // marginTop: theme.spacing(3),
  // padding: theme.spacing(2)
}));

const ThumbnailCategory = styled(Typography)(({ theme }) => ({
  // paddingLeft: theme.spacing(2),
  color: '#fff'
}));

const ThumbnailViews = styled(Typography)(({ theme }) => ({
  // paddingLeft: theme.spacing(2),
  color: '#fff'
}));

const VideoThumbnailImgStyle = styled('img')(() => ({
  maxWidth: '100%',
  height: 'auto'
}));

const PlayIconButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  verticalAlign: 'middle',
  width: '28px',
  height: '28px',
  fill: 'rgb(255, 255, 255)',
  transform: 'scale(2.8)',
  position: 'absolute',
  top: '30%',
  padding: theme.spacing(1)
}));
// ----------------------------------------------------------------------

VideoThumbnail.propTypes = {
  thumbnail: PropTypes.shape({
    title: PropTypes.string
  })
};

function VideoThumbnail({ thumbnail }) {
  const { title } = thumbnail;

  return (
    <Box sx={{ position: 'relative' }}>
      <VideoThumbnailImgStyle alt={title} src={thumbnails[title]} />
      {/* <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
        }}
      /> */}
    </Box>
  );
}

// ----------------------------------------------------------------------

Thumbnail.propTypes = {
  handleClickOpenLecture: PropTypes.func,
  lecture: PropTypes.object
};

export default function Thumbnail({ handleClickOpenLecture, lecture }) {
  return (
    <ThumbnailStyle
      sx={{
        pb: 1,
        boxShadow: (theme) => theme.customShadows.z8
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleClickOpenLecture(lecture);
      }}
    >
      <VideoThumbnail
        thumbnail={lecture}
        onClick={(e) => {
          e.stopPropagation();
          handleClickOpenLecture(lecture);
        }}
      />
      <motion.div variants={varScaleOutX}>
        <PlayIconButton
          onClick={(e) => {
            e.stopPropagation();
            handleClickOpenLecture(lecture);
          }}
        >
          <PlayArrowIcon />
        </PlayIconButton>
      </motion.div>
      <ThumbnailTitle
        sx={{ color: '#fff' }}
        variant="subtitle1"
        onClick={(e) => {
          e.stopPropagation();
          handleClickOpenLecture(lecture);
        }}
      >
        {lecture.title}
      </ThumbnailTitle>
      <ThumbnailCategory noWrap variant="subtitle1">
        #{lecture.category}
      </ThumbnailCategory>
      <ThumbnailViews
        noWrap
        variant="subtitle1"
        onClick={(e) => {
          e.stopPropagation();
          handleClickOpenLecture(lecture);
        }}
      >
        {kViewsLikesFormatter(lecture.views)} vues
      </ThumbnailViews>
    </ThumbnailStyle>
  );
}
