import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import videoFill from '@iconify/icons-eva/video-fill';
import phoneFill from '@iconify/icons-eva/phone-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Avatar, Typography, AvatarGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
//
import { MIconButton } from '../../../@material-extend';
import BadgeStatus from '../../../BadgeStatus';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 80,
  display: 'flex',
  alignItems: 'center',
  padding: '18px 24px'
}));

// ----------------------------------------------------------------------

OneAvatar.propTypes = {
  participants: PropTypes.array
};

function OneAvatar({ participants }) {
  const participant = [...participants][0];

  if (participant === undefined) {
    return null;
  }
  const status = participant.online ? 'online' : 'offline';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={participant.avatar} alt={participant.user_name} />
        <BadgeStatus status={status} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant.user_name}</Typography>
        <Typography variant="body2">
          {status !== 'offline' ? capitalCase(status) : fToNow(participant.lastActivity)}
        </Typography>
      </Box>
    </Box>
  );
}

GroupAvatar.propTypes = {
  participants: PropTypes.array
};

function GroupAvatar({ participants }) {
  return (
    <div style={{ display: 'flex' }}>
      <AvatarGroup
        max={3}
        sx={{
          mb: 0.5,
          '& .MuiAvatar-root': { width: 32, height: 32 }
        }}
      >
        {participants.map((participant) => (
          <Avatar key={participant.c_uuid} alt={participant.name} src={participant.avatar} />
        ))}
      </AvatarGroup>
      <Link variant="body2" underline="none" component="button" color="text.secondary" onClick={() => {}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {participants.length}
          <Icon icon={arrowIosForwardFill} />
        </Box>
      </Link>
    </div>
  );
}

MessengerHeaderDetail.propTypes = {
  participants: PropTypes.array,
  conversation: PropTypes.object
};

export default function MessengerHeaderDetail({ conversation, participants, ...other }) {
  const navigate = useNavigate();
  const isActivity = conversation.type === 'ACTIVITY';
  const isGroup = conversation.type === 'GROUP';
  const [action, setAction] = useState('');
  const handleAction = (event, newAlignment) => {
    setAction(newAlignment);
  };

  return (
    <RootStyle {...other}>
      {isActivity || isGroup ? <GroupAvatar participants={participants} /> : <OneAvatar participants={participants} />}

      <Box sx={{ flexGrow: 1 }} />
      <MIconButton component={RouterLink} to={PATH_DASHBOARD.inquist.browse}>
        <Icon icon="mdi:head-question-outline" width={24} height={24} />
      </MIconButton>
      {/* {!isActivity && (
        <ToggleButtonGroup value={action} exclusive onChange={handleAction}>
          <ToggleButton value="phone" disabled>
            <Icon icon={phoneFill} width={20} height={20} />
          </ToggleButton>
          <ToggleButton value="conference">
            <Icon icon={videoFill} width={20} height={20} />
          </ToggleButton>
        </ToggleButtonGroup>
      )} */}
      {/* <MIconButton>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </MIconButton> */}
    </RootStyle>
  );
}
