import { Button, Modal, ModalDialog, Typography, Table, Sheet, Box } from '@mui/joy';
import { useState } from 'react';
import Add from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useDispatch, useSelector } from '../../redux/store';
import { onProjectSelected } from '../../redux/slices/project';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

ProjectsTable.propTypes = {
  projects: PropTypes.array
};

function ProjectsTable({ projects }) {
  const { work } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleProjectSelection = (project) => {
    dispatch(onProjectSelected(project));
  };

  return (
    <Table aria-label="basic table">
      <thead>
        <tr>
          <th style={{ width: '50%' }}>Nom</th>
          <th>Identifiant</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {projects &&
          projects.map((p) => (
            <tr key={p.id} onClick={() => handleProjectSelection(p)}>
              <td>
                <Box>{p.id}</Box>
              </td>
              <td>
                <Box>{p.project_name}</Box>
              </td>

              {work.id !== p.id && (
                <td>
                  <Button variant="outlined">sélectionner</Button>
                </td>
              )}
              {work.id === p.id && (
                <td>
                  <Button variant="outlined" disabled>
                    Current project
                  </Button>
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

SelectProjectMobile.propTypes = {
  projects: PropTypes.array
};

export default function SelectProjectMobile({ projects }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProjectSelection = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} aria-label="select project" color="secondary">
        <CorporateFareIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ width: '756px', maxWidth: '80vw' }}
        >
          <Sheet>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography typography="h4">Sélectionner un projet</Typography>
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate(PATH_DASHBOARD.project.newProject);
                  }}
                  startDecorator={<Add />}
                >
                  Nouveau projet
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Tous" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <ProjectsTable projects={projects} />
              </TabPanel>
            </Box>
          </Sheet>
        </ModalDialog>
      </Modal>
    </>
  );
}
