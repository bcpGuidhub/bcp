import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, List, ListItemButton, ListItemText } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { GUIDETHUMBNAILS } from '../../../layouts/service/guide/Guide';
import API from '../../../utils/axios';
import { getGuidePath } from '../../../utils/getGuidePath';

const ExpandMore = styled((props) => {
  /* eslint-disable-next-line no-unused-vars */
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

GuideThumbnail.propTypes = {
  label: PropTypes.string,
  landmarks: PropTypes.array,
  guides: PropTypes.array,
  user: PropTypes.object
};
export default function GuideThumbnail({ label, landmarks, guides, user }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const guideNav = (e) => {
    e.preventDefault();
    const guideExist = guides.find((guide) => guide.label === label);
    if (typeof guideExist === 'undefined') {
      const data = {
        project_id: user.id,
        label,
        project_guide_landmarks: landmarks.reduce((acc, landmark) => {
          const projectLandmark = {
            label: landmark.label,
            project_guide_landmark_achievements: landmark.achievements.reduce((acc, achievement) => {
              const landmarkAchievement = {
                label: achievement.label
              };
              acc.push(landmarkAchievement);
              return acc;
            }, [])
          };
          acc.push(projectLandmark);
          return acc;
        }, [])
      };

      API.post('v1/workstation/guides', data)
        .then((response) => {
          getGuidePath(response.data);
        })
        .catch((error) => {});
    } else if (guideExist.status === 'running' || guideExist.status === 'finished') {
      getGuidePath(guideExist);
    } else {
      const data = {
        id: guideExist.id,
        label,
        status: 'running',
        project_id: user.id
      };

      API.put('v1/workstation/guides', data)
        .then((response) => {
          let guide;
          /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].status === 'running') {
              guide = response.data[i];
              break;
            }
          }
          getGuidePath(guide);
        })
        .catch((error) => {});
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader title={label} />
      <CardMedia component="img" sx={{ height: 'auto' }} image={GUIDETHUMBNAILS[label]} alt={label} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of
          frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button size="meduim" variant="contained" onClick={guideNav}>
          Commencer ce parcours
        </Button>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Étapes:</Typography>
          <List component="nav">
            {landmarks.map((landmark, k) => (
              <ListItemButton key={`${landmark}-${k}`}>
                <ListItemText primary={landmark.label} sx={{ color: 'primary.main' }} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
}
