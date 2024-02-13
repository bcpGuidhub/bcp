// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { AssociatesCapitalContributionNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
AssociatesCapitalContributionCreate.propTypes = {
  setListAssociatesCapitalContributions: PropTypes.func.isRequired,
  associatesCapitalContributions: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function AssociatesCapitalContributionCreate({
  setListAssociatesCapitalContributions,
  associatesCapitalContributions,
  currentResourceId,
  isEdit
}) {
  const { themeStretch } = useSettings();
  const currentAssociatesCapitalContribution = associatesCapitalContributions.find(
    (associatesCapitalContribution) => associatesCapitalContribution.id === currentResourceId
  );
  return (
    <Page title="Prévisionnel: Ajouter un apport ou un remboursement de compte courant | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un apport ou un remboursement de compte courant' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un apport ou un remboursement de compte courant' : 'Modifier'
            }
          ]}
        />

        <AssociatesCapitalContributionNewForm
          isEdit={isEdit}
          currentAssociatesCapitalContribution={currentAssociatesCapitalContribution}
          setListAssociatesCapitalContributions={setListAssociatesCapitalContributions}
        />
      </Container>
    </Page>
  );
}
