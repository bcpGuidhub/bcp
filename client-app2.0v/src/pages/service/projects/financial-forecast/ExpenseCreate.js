// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { ExpenseNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
ExpenseCreate.propTypes = {
  setListExpenses: PropTypes.func.isRequired,
  expenses: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function ExpenseCreate({ setListExpenses, expenses, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentExpense = expenses.find((expense) => expense.id === currentResourceId);
  return (
    <Page title="Prévisionnel: Ajoutez vos dépenses | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajoutez vos dépenses' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajoutez vos dépenses' : 'Modifier'
            }
          ]}
        />

        <ExpenseNewForm isEdit={isEdit} currentExpense={currentExpense} setListExpenses={setListExpenses} />
      </Container>
    </Page>
  );
}
