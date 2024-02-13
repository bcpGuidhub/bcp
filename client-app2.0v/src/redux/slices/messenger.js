import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------
function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: false,
  contacts: { byId: {}, allIds: [], sector: [], invite: [] },
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: [],
  messages: [],
  user: {}
};

const slice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state) {
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = [...action.payload.contacts.invite, ...action.payload.contacts.sector];
      state.contacts.byId = objFromArray(contacts, 'c_uuid');
      state.contacts.allIds = Object.keys(state.contacts.byId);
      state.contacts.invite = action.payload.contacts.invite;
      state.contacts.sector = action.payload.contacts.sector;
      state.user = state.contacts.byId[localStorage.getItem('sender.uuid')];
      if (state.isLoading) {
        state.isLoading = false;
      }
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = objFromArray(conversations);
      state.conversations.allIds = Object.keys(state.conversations.byId);
      if (state.isLoading) {
        state.isLoading = false;
      }
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        state.participants = conversation.participants !== null ? conversation.participants : [];
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const message = action.payload.channel_message;
      if (message.content_type === 'newCommunityContact') {
        const contact = JSON.parse(message.body);
        state.contacts.byId[contact.c_uuid] = contact;
        state.contacts.allIds = Object.keys(state.contacts.byId);
        state.contacts.sector = [...state.contacts.sector, contact];
        return;
      }
      state.messages = [...state.messages, action.payload.channel_message];
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },
    resetConversationMessages(state) {
      state.messages = [];
    },
    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },

    // Get active conversation messages
    getConversationMessagesSuccess(state, action) {
      state.messages = action.payload.messages || [];
      state.isLoading = false;
    },
    // Set contact online
    setContactOnlineSuccess(state, action) {
      // state.user.online = true;
    },
    // Set contact offline
    setContactOfflineSuccess(state) {
      // state.user.online = false;
    },

    // message was received
    receiveConversationMessageSuccess(state) {}
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addRecipients,
  onSendMessage,
  resetActiveConversation,
  resetConversationMessages,
  getConversationsSuccess,
  getContactsSuccess,
  getConversationSuccess,
  getConversationMessagesSuccess,
  setContactOnlineSuccess,
  setContactOfflineSuccess,
  receiveConversationMessageSuccess,
  startLoading,
  stopLoading
} = slice.actions;
