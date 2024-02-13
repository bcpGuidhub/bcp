import { useContext } from 'react';
import { ChatWebSocketContext } from '../contexts/ChatWebSocketContext';

// ----------------------------------------------------------------------

const useChatWebSocket = () => useContext(ChatWebSocketContext);

export default useChatWebSocket;
