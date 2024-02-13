import { useEffect, useState } from 'react';
// material
import {
  Container,
  Card,
  CardHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Alert,
  Box
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../../redux/store';
import API, { COTISATION_API } from '../../../../utils/axios';
import LoadingScreen from '../../../../components/LoadingScreen';
// components
import Scrollbar from '../../../../components/Scrollbar';
import { CollapsableIncomeStatementRow, FinancialForecastToolbar } from '../../../../components/services/guide';
import useAuth from '../../../../hooks/useAuth';
import { getProjectLegalStatus } from '../../../../redux/slices/project';
// ----------------------------------------------------------------------

const COLLAPSABLE_ROWS_FIELDS = [
  "Total des produits d'exploitation",
  "Marge brute d'exploitation",
  "Total des charges d'exploitation",
  "Résultat d'exploitation",
  'Résultat financier',
  'Résultat courant avant impôts',
  "Résultat de l'exercice"
];

function createCollapsableRows(rows) {
  const data = [];
  const mutatableRows = Object.assign([], rows);

  COLLAPSABLE_ROWS_FIELDS.forEach((label) => {
    const obj = {
      field: label,
      sub_rows: []
    };
    const dupRows = Object.assign([], mutatableRows);
    try {
      dupRows.forEach((row) => {
        if (row.field === label) {
          Object.assign(obj, row);
          mutatableRows.shift();
          throw new Error('');
        } else {
          obj.sub_rows.push(row);
        }
        mutatableRows.shift();
      });
    } catch {
      console.log('row');
    }

    data.push(obj);
  });
  return data;
}

export default function IncomeStatementVisualisation() {
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState({});
  const [collapsableRows, setCollapsableRows] = useState([]);

  const { accountType } = useAuth();
  const financeApiUrl =
    accountType === 'stakeholder'
      ? `v1/stakeholder/workstation/projects/${work.id}/finance`
      : `v1/workstation/projects/${work.id}/finance`;
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  useEffect(() => {
    dispatch(getProjectLegalStatus(work.id, apiPrefix));
  }, []);

  useEffect(() => {
    API.get(financeApiUrl)
      .then((response) => {
        const { employees } = response.data;
        const directorDoneProcessing = {};
        if (employees.directors !== null) {
          employees.directors.forEach((director) => {
            if (director.processing_cotisations === 'true') {
              setLoadingMessage('synchronisation des modifications apportées...');

              directorDoneProcessing[director.id] = false;
              const endPoint = 'director-cotisation-processing';
              let socket;
              const { host } = new URL(process.env.REACT_APP_APP_SERVER);
              if (process.env.NODE_ENV === 'production') {
                socket = new WebSocket(`wss://${host}/v1/${endPoint}`);
              } else {
                socket = new WebSocket(`ws://${host}/v1/${endPoint}`);
              }
              socket.onopen = function onOpen(evt) {
                socket.send(JSON.stringify({ id: director.id }));
              };
              socket.onmessage = function onMessage(evt) {
                const director = JSON.parse(evt.data);
                if (director.processing_cotisations === 'false') {
                  directorDoneProcessing[director.id] = true;
                  employees.directors = employees.directors.map((d) => (d.id === director.id ? director : d));
                }
              };
              socket.onclose = function onClose(evt) {
                const processingDone = Object.keys(directorDoneProcessing).every(
                  (e) => directorDoneProcessing[e] === true
                );
                if (processingDone) {
                  const storedSelectedProject = localStorage.getItem('selected_project');
                  const payload = {
                    project_details: { ...JSON.parse(storedSelectedProject) },
                    project_legal_status: { ...work.project_legal_status }
                  };

                  const reqPayload = {
                    ...response.data,
                    ...payload
                  };
                  COTISATION_API.post(`cotisations/financial-synthesis`, reqPayload).then((tables) => {
                    setIncomeStatement(tables.income_statement === null ? {} : tables.income_statement);
                    setLoadingMessage(null);
                    setLoadingTable(false);
                  });
                }
              };
            }
          });
        }
        if (Object.keys(directorDoneProcessing).length === 0) {
          const storedSelectedProject = localStorage.getItem('selected_project');
          const payload = {
            project_details: { ...JSON.parse(storedSelectedProject) },
            project_legal_status: { ...work.project_legal_status }
          };

          const reqPayload = {
            ...response.data,
            ...payload
          };
          COTISATION_API.post(`cotisations/financial-synthesis`, reqPayload).then((response) => {
            setCollapsableRows(createCollapsableRows(response.data.tables.income_statement.rows));
            setIncomeStatement(
              response.data.tables.income_statement === null ? {} : response.data.tables.income_statement
            );
            setLoadingMessage(null);
            setLoadingTable(false);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingMessage(null);
        setLoadingTable(false);
      });
  }, []);

  return (
    <Box sx={{ pt: '112px' }}>
      <FinancialForecastToolbar
        forecast={collapsableRows}
        user={account}
        document={incomeStatement}
        type="income-statement"
      />
      <Card>
        {loadingMessage && <Alert severity="error">{loadingMessage}</Alert>}
        <CardHeader title="Compte de résultat" />
        {loadingTable ? (
          <LoadingScreen />
        ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {incomeStatement?.columns?.map((column) => (
                      <TableCell
                        key={column.label}
                        align="right"
                        style={{
                          color: column.color,
                          fontSize: column.fontSize
                        }}
                      >
                        {column.label !== '' && <>{column.label}&nbsp;(€)</>}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {typeof collapsableRows !== 'undefined' &&
                    collapsableRows.map((row, i) => (
                      <CollapsableIncomeStatementRow
                        key={`${i}-${row.name}`}
                        row={row}
                        rowIndex={i}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </Card>
    </Box>
  );
}
