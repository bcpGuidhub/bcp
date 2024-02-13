import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

OnboardingGuard.propTypes = {
  children: PropTypes.node
};

export default function OnboardingGuard({ children }) {
  const { userAccountExists, userAccountDeleted } = useAuth();

  if (userAccountExists) {
    return <Navigate to={PATH_AUTH.login} />;
  }

  if (userAccountDeleted) {
    return <Navigate to={PATH_AUTH.register} />;
  }

  return <>{children}</>;
}
