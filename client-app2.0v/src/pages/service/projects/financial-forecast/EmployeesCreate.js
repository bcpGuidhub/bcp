// material
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
import { EmployeeNewForm } from '../../../../components/services/guide';
// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
EmployeesCreate.propTypes = {
  setListEmployees: PropTypes.func.isRequired,
  employees: PropTypes.array,
  currentResourceId: PropTypes.string,
  isEdit: PropTypes.bool
};
export default function EmployeesCreate({ setListEmployees, employees, currentResourceId, isEdit }) {
  const { themeStretch } = useSettings();
  const currentEmployee = employees.find((employee) => employee.id === currentResourceId);
  return (
    <Page title="Prévisionnel: Ajouter un salarié | Guidhub">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Ajouter un salarié' : 'Modifier'}
          links={[
            { name: "Vue d'ensemble", href: PATH_DASHBOARD.project.root },
            {
              name: !isEdit ? 'Ajouter un salarié' : 'Modifier'
            }
          ]}
        />

        <EmployeeNewForm isEdit={isEdit} currentEmployee={currentEmployee} setListEmployees={setListEmployees} />
      </Container>
    </Page>
  );
}
