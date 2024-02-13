// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { CapitalContributionNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
CapitalContributionCreate.propTypes = {
  setListCapitalContributions: PropTypes.func.isRequired,
  capitalContributions: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function CapitalContributionCreate({
  setListCapitalContributions,
  capitalContributions,
  currentResourceId,
  isEdit
}) {
  const { themeStretch } = useSettings();
  const currentCapitalContribution = capitalContributions.find(
    (capitalContribution) => capitalContribution.id === currentResourceId
  );
  return (
    <Page title="Prévisionnel: Ajouter un apport en capital | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un apport en capital' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un apport en capital' : 'Modifier'
            }
          ]}
        />

        <CapitalContributionNewForm
          isEdit={isEdit}
          currentCapitalContribution={currentCapitalContribution}
          setListCapitalContributions={setListCapitalContributions}
        />
      </Container>
    </Page>
  );
}
