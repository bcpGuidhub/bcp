import { useContext } from 'react';
import { InquistWebSocketContext } from '../contexts/InquistWebSocketContext';

// ----------------------------------------------------------------------

const useInquistWebSocket = () => useContext(InquistWebSocketContext);

export default useInquistWebSocket;
