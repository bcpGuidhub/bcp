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
  deleteDirector,
  deleteEmployee,
  fetchEmployees,
  getProjectLegalStatus
} from '../../../../redux/slices/project';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DirectorCreate from './DirectorCreate';
import EmployeesCreate from './EmployeesCreate';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

function buildResource(directors) {
  const cells = directors.reduce((acc, director) => {
    const cell = {
      id: director.id,
      name: director.last_name,
      createdAt: director.created_at,
      amounts: [director.net_compensation_year_1, director.net_compensation_year_2, director.net_compensation_year_3]
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

function buildResourceEmployees(employees) {
  const cells = employees.reduce((acc, employee) => {
    const cell = {
      id: employee.id,
      name: employee.post,
      createdAt: employee.created_at,
      status: employee.contract_type,
      amounts: [employee.salary_brute_year_1, employee.salary_brute_year_2, employee.salary_brute_year_3]
    };
    acc.push(cell);
    return acc;
  }, []);
  return cells;
}

const TABLE_HEAD_DIRECTORS = [
  { id: 'last_name', label: 'Nom et prénom du dirigeant', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'net_compensation_year_1', label: 'Montant des rémunérations Année 1', alignRight: true, type: 'amount' },
  { id: 'net_compensation_year_2', label: 'Montant des rémunérations Année 2', alignRight: true, type: 'amount' },
  { id: 'net_compensation_year_3', label: 'Montant des rémunérations Année 3', alignRight: true, type: 'amount' },
  { id: '' }
];

const TABLE_HEAD_EMPLOYEES = [
  { id: 'post', label: 'Intitulé du poste du salarié', alignRight: false, type: 'name' },
  { id: 'created_at', label: 'Créé à', alignRight: false, type: 'date' },
  { id: 'contract_type', label: 'Type de contrat de travail', alignRight: false, type: 'status' },
  { id: 'salary_brute_year_1', label: 'Montant des rémunérations brutes Année 1', alignRight: true, type: 'amount' },
  { id: 'salary_brute_year_2', label: 'Montant des rémunérations brutes Année 2', alignRight: true, type: 'amount' },
  { id: 'salary_brute_year_3', label: 'Montant des rémunérations brutes Année 3', alignRight: true, type: 'amount' },
  { id: '' }
];

export default function Employees() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const [listDirectors, setListDirectors] = useState(true);
  const [isEditEmployees, setIsEditEmployees] = useState(false);
  const [isEditDirector, setIsEditDirector] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState('');
  const [listEmployees, setListEmployees] = useState(true);
  const { work } = useSelector((state) => state.project);
  const { employees = [], directors = [] } = work;
  const legal = work.project_legal_status || {};
  const companyTaxSystem = legal.tax_system;
  const individuelle =
    (legal.legal_status_idea === 'Entreprise individuelle' || legal.legal_status_idea === 'EIRL') &&
    (companyTaxSystem === 'IR' || companyTaxSystem === 'Micro-entreprise');

  useEffect(() => {
    if (work.id) {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
    }
  }, []);

  useEffect(() => {
    if (work.id) {
      dispatch(fetchEmployees(work.id, apiPrefix));
      setListDirectors(true);
      setListEmployees(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditDirector) {
      setIsEditEmployees(false);
      setListDirectors(false);
    }
  }, [isEditDirector, setIsEditEmployees, setListDirectors]);

  useEffect(() => {
    if (listDirectors) {
      setIsEditDirector(false);
    }
  }, [listDirectors, setIsEditDirector]);

  useEffect(() => {
    if (isEditEmployees) {
      setIsEditDirector(false);
      setListEmployees(false);
    }
  }, [isEditEmployees, setIsEditDirector, setListEmployees]);

  useEffect(() => {
    if (listEmployees) {
      setIsEditEmployees(false);
    }
  }, [listEmployees, setIsEditEmployees]);
  const directorPercentageExceeded = (addOwner) => {
    const currentPercent = directors.reduce((acc, director) => {
      acc += Number.isNaN(parseInt(director.percentage_equity_capital, 10))
        ? 0
        : parseInt(director.percentage_equity_capital, 10);
      return acc;
    }, 0);
    return parseInt(addOwner + currentPercent, 10) > 100;
  };
  const permitAddDirector = () => {
    if (
      ['Entreprise individuelle', 'EIRL', 'EURL', 'SASU'].includes(legal.legal_status_idea) &&
      directors.length === 1
    ) {
      return false;
    }
    if (legal.legal_status_idea === 'SARL') {
      return !directorPercentageExceeded(0);
    }
    return true;
  };
  return (
    <Page title="Les salaires et cotisations sociales | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ pt: '112px' }}>
          <Stack spacing={4}>
            {listEmployees && listDirectors && (
              <>
                <>
                  <HeaderBreadcrumbs
                    heading="Rémunérations et cotisations sociales des dirigeants"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      {
                        name: !individuelle
                          ? 'Rémunérations et cotisations sociales des dirigeants'
                          : 'Prélèvements de l’entrepreneur individuel'
                      }
                    ]}
                    action={
                      permitAddDirector() && isCreator ? (
                        <Button
                          variant="contained"
                          onClick={() => setListDirectors(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          {individuelle ? 'Ajouter des prélèvements' : 'Ajouter un dirigeant'}
                        </Button>
                      ) : (
                        ''
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_DIRECTORS}
                    resource={buildResource(directors)}
                    deleteResource={deleteDirector}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditDirector}
                  />
                </>
                <>
                  <HeaderBreadcrumbs
                    heading="Rémunérations et cotisations sociales des salariés"
                    links={[
                      { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
                      { name: 'Rémunérations et cotisations sociales des salariés' }
                    ]}
                    action={
                      isCreator && (
                        <Button
                          variant="contained"
                          onClick={() => setListEmployees(false)}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          Nouveau
                        </Button>
                      )
                    }
                  />
                  <ResourceList
                    tableHead={TABLE_HEAD_EMPLOYEES}
                    resource={buildResourceEmployees(employees)}
                    deleteResource={deleteEmployee}
                    setCurrentResourceId={setCurrentResourceId}
                    editResource={setIsEditEmployees}
                  />
                </>
              </>
            )}
          </Stack>
          {!listEmployees && (
            <EmployeesCreate
              setListEmployees={setListEmployees}
              employees={employees}
              currentResourceId={currentResourceId}
              isEdit={isEditEmployees}
            />
          )}
          {!listDirectors && (
            <DirectorCreate
              setListDirectors={setListDirectors}
              directors={directors}
              currentResourceId={currentResourceId}
              isEdit={isEditDirector}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
