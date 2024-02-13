import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Page from '../../../Page';
import Markdown from '../../../Markdown';
import LoadingScreen from '../../../LoadingScreen';
import useSettings from '../../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getPost, getPosTags, getAnswers } from '../../../../redux/slices/inquisite';
import {
  InquistPostHero,
  InquisitePostUpDownVote,
  InquisitePostRevisionTimestamp,
  InquisitePostEdit,
  InquisitePostOwner,
  InquisitePostComment,
  InquisitePostAnswerBoard
} from '..';
import useInquistWebSocket from '../../../../hooks/useInquistWebSocket';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const TAGS_OPTION = [
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  },
  {
    label: 'SASU',
    description: `Les formalités sont nombreuses et peuvent être compliquées à gérer seul. Elles sont également plus coûteuses. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe`,
    score: 44444
  }
];

function applySortBy(answers, sortBy) {
  // SORT BY
  // if (sortBy === 'scoredesc') {
  //   answers = orderBy(answers, ['sold'], ['desc']);
  // }
  // if (sortBy === 'trending') {
  //   answers = orderBy(answers, ['createdAt'], ['desc']);
  // }
  // if (sortBy === 'priceDesc') {
  //   answers = orderBy(answers, ['price'], ['desc']);
  // }
  // if (sortBy === 'priceAsc') {
  //   answers = orderBy(answers, ['price'], ['asc']);
  // }
  return answers;
}

const ANSWERS_QUERY_INTERVAL = 10000;
const VOTES_QUERY_INTERVAL = 10000;
const COMMENTS_QUERY_INTERVAL = 10000;

export default function PostedInquisite() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { commentOnPost, onUpVote, onDownVote, retractUpVotePost, retractDownVotePost } = useInquistWebSocket();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [votesTotal, setVotesTotal] = useState(0);
  const [votes, setVotes] = useState(null);
  const [comments, setComments] = useState([]);
  const [aggregateId, setAggregateId] = useState('');

  const { post, tags, answers, isLoading, sortBy } = useSelector((state) => state.inquist);
  // const sortedAnswers = applySortBy(answers, sortBy);

  const getPostVotes = async () => {
    try {
      if (post) {
        const response = await API.get(`${apiPrefix}/inquisite/posts/${post.id}/votes`);

        if (response.data.votes) {
          const votesTotal =
            response.data.votes.reduce((acc, v) => {
              acc += v.weight;
              return acc;
            }, 0) || 0;

          setVotesTotal(votesTotal);
          setVotes(response.data.votes);
        } else {
          setVotesTotal(0);
          setVotes(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPostComments = async () => {
    try {
      if (post) {
        const response = await API.get(`${apiPrefix}/inquisite/posts/${post.id}/comments`);
        if (response.data && response.data.comments) {
          response.data.comments.sort((_comment, _comment_) => {
            if (_comment.votes.votes && _comment_.votes.votes === null) {
              return -1;
            }
            if (_comment_.votes && _comment_.votes.votes && _comment.votes.votes === null) {
              return 1;
            }
            if (_comment_.votes && _comment.votes.votes && _comment.votes.votes.length < _comment_.votes.votes.length) {
              return -1;
            }
            if (_comment_.votes && _comment.votes.votes && _comment_.votes.votes.length > _comment.votes.votes.length) {
              return 1;
            }
            return 0;
          });
          setComments(response.data.comments);
          setAggregateId(response.data.aggregate_id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getPost(id, apiPrefix));
      dispatch(getPosTags(id, apiPrefix));
      dispatch(getAnswers(id, apiPrefix));
    }
  }, [id]);

  useEffect(() => {
    const getAnswersEveryInterval = setInterval(() => {
      dispatch(getAnswers(id, apiPrefix));
    }, ANSWERS_QUERY_INTERVAL);
    return () => clearInterval(getAnswersEveryInterval);
  }, [id]);

  useEffect(() => {
    if (post) {
      getPostVotes();
      getPostComments();
    }
  }, [post]);

  useEffect(async () => {
    if (post) {
      const getPostVotesEveryInterval = setInterval(getPostVotes, VOTES_QUERY_INTERVAL);
      return () => clearInterval(getPostVotesEveryInterval);
    }
  }, [post]);

  useEffect(async () => {
    if (post) {
      const getPostCommentsEveryInterval = setInterval(getPostComments, COMMENTS_QUERY_INTERVAL);
      return () => clearInterval(getPostCommentsEveryInterval);
    }
  }, [post]);

  const renderPost = () => {
    if (post === null || tags === null) {
      return <LoadingScreen />;
    }
    const currentPostRevision = post.revisions.slice(-1)[0];
    return (
      <Page title={`${currentPostRevision.title} | Guidhub`}>
        <Container maxWidth={themeStretch ? false : 'md'} sx={{ pt: '112px' }}>
          <InquistPostHero post={currentPostRevision} />
          <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ p: theme.spacing(1) }}>
            <Typography sx={{ typography: 'body2' }}>
              Demandée{' '}
              <strong>
                {formatDistanceToNowStrict(new Date(post.revisions[0].posted), {
                  addSuffix: true,
                  locale: fr
                })}
              </strong>
            </Typography>
            {/* <Typography sx={{ typography: 'body2' }}>Modified </Typography> */}
          </Stack>
          <Divider />
          <Grid container spacing={2} style={{ marginTop: 0, marginLeft: 0 }} alignItems="flex-start">
            <Grid
              item
              xs={2}
              style={{
                display: 'flex'
              }}
            >
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <InquisitePostUpDownVote
                    post={post}
                    onUpVote={onUpVote}
                    onDownVote={onDownVote}
                    votesTotal={votesTotal}
                    retractUpVote={retractUpVotePost}
                    retractDownVote={retractDownVotePost}
                    votes={votes}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={10}>
              <Stack direction="column">
                <Box sx={{ mb: 2, minHeight: 200 }}>
                  <Card>
                    <CardContent>{parse(currentPostRevision.description)}</CardContent>
                  </Card>
                </Box>
                <Box sx={{ mt: 4, mb: 2 }}>
                  {tags.map((tag, index) => (
                    <Button
                      key={tag.id}
                      variant="outlined"
                      color="info"
                      size="small"
                      sx={{ mr: 1, pt: '1px', pb: '1px', fontSize: '0.6rem' }}
                    >
                      {tag.label}
                    </Button>
                  ))}
                </Box>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <InquisitePostEdit post={post} />
                      {post.revisions.length > 1 && <InquisitePostRevisionTimestamp post={post} />}
                      <InquisitePostOwner post={post} />
                    </Box>
                  </CardContent>
                </Card>

                <Box>
                  <InquisitePostComment
                    post={post}
                    onSend={commentOnPost}
                    comments={comments}
                    aggregateId={aggregateId}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <InquisitePostAnswerBoard post={post} answers={answers} />
        </Container>
      </Page>
    );
  };
  return <>{isLoading ? <LoadingScreen /> : renderPost()}</>;
}
