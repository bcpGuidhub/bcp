// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { DirectorNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
DirectorCreate.propTypes = {
  setListDirectors: PropTypes.func.isRequired,
  directors: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function DirectorCreate({ setListDirectors, directors, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentDirector = directors.find((director) => director.id === currentResourceId);
  return (
    <Page title="Prévisionnel: Ajouter un dirigeant | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un dirigeant' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un dirigeant' : 'Modifier'
            }
          ]}
        />

        <DirectorNewForm isEdit={isEdit} currentDirector={currentDirector} setListDirectors={setListDirectors} />
      </Container>
    </Page>
  );
}
