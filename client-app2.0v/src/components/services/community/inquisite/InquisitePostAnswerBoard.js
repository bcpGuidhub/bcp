import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Card,
  CardHeader,
  CardContent,
  useTheme,
  styled
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import InfoIcon from '@mui/icons-material/Info';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { InquisitePostNewAnswerForm, InquisitePostAnswer, AnswerSort, InquisitePostAnswerSelfQuestion } from '..';
import useWebSocket from '../../../../hooks/useInquistWebSocket';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { varScaleOutX } from '../../../animate';
// ----------------------------------------------------------------------
const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    color: '#fff',
    background: '#212B36'
  }
});

// ----------------------------------------------------------------------

InquisitePostAnswerBoard.propTypes = {
  post: PropTypes.object.isRequired,
  answers: PropTypes.array
};

export default function InquisitePostAnswerBoard({ post, answers }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const { addAnswerToQuestion } = useWebSocket();

  const { work } = useSelector((state) => state.project);
  const { account: user } = useSelector((state) => state.user);
  const isPostAuthor = user.id === post.revisions[0].author_id;
  const [displayAnswerForm, setDisplayAnswerForm] = useState(true);
  const [postUnanswered, setPostUnanswered] = useState(false);

  const handleEdit = (answer) => {
    const url = `${PATH_DASHBOARD.inquist.root}/posts/${post.id}/answers/${answer.id}/edit`;

    navigate(url);
  };

  const handlePostAnswer = () => {
    setDisplayAnswerForm(true);
    setPostUnanswered(false);
  };

  useEffect(() => {
    if (typeof answers === 'undefined' || answers === null || answers.length === 0) {
      setPostUnanswered(true);
      return;
    }

    if (answers?.some((answer) => answer.author === user.id)) {
      setPostUnanswered(false);
      setDisplayAnswerForm(false);
      return;
    }
    setDisplayAnswerForm(true);
  }, [answers]);

  useEffect(() => {
    if (isPostAuthor) {
      setDisplayAnswerForm(false);
    }
  }, [post]);

  const renderPost = () => {
    if (post === null) {
      return null;
    }
    return (
      <Box sx={{ mt: 2 }}>
        {answers && (
          <>
            <Divider />
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Box>
                <Typography sx={{ typography: 'h4' }}> {answers.length} Réponses</Typography>
              </Box>
              {/* <Box>
                <AnswerSort />
              </Box> */}
            </Stack>
            <Divider />
          </>
        )}
        {answers && (
          <>
            {answers.map((answer, i) => (
              <InquisitePostAnswer
                key={answer.id}
                post={post}
                answer={answer}
                onEdit={handleEdit}
                isPostAuthor={isPostAuthor}
              />
            ))}
          </>
        )}
        <Divider />
        {!displayAnswerForm && isPostAuthor && postUnanswered && (
          <CustomWidthTooltip
            enterNextDelay={4000}
            arrow
            title={
              <Card>
                <CardHeader
                  title={
                    <Box>
                      <Typography sx={{ typography: 'subtitle1', color: theme.palette.primary.main }}>
                        Êtes-vous sûr de vouloir répondre à votre question?
                      </Typography>
                      <Divider />
                    </Box>
                  }
                />
                <CardContent>
                  <InquisitePostAnswerSelfQuestion />
                </CardContent>
              </Card>
            }
          >
            <motion.div variants={varScaleOutX} style={{ margin: '50px 0px' }}>
              <Button variant="contained" onClick={handlePostAnswer} sx={{ textTransform: 'none !important' }}>
                <Typography sx={{ typography: 'body2', mr: 2 }}> Répondre à votre question </Typography>
                <InfoIcon />
              </Button>
            </motion.div>
          </CustomWidthTooltip>
        )}
        {displayAnswerForm && <InquisitePostNewAnswerForm post={post} onSend={addAnswerToQuestion} />}
      </Box>
    );
  };
  return <>{renderPost()}</>;
}
