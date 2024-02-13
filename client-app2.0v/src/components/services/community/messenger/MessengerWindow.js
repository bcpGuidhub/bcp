import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
// material
import { Box, Divider, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { addRecipients, resetActiveConversation, resetConversationMessages } from '../../../../redux/slices/messenger';
import useWebSocket from '../../../../hooks/useChatWebSocket';

import { MessageInput, MessageList, MessengerHeaderDetail, MessengerHeaderCompose, MessengerRoom } from '..';
import LoadingScreen from '../../../LoadingScreen';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.messenger;
  const conversation = activeConversationId ? conversations.byId[activeConversationId] : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: ''
  };
  return initState;
};

MessengerWindow.propTypes = {
  embedded: PropTypes.bool
};

export default function MessengerWindow({ embedded }) {
  let contactRecipients = null;
  const dispatch = useDispatch();
  const recipientsSelectionRef = useRef();
  const { pathname } = useLocation();
  const { sendMessage, getConversation, joinConversation } = useWebSocket();
  const { conversationKey } = useParams();
  const { messages, contacts, recipients, participants, activeConversationId, isLoading, user } = useSelector(
    (state) => state.messenger
  );
  const { account } = useSelector((state) => state.user);
  const conversation = useSelector((state) => conversationSelector(state));

  const mode = activeConversationId ? 'DETAIL' : 'COMPOSE';

  const displayParticipants =
    conversation.type === 'ACTIVITY'
      ? contacts.sector
      : participants.filter((item) => item.c_uuid !== localStorage.getItem('sender.uuid'));

  const handleAddRecipients = (recipients) => {
    dispatch(addRecipients(recipients));
  };

  const handleSendMessage = async (value) => {
    try {
      sendMessage(value);
    } catch (error) {
      console.error(error);
    }
  };

  contactRecipients = { ...contacts.byId };
  // delete contactRecipients[user.c_uuid];
  delete contactRecipients[account.id];

  useEffect(() => {
    if (conversationKey) {
      getConversation(conversationKey).then(() => {
        joinConversation(conversationKey);
      });
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
        minWidth: '1px',
        height: '100%',
        // backgroundColor: 'rgb(37,38,41)'
        backgroundColor: ' #D8E9E7'
      }}
    >
      {mode === 'DETAIL' ? (
        <MessengerHeaderDetail conversation={conversation} participants={displayParticipants} />
      ) : (
        <MessengerHeaderCompose
          recipients={recipients}
          contacts={Object.values(contactRecipients)}
          onAddRecipients={handleAddRecipients}
          recipientsSelectionRef={recipientsSelectionRef}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', height: '100%' }}>
        <Stack sx={{ height: '100%', width: '100%' }}>
          <MessageList messages={messages} sx={{ mb: 'auto' }} />

          {/* <Divider /> */}

          <MessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.hub.new && Object.keys(contactRecipients).length === 0}
            recipientsSelectionRef={recipientsSelectionRef}
          />
        </Stack>
        {mode === 'DETAIL' && <MessengerRoom conversation={conversation} participants={displayParticipants} />}
      </Box>
    </Stack>
  );
}
