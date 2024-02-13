import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Table, Collapse, TableRow, TableHead, TableBody, TableCell } from '@mui/material';
import { MIconButton } from '../../../@material-extend';
// ----------------------------------------------------------------------

const Cell = styled(TableCell)(({ theme, row }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: typeof row.color !== 'undefined' ? row.color : 'rgb(38 144 198)'
}));

const SubCell = styled(TableCell)(({ theme }) => ({
  ...theme.typography.subtitle1,
  padding: theme.spacing(1)
}));

CollapsableTreasuryRow.propTypes = {
  row: PropTypes.shape({
    field: PropTypes.string.isRequired,
    background: PropTypes.string,
    asset: PropTypes.string,
    sub_rows: PropTypes.arrayOf(
      PropTypes.shape({
        asset: PropTypes.string
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

export default function CollapsableTreasuryRow({ row, columns }) {
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
          <Cell key={`${i}-${column.id}`} row={row} align="left">
            {typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}
          </Cell>
        ))}
      </TableRow>
      {row.sub_rows.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Table size="small" aria-label="années">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {columns.map(
                        (column, i) =>
                          i !== 0 && (
                            <TableCell
                              key={`${i}-${column.label}`}
                              align="left"
                              style={{
                                color: column.color,
                                fontSize: column.fontSize
                              }}
                            >
                              {column.label !== '' && <>{column.label}&nbsp;(€)</>}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.sub_rows.map((row) => (
                      <TableRow
                        key={Math.random()}
                        sx={{
                          background: row.background
                        }}
                      >
                        {columns.map((column, i) => (
                          <SubCell key={`${i}-${column.id}`} align="left">
                            {typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}
                          </SubCell>
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
