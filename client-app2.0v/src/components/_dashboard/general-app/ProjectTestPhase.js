import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import shareFill from '@iconify/icons-eva/share-fill';
import printerFill from '@iconify/icons-eva/printer-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import playCircleFill from '@iconify/icons-eva/play-circle-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { useNavigate } from 'react-router';
import { red } from '@mui/material/colors';
// material
import { useTheme } from '@mui/material/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import {
  Box,
  Menu,
  Card,
  Table,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardHeader,
  TableContainer,
  IconButton,
  Tooltip
} from '@mui/material';
import { useSnackbar } from 'notistack';
//
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import { MIconButton } from '../../@material-extend';
import { verificationsFramework, verificationsConditions } from './project-tests-analyse/verifications';
import { useDispatch, useSelector } from '../../../redux/store';
import { getProjectTestSuites, selectTestSuiteLabel } from '../../../redux/slices/project';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
// ----------------------------------------------------------------------

MoreMenuButton.propTypes = {
  typeOfTest: PropTypes.string,
  callBackFnc: PropTypes.func
};

function MoreMenuButton({ typeOfTest, callBackFnc }) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <>
        <MIconButton ref={menuRef} size="large" onClick={handleOpen}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </MIconButton>
      </>

      <Menu
        open={open}
        anchorEl={menuRef.current}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={() => callBackFnc(typeOfTest)}>
          <Icon icon={playCircleFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            tester
          </Typography>
        </MenuItem>

        {/* <MenuItem>
          <Icon icon={settings2Fill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Setting details
          </Typography>
        </MenuItem> */}
        {/* <MenuItem>
          <Icon icon={downloadFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Télécharger
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={printerFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Print
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={shareFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Share
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={archiveFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Archive
          </Typography>
        </MenuItem>

        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>
          <Icon icon={trash2Outline} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Delete
          </Typography>
        </MenuItem> */}
      </Menu>
    </>
  );
}

export default function ProjectTestPhase() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [limit, setLimit] = useState(5);
  const [renderingTestSuite, setRenderingTestSuite] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const { onCreateProjectSuccess, work, error } = useSelector((state) => state.project);
  const { projects } = useSelector((state) => state.user);

  const handleLimit = () => {
    setLimit(limit === -1 ? 5 : -1);
    setViewMore(!viewMore);
  };

  const handleTest = (label) => {
    dispatch(selectTestSuiteLabel(label));
    navigate(PATH_DASHBOARD.project.testSuite.replace(':id', work.id));
  };

  useEffect(() => {
    if (projects && work.id && !renderingTestSuite && !work.testSuites) {
      dispatch(getProjectTestSuites(work.id, apiPrefix));
      setRenderingTestSuite(true);
    }
  }, [work]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar('project test suite error', { variant: 'error' });
      if (!projects) {
        enqueueSnackbar('create a project to activate test suite', { variant: 'error' });
      }
    }
  }, [error]);

  useEffect(() => {
    if (onCreateProjectSuccess && work.id && !renderingTestSuite) {
      dispatch(getProjectTestSuites(work.id, apiPrefix));
      setRenderingTestSuite(true);
    }
  }, [onCreateProjectSuccess]);

  return (
    // <Card>
    //   <CardHeader
    //     title="test et analyse de votre projet"
    //     sx={{ mb: 3 }}
    //     action={
    //       <Tooltip title="Tester">
    //         <IconButton
    //           sx={{
    //             borderRadius: 0
    //           }}
    //           aria-label="settings"
    //           onClick={() => handleTest('accumulation_professional_income_retirement_pension')}
    //         >
    //           Run tests <Icon icon={playCircleFill} width={30} height={30} />
    //         </IconButton>
    //       </Tooltip>
    //     }
    //   />
    <>
      {!work.id && (
        <>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableBody>
                  {Object.entries(verificationsFramework)
                    .slice(0, limit)
                    .map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{v.label}</TableCell>
                        <TableCell>
                          {typeof verificationsConditions[k] !== 'undefined' &&
                            verificationsConditions[k].conditions.map((c) => (
                              <Typography key={c.label}>{c.label}</Typography>
                            ))}
                        </TableCell>
                        <TableCell align="right">
                          <MoreMenuButton typeOfTest={k} callBackFnc={handleTest} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Divider />

          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              to="#"
              size="small"
              color="inherit"
              onClick={handleLimit}
              endIcon={<Icon icon={arrowIosForwardFill} />}
            >
              {viewMore ? 'Voir moins' : 'Voir tout'}
            </Button>
          </Box>
        </>
      )}
      {work.id && work.testSuites && work.testSuites.test_suite && (
        <>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableBody>
                  {Object.entries(work.testSuites.test_suite.test_suite[0].tests)
                    .slice(0, limit)
                    .map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{v.label}</TableCell>
                        <TableCell>
                          {work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[k] &&
                            work.testSuites.test_suite_conditions.test_suite_conditions[0].tests[k].conditions.map(
                              (c) => <Typography key={c.label}>{c.label}</Typography>
                            )}
                        </TableCell>
                        {/* <TableCell>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                              // (row.status === 'in_progress' && 'warning') ||
                              // (row.status === 'out_of_date' && 'error') ||
                              // 'success'
                              !v.status && 'error'
                            }
                          >
                            {!v.status && sentenceCase('test not started')}
                          </Label>
                        </TableCell> */}
                        <TableCell align="right">
                          <MoreMenuButton typeOfTest={k} callBackFnc={handleTest} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Divider />

          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              to="#"
              size="small"
              color="inherit"
              onClick={handleLimit}
              endIcon={<Icon icon={arrowIosForwardFill} />}
            >
              {viewMore ? 'Voir moins' : 'Voir tout'}
            </Button>
          </Box>
        </>
      )}
    </>
    // </Card>
  );
}
