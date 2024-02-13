import { Box, Button, Card, CardContent, Fab, Grid, IconButton, Stack, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import {
  InquisitePostUpDownVote,
  InquisitePostRevisionTimestamp,
  InquisitePostOwner,
  InquisitePostComment,
  InquisiteAnswerFlag
} from '..';

import useWebSocket from '../../../../hooks/useInquistWebSocket';
import { useDispatch } from '../../../../redux/store';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const VOTES_QUERY_INTERVAL = 30000;
const COMMENTS_QUERY_INTERVAL = 30000;
const ANSWER_ACCEPT_VOTE = 15;

InquisitePostAnswer.propTypes = {
  post: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  isPostAuthor: PropTypes.bool.isRequired
};

export default function InquisitePostAnswer({ post, answer, onEdit, isPostAuthor }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const {
    commentOnAnswer,
    onUpVoteAnswer,
    onDownVoteAnswer,
    retractUpVoteAnswer,
    retractDownVoteAnswer,
    acceptAnswer,
    retractAcceptAnswer
  } = useWebSocket();

  const [votesTotal, setVotesTotal] = useState(0);
  const [votes, setVotes] = useState(null);
  const [answerAccepted, setAnswerAccepted] = useState(false);
  const [comments, setComments] = useState([]);
  const [aggregateId, setAggregateId] = useState('');

  const currentRevision = answer.revisions.slice(-1)[0];

  const getAnswerVotes = async () => {
    try {
      if (answer) {
        const response = await API.get(`${apiPrefix}/inquisite/answers/${answer.id}/votes`);

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

  const getAnswerComments = async () => {
    try {
      if (answer) {
        const response = await API.get(`${apiPrefix}/inquisite/answers/${answer.id}/comments`);
        if (response.data && response.data.comments) {
          response.data.comments.sort((_comment, _comment_) => {
            if (_comment.votes.votes && _comment_.votes.votes === null) {
              return -1;
            }
            if (_comment_.votes.votes && _comment.votes.votes === null) {
              return 1;
            }
            if (_comment.votes.votes.length < _comment_.votes.votes.length) {
              return -1;
            }
            if (_comment_.votes.votes.length > _comment.votes.votes.length) {
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

  const onSnackbarAction = (variant, info) => {
    enqueueSnackbar(info, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      },
      action: (key) => (
        <>
          <Button size="small" color="inherit" onClick={() => closeSnackbar(key)}>
            Fermer
          </Button>
        </>
      )
    });
  };

  const handleAcceptAnswer = () => {
    if (answerAccepted) {
      retractAcceptAnswer({
        aggregate_id: post.id,
        answer_id: answer.id
      });
      onSnackbarAction('success', 'retracting accepted answer registered');
      setAnswerAccepted(false);
      return;
    }

    acceptAnswer({
      aggregate_id: post.id,
      answer_id: answer.id
    });
    onSnackbarAction('success', 'answer registered');
    setAnswerAccepted(true);
  };

  useEffect(() => {
    if (answer) {
      getAnswerVotes();
      getAnswerComments();
    }
  }, [answer]);

  useEffect(() => {
    if (answer) {
      const getAnswerVotesEveryInterval = setInterval(getAnswerVotes, VOTES_QUERY_INTERVAL);
      return () => clearInterval(getAnswerVotesEveryInterval);
    }
  }, [answer]);

  useEffect(() => {
    if (answer) {
      const getAnswerCommentsEveryInterval = setInterval(getAnswerComments, COMMENTS_QUERY_INTERVAL);
      return () => clearInterval(getAnswerCommentsEveryInterval);
    }
  }, [answer]);

  useEffect(() => {
    if (votes) {
      const accepted = votes && votes.some((vote) => vote.weight === ANSWER_ACCEPT_VOTE && isPostAuthor);

      if (accepted) {
        setAnswerAccepted(true);
      }
    }
  }, [votes]);

  return (
    <Grid key={answer.id} container spacing={2} style={{ marginTop: 0, marginLeft: 0 }} alignItems="flex-start">
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
              post={answer}
              onUpVote={onUpVoteAnswer}
              onDownVote={onDownVoteAnswer}
              votesTotal={votesTotal}
              retractUpVote={retractUpVoteAnswer}
              retractDownVote={retractDownVoteAnswer}
              votes={votes}
            />
            {isPostAuthor && (
              <Box sx={{ mt: theme.spacing(2) }}>
                <Tooltip
                  title="Acceptez cette réponse si elle a résolu votre problème ou si elle a été la plus utile pour trouver votre solution"
                  placement="right"
                  arrow
                >
                  <Fab color="default" onClick={handleAcceptAnswer}>
                    <BeenhereIcon
                      style={{
                        width: '2em',
                        height: '2em',
                        color: answerAccepted ? 'green' : theme.palette.text.secondary,
                        fontSize: '1rem'
                      }}
                    />
                  </Fab>
                </Tooltip>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={10}>
        <Stack direction="column">
          <Box sx={{ mb: 2, minHeight: 200 }}>
            <Card>
              <CardContent>{parse(currentRevision.body)}</CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Button
                    color="info"
                    size="small"
                    onClick={() => {
                      onEdit(answer);
                    }}
                  >
                    Modifier
                  </Button>
                  <InquisiteAnswerFlag answer={answer} />
                </Stack>
                {answer.revisions.length > 1 && <InquisitePostRevisionTimestamp post={answer} />}
                <InquisitePostOwner post={answer} />
              </Box>
            </CardContent>
          </Card>

          <Box>
            <InquisitePostComment
              post={answer}
              onSend={commentOnAnswer}
              comments={comments}
              aggregateId={aggregateId}
            />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
