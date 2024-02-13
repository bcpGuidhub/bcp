// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { RevenueNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
RevenueCreate.propTypes = {
  setListRevenues: PropTypes.func.isRequired,
  revenues: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function RevenueCreate({ setListRevenues, revenues, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentRevenue = revenues.find((revenue) => revenue.id === currentResourceId);

  return (
    <Page title="Prévisionnel: Ajouter un chiffre d'affaires | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Ajouter un chiffre d'affaires" : "Modifier le chiffre d'affaires"}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? "Ajouter un chiffre d'affaires" : "Modifier le chiffre d'affaires"
            }
          ]}
        />

        <RevenueNewForm isEdit={isEdit} currentRevenue={currentRevenue} setListRevenues={setListRevenues} />
      </Container>
    </Page>
  );
}
