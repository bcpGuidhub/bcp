import PropTypes from 'prop-types';
import {
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
// material
import { useTheme } from '@mui/material/styles';
import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import Label from '../../../Label';
import Scrollbar from '../../../Scrollbar';
import SearchNotFound from '../../../SearchNotFound';
import { UserListHead, UserMoreMenu } from '../../../_dashboard/user/list';
// hooks
import useSettings from '../../../../hooks/useSettings';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { deleteProjectStakeholder } from '../../../../redux/slices/project';

// ----------------------------------------------------------------------

StakeHolderList.propTypes = {
  handleModifyStakeholder: PropTypes.func.isRequired
};

export default function StakeHolderList({ handleModifyStakeholder }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);

  const handleDeleteUser = (id) => dispatch(deleteProjectStakeholder(work.id, { id }));

  return (
    <Box>
      <Scrollbar>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {work?.business_plan?.project_stakeholders.map((row, index) => {
            /* eslint-disable camelcase */
            const { id, first_name, last_name, role, status, profile_image } = row;
            const name = `${first_name} ${last_name}`;

            return (
              <Box key={id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    work.business_plan?.owner?.id === account.id && (
                      <UserMoreMenu
                        onDelete={() => handleDeleteUser(id)}
                        onModify={() => handleModifyStakeholder(row)}
                      />
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt={name} src={profile_image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={role}
                    secondary={
                      <>
                        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                          {name}
                        </Typography>
                        {' — '}
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={(status === 0 && 'error') || (status === 1 && 'success')}
                        >
                          {status === 0 && sentenceCase('mot de passe en attente')}
                          {status === 1 && 'vérifié'}
                        </Label>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Box>
            );
          })}
        </List>
      </Scrollbar>
    </Box>
  );
}
