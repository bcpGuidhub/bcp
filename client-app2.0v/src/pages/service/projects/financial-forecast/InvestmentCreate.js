// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { InvestmentNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
InvestmentCreate.propTypes = {
  setListInvestments: PropTypes.func.isRequired,
  investments: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function InvestmentCreate({ setListInvestments, investments, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentInvestment = investments.find((investment) => investment.id === currentResourceId);
  return (
    <Page title="Prévisionnel: Ajouter un investissement | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un investissement' : "Modifier l'investissement"}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un investissement' : "Modifier l'investissement"
            }
          ]}
        />

        <InvestmentNewForm
          isEdit={isEdit}
          currentInvestment={currentInvestment}
          setListInvestments={setListInvestments}
        />
      </Container>
    </Page>
  );
}
