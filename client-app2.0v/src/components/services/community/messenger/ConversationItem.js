import { useEffect, useState } from 'react';
import { last } from 'lodash';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict, sub } from 'date-fns';
import { fr } from 'date-fns/locale';
import parse from 'html-react-parser';
// material
import { styled } from '@mui/material/styles';
import { Box, Avatar, ListItemText, ListItemAvatar, ListItemButton, Typography } from '@mui/material';
//
import BadgeStatus from '../../../BadgeStatus';
// redux
import { useSelector } from '../../../../redux/store';

import useWebSocket from '../../../../hooks/useChatWebSocket';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  paddingTop: 0,
  borderRadius: '10px',
  paddingBottom: 1,
  transition: theme.transitions.create('all'),
  height: '100%'
}));

const AvatarWrapperStyle = styled('div')({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' }
});

// ----------------------------------------------------------------------

const getDetails = (conversation, currentUserId) => {
  const otherParticipants =
    conversation.participants === null
      ? []
      : conversation.participants.filter((participant) => participant.c_uuid !== currentUserId);

  const displayNames =
    conversation.type === 'ACTIVITY'
      ? conversation.sector
      : otherParticipants.reduce((names, participant) => [...names, participant.user_name], []).join(', ');

  return { otherParticipants, displayNames };
};

ConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func
};

export default function ConversationItem({ isSelected, conversation, isOpenSidebar, onSelectConversation }) {
  const { conversationGetMessages } = useWebSocket();
  const { account } = useSelector((state) => state.user);
  const currentUserId = account.id;
  const [displayLastActivity, setDisplayLastActivity] = useState(sub(new Date(), { minutes: 1 }));
  const [displayText, setDisplayText] = useState('');

  const { activeConversationId, messages, contacts, participants } = useSelector((state) => state.messenger);

  const details = getDetails(conversation, currentUserId);

  const isGroup = details.otherParticipants.length > 1 || conversation.type === 'ACTIVITY';
  const isUnread = conversation.unreadCount > 0;
  const isOnlineGroup =
    conversation.type === 'ACTIVITY' ? true : isGroup && details.otherParticipants.some((item) => item.online);
  const displayParticipants =
    conversation.type === 'ACTIVITY' ? contacts.sector : participants.filter((item) => item.c_uuid !== currentUserId);
  useEffect(() => {
    if (typeof activeConversationId !== 'undefined' && activeConversationId !== null && isSelected) {
      conversationGetMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = last(messages);
      let message = '';
      setDisplayLastActivity(lastMessage.created_at);

      const sender = lastMessage.sender_id === currentUserId ? 'vous: ' : ' ';

      switch (lastMessage.content_type) {
        case 'image':
          message = 'Envoyé une photo';
          break;
        // case 'text':
        //   message = parse(lastMessage.body);
        //   break;
        default:
          message = '';
      }
      setDisplayText(`${sender}${message}`);
    }
  }, [messages]);

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: '#fff', color: '#000' })
      }}
    >
      {/* <ListItemAvatar>
        <Box
          sx={{
            // ...(isGroup && {
            //   position: 'relative',
            //   width: AVATAR_SIZE,
            //   height: AVATAR_SIZE,
            //   '& .avatarWrapper': {
            //     position: 'absolute',
            //     width: AVATAR_SIZE_GROUP,
            //     height: AVATAR_SIZE_GROUP,
            //     '&:nth-of-type(1)': {
            //       left: 0,
            //       zIndex: 9,
            //       bottom: 2,
            //       '& .MuiAvatar-root': {
            //         border: (theme) => `solid 2px ${theme.palette.background.paper}`
            //       }
            //     },
            //     '&:nth-of-type(2)': { top: 2, right: 0 }
            //   }
            // })
          }}
        >
          {conversation.type === 'ACTIVITY' &&
            new Array(3).fill('/static/mock-images/avatars/sector_activity_').map((a, i) => (
              <AvatarWrapperStyle className="avatarWrapper" key={i}>
                <Avatar alt={conversation.sector} src={`${a}${i}.jpg`} />
                {!isGroup && <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />}
              </AvatarWrapperStyle>
            ))}

          {conversation.type !== 'ACTIVITY' &&
            details.otherParticipants.slice(0, 2).map((participant) => (
              <AvatarWrapperStyle className="avatarWrapper" key={participant.c_uuid}>
                <Avatar alt={participant.user_name} src={participant.avatar} />
                {!isGroup && (
                  <BadgeStatus
                    status={participant.online ? 'online' : 'offline'}
                    sx={{ right: 2, bottom: 2, position: 'absolute' }}
                  />
                )}
              </AvatarWrapperStyle>
            ))}

          {isOnlineGroup && <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />}
        </Box>
      </ListItemAvatar> */}

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: '5px', display: 'flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                    <mask id="ipSHashtagKey0">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                        <rect width="36" height="36" x="6" y="6" fill="#fff" stroke="#fff" rx="3" />
                        <path stroke="#000" d="M19 16v16m10-16v16M16 19h16M16 29h16" />
                      </g>
                    </mask>
                    <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSHashtagKey0)" />
                  </svg>
                </Box>
                <Typography sx={{ typography: 'subtitle1', color: '#9AB0C1', fontWeight: 900 }}>
                  {details.displayNames}
                </Typography>
              </Box>
            }
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle1'
            }}
            // secondary={displayText}
            // secondaryTypographyProps={{
            //   noWrap: true,
            //   variant: isUnread ? 'subtitle2' : 'body2',
            //   color: isUnread ? 'textPrimary' : 'textSecondary'
            // }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column'
            }}
          >
            {/* <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled'
              }}
            >
              {formatDistanceToNowStrict(new Date(displayLastActivity), {
                addSuffix: false,
                locale: fr
              })}
            </Box> */}
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
