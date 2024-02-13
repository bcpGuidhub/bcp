import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// material
import {
  Stack,
  TextField,
  Box,
  Button,
  CardContent,
  CardHeader,
  Divider,
  List,
  Card,
  styled,
  Typography,
  useTheme,
  Alert,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';
import { useDispatch } from '../../../../redux/store';
import { varScaleOutX } from '../../../animate';
import { InquisitePostCommentItem, InquisitePostCommentToolTipHelper } from '..';
import { getInquisiteCommunityReputation } from '../../../../redux/slices/inquisite';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    color: '#fff',
    background: '#212B36'
  }
});

// ----------------------------------------------------------------------
// const COMMENT_PRIVILEGE = 50;
const COMMENT_PRIVILEGE = 0;
// const UP_VOTE_COMMENT_PRIVILEGE = 15;
const UP_VOTE_COMMENT_PRIVILEGE = 0;

InquisitePostComment.propTypes = {
  post: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  comments: PropTypes.array,
  aggregateId: PropTypes.string
};
// ----------------------------------------------------------------------

export default function InquisitePostComment({ post, onSend, comments, aggregateId }) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { reputation } = useSelector((state) => state.inquist);
  const { work } = useSelector((state) => state.project);
  const { account: user } = useSelector((state) => state.user);
  console.log('--- comments ---: ', comments);
  // const currentCommentors = ['mark', 'marcus', 'grace', 'jimmy'];

  const [currentCommentors, setCurrentCommentors] = useState([]);
  const [allowComment, setAllowComment] = useState(false);
  const [matched, setMatched] = useState(null);
  const [matchReplyTo, setMatchReplyTo] = useState('');
  const [matchedIdx, setMatchedIdx] = useState(null);

  const handleMatchReplyTo = (event, m) => {
    setMatchReplyTo(m);
    setTimeout(() => {
      setMatched(null);
    }, 1000);
  };

  const regex = /@([a-zA-Z0-9][a-zA-Z0-9._]*)?$/gim;

  const handleComment = () => {
    if (user && post.author === user.id) {
      setAllowComment(true);
    }
    if (reputation && reputation >= COMMENT_PRIVILEGE) {
      setAllowComment(true);
    }
  };

  const handleCurrentCommentors = (authorFullName) => {
    const alreadyAdded = currentCommentors.filter((name) => name === authorFullName);

    if (alreadyAdded.length === 0) {
      setCurrentCommentors([...currentCommentors, authorFullName]);
    }
  };
  useEffect(() => {
    if (user) {
      dispatch(getInquisiteCommunityReputation(user.id, apiPrefix));
    }
  }, []);

  const NewInquisitePostNewCommentSchema = Yup.object().shape({
    comment: Yup.string().min(30).required('Saisissez au moins 30 caractères')
  });

  const formik = useFormik({
    initialValues: {
      aggregate_id: post.id,
      comment: '',
      reply: '',
      author: user.id
    },
    validationSchema: NewInquisitePostNewCommentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSend(values);
        setAllowComment(false);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Réponse publiée', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    const matchIdx = values.comment.search(regex);
    if (matchIdx > -1) {
      const matchedIdxCommentor = matchIdx + 1;
      const actualMatchCommentorToken = values.comment.substring(matchedIdxCommentor).toLowerCase();
      const matched = currentCommentors.filter((_c) => _c.toLowerCase().startsWith(actualMatchCommentorToken));

      setMatched(matched);
      setMatchedIdx(matchedIdxCommentor);
      return;
    }
    setMatched(null);
  }, [values.comment]);

  useEffect(() => {
    if (matchReplyTo) {
      const commentEmbeddReply =
        values.comment.substring(0, matchedIdx) +
        matchReplyTo +
        values.comment.substring(matchedIdx + matchReplyTo.length);
      setFieldValue('comment', commentEmbeddReply);
      setFieldValue('reply', matchReplyTo);
    }
  }, [matchReplyTo]);

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Divider />
      <List disablePadding sx={{ mb: 2 }}>
        {comments.length > 0 &&
          comments.map((comment) => {
            const { id } = comment;

            return (
              <div key={id}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {comment.votes.votes && comment.votes.votes.length > 0 && (
                    <Box>
                      <Typography sx={{ typography: 'body' }}>{comment.votes.votes.length}</Typography>
                    </Box>
                  )}
                  <InquisitePostCommentItem
                    comment={comment}
                    aggregateId={aggregateId}
                    upVotePrivilege={reputation >= UP_VOTE_COMMENT_PRIVILEGE}
                    handleCurrentCommentors={handleCurrentCommentors}
                  />
                </Box>
                <Divider
                  sx={{
                    ml: 'auto',
                    width: (theme) => `calc(100% - ${theme.spacing(7)})`
                  }}
                />
              </div>
            );
          })}
      </List>
      {/* <Divider /> */}
      {!allowComment && (
        <CustomWidthTooltip
          enterNextDelay={4000}
          arrow
          title={
            <Card>
              <CardHeader
                title={
                  <Box>
                    <Typography sx={{ typography: 'h5' }}>Inquisite comment action</Typography>
                    <Typography sx={{ typography: 'subtitle1', color: theme.palette.primary.main }}>
                      Privilège de communication accordé à 50 points de réputation <CommentIcon />
                    </Typography>
                    <Divider />
                  </Box>
                }
              />
              <CardContent>
                <InquisitePostCommentToolTipHelper />
              </CardContent>
            </Card>
          }
        >
          <motion.div variants={varScaleOutX}>
            <Box>
              <Button
                onClick={handleComment}
                color="info"
                size="small"
                sx={{ typography: 'button', textTransform: 'none !important' }}
              >
                <Typography sx={{ typography: 'body2', mr: 2 }}> Ajouter un commentaire</Typography> <CommentIcon />{' '}
              </Button>
              <InfoIcon />
            </Box>
          </motion.div>
        </CustomWidthTooltip>
      )}
      {allowComment && (
        <Box>
          <Box>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Card sx={{ p: 3 }}>
                    <div
                      style={{
                        position: 'relative'
                      }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={5}
                        label="Comment"
                        placeholder="Utilisez les commentaires pour répondre aux autres utilisateurs ou les informer des modifications. Si vous ajoutez de nouvelles informations, modifiez votre message au lieu de commenter."
                        {...getFieldProps('comment')}
                        error={Boolean(touched.comment && errors.comment)}
                        helperText={touched.comment && errors.comment}
                      />

                      {matched && (
                        <Box sx={{ position: 'absolute', top: 0, left: '30%' }}>
                          <ToggleButtonGroup
                            size="small"
                            value={matchReplyTo}
                            exclusive
                            onChange={handleMatchReplyTo}
                            aria-label="text alignment"
                          >
                            {matched.map((_m) => (
                              <ToggleButton key={_m} value={_m} aria-label={_m}>
                                {_m}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </Box>
                      )}

                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Alert variant="outlined" severity="info">
                          <Typography sx={{ mt: 1, mb: 1 }}>
                            Les commentaires sont utilisés pour demander des éclaircissements ou pour signaler des
                            problèmes dans le message.{' '}
                          </Typography>

                          <Typography sx={{ mt: 1, mb: 1 }}>
                            L'auteur du message sera toujours informé de votre commentaire. Pour notifier également un
                            précédent commentateur, mentionnez son nom d'utilisateur: @charlotte ou @Charlotte
                            fonctionneront tous les deux.
                          </Typography>
                        </Alert>
                      </Box>
                    </div>
                  </Card>
                </Stack>

                <Box sx={{ mt: 2, mb: 4 }}>
                  <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                    Ajouter un commentaire
                  </LoadingButton>
                </Box>
              </Form>
            </FormikProvider>
          </Box>
        </Box>
      )}
    </Box>
  );
}
