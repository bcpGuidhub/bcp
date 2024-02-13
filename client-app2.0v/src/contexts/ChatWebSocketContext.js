import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useDispatch, useSelector } from '../redux/store';
import {
  getConversationsSuccess,
  getContactsSuccess,
  getConversationSuccess,
  onSendMessage,
  getConversationMessagesSuccess,
  setContactOnlineSuccess,
  setContactOfflineSuccess,
  receiveConversationMessageSuccess
} from '../redux/slices/messenger';
import useAuth from '../hooks/useAuth';
import { getNewToken } from '../utils/getAppToken';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------
const { host } = new URL(process.env.REACT_APP_APP_SERVER);
let webSocketUrl = null;
let conn = null;
// ----------------------------------------------------------------------
const messageTypeGetConversations = 'getConversations';
const messageTypeGetContacts = 'getContacts';
const messageTypeGetConversationByUUID = 'conversationByUUID';
const MessageTypeConversationJoin = 'conversationJoin';
const MessageTypeConversationLeave = 'conversationLeave';
const MessageTypeConversationMessage = 'conversationMessage';
const MessageTypeConversationMessages = 'conversationMessages';
const MessageTypeSetContactOffline = 'contactSetOffline';
const MessageTypeSetContactOnline = 'contactSetOnline';

// ----------------------------------------------------------------------

function StorageGet(key) {
  const value = localStorage.getItem(key);
  return value == null ? '' : value;
}

function AudioMessagePayload(message, senderId) {
  return {
    type: MessageTypeConversationMessage,
    channel_message: {
      conversation_id: message.conversationId,
      conversation_type: message.type,
      message: {
        content_type: message.contentType,
        sender_id: senderId
      },
      attachments: message.attachments,
      recipient_ids: message.recipients
    },
    ssuid: StorageGet('session.uuid'),
    sender_uuid: senderId
  };
}

function CamMessagePayload(message, senderId) {
  return {
    type: MessageTypeConversationMessage,
    channel_message: {
      conversation_id: message.conversationId,
      conversation_type: message.type,
      message: {
        content_type: message.contentType,
        sender_id: senderId
      },
      attachments: message.attachments,
      recipient_ids: message.recipients
    },
    ssuid: StorageGet('session.uuid'),
    sender_uuid: senderId
  };
}

function TextMessagePayload(message, senderId) {
  return {
    type: MessageTypeConversationMessage,
    channel_message: {
      conversation_id: message.conversationId,
      conversation_type: message.type,
      message: {
        body: message.message,
        content_type: message.contentType,
        sender_id: senderId
      },
      recipient_ids: message.recipients
    },
    ssuid: StorageGet('session.uuid'),
    sender_uuid: senderId
  };
}

function ImageMessagePayload(message, senderId) {
  return {
    type: MessageTypeConversationMessage,
    channel_message: {
      conversation_id: message.conversationId,
      conversation_type: message.type,
      message: {
        content_type: message.contentType,
        sender_id: senderId
      },
      attachments: message.attachments,
      recipient_ids: message.recipients
    },
    ssuid: StorageGet('session.uuid'),
    sender_uuid: senderId
  };
}

function MultiFileMessagePayload(message, senderId) {
  return {
    type: MessageTypeConversationMessage,
    channel_message: {
      conversation_id: message.conversationId,
      conversation_type: message.type,
      message: {
        content_type: message.contentType,
        sender_id: senderId
      },
      attachments: message.attachments,
      recipient_ids: message.recipients
    },
    ssuid: StorageGet('session.uuid'),
    sender_uuid: senderId
  };
}
// ----------------------------------------------------------------------

const messages = {
  ready(_, data) {
    localStorage.setItem('session.uuid', data.ready.session_uuid);
  },
  sys(dispatch, data) {},
  error(_, data) {},
  getConversations(dispatch, data) {
    const { conversations } = data;
    dispatch(getConversationsSuccess(conversations));
  },
  getContacts(dispatch, data) {
    dispatch(getContactsSuccess(data));
  },
  conversationByUUID(dispatch, data) {
    const { conversation } = data;
    dispatch(getConversationSuccess(conversation));
  },
  channelMessage(dispatch, data) {
    dispatch(onSendMessage(data));
  },
  conversationMessages(dispatch, data) {
    dispatch(getConversationMessagesSuccess(data));
  },
  conversationMessage(dispatch, data) {
    dispatch(receiveConversationMessageSuccess(data));
  },
  conversationJoin(dispatch, data) {},
  contactSetOffline(dispatch) {
    dispatch(setContactOfflineSuccess());
  },
  contactSetOnline(dispatch) {
    dispatch(setContactOnlineSuccess());
  }
};

// ----------------------------------------------------------------------

const messageApi = {
  conversations: {
    getConversations(senderId) {
      return {
        type: messageTypeGetConversations,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId
      };
    },
    getConversation(id, senderId) {
      return {
        type: messageTypeGetConversationByUUID,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId,
        active_conversation_id: id
      };
    },
    join(id, senderId) {
      return {
        type: MessageTypeConversationJoin,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId,
        channel: {
          channel_join: {
            conversation_uuid: id
          }
        }
      };
    },
    leave(id, senderId) {
      return {
        type: MessageTypeConversationLeave,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId,
        channel: {
          channel_leave: {
            conversation_uuid: id
          }
        }
      };
    },
    message(message, senderId) {
      switch (message.contentType) {
        case 'text':
          return TextMessagePayload(message, senderId);
        case 'audio':
          return AudioMessagePayload(message, senderId);
        case 'cam':
          return CamMessagePayload(message, senderId);
        case 'image':
          return ImageMessagePayload(message, senderId);
        case 'multi-file':
          return MultiFileMessagePayload(message, senderId);
        default:
          return {};
      }
    },
    messages(activeConversationId) {
      return {
        type: MessageTypeConversationMessages,
        active_conversation_id: activeConversationId
      };
    }
  },
  contacts: {
    getContacts(senderId) {
      return {
        type: messageTypeGetContacts,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId
      };
    },
    setOnline(senderId) {
      return {
        type: MessageTypeSetContactOnline,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId
      };
    },
    setOffline(senderId) {
      return {
        type: MessageTypeSetContactOffline,
        ssuid: StorageGet('session.uuid'),
        sender_uuid: senderId
      };
    }
  }
};

// ----------------------------------------------------------------------
const messageQueue = {
  getMessageQueue: () => {
    const v = StorageGet('message_queue');
    return JSON.parse(v === '' ? '[]' : v);
  },
  notEmpty: () => messageQueue.getMessageQueue().length > 0,
  dequeue: () => {
    const q = messageQueue.getMessageQueue();
    const msg = q.shift();
    const qNew = JSON.stringify(q);
    localStorage.setItem('message_queue', qNew);
    return msg;
  },
  enqueue: (msg) => {
    let q = messageQueue.getMessageQueue();
    if (q === '') {
      q = [];
    }
    q.push(msg);
    const qNew = JSON.stringify(q);
    localStorage.setItem('message_queue', qNew);
  }
};
// ----------------------------------------------------------------------
const websocketConnection = (url) => {
  let newConn = null;
  try {
    if (!conn) {
      newConn = new WebSocket(url);
    } else if (conn && (conn.readyState === 2 || conn.readyState === 3)) {
      newConn = new WebSocket(url);
    } else {
      newConn = conn;
    }
  } catch (err) {
    console.log('err creating websocket connection:  ', err);
  }
  conn = newConn;
  return newConn;
};

const initialState = {
  webSocketIsOpen: null,
  webSocketIsClosed: null,
  webSocket: null
};

const handlers = {
  INITIALISE: (state, action) => {
    const { webSocketIsOpen } = action.payload;
    return {
      ...state,
      webSocketIsClosed: false,
      webSocketIsOpen
    };
  },
  CLOSED: (state, action) => {
    const { webSocketIsClosed } = action.payload;
    return {
      ...state,
      webSocket: null,
      webSocketIsOpen: false,
      webSocketIsClosed
    };
  },
  WEB_SOCKET_HOST: (state) => {
    if (state.webSocket) {
      if (state.webSocket.readyState === 0 || state.webSocket.readyState === 1) {
        return {
          ...state,
          webSocket: state.webSocket
        };
      }
    }
    return {
      ...state,
      webSocket: websocketConnection(webSocketUrl)
    };
  },
  WEB_SOCKET_TERMINATE: (state) => {
    if (state.webSocket && state.webSocket.readyState === 1) {
      state.webSocket.onclose = function () {}; // disable onclose handler first
      state.webSocket.onerror = function () {};
      state.webSocket.close();
    }
    return {
      ...state,
      webSocket: websocketConnection(webSocketUrl)
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const ChatWebSocketContext = createContext({
  ...initialState,
  method: 'app',
  send: () => Promise.resolve(),
  getConversations: () => Promise.resolve(),
  getContacts: () => Promise.resolve(),
  getConversation: () => Promise.resolve(),
  joinConversation: () => Promise.resolve(),
  leaveConversation: () => Promise.resolve(),
  sendMessage: () => Promise.resolve(),
  conversationGetMessages: () => Promise.resolve(),
  setOnline: () => Promise.resolve(),
  setOffline: () => Promise.resolve(),
  connectToSocket: () => {}
});

ChatWebSocketProvider.propTypes = {
  children: PropTypes.node
};

function ChatWebSocketProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { webSocket } = state;
  const { account, projects } = useSelector((state) => state.user);
  const { accountType } = useAuth();

  // let isMounted;

  if (account) {
    localStorage.setItem('sender.uuid', account.id);
  }

  const dispatchFnc = useDispatch();

  const connectToSocket = () => {
    if (!webSocket || (webSocket && webSocket.readyState !== 0 && webSocket.readyState !== 1)) {
      let endPoint = 'community/chat';
      const storedSelectedProject = localStorage.getItem('selected_project');
      const selectedProject = storedSelectedProject !== null ? JSON.parse(storedSelectedProject) : null;
      if (!selectedProject || !accountType) {
        return;
      }
      if (accountType === 'stakeholder') {
        endPoint = `stakeholder/${endPoint}`;
      } else {
        endPoint = `${endPoint}/${selectedProject.id}`;
      }

      if (process.env.NODE_ENV === 'production') {
        webSocketUrl = `wss://${host}/v1/${endPoint}`;

        dispatch({
          type: 'WEB_SOCKET_HOST'
        });
      } else {
        webSocketUrl = `ws://${host}/v1/${endPoint}`;
        dispatch({
          type: 'WEB_SOCKET_HOST'
        });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (webSocket && !webSocket.onopen) {
      webSocket.onopen = function onOpen(evt) {
        while (messageQueue.notEmpty()) {
          send(messageQueue.dequeue());
        }
        if (isMounted) {
          dispatch({
            type: 'INITIALISE',
            payload: {
              webSocketIsOpen: true
            }
          });
        }
      };
      webSocket.onmessage = function onMessage(evt) {
        try {
          const data = JSON.parse(evt.data);
          if (typeof messages[data.type] === 'function') {
            messages[data.type](dispatchFnc, data, state);
          } else {
            console.error('unknown message type');
          }
        } catch (err) {
          console.log('error message type = ', err, 'with data = ', evt.data);
        }
      };
      webSocket.onclose = function onClose(evt) {
        if (isMounted) {
          dispatch({
            type: 'CLOSED',
            payload: {
              webSocketIsClosed: true
            }
          });
          dispatch({
            type: 'WEB_SOCKET_TERMINATE'
          });
        }
      };
      webSocket.onerror = async (evt) => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            return <Navigate to={PATH_AUTH.login} />;
          }
          const response = await getNewToken();
          window.localStorage.setItem('refreshToken', response.data.refresh_token);
        } catch (error) {
          console.error(error);
          window.location.href = PATH_AUTH.login;
        }
      };
    } else {
      connectToSocket();
    }
    return () => {
      isMounted = false;
    };
  }, [webSocket]);

  const send = async (message) => {
    if (webSocket !== null && typeof webSocket !== 'undefined') {
      if (webSocket.readyState === 1) {
        while (messageQueue.notEmpty()) {
          send(messageQueue.dequeue());
        }
        const blob = JSON.stringify(message);

        webSocket.send(blob);
      }
      if (webSocket.readyState === 0 || webSocket.readyState === 2 || webSocket.readyState === 3) {
        messageQueue.enqueue(message);
      }
    } else {
      messageQueue.enqueue(message);
    }
  };

  const getConversations = async () => {
    await send(messageApi.conversations.getConversations(account.id));
  };

  const getContacts = async () => {
    await send(messageApi.contacts.getContacts(account.id));
  };

  const getConversation = async (id) => {
    await send(messageApi.conversations.getConversation(id, account.id));
  };

  const joinConversation = async (id) => {
    await send(messageApi.conversations.join(id, account.id));
  };

  const leaveConversation = async (id) => {
    await send(messageApi.conversations.leave(id, account.id));
  };

  const sendMessage = async (message) => {
    const msg = messageApi.conversations.message(message, account.id);
    await send(msg);
  };

  const conversationGetMessages = async (activeConversationId) => {
    const msg = messageApi.conversations.messages(activeConversationId);

    await send(msg);
  };

  const setOnline = async () => {
    await send(messageApi.contacts.setOnline(account.id));
  };

  const setOffline = async () => {
    await send(messageApi.contacts.setOffline(account.id));
  };

  // const markConversationAsRead = async (id) => {
  //   await send(messageApi.conversations.markConversationAsRead(id));
  // }

  return (
    <ChatWebSocketContext.Provider
      value={{
        ...state,
        method: 'app',
        send,
        getConversations,
        getContacts,
        getConversation,
        joinConversation,
        leaveConversation,
        sendMessage,
        conversationGetMessages,
        setOnline,
        setOffline,
        connectToSocket
        // markConversationAsRead
      }}
    >
      {children}
    </ChatWebSocketContext.Provider>
  );
}

export { ChatWebSocketContext, ChatWebSocketProvider };
