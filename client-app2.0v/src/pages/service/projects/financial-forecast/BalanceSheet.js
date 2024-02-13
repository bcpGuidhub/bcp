import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Card,
  CardHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../redux/store';
import API, { COTISATION_API } from '../../../../utils/axios';
import LoadingScreen from '../../../../components/LoadingScreen';
// components

import Scrollbar from '../../../../components/Scrollbar';
import { CollapsableBalanceSheetRow, FinancialForecastToolbar } from '../../../../components/services/guide';
import useAuth from '../../../../hooks/useAuth';
import { getProjectLegalStatus } from '../../../../redux/slices/project';
// ----------------------------------------------------------------------
const COLLAPSABLE_ROWS_FIELDS = ['Total des Investissements', "Total de l'actif circulant", 'TOTAL ACTIF'];

function createCollapsableRows(rows) {
  const mutatableRows = Object.assign([], rows);
  return [{}, {}, {}].map((year, i) => {
    const obj = {
      rows: []
    };
    COLLAPSABLE_ROWS_FIELDS.forEach((label) => {
      const collapsableRow = {
        field: label,
        sub_rows: []
      };
      const dupRows = Object.assign([], mutatableRows[i]);
      try {
        dupRows.forEach((row, j) => {
          if (row.asset === label) {
            Object.assign(collapsableRow, row);

            mutatableRows[i].shift();
            throw new Error('proceed to next collapsable row');
          } else {
            collapsableRow.sub_rows.push(row);
          }

          mutatableRows[i].shift();
        });
      } catch (e) {
        console.log(e);
      }
      obj.rows.push(collapsableRow);
    });
    return {
      year: `Année ${i + 1}`,
      rows: obj.rows
    };
  });
}

export default function BalanceSheet() {
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState({});
  const [collapsableRows, setCollapsableRows] = useState([]);
  const [selectedYear, setSelectedYear] = useState('Année 1');
  const { accountType } = useAuth();
  const apiUrl =
    accountType === 'stakeholder'
      ? `v1/stakeholder/workstation/projects/${work.id}/finance`
      : `v1/workstation/projects/${work.id}/finance`;
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  useEffect(() => {
    dispatch(getProjectLegalStatus(work.id, apiPrefix));
  }, []);

  useEffect(() => {
    const storedSelectedProject = localStorage.getItem('selected_project');
    const payload = {
      project_details: { ...JSON.parse(storedSelectedProject) },
      project_legal_status: { ...work.project_legal_status }
    };

    API.get(apiUrl)
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
                  COTISATION_API.post(`cotisations/financial-synthesis`, response.data).then((tables) => {
                    setBalanceSheet(tables.balance_sheet === null ? {} : tables.balance_sheet);
                    setLoadingMessage(null);
                    setLoadingTable(false);
                  });
                }
              };
            }
          });
        }
        if (Object.keys(directorDoneProcessing).length === 0) {
          const reqPayload = {
            ...response.data,
            ...payload
          };
          COTISATION_API.post(`cotisations/financial-synthesis`, reqPayload).then((response) => {
            // setCollapsableRows(createCollapsableRows(response.data.tables.balance_sheet.rows));
            const rows = createCollapsableRows(response.data.tables.balance_sheet.rows);
            setCollapsableRows(rows);
            setBalanceSheet(response.data.tables.balance_sheet === null ? {} : response.data.tables.balance_sheet);
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
        document={balanceSheet}
        type="balance-sheet"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 4 }}>
        <Box>
          <ButtonGroup size="large" variant="contained">
            {['Année 1', 'Année 2', 'Année 3'].map((year) => (
              <Button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                }}
                sx={
                  selectedYear === year
                    ? {
                        background: '#001E3C',
                        color: '#fff'
                      }
                    : {}
                }
              >
                {year}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      <Card>
        {loadingMessage && <Alert severity="error">{loadingMessage}</Alert>}
        <CardHeader title="Bilan" />
        {loadingTable ? (
          <LoadingScreen />
        ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {balanceSheet.columns.map((column, i) => (
                      <TableCell
                        key={`${i}-${column.label}`}
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
                    collapsableRows.map(
                      (year) =>
                        selectedYear === year.year &&
                        year.rows.map((row, i) => (
                          <CollapsableBalanceSheetRow
                            key={`${i}-${year.year}`}
                            row={row}
                            rowIndex={i}
                            columns={balanceSheet.columns}
                          />
                        ))
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </Card>
    </Box>
  );
}
