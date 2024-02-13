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
import {
  deleteAssociateCapitalContribution,
  deleteCapitalContribution,
  deleteLoan,
  fetchFinancingDetails
} from '../../../../redux/slices/project';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import AssociatesCapitalContributionsCreate from './AssociatesCapitalContributionsCreate';
import CapitalContributionCreate from './CapitalContributionCreate';
import LoanCreate from './LoanCreate';
import useAuth from '../../../../hooks/useAuth';

function buildCapitalContributions(capitalContributions) {
  const cells = capitalContributions.reduce((acc, capitalContribution) => {
    const cell = {
      id: capitalContribution.id,
      name: capitalContribution.type_capital_contribution,
      createdAt: capitalContribution.created_at,
      amounts: [capitalContribution.contribution_amount],
      year: capitalContribution.year_of_contribution,
      month: capitalContribution.month_of_contribution
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

function buildAssociatesCapitalContributions(associatesCapitalContributions) {
  const cells = associatesCapitalContributions.reduce((acc, associatesCapitalContribution) => {
    const cell = {
      id: associatesCapitalContribution.id,
      name: associatesCapitalContribution.type_of_operation,
      createdAt: associatesCapitalContribution.created_at,
      amounts: [associatesCapitalContribution.associate_capital_contribution_amount],
      year: associatesCapitalContribution.year_of_contribution_repayment,
      month: associatesCapitalContribution.month_of_contribution_repayment
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

function buildLoans(loans) {
  const cells = loans.reduce((acc, loan) => {
    const cell = {
      id: loan.id,
      name: loan.bank_loan_name,
      createdAt: loan.created_at,
      amounts: [loan.amount_loan],
      year: loan.year_of_loan_disbursement,
      month: loan.month_of_loan_disbursement
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

const TABLE_HEAD_CAPITAL_CONTRIBUTIONS = [
  { id: 'type_capital_contribution', label: 'Type de l’apport', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'contribution_amount', label: 'Montant de l’apport', alignRight: true, type: 'amount' },
  { id: 'year_of_contribution', label: 'Année', alignRight: true, type: 'date:year' },
  { id: 'month_of_contribution', label: 'Mois', alignRight: true, type: 'date:month' },
  { id: '' }
];

const TABLE_HEAD_ASSOCIATES_CAPITAL_CONTRIBUTIONS = [
  { id: 'type_of_operation', label: 'Nature de l’opération', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'associate_capital_contribution_amount', label: 'Montant', alignRight: true, type: 'amount' },
  { id: 'year_of_contribution_repayment', label: 'Année', alignRight: true, type: 'date:year' },
  { id: 'month_of_contribution_repayment', label: 'Mois', alignRight: true, type: 'date:month' },
  { id: '' }
];

const TABLE_HEAD_LOANS = [
  { id: 'bank_loan_name', label: 'Intitulé du financement', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'amount_loan', label: 'Montant du financement', alignRight: true, type: 'amount' },
  { id: 'year_of_loan_disbursement', label: 'Année de souscription', alignRight: true, type: 'date:year' },
  { id: 'month_of_loan_disbursement', label: 'Mois de souscription', alignRight: true, type: 'date:month' },
  { id: '' }
];

export default function Finances() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const isCreator = accountType !== 'stakeholder';
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const [listLoans, setListLoans] = useState(true);
  const [listCapitalContributions, setListCapitalContributions] = useState(true);
  const [listAssociatesCapitalContributions, setListAssociatesCapitalContributions] = useState(true);

  const [isEditCapitalContribution, setIsEditCapitalContribution] = useState(false);
  const [isEditAssociatesCapitalContribution, setIsEditAssociatesCapitalContribution] = useState(false);
  const [isEditLoan, setIsEditLoan] = useState(false);

  const [currentResourceId, setCurrentResourceId] = useState('');

  const { work } = useSelector((state) => state.project);

  const { loans = [], associatesCapitalContributions = [], capitalContributions = [] } = work;

  useEffect(() => {
    if (work.id) {
      dispatch(fetchFinancingDetails(work.id, apiPrefix));
      setListLoans(true);
      setListCapitalContributions(true);
      setListAssociatesCapitalContributions(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditLoan) {
      setIsEditCapitalContribution(false);
      setIsEditAssociatesCapitalContribution(false);
      setListLoans(false);
    }
  }, [isEditLoan, setListLoans, setListAssociatesCapitalContributions, setListCapitalContributions]);

  useEffect(() => {
    if (listLoans) {
      setIsEditLoan(false);
    }
  }, [listLoans, setIsEditLoan]);

  useEffect(() => {
    if (isEditCapitalContribution) {
      setIsEditLoan(false);
      setIsEditAssociatesCapitalContribution(false);
      setListCapitalContributions(false);
    }
  }, [isEditCapitalContribution, setListCapitalContributions, setIsEditLoan, setIsEditAssociatesCapitalContribution]);

  useEffect(() => {
    if (listCapitalContributions) {
      setIsEditCapitalContribution(false);
    }
  }, [listCapitalContributions, setIsEditCapitalContribution]);

  useEffect(() => {
    if (isEditAssociatesCapitalContribution) {
      setIsEditLoan(false);
      setIsEditCapitalContribution(false);
      setListAssociatesCapitalContributions(false);
    }
  }, [
    isEditAssociatesCapitalContribution,
    setListAssociatesCapitalContributions,
    setIsEditLoan,
    setIsEditCapitalContribution
  ]);

  useEffect(() => {
    if (listAssociatesCapitalContributions) {
      setIsEditAssociatesCapitalContribution(false);
    }
  }, [listAssociatesCapitalContributions, setIsEditAssociatesCapitalContribution]);

  return (
    <Page title="Les financements | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ pt: '112px' }}>
          <Stack spacing={4}>
            {listCapitalContributions && listLoans && listAssociatesCapitalContributions && (
              <>
                <>
                  <HeaderBreadcrumbs
                    heading="Les apports en capital"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Les apports en capital' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListCapitalContributions(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_CAPITAL_CONTRIBUTIONS}
                    resource={buildCapitalContributions(capitalContributions)}
                    deleteResource={deleteCapitalContribution}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditCapitalContribution}
                  />
                </>
                <>
                  <HeaderBreadcrumbs
                    heading="Les apports / remboursements en compte courant d'associé"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: "Les apports / remboursements en compte courant d'associé" }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListAssociatesCapitalContributions(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_ASSOCIATES_CAPITAL_CONTRIBUTIONS}
                    resource={buildAssociatesCapitalContributions(associatesCapitalContributions)}
                    deleteResource={deleteAssociateCapitalContribution}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditAssociatesCapitalContribution}
                  />
                </>
                <>
                  <HeaderBreadcrumbs
                    heading="Les financements externes"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Les financements externes' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListLoans(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_LOANS}
                    resource={buildLoans(loans)}
                    deleteResource={deleteLoan}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditLoan}
                  />
                </>
              </>
            )}
          </Stack>
          {!listCapitalContributions && (
            <CapitalContributionCreate
              setListCapitalContributions={setListCapitalContributions}
              capitalContributions={capitalContributions}
              currentResourceId={currentResourceId}
              isEdit={isEditCapitalContribution}
            />
          )}
          {!listAssociatesCapitalContributions && (
            <AssociatesCapitalContributionsCreate
              setListAssociatesCapitalContributions={setListAssociatesCapitalContributions}
              associatesCapitalContributions={associatesCapitalContributions}
              currentResourceId={currentResourceId}
              isEdit={isEditAssociatesCapitalContribution}
            />
          )}
          {!listLoans && (
            <LoanCreate
              setListLoans={setListLoans}
              loans={loans}
              currentResourceId={currentResourceId}
              isEdit={isEditLoan}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
