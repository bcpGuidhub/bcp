import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ResourceListHead, ResourceListToolbar, ResourceMoreMenu } from '..';
import { useDispatch } from '../../../../redux/store';
import { fDate } from '../../../../utils/formatTime';
import Label from '../../../Label';
import Scrollbar from '../../../Scrollbar';
import SearchNotFound from '../../../SearchNotFound';

const currency = require('currency.js');

const euro = (value) =>
  currency(value, {
    symbol: '€',
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: ' ',
    decimal: ',',
    precision: 0
  });
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(array, (_resource) => _resource.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------
ResourceList.propTypes = {
  tableHead: PropTypes.array.isRequired,
  resource: PropTypes.array.isRequired,
  deleteResource: PropTypes.func.isRequired,
  setCurrentResourceId: PropTypes.func.isRequired,
  editResource: PropTypes.func.isRequired
};
let amountSeen = -1;

export default function ResourceList({ tableHead, resource, deleteResource, setCurrentResourceId, editResource }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = resource.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteResource = (id) => {
    dispatch(deleteResource(id, { id }));
  };

  const batchDelete = () => {
    selected.map((id) => handleDeleteResource(id));
  };
  const handleEditResource = (id) => {
    setCurrentResourceId(id);
    editResource(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resource.length) : 0;

  const filteredResources = applySortFilter(resource, getComparator(order, orderBy), filterName);

  const isResourceNotFound = filteredResources.length === 0;

  return (
    <>
      <Card>
        <ResourceListToolbar
          batchDelete={batchDelete}
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ResourceListHead
                order={order}
                orderBy={orderBy}
                headLabel={tableHead}
                rowCount={resource.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredResources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.id)} />
                      </TableCell>
                      {tableHead.map((cell, k) => {
                        amountSeen = cell.type === 'amount' ? amountSeen + 1 : -1;

                        return (
                          <React.Fragment key={k}>
                            {cell.type === 'name' && (
                              <TableCell key={row.name} component="th" scope="row" padding="none">
                                <Box
                                  sx={{
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Typography variant="subtitle2" noWrap>
                                    {row.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                            )}
                            {cell.type === 'status' && (
                              <TableCell key={`${row.status}-${k}`} style={{ minWidth: 160 }}>
                                <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                                  {sentenceCase(row.status)}
                                </Label>
                              </TableCell>
                            )}
                            {cell.type === 'date' && (
                              <TableCell key={row.createdAt} style={{ minWidth: 160 }}>
                                {fDate(row.createdAt)}
                              </TableCell>
                            )}
                            {cell.type === 'amount' && (
                              <TableCell align="right" key={`amount-${row.amounts}-${amountSeen}`}>
                                {euro(row.amounts[amountSeen]).format()}
                              </TableCell>
                            )}
                            {cell.type === 'date:year' && (
                              <TableCell align="right" key={`date:year-${row.year}`}>
                                {row.year}
                              </TableCell>
                            )}
                            {cell.type === 'date:month' && (
                              <TableCell align="right" key={`date:month-${row.month}`}>
                                {row.month}
                              </TableCell>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <TableCell align="right">
                        <ResourceMoreMenu
                          onDelete={() => handleDeleteResource(row.id)}
                          onEdit={() => handleEditResource(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isResourceNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={resource.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </Card>
    </>
  );
}
