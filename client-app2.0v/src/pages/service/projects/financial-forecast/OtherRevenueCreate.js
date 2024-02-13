// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import OtherRevenueNewForm from '../../../../components/services/guide/financial-forecasts/OtherRevenueNewForm';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
OtherRevenueCreate.propTypes = {
  setListOtherIncome: PropTypes.func.isRequired,
  otherRevenueSources: PropTypes.array.isRequired,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function OtherRevenueCreate({ setListOtherIncome, otherRevenueSources, isEdit, currentResourceId }) {
  const { themeStretch } = useSettings();
  const currentRevenueSource = otherRevenueSources.find((revenue) => revenue.id === currentResourceId);

  return (
    <Page title="Prévisionnel: Les autres produits | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 4 }}>
        <OtherRevenueNewForm
          isEdit={isEdit}
          currentRevenueSource={currentRevenueSource}
          setListOtherIncome={setListOtherIncome}
        />
      </Container>
    </Page>
  );
}
