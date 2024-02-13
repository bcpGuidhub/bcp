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
import { deleteInvestment, fetchInvestments } from '../../../../redux/slices/project';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import InvestmentCreate from './InvestmentCreate';
import useAuth from '../../../../hooks/useAuth';

function buildInvestments(investments) {
  const cells = investments.reduce((acc, investments) => {
    const cell = {
      id: investments.id,
      name: investments.investment_name,
      createdAt: investments.created_at,
      status: investments.investment_type,
      amounts: [investments.investment_amount_tax_included],
      year: investments.year_of_purchase,
      month: investments.month_of_purchase
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

const TABLE_HEAD_INVESTMENTS = [
  { id: 'investment_name', label: 'Nom de l’investissement', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'investments_category', label: "Nature de l'investissement", alignRight: false, type: 'status' },
  { id: 'investment_amount_tax_included', label: 'Montant hors taxes', alignRight: true, type: 'amount' },
  { id: 'year', label: 'Année', alignRight: true, type: 'date:year' },
  { id: 'month', label: 'Mois', alignRight: true, type: 'date:month' },
  { id: '' }
];

export default function Investments() {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [listInvestments, setListInvestments] = useState(true);
  const [isEditInvestment, setIsEditInvestment] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState('');
  const { work } = useSelector((state) => state.project);
  const { investments = [] } = work;

  useEffect(() => {
    if (work.id) {
      dispatch(fetchInvestments(work.id, apiPrefix));
      setListInvestments(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditInvestment) {
      setListInvestments(false);
    }
  }, [isEditInvestment, setListInvestments]);

  useEffect(() => {
    if (listInvestments) {
      setIsEditInvestment(false);
    }
  }, [listInvestments, setIsEditInvestment]);

  return (
    <Page title="Les investissements | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ pt: '112px' }}>
          <Stack spacing={4}>
            {listInvestments && (
              <>
                <>
                  <HeaderBreadcrumbs
                    heading="Les investissements"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Les investissements globaux' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListInvestments(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_INVESTMENTS}
                    resource={buildInvestments(investments)}
                    deleteResource={deleteInvestment}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditInvestment}
                  />
                </>
              </>
            )}
          </Stack>
          {!listInvestments && (
            <InvestmentCreate
              setListInvestments={setListInvestments}
              investments={investments}
              currentResourceId={currentResourceId}
              isEdit={isEditInvestment}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
