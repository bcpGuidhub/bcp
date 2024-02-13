import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
// material
import { Alert, Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import HeaderBreadcrumbs from '../../../HeaderBreadcrumbs';
// components
import Page from '../../../Page';
import InquisiteNewForm from './InquisiteNewForm';
import LoadingScreen from '../../../LoadingScreen';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useWebSocket from '../../../../hooks/useInquistWebSocket';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

import { getPost, getPosTags } from '../../../../redux/slices/inquisite';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------
const GUIDELINES = [
  'Résumez votre problème en une phrase.',
  'Décrivez votre problème en détail.',
  'Décrivez où vous en êtes dans votre projet et vos attentes.',
  'Ajoutez des « mots clés » qui vont rendre votre question plus visible.',
  'Revoyez votre question et la poster.'
];
export default function InquisiteNew() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { addQuestionToInquisition, addToPostRevisionHistory } = useWebSocket();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { post, isLoading, tags } = useSelector((state) => state.inquist);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    if (isEdit) {
      dispatch(getPost(id, apiPrefix));
      dispatch(getPosTags(id, apiPrefix));
    }
  }, [dispatch, isEdit]);

  const renderPostEdit = () => {
    if (post === null) {
      return null;
    }

    const currentPostRevision = post.revisions.slice(-1)[0];
    const revisions = post.revisions.reduce((acc, revision) => {
      const author = post.revision_authors.find((author) => author.author_id === revision.author_id);
      const r = {
        ...revision,
        ...author
      };
      acc.push(r);
      return acc;
    }, []);

    return (
      <Page title="Inquisite: Edit Post | Guidhub">
        <Container maxWidth={themeStretch ? false : 'lg'} sx={{ pt: '164px !important' }}>
          <HeaderBreadcrumbs
            heading="Modifier"
            links={[
              { name: 'Inquisitions', href: PATH_DASHBOARD.inquist.browse },
              {
                name: 'retourner',
                href: PATH_DASHBOARD.inquist.post.replace(':id', post.id)
              },
              { name: currentPostRevision.title }
            ]}
          />
          <InquisiteNewForm
            onSend={addToPostRevisionHistory}
            isEdit={isEdit}
            post={post}
            tags={tags}
            revisions={revisions}
          />
        </Container>
      </Page>
    );
  };

  const renderPostCreate = () => (
    <Page title="Inquisite: New Post | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ pt: '164px !important' }}>
        <HeaderBreadcrumbs
          heading="Poser une question"
          links={[{ name: 'Retour aux questions', href: PATH_DASHBOARD.inquist.browse }, { name: '' }]}
        />
        <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
          <Typography sx={{ typography: 'h5' }}>Ecrire une bonne question.</Typography>
          <Typography sx={{ typography: 'body1' }}>
            Vous êtes prêt à poser une question en lien avec votre projet professionnel et ce formulaire va vous aider.
          </Typography>
          <Typography sx={{ typography: 'body1' }}> Etapes </Typography>
          <Box component="span">
            <List dense>
              {GUIDELINES.map((guideline, i) => (
                <ListItem key={i}>
                  <ListItemText primary={guideline} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Alert>
        <InquisiteNewForm onSend={addQuestionToInquisition} />
      </Container>
    </Page>
  );

  return <>{isLoading ? <LoadingScreen /> : <> {isEdit ? renderPostEdit() : renderPostCreate()}</>}</>;
}
