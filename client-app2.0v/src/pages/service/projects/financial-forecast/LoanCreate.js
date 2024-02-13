// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { LoanNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
LoanCreate.propTypes = {
  setListLoans: PropTypes.func.isRequired,
  loans: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function LoanCreate({ setListLoans, loans, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentLoan = loans.find((loan) => loan.id === currentResourceId);
  return (
    <Page title="Prévisionnel: Ajouter un financement externe | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un financement externe' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un financement externe' : 'Modifier'
            }
          ]}
        />

        <LoanNewForm isEdit={isEdit} currentLoan={currentLoan} setListLoans={setListLoans} />
      </Container>
    </Page>
  );
}
