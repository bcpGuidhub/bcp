import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Table, Collapse, TableRow, TableHead, TableBody, TableCell, Typography } from '@mui/material';
import { MIconButton } from '../../../@material-extend';
// ----------------------------------------------------------------------
const COLORS_VARIATIONS = ['lighter', 'lighter', 'lighter', 'light', 'light', 'light', 'main'];

const Cell = styled(TableCell)(({ theme, row }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: typeof row.color !== 'undefined' ? row.color : 'rgb(38 144 198)'
}));

CollapsableIncomeStatementRow.propTypes = {
  row: PropTypes.shape({
    year_1: PropTypes.number.isRequired,
    year_2: PropTypes.number.isRequired,
    year_3: PropTypes.number.isRequired,
    field: PropTypes.string,
    sub_rows: PropTypes.arrayOf(
      PropTypes.shape({
        year_1: PropTypes.number.isRequired,
        year_2: PropTypes.number.isRequired,
        year_3: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
  rowIndex: PropTypes.number.isRequired
};

export default function CollapsableIncomeStatementRow({ row, rowIndex }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const bgColor = theme.palette.primary[COLORS_VARIATIONS[rowIndex % COLORS_VARIATIONS.length]];
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
        <Cell row={row} component="th" scope="row">
          {row.field}
        </Cell>
        <Cell row={row} align="right">
          {typeof row.year_1 === 'number' ? Math.round(row.year_1) : row.year_1}
        </Cell>
        <Cell row={row} align="right">
          {typeof row.year_2 === 'number' ? Math.round(row.year_2) : row.year_2}
        </Cell>
        <Cell row={row} align="right">
          {typeof row.year_3 === 'number' ? Math.round(row.year_3) : row.year_3}
        </Cell>
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
                      <TableCell>Année 1</TableCell>
                      <TableCell align="right">Année 2 </TableCell>
                      <TableCell align="right">Année 3 </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.sub_rows.map((row) => (
                      <TableRow key={row.field}>
                        <TableCell>{row.field}</TableCell>
                        <TableCell> {typeof row.year_1 === 'number' ? Math.round(row.year_1) : row.year_1}</TableCell>
                        <TableCell align="right">
                          {typeof row.year_2 === 'number' ? Math.round(row.year_2) : row.year_2}
                        </TableCell>
                        <TableCell align="right">
                          {typeof row.year_3 === 'number' ? Math.round(row.year_3) : row.year_3}
                        </TableCell>
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
