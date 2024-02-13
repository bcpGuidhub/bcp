import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, List, Avatar, Button, Collapse, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
//
import Scrollbar from '../../../Scrollbar';
import BadgeStatus from '../../../BadgeStatus';
import { MessengerRoomPopup } from '..';

import { useSelector } from '../../../../redux/store';
// ----------------------------------------------------------------------

const HEIGHT = 64;

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled
}));

// ----------------------------------------------------------------------

Participant.propTypes = {
  participant: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  onClosePopup: PropTypes.func,
  onShowPopup: PropTypes.func
};
function Participant({ participant, isOpen, onClosePopup, onShowPopup }) {
  const { account } = useSelector((state) => state.user);
  const isMe = account.c_uuid === participant.c_uuid;
  const online = isMe ? true : participant.online;
  const { avatar, position } = participant;

  return (
    <>
      <ListItemButton onClick={onShowPopup} sx={{ height: HEIGHT, px: 2.5 }}>
        <ListItemAvatar>
          <Box sx={{ position: 'relative', width: 40, height: 40 }}>
            <Avatar alt={participant.user_name} src={avatar} />
            <BadgeStatus status={online ? 'online' : 'offline'} sx={{ right: 0, bottom: 0, position: 'absolute' }} />
          </Box>
        </ListItemAvatar>
        <ListItemText
          primary={participant.user_name}
          secondary={position}
          primaryTypographyProps={{ variant: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
      {/* <MessengerRoomPopup participant={participant} isOpen={isOpen} onClose={onClosePopup} /> */}
    </>
  );
}

MessengerRoomGroupParticipant.propTypes = {
  participants: PropTypes.array.isRequired,
  selectUserId: PropTypes.string,
  onShowPopupUserInfo: PropTypes.func,
  isCollapse: PropTypes.bool,
  onCollapse: PropTypes.func
};

export default function MessengerRoomGroupParticipant({
  participants,
  selectUserId,
  onShowPopupUserInfo,
  isCollapse,
  onCollapse
}) {
  // const onlineParticipants = participants.filter((p) => p.online);
  return (
    <>
      <CollapseButtonStyle
        fullWidth
        disableRipple
        color="inherit"
        onClick={onCollapse}
        endIcon={<Icon icon={isCollapse ? arrowIosDownwardFill : arrowIosForwardFill} width={16} height={16} />}
      >
        Membres du groupe ({participants.length})
      </CollapseButtonStyle>

      <Box sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
        <Scrollbar>
          <Collapse in={isCollapse} sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
            <List disablePadding>
              {participants.map((participant) => (
                <Participant
                  key={participant.c_uuid}
                  participant={participant}
                  isOpen={selectUserId === participant.c_uuid}
                  onShowPopup={() => {
                    onShowPopupUserInfo(participant.c_uuid);
                  }}
                  onClosePopup={() => onShowPopupUserInfo(null)}
                />
              ))}
            </List>
          </Collapse>
        </Scrollbar>
      </Box>
    </>
  );
}
