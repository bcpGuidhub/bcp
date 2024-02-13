import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import vote20Filled from '@iconify/icons-fluent/vote-20-filled';
import answersIcon from '@iconify/icons-flat-color-icons/answers';
// material
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Typography,
  CardContent,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Badge
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { useDispatch, useSelector } from '../../../../redux/store';
import { getPost, getPosTags, getAnswers } from '../../../../redux/slices/inquisite';
import { fShortenNumber } from '../../../../utils/formatNumber';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative'
});

const TitleStyle = styled(RouterLink)(({ theme }) => ({
  ...theme.typography.subtitle2,
  height: 30,
  color: 'inherit',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline'
  },
  paddingLeft: '18px'
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));
// ----------------------------------------------------------------------
const FIXED_LENGTH_DESCRIPTION = 200;

InquisiteCard.propTypes = {
  inquist: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function InquisiteCard({ inquist, index }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const [answersCount, setAnswersCount] = useState(0);
  const [votesTotal, setVotesTotal] = useState(0);
  const [authorRep, setAuthorRep] = useState(1);

  const { id, author: authorId } = inquist;
  const { tags, answers } = useSelector((state) => state.inquist);
  const linkTo = `${PATH_DASHBOARD.inquist.post.replace(':id', id)}`;

  const author = inquist.revision_authors.filter((rev) => rev.author_id === authorId)[0];
  const { description, title, posted } = inquist.revisions[0];
  // const parsedDescription = parse(description);
  // debugger; // eslint-disable-line no-debugger
  const INQUIST_INFO = [
    { number: answersCount, icon: answersIcon, label: 'réponses' },
    // { number: view, icon: eyeFill },
    { number: votesTotal, icon: vote20Filled, label: 'votes' }
  ];

  const getPostVotes = async () => {
    try {
      if (inquist) {
        const response = await API.get(`${apiPrefix}/inquisite/posts/${id}/votes`);

        if (response.data.votes) {
          const votesTotal =
            response.data.votes.reduce((acc, v) => {
              acc += v.weight;
              return acc;
            }, 0) || 0;

          setVotesTotal(votesTotal);
        } else {
          setVotesTotal(0);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getPosTags(id, apiPrefix));
    dispatch(getAnswers(id, apiPrefix));
  }, [dispatch, id]);

  useEffect(() => {
    setAnswersCount(answers?.length);
  }, [answers]);

  useEffect(() => {
    getPostVotes();
  }, [inquist]);

  useEffect(async () => {
    if (inquist) {
      try {
        const response = await API.get(`${apiPrefix}/inquisite/community/reputation`, {
          params: { id: inquist.revision_authors[0].author_id }
        });
        if (response.data) {
          setAuthorRep(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return (
    <Card sx={{ position: 'relative' }}>
      <CardMediaStyle>
        <ListItem
          disableGutters
          sx={{
            alignItems: 'flex-start',
            pl: 3,
            mt: 1
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt={`${author.first_name}.${author.last_name}`}
              src={author.profile_image}
              sx={{
                width: 32,
                height: 32
              }}
            />
          </ListItemAvatar>

          <ListItemText
            primary={
              <Tooltip title={`reputation score: ${authorRep}`}>
                <Badge
                  color="secondary"
                  badgeContent={authorRep}
                  max={99999999}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  {`${author.first_name}.${author.last_name}`}
                </Badge>
              </Tooltip>
            }
            primaryTypographyProps={{ variant: 'subtitle1' }}
            secondary={
              <>
                <Typography
                  gutterBottom
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.disabled'
                  }}
                >
                  Demandée{' '}
                  {formatDistanceToNowStrict(new Date(posted), {
                    addSuffix: true,
                    locale: fr
                  })}
                </Typography>
                <Typography component="span" variant="body2">
                  {/* <strong>{tagUser}</strong> {message} */}
                </Typography>
              </>
            }
          />
        </ListItem>
      </CardMediaStyle>

      <CardContent>
        <TitleStyle to={linkTo}>{title}</TitleStyle>
        <Box sx={{ mb: 2, typography: 'subtitle2', opacity: 0.72, pl: '18px' }}>{parse(description)}...</Box>

        <InfoStyle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {tags?.map((tag, index) => (
              <Button
                key={index}
                variant="outlined"
                color="info"
                size="small"
                sx={{ mr: 1, pt: '1px', pb: '1px', fontSize: '0.6rem' }}
              >
                {tag.label}
              </Button>
            ))}
          </Box>
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {INQUIST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5
                  // ...((latestPostLarge || latestPost) && {
                  //   color: 'grey.500'
                  // })
                }}
              >
                <Box component={Icon} icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography sx={{ typography: 'subtitle1', color: '#000' }}>{fShortenNumber(info.number)}</Typography>
                <strong style={{ padding: '0 5px' }}>{info.label}</strong>
              </Box>
            ))}
          </Box>
        </InfoStyle>
      </CardContent>
    </Card>
  );
}
