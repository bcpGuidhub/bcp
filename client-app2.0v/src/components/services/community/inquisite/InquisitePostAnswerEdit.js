import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
// material
import { Alert, Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import HeaderBreadcrumbs from '../../../HeaderBreadcrumbs';
// components
import Page from '../../../Page';
import InquisitePostAnswerEditForm from './InquisitePostAnswerEditForm';
import LoadingScreen from '../../../LoadingScreen';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useWebSocket from '../../../../hooks/useInquistWebSocket';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

import { getAnswer, getPost } from '../../../../redux/slices/inquisite';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

export default function InquisitePostAnswerEdit() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { addToPostAnswerRevisionHistory } = useWebSocket();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { postId, answerId } = useParams();
  const { post, isLoading, answer } = useSelector((state) => state.inquist);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    if (isEdit) {
      dispatch(getPost(postId, apiPrefix));
      dispatch(getAnswer(answerId, apiPrefix));
      // check if can edit.
      // - reputation
      // - edit moderator queue
    }
  }, [dispatch, isEdit]);

  const renderPostEdit = () => {
    if (post === null || answer === null) {
      return null;
    }
    return (
      <Page title="Inquisite: Modifier la réponse | Guidhub">
        <Container maxWidth={themeStretch ? false : 'lg'} sx={{ pt: '164px !important' }}>
          <HeaderBreadcrumbs
            heading="Modifier la réponse"
            links={[
              { name: 'Inquisitions', href: PATH_DASHBOARD.inquist.browse },
              {
                name: 'retourner',
                href: PATH_DASHBOARD.inquist.post.replace(':id', post.id)
              },
              { name: post.title }
            ]}
          />
          <InquisitePostAnswerEditForm onSend={addToPostAnswerRevisionHistory} answer={answer} post={post} />
        </Container>
      </Page>
    );
  };

  return <>{isLoading ? <LoadingScreen /> : renderPostEdit()}</>;
}
