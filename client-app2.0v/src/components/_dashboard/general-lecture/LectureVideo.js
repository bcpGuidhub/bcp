import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TwitterIcon,
  TwitterShareButton
} from 'react-share';
// import Scrollbar from '../../Scrollbar';
import SimpleBarReact from 'simplebar-react';
import { Block } from '../../../pages/components-overview/Block';
import { kViewsLikesFormatter } from '../../../utils/lectureViewFormat';
import { MAvatar } from '../../@material-extend';
import CopyClipboard from '../../CopyClipboard';
import Thumbnail from './Thumbnail';
import Scrollbar from '../../Scrollbar';

const ContainerStyle = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadiusSm,
  border: `solid 1px ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800]
}));

const VideoShareContainer = styled('div')(() => ({
  verticalAlign: 'top',
  display: 'inline-block',
  marginRight: '10px',
  textAlign: 'center'
}));

const LikeIcon = styled('div')(() => ({
  cursor: 'pointer',
  marginRight: '6px',
  width: '40px',
  height: '40px',
  borderRadius: '100%',
  backgroundColor: 'rgba(22, 24, 35, 0.06)',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: 'rgba(22, 24, 35, 0.2)'
  }
}));
// ----------------------------------------------------------------------

Item.propTypes = {
  sx: PropTypes.object
};

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 1,
        m: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '700',
        ...sx
      }}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

SelectedVideo.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    category: PropTypes.string
  }),
  likes: PropTypes.number,
  handleLikes: PropTypes.func
};
function SelectedVideo({ video, handleLikes, likes }) {
  const { title, url, category } = video;
  console.log(url);
  return (
    <Stack spacing={3}>
      <Block>
        <ReactPlayer url={url} height="100%" width="100%" playing controls />
      </Block>
      <Block>
        <List>
          <ListItem>
            <ListItemAvatar>
              <MAvatar sx={{ width: '60px', height: '60px' }}>
                <img
                  style={{
                    padding: '5px 5px'
                  }}
                  width="60px"
                  alt={title}
                  src="https://storage.googleapis.com/project-application-assets/guidhub-emblem.png"
                />
              </MAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={title}
              primaryTypographyProps={{
                style: {
                  fontSize: '1.2rem',
                  fontWeight: 900
                }
              }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={`#${category}`}
              primaryTypographyProps={{
                style: {
                  fontSize: '1.2rem',
                  fontWeight: 900
                }
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LikeIcon onClick={handleLikes} onKeyDown={handleLikes}>
                <FavoriteIcon />
              </LikeIcon>
            </ListItemIcon>
            <ListItemText primary={kViewsLikesFormatter(likes)} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Partager"
              primaryTypographyProps={{
                style: {
                  fontSize: '1.2rem',
                  fontWeight: 900
                }
              }}
            />
            <Stack>
              <VideoShareContainer>
                <TwitterShareButton url={url} title={title} className="Demo__some-network__share-button">
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </VideoShareContainer>
              <VideoShareContainer>
                <FacebookShareButton url={url} quote={title} className="Demo__some-network__share-button">
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </VideoShareContainer>
              <VideoShareContainer>
                <FacebookShareCount url={url} className="Demo__some-network__share-count">
                  {(count) => count}
                </FacebookShareCount>
              </VideoShareContainer>
              <VideoShareContainer>
                <EmailShareButton url={url} subject={title} body={title} className="Demo__some-network__share-button">
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </VideoShareContainer>
            </Stack>
          </ListItem>
          <Divider />
        </List>
      </Block>
      <Block>
        <CopyClipboard value={url} />
      </Block>
    </Stack>
  );
}

// ----------------------------------------------------------------------

// ShareButton.propTypes = {
//   children: PropTypes.node
// };

// function ShareButton({ children }) {
//   return;
// }

// ----------------------------------------------------------------------

LectureVideo.propTypes = {
  lecture: PropTypes.object,
  handleLikes: PropTypes.func,
  likes: PropTypes.number,
  lectures: PropTypes.array,
  selectedCategory: PropTypes.string,
  handleClickOpenLecture: PropTypes.func
};

export default function LectureVideo({
  lecture,
  handleLikes,
  likes,
  lectures,
  selectedCategory,
  handleClickOpenLecture
}) {
  return (
    <Box
      sx={{
        pt: 6,
        pb: 1,
        mb: 10
      }}
    >
      <Scrollbar
        sx={{
          height: 120 * 10
          // [theme.breakpoints.down('sm')]: { height: 44 * 10 }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Item>
              <SelectedVideo video={lecture} handleLikes={handleLikes} likes={likes} />
            </Item>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack spacing={3}>
              {lectures
                .filter((f) => f.category === selectedCategory && f.title !== lecture.title)
                .map((value, i) => (
                  <Thumbnail
                    key={`${value.title}-${i}`}
                    handleClickOpenLecture={handleClickOpenLecture}
                    lecture={value}
                  />
                ))}
            </Stack>
          </Grid>
        </Grid>
      </Scrollbar>
    </Box>
  );
}
