import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useSnackbar } from 'notistack';
// material
import {
  Box,
  Button,
  Avatar,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
  Stack,
  Tooltip
} from '@mui/material';

import { MIconButton } from '../../../@material-extend';
import { useSelector } from '../../../../redux/store';
// utils
import API from '../../../../utils/axios';
import useInquistWebSocket from '../../../../hooks/useInquistWebSocket';
import InquisitePostCommentFlag from './InquisitePostCommentFlag';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

InquisitePostCommentItem.propTypes = {
  comment: PropTypes.object,
  aggregateId: PropTypes.string,
  upVotePrivilege: PropTypes.bool,
  handleCurrentCommentors: PropTypes.func
};

export default function InquisitePostCommentItem({ comment, aggregateId, upVotePrivilege, handleCurrentCommentors }) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { upVoteComment, retractUpVoteComment } = useInquistWebSocket();
  const { enqueueSnackbar } = useSnackbar();

  const { work } = useSelector((state) => state.project);
  const { account: user } = useSelector((state) => state.user);

  const [author, setAuthor] = useState(null);

  useEffect(async () => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/authors`, {
        params: { id: comment.author }
      });
      if (response.data) {
        setAuthor(`${response.data.first_name}.${response.data.last_name}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (author) {
      handleCurrentCommentors(author);
    }
  }, [author]);

  const alreadyVoted = comment && comment.votes.votes && comment.votes.votes.some((vote) => vote.voter_id === user.id);

  const handleCommentUpVote = () => {
    if (!upVotePrivilege) {
      enqueueSnackbar('voter pour un commentaire nécessite une réputation de 15', { variant: 'error' });
      return;
    }
    if (user && comment.author === user.id) {
      enqueueSnackbar('vous ne pouvez pas voter pour votre propre commentaire.', { variant: 'error' });
      return;
    }
    if (alreadyVoted) {
      enqueueSnackbar('supprimer le vote sur le commentaire', { variant: 'warn' });
      retractUpVoteComment({
        aggregate_id: aggregateId,
        comment_id: comment.id
      });
      return;
    }
    enqueueSnackbar('vote enregistré.', { variant: 'success' });
    upVoteComment({
      aggregate_id: aggregateId,
      comment_id: comment.id
    });
  };

  return (
    <>
      <ListItem disableGutters>
        <ListItemAvatar>
          <Stack direction="column">
            <Tooltip title="votez pour ce commentaire">
              <MIconButton onClick={handleCommentUpVote}>
                <ArrowCircleUpIcon />
              </MIconButton>
            </Tooltip>
            <InquisitePostCommentFlag comment={comment} />
          </Stack>
        </ListItemAvatar>

        <ListItemText
          primary={parse(comment.body)}
          primaryTypographyProps={{ variant: 'body2' }}
          secondary={
            <>
              <Typography component="span" variant="body2">
                <strong>-</strong>{' '}
                <Button color="info" size="small">
                  {author}
                </Button>
                {formatDistanceToNowStrict(new Date(comment.posted), {
                  addSuffix: true,
                  locale: fr
                })}
              </Typography>
            </>
          }
        />
      </ListItem>
    </>
  );
}
