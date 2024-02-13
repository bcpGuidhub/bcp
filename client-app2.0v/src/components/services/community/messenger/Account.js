import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { capitalCase } from 'change-case';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import roundPowerSettingsNew from '@iconify/icons-ic/round-power-settings-new';
// material
import {
  Box,
  List,
  Select,
  Divider,
  Popover,
  Tooltip,
  ListItem,
  Typography,
  IconButton,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
//
import MyAvatar from '../../../MyAvatar';
import BadgeStatus from '../../../BadgeStatus';
// redux
import { useSelector } from '../../../../redux/store';

import useWebSocket from '../../../../hooks/useChatWebSocket';
// ----------------------------------------------------------------------

const STATUS = ['online', 'invisible', 'away'];

export default function Account() {
  const { setOnline, setOffline } = useWebSocket();

  const { user } = useSelector((state) => state.messenger);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('online');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeStatus = (event) => {
    const v = event.target.value;
    if (v !== 'online') {
      setOffline();
    }
    if (v === 'online') {
      setOnline();
    }
    setStatus(v);
  };

  useEffect(() => {
    setOnline();
  }, []);

  return (
    <>
      <Box ref={anchorRef} sx={{ position: 'relative' }}>
        <MyAvatar onClick={handleOpen} sx={{ cursor: 'pointer', width: 48, height: 48 }} />
        <BadgeStatus status={status} sx={{ position: 'absolute', bottom: 2, right: 2 }} />
      </Box>

      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ py: 2, pr: 1, pl: 2.5, display: 'flex', alignItems: 'center' }}>
          <MyAvatar />

          <Box sx={{ ml: 2, mr: 3 }}>
            <Typography noWrap variant="subtitle1">
              {user?.user_name}
            </Typography>
            {/* <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography> */}
          </Box>

          {/* <Tooltip title="Log out">
            <IconButton>
              <Icon icon={roundPowerSettingsNew} width={24} height={24} />
            </IconButton>
          </Tooltip> */}
          <ListItem sx={{ px: 2.5 }}>
            <ListItemIcon>
              <BadgeStatus size="large" status={status} sx={{ m: 0.75 }} />
            </ListItemIcon>
            <ListItemText>
              <Select
                native
                value={status}
                onChange={handleChangeStatus}
                sx={{
                  '& svg': { display: `none` },
                  '& select': { p: 0, typography: 'body2' },
                  '& fieldset': { display: 'none' }
                }}
              >
                {STATUS.map((option) => (
                  <option key={option} value={option}>
                    {capitalCase(option)}
                  </option>
                ))}
              </Select>
            </ListItemText>
          </ListItem>
        </Box>

        <Divider />

        {/* <List> */}
        {/* <ListItem sx={{ px: 2.5 }}>
            <ListItemIcon>
              <BadgeStatus size="large" status={status} sx={{ m: 0.75 }} />
            </ListItemIcon>
            <ListItemText>
              <Select
                native
                value={status}
                onChange={handleChangeStatus}
                sx={{
                  '& svg': { display: `none` },
                  '& select': { p: 0, typography: 'body2' },
                  '& fieldset': { display: 'none' }
                }}
              >
                {STATUS.map((option) => (
                  <option key={option} value={option}>
                    {capitalCase(option)}
                  </option>
                ))}
              </Select>
            </ListItemText>
          </ListItem> */}

        {/* <ListItemButton sx={{ px: 2.5 }}>
            <ListItemIcon>
              <Icon icon={roundAccountBox} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
          </ListItemButton> */}

        {/* <ListItemButton sx={{ px: 2.5 }}>
            <ListItemIcon>
              <Icon icon={settings2Fill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body2' }} />
          </ListItemButton> */}
        {/* </List> */}
      </Popover>
    </>
  );
}
