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
import { deleteRevenue, deleteRevenueSource, fetchRevenues } from '../../../../redux/slices/project';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD, PATH_GUIDE } from '../../../../routes/paths';
import OtherRevenueCreate from './OtherRevenueCreate';
import RevenueCreate from './RevenueCreate';
import useAuth from '../../../../hooks/useAuth';

function buildResource(revenues) {
  const cells = revenues.reduce((acc, revenue) => {
    const cell = {
      id: revenue.id,
      name: revenue.revenue_label,
      createdAt: revenue.created_at,
      status: revenue.inventory_linked_revenue,
      amounts: [
        revenue.annual_amount_tax_excluded_year_1,
        revenue.annual_amount_tax_excluded_year_2,
        revenue.annual_amount_tax_excluded_year_3
      ]
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

function buildResourceSources(revenues) {
  const cells = revenues.reduce((acc, revenue) => {
    const cell = {
      id: revenue.id,
      name: revenue.name,
      createdAt: revenue.created_at,
      status: revenue.source_type,
      amounts: [revenue.amount_excluding_taxes],
      year: revenue.year,
      month: revenue.month
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

const TABLE_HEAD_REVENUE = [
  { id: 'revenue_label', label: 'Intitulé du chiffre d’affaires', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'inventory_linked_revenue', label: 'Achats', alignRight: false, type: 'status' },
  { id: 'annual_amount_tax_excluded_year_1', label: 'Montant hors taxes Année 1', alignRight: true, type: 'amount' },
  { id: 'annual_amount_tax_excluded_year_2', label: 'Montant hors taxes Année 2', alignRight: true, type: 'amount' },
  { id: 'annual_amount_tax_excluded_year_3', label: 'Montant hors taxes Année 3', alignRight: true, type: 'amount' },
  { id: '' }
];

const TABLE_HEAD_REVENUE_SOURCES = [
  { id: 'revenue_label', label: 'Intitulé de l’autre produit', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'source_type', label: 'Nature du produit', alignRight: false, type: 'status' },
  { id: 'amount_excluding_taxes', label: 'Montant', alignRight: true, type: 'amount' },
  { id: 'year', label: 'Année du produit', alignRight: true, type: 'date:year' },
  { id: 'month', label: 'Mois du produit', alignRight: true, type: 'date:month' },
  { id: '' }
];

export default function Revenue() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const isCreator = accountType !== 'stakeholder';
  const [listRevenues, setListRevenues] = useState(true);
  const [isEditRevenueSource, setIsEditRevenueSource] = useState(false);
  const [isEditRevenue, setIsEditRevenue] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState('');
  const [listOtherIncome, setListOtherIncome] = useState(true);
  const { work } = useSelector((state) => state.project);
  const { revenues = [] } = work;
  const otherRevenueSources = work.revenue_sources || [];

  useEffect(() => {
    if (work.id) {
      dispatch(fetchRevenues(work.id, apiPrefix));
      setListRevenues(true);
      setListOtherIncome(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditRevenue) {
      setIsEditRevenueSource(false);
      setListRevenues(false);
    }
  }, [isEditRevenue, setIsEditRevenueSource, setListRevenues]);

  useEffect(() => {
    if (listRevenues) {
      setIsEditRevenue(false);
    }
  }, [listRevenues, setIsEditRevenue]);

  useEffect(() => {
    if (isEditRevenueSource) {
      setIsEditRevenue(false);
      setListOtherIncome(false);
    }
  }, [isEditRevenueSource, setIsEditRevenue, setListOtherIncome]);

  useEffect(() => {
    if (listOtherIncome) {
      setIsEditRevenueSource(false);
    }
  }, [listOtherIncome, setIsEditRevenueSource]);

  return (
    <Page title="Votre chiffre d'affaires | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ pt: '112px' }}>
          <Stack spacing={4}>
            {listOtherIncome && listRevenues && (
              <>
                <>
                  <HeaderBreadcrumbs
                    heading="Le chiffre d'affaires global"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: "Le chiffre d'affaires global" }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListRevenues(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_REVENUE}
                    resource={buildResource(revenues)}
                    deleteResource={deleteRevenue}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditRevenue}
                  />
                </>
                <>
                  <HeaderBreadcrumbs
                    heading="Les autres produits"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Les autres produits' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListOtherIncome(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_REVENUE_SOURCES}
                    resource={buildResourceSources(otherRevenueSources)}
                    deleteResource={deleteRevenueSource}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditRevenueSource}
                  />
                </>
              </>
            )}
          </Stack>
          {!listOtherIncome && (
            <OtherRevenueCreate
              setListOtherIncome={setListOtherIncome}
              otherRevenueSources={otherRevenueSources}
              currentResourceId={currentResourceId}
              isEdit={isEditRevenueSource}
            />
          )}
          {!listRevenues && (
            <RevenueCreate
              setListRevenues={setListRevenues}
              revenues={revenues}
              currentResourceId={currentResourceId}
              isEdit={isEditRevenue}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
