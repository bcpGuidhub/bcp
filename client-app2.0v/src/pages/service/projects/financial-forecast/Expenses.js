import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { Box, Button, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { ResourceList } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { deleteExpense, fetchExpenses } from '../../../../redux/slices/project';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import ExpenseCreate from './ExpenseCreate';
import useAuth from '../../../../hooks/useAuth';

function buildExpenses(expenses) {
  const cells = expenses.reduce((acc, expense) => {
    const cell = {
      id: expense.id,
      name: expense.expense_label,
      createdAt: expense.created_at,
      status: expense.expense_category,
      amounts: [expense.annual_amount_tax_inc_1, expense.annual_amount_tax_inc_2, expense.annual_amount_tax_inc_3]
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

const TABLE_HEAD_EXPENSES = [
  { id: 'expense_label', label: 'Nom de la dépense', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'expense_category', label: 'Catégorie de dépense', alignRight: false, type: 'status' },
  { id: 'annual_amount_tax_inc_1', label: 'Montant hors taxes Année 1', alignRight: true, type: 'amount' },
  { id: 'annual_amount_tax_inc_2', label: 'Montant hors taxes Année 2', alignRight: true, type: 'amount' },
  { id: 'annual_amount_tax_inc_3', label: 'Montant hors taxes Année 3', alignRight: true, type: 'amount' },
  { id: '' }
];

export default function Expenses() {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [listExpenses, setListExpenses] = useState(true);
  const [isEditExpense, setIsEditExpense] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState('');
  const { work } = useSelector((state) => state.project);
  const { expenses = [] } = work;

  useEffect(() => {
    if (work.id) {
      dispatch(fetchExpenses(work.id, apiPrefix));
      setListExpenses(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditExpense) {
      setListExpenses(false);
    }
  }, [isEditExpense, setListExpenses]);

  useEffect(() => {
    if (listExpenses) {
      setIsEditExpense(false);
    }
  }, [listExpenses, setIsEditExpense]);

  return (
    <Page title="Les dépenses | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ pt: '112px' }}>
          <Stack spacing={4}>
            {listExpenses && (
              <>
                <>
                  <HeaderBreadcrumbs
                    heading="Les dépenses globales"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Les dépenses globales' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListExpenses(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_EXPENSES}
                    resource={buildExpenses(expenses)}
                    deleteResource={deleteExpense}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditExpense}
                  />
                </>
              </>
            )}
          </Stack>
          {!listExpenses && (
            <ExpenseCreate
              setListExpenses={setListExpenses}
              expenses={expenses}
              currentResourceId={currentResourceId}
              isEdit={isEditExpense}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
