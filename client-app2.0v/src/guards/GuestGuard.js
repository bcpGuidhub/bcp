import PropTypes from 'prop-types';
import { useEffect } from 'react';
// material
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, accountType, setAccountType } = useAuth();

  useEffect(() => {
    if (!accountType) {
      const storedRole = localStorage.getItem('acc_t');
      const selectedRole = storedRole !== null ? JSON.parse(storedRole) : null;
      if (selectedRole) {
        setAccountType(selectedRole);
      }
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.hub.root} />;
  }
  return <>{children}</>;
}
