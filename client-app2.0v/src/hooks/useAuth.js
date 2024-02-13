import { useContext } from 'react';
import { AuthContext } from '../contexts/AppDefinedContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
