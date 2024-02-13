import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Fab, Stack, Tooltip, Typography, Button } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

InquisitePostUpDownVote.propTypes = {
  post: PropTypes.object.isRequired,
  onUpVote: PropTypes.func,
  onDownVote: PropTypes.func,
  votesTotal: PropTypes.number,
  retractUpVote: PropTypes.func,
  retractDownVote: PropTypes.func,
  votes: PropTypes.array
};

export default function InquisitePostUpDownVote({
  post,
  onUpVote,
  onDownVote,
  votesTotal,
  retractUpVote,
  retractDownVote,
  votes,
  ...other
}) {
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const initialPostRev = post.revisions[0];
  const { account } = useSelector((state) => state.user);
  const isPostAuthor = initialPostRev.author_id === account.id;

  const theme = useTheme();

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

  const handlePostUpVote = () => {
    if (isPostAuthor) {
      onSnackbarAction('info', 'Vous ne pouvez pas voter pour votre propre message');
      return;
    }

    if (upVoted) {
      retractUpVote({
        aggregate_id: post.id
      });
      onSnackbarAction('success', 'se rétracter vote enregistré');
      setUpVoted(false);
      return;
    }

    onUpVote({
      aggregate_id: post.id
    });
    onSnackbarAction('success', 'vote positif enregistré');
  };

  const handlePostDownVote = () => {
    if (isPostAuthor) {
      onSnackbarAction('info', 'Vous ne pouvez pas voter pour votre propre message');
      return;
    }

    if (downVoted) {
      retractDownVote({
        aggregate_id: post.id
      });
      onSnackbarAction('success', 'retirer le vote enregistré');
      setDownVoted(false);
      return;
    }

    onDownVote({
      aggregate_id: post.id
    });
    onSnackbarAction('success', 'vote positif enregistré');
  };

  useEffect(() => {
    const downVotesBySelf = votes && votes.some((vote) => vote.weight < 0 && vote.voter_id === account.id);
    const upVotesBySelf = votes && votes.some((vote) => vote.weight > 0 && vote.voter_id === account.id);

    if (downVotesBySelf) {
      setDownVoted(true);
    }

    if (upVotesBySelf) {
      setUpVoted(true);
    }
  }, [votes]);
  return (
    <Stack direction="column" alignContent="center" alignItems="center">
      <Box>
        <Tooltip title="Cette question montre un effort de recherche ; c'est utile et clair" placement="right" arrow>
          <Fab color="default" onClick={handlePostUpVote}>
            <ArrowCircleUpIcon
              style={{
                width: '3em',
                height: '3em',
                color: upVoted ? theme.palette.primary.main : theme.palette.text.secondary,
                fontSize: '1rem'
              }}
            />
          </Fab>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 1, mb: 1 }}>
        <Typography sx={{ typography: 'h4', color: theme.palette.text.secondary }}>{votesTotal}</Typography>
      </Box>
      <Box>
        <Tooltip
          title="Cette question ne montre aucun effort de recherche ; ce n'est pas clair ou pas utile"
          placement="right"
          arrow
        >
          <Fab color="default" onClick={handlePostDownVote}>
            <ArrowCircleDownIcon
              style={{
                width: '3em',
                height: '3em',
                color: downVoted ? theme.palette.primary.main : theme.palette.text.secondary,
                fontSize: '1rem'
              }}
            />
          </Fab>
        </Tooltip>
      </Box>
    </Stack>
  );
}
