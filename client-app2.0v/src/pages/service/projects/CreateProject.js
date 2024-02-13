// material
import { Container } from '@mui/material';
import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../components/Page';
import ProjectNewForm from '../../../components/_dashboard/project/ProjectNewForm';
// hooks
import useSettings from '../../../hooks/useSettings';
// import { getUserList } from '../../redux/slices/user';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

export default function CreateProject() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  return (
    <Page title="Projet: créer un nouveau projet | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Créer un nouveau projet' : 'Modifier le projet'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            { name: !isEdit ? 'Nouveau projet' : id }
          ]}
        />

        <ProjectNewForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
