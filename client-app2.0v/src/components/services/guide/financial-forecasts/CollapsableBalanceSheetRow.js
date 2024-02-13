import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Table, Collapse, TableRow, TableHead, TableBody, TableCell, Typography } from '@mui/material';
import { MIconButton } from '../../../@material-extend';
// ----------------------------------------------------------------------

const Cell = styled(TableCell)(({ theme, row }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: typeof row.color !== 'undefined' ? row.color : 'rgb(38 144 198)'
}));

CollapsableBalanceSheetRow.propTypes = {
  row: PropTypes.shape({
    field: PropTypes.string.isRequired,
    asset: PropTypes.string.isRequired,
    liability: PropTypes.string.isRequired,
    background: PropTypes.string,
    sub_rows: PropTypes.arrayOf(
      PropTypes.shape({
        asset: PropTypes.string.isRequired,
        liability: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

export default function CollapsableBalanceSheetRow({ row, columns }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow
        sx={{
          height: 80,
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: '#001E3C'
        }}
      >
        {row.sub_rows.length > 0 && (
          <TableCell>
            <MIconButton sx={{ color: '#fff', background: '#001E3C' }} size="medium" onClick={() => setOpen(!open)}>
              <Icon fontSize="large" icon={open ? arrowIosUpwardFill : arrowIosDownwardFill} />
            </MIconButton>
          </TableCell>
        )}
        {row.sub_rows.length === 0 && <TableCell />}
        {/* <Cell row={row} component="th" scope="row">
          {row.field}
        </Cell> */}
        {columns.map((column, i) => (
          <Cell key={`${i}-${column.id}`} row={row} align="right">
            {row[column.id] === 'Total des Investissements' && <>ACTIF IMMOBILISE</>}
            {row[column.id] === 'Total des capitaux propres' && <>CAPITAUX PROPRES</>}
            {row[column.id] === "Total de l'actif circulant" && <>ACTIF CIRCULANT</>}
            {row[column.id] === 'Total des dettes' && <>DETTES</>}
            {row[column.id] !== 'Total des Investissements' &&
              row[column.id] !== 'Total des capitaux propres' &&
              row[column.id] !== "Total de l'actif circulant" &&
              row[column.id] !== 'Total des dettes' && (
                <>{typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}</>
              )}
          </Cell>
        ))}
      </TableRow>
      {row.sub_rows.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Détails
                </Typography>
                <Table size="small" aria-label="années">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {columns.map(
                        (column, i) =>
                          i !== 0 && (
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
                          )
                      )}
                      {/* <TableCell>Année 1</TableCell>
                      <TableCell align="right">Année 2 </TableCell>
                      <TableCell align="right">Année 3 </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.sub_rows.map((row) => (
                      <TableRow
                        key={row.asset}
                        sx={{
                          background: row.background
                        }}
                      >
                        {columns.map((column, i) => (
                          <TableCell key={`${i}-${column.id}`} align="right">
                            {row[column.id] === 'ACTIF IMMOBILISE' && <>Total des Investissements</>}
                            {row[column.id] === 'CAPITAUX PROPRES' && <>Total des capitaux propres</>}
                            {row[column.id] === 'ACTIF CIRCULANT' && <>Total de l'actif circulant</>}
                            {row[column.id] === 'DETTES' && <>Total des dettes</>}
                            {row[column.id] !== 'ACTIF IMMOBILISE' &&
                              row[column.id] !== 'CAPITAUX PROPRES' &&
                              row[column.id] !== 'ACTIF CIRCULANT' &&
                              row[column.id] !== 'DETTES' && (
                                <>{typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}</>
                              )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
