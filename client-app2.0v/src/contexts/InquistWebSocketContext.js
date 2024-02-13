import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router';
import { createContext, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from '../redux/store';
import useAuth from '../hooks/useAuth';
import { getNewToken } from '../utils/getAppToken';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------
const messageAddQuestionPost = 'c_add_post';
const messageAddAnswerPost = 'c_add_answer';
const commentOnPost = 'c_comment_post';
const commentOnAnswer = 'c_comment_on_answer';
const upVoteComment = 'c_vote_up_comment';
const retractUpVoteComment = 'c_retract_vote_up_comment';
const addRevisionAnswer = 'c_add_revision_answer';
const addToPostRevisionHistory = 'c_add_revision_post';
const upVotePost = 'c_vote_up_post';
const downVotePost = 'c_vote_down_post';
const upVoteAnswer = 'c_vote_up_answer';
const downVoteAnswer = 'c_vote_down_answer';
const retractUpVotePost = 'c_retract_vote_up_post';
const retractDownVotePost = 'c_retract_vote_down_post';
const retractUpVoteAnswer = 'c_retract_vote_up_answer';
const retractDownVoteAnswer = 'c_retract_vote_down_answer';
const flagComment = 'c_flag_comment';
const retractFlagComment = 'c_retract_flag_comment';
const flagPost = 'c_flag_post';
const retractFlagPost = 'c_retract_flag_post';
const flagAnswer = 'c_flag_answer';
const retractFlagAnswer = 'c_retract_flag_answer';
const acceptAnswer = 'c_accept_answer';
const retractAcceptAnswer = 'c_retract_accept_answer';
// ----------------------------------------------------------------------

const { host } = new URL(process.env.REACT_APP_APP_SERVER);
let webSocketUrl = null;
let conn = null;
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function StorageGet(key) {
  const value = localStorage.getItem(key);
  return value == null ? '' : value;
}

// ----------------------------------------------------------------------

const messages = {
  ready(_, data) {
    localStorage.setItem('session.uuid', data.ready.session_uuid);
  },
  sys(dispatch, data) {},
  error(_, data) {},
  c_added_post: (dispatch, data) => {
    // const { conversations } = data;
    // dispatch(getConversationsSuccess(conversations));
  },
  c_add_post: (dispatch, data) => {
    // const { conversations } = data;
    // dispatch(getConversationsSuccess(conversations));
  },
  c_comment_on_answer: (dispatch, data) => {},
  c_vote_up_post: (dispatch, data) => {},
  c_vote_down_post: (dispatch, data) => {},
  c_flag_comment: (dispatch, data) => {},
  c_retract_vote_up_comment: (dispatch, data) => {},
  c_retract_flag_comment: (dispatch, data) => {},
  c_retract_vote_down_post: (dispatch, data) => {},
  c_flag_post: (dispatch, data) => {},
  c_retract_flag_post: (dispatch, data) => {},
  c_add_revision_post: (dispatch, data) => {},
  c_retract_vote_up_answer: (dispatch, data) => {},
  c_retract_vote_down_answer: (dispatch, data) => {},
  c_flag_answer: (dispatch, data) => {},
  c_retract_flag_answer: (dispatch, data) => {},
  c_accept_answer: (dispatch, data) => {},
  c_retract_accept_answer: (dispatch, data) => {}
};

// ----------------------------------------------------------------------

const messageApi = {
  inquisitions: {
    addQuestionPost(q) {
      return {
        type: messageAddQuestionPost,
        ...q
      };
    },
    addAnswerPost(q) {
      return {
        type: messageAddAnswerPost,
        ...q
      };
    },
    commentOnPost(q) {
      return {
        type: commentOnPost,
        ...q
      };
    },
    commentOnAnswer(q) {
      return {
        type: commentOnAnswer,
        ...q
      };
    },
    upVoteComment(q) {
      return {
        type: upVoteComment,
        ...q
      };
    },
    retractUpVoteComment(q) {
      return {
        type: retractUpVoteComment,
        ...q
      };
    },
    addRevisionAnswerPost(q) {
      return {
        type: addRevisionAnswer,
        ...q
      };
    },
    upVotePost(q) {
      return {
        type: upVotePost,
        ...q
      };
    },
    downVotePost(q) {
      return {
        type: downVotePost,
        ...q
      };
    },
    upVoteAnswer(q) {
      return {
        type: upVoteAnswer,
        ...q
      };
    },
    downVoteAnswer(q) {
      return {
        type: downVoteAnswer,
        ...q
      };
    },
    retractUpVotePost(q) {
      return {
        type: retractUpVotePost,
        ...q
      };
    },
    retractDownVotePost(q) {
      return {
        type: retractDownVotePost,
        ...q
      };
    },
    flagComment(q) {
      return {
        type: flagComment,
        ...q
      };
    },
    retractFlagComment(q) {
      return {
        type: retractFlagComment,
        ...q
      };
    },
    flagPost(q) {
      return {
        type: flagPost,
        ...q
      };
    },
    retractFlagPost(q) {
      return {
        type: retractFlagPost,
        ...q
      };
    },
    addToPostRevisionHistory(q) {
      return {
        type: addToPostRevisionHistory,
        ...q
      };
    },
    retractUpVoteAnswer(q) {
      return {
        type: retractUpVoteAnswer,
        ...q
      };
    },
    retractDownVoteAnswer(q) {
      return {
        type: retractDownVoteAnswer,
        ...q
      };
    },
    flagAnswer(q) {
      return {
        type: flagAnswer,
        ...q
      };
    },
    retractFlagAnswer(q) {
      return {
        type: retractFlagAnswer,
        ...q
      };
    },
    acceptAnswer(q) {
      return {
        type: acceptAnswer,
        ...q
      };
    },
    retractAcceptAnswer(q) {
      return {
        type: retractAcceptAnswer,
        ...q
      };
    }
  }
};

// ----------------------------------------------------------------------
const messageQueue = {
  getMessageQueue: () => {
    const v = StorageGet('inquist_message_queue');
    return JSON.parse(v === '' ? '[]' : v);
  },
  notEmpty: () => messageQueue.getMessageQueue().length > 0,
  dequeue: () => {
    const q = messageQueue.getMessageQueue();
    const msg = q.shift();
    const qNew = JSON.stringify(q);
    localStorage.setItem('inquist_message_queue', qNew);
    return msg;
  },
  enqueue: (msg) => {
    let q = messageQueue.getMessageQueue();
    if (q === '') {
      q = [];
    }
    q.push(msg);
    const qNew = JSON.stringify(q);
    localStorage.setItem('inquist_message_queue', qNew);
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

const InquistWebSocketContext = createContext({
  ...initialState,
  method: 'app',
  addQuestionToInquisition: () => Promise.resolve(),
  addAnswerToQuestion: () => Promise.resolve(),
  commentOnPost: () => Promise.resolve(),
  commentOnAnswer: () => Promise.resolve(),
  upVoteComment: () => Promise.resolve(),
  addToPostAnswerRevisionHistory: () => Promise.resolve(),
  onUpVote: () => Promise.resolve(),
  onDownVote: () => Promise.resolve(),
  onUpVoteAnswer: () => Promise.resolve(),
  onDownVoteAnswer: () => Promise.resolve(),
  retractUpVotePost: () => Promise.resolve(),
  retractDownVotePost: () => Promise.resolve(),
  flagComment: () => Promise.resolve(),
  retractFlagComment: () => Promise.resolve(),
  flagPost: () => Promise.resolve(),
  retractFlagPost: () => Promise.resolve(),
  addToPostRevisionHistory: () => Promise.resolve(),
  retractUpVoteAnswer: () => Promise.resolve(),
  retractDownVoteAnswer: () => Promise.resolve(),
  flagAnswer: () => Promise.resolve(),
  retractFlagAnswer: () => Promise.resolve(),
  acceptAnswer: () => Promise.resolve(),
  retractAcceptAnswer: () => Promise.resolve(),
  connectToSocket: () => {}
});

InquistWebSocketProvider.propTypes = {
  children: PropTypes.node
};

function InquistWebSocketProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const { accountType } = useAuth();

  const { projects } = useSelector((state) => state.user);

  // let isMounted;

  const dispatchFnc = useDispatch();

  const { webSocket } = state;

  const connectToSocket = () => {
    if (!webSocket || (webSocket && webSocket.readyState !== 0 && webSocket.readyState !== 1)) {
      let endPoint = 'community/inquisition';
      const storedSelectedProject = localStorage.getItem('selected_project');
      const selectedProject = storedSelectedProject !== null ? JSON.parse(storedSelectedProject) : null;
      if (!selectedProject || !accountType) {
        return;
      }
      if (accountType === 'stakeholder') {
        endPoint = `stakeholder/${endPoint}`;
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
    if (webSocket && !webSocket.open) {
      webSocket.onopen = function onOpen(evt) {
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
        const data = JSON.parse(evt.data);
        if (typeof messages[data.type] === 'function') {
          messages[data.type](dispatchFnc, data, state);
        } else {
          console.error('unknown message type');
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
        console.error(evt);
        // window.location.reload(true);
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            return <Navigate to={PATH_AUTH.login} />;
          }
          const response = await getNewToken();
          window.localStorage.setItem('refreshToken', response.data.refresh_token);
        } catch (error) {
          console.log('error : ', error);
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

  const addQuestionToInquisition = async (message) => {
    const msg = messageApi.inquisitions.addQuestionPost(message);

    await send(msg);
  };

  const addAnswerToQuestion = async (message) => {
    const msg = messageApi.inquisitions.addAnswerPost(message);

    await send(msg);
  };

  const commentOnPost = async (message) => {
    const msg = messageApi.inquisitions.commentOnPost(message);

    await send(msg);
  };

  const commentOnAnswer = async (message) => {
    const msg = messageApi.inquisitions.commentOnAnswer(message);

    await send(msg);
  };

  const addToPostAnswerRevisionHistory = async (message) => {
    const msg = messageApi.inquisitions.addRevisionAnswerPost(message);

    await send(msg);
  };

  const onUpVote = async (message) => {
    const msg = messageApi.inquisitions.upVotePost(message);

    await send(msg);
  };

  const onDownVote = async (message) => {
    const msg = messageApi.inquisitions.downVotePost(message);

    await send(msg);
  };

  const onUpVoteAnswer = async (message) => {
    const msg = messageApi.inquisitions.upVoteAnswer(message);

    await send(msg);
  };

  const onDownVoteAnswer = async (message) => {
    const msg = messageApi.inquisitions.downVoteAnswer(message);

    await send(msg);
  };

  const retractUpVotePost = async (message) => {
    const msg = messageApi.inquisitions.retractUpVotePost(message);

    await send(msg);
  };

  const retractDownVotePost = async (message) => {
    const msg = messageApi.inquisitions.retractDownVotePost(message);

    await send(msg);
  };

  const upVoteComment = async (message) => {
    const msg = messageApi.inquisitions.upVoteComment(message);

    await send(msg);
  };

  const retractUpVoteComment = async (message) => {
    const msg = messageApi.inquisitions.retractUpVoteComment(message);

    await send(msg);
  };

  const flagComment = async (message) => {
    const msg = messageApi.inquisitions.flagComment(message);

    await send(msg);
  };

  const retractFlagComment = async (message) => {
    const msg = messageApi.inquisitions.retractFlagComment(message);

    await send(msg);
  };

  const flagPost = async (message) => {
    const msg = messageApi.inquisitions.flagPost(message);

    await send(msg);
  };

  const retractFlagPost = async (message) => {
    const msg = messageApi.inquisitions.retractFlagPost(message);

    await send(msg);
  };

  const addToPostRevisionHistory = async (message) => {
    const msg = messageApi.inquisitions.addToPostRevisionHistory(message);

    await send(msg);
  };

  const retractUpVoteAnswer = async (message) => {
    const msg = messageApi.inquisitions.retractUpVoteAnswer(message);

    await send(msg);
  };

  const retractDownVoteAnswer = async (message) => {
    const msg = messageApi.inquisitions.retractDownVoteAnswer(message);

    await send(msg);
  };

  const flagAnswer = async (message) => {
    const msg = messageApi.inquisitions.flagAnswer(message);

    await send(msg);
  };

  const retractFlagAnswer = async (message) => {
    const msg = messageApi.inquisitions.retractFlagAnswer(message);

    await send(msg);
  };

  const acceptAnswer = async (message) => {
    const msg = messageApi.inquisitions.acceptAnswer(message);

    await send(msg);
  };

  const retractAcceptAnswer = async (message) => {
    const msg = messageApi.inquisitions.retractAcceptAnswer(message);

    await send(msg);
  };
  return (
    <InquistWebSocketContext.Provider
      value={{
        ...state,
        method: 'app',
        addQuestionToInquisition,
        addAnswerToQuestion,
        commentOnPost,
        commentOnAnswer,
        addToPostAnswerRevisionHistory,
        onUpVote,
        onDownVote,
        onUpVoteAnswer,
        onDownVoteAnswer,
        retractUpVotePost,
        retractDownVotePost,
        upVoteComment,
        retractUpVoteComment,
        flagComment,
        retractFlagComment,
        flagPost,
        retractFlagPost,
        addToPostRevisionHistory,
        retractUpVoteAnswer,
        retractDownVoteAnswer,
        flagAnswer,
        retractFlagAnswer,
        acceptAnswer,
        retractAcceptAnswer,
        connectToSocket
      }}
    >
      {children}
    </InquistWebSocketContext.Provider>
  );
}

export { InquistWebSocketContext, InquistWebSocketProvider };
