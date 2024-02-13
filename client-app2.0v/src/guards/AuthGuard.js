import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { getUserAccount, hasProjects, getStakeholderAccount, stakeholderProject } from '../redux/slices/user';
import { isProjectSelected, onProjectSelected } from '../redux/slices/project';
import { useDispatch, useSelector } from '../redux/store';
import { PATH_AUTH } from '../routes/paths';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountType, getAccountType } = useAuth();

  const { isLoading, error, projects } = useSelector((state) => state.user);
  useEffect(() => {
    getAccountType();
  }, []);

  useEffect(() => {
    if (accountType && typeof accountType !== 'undefined') {
      if (accountType === 'stakeholder') {
        dispatch(getStakeholderAccount())
          .then(() => {
            dispatch(stakeholderProject());
          })
          .catch((err) => console.error(err));
      } else {
        dispatch(getUserAccount())
          .then(() => {
            dispatch(hasProjects());
            dispatch(isProjectSelected());
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else {
      navigate(PATH_AUTH.login);
    }
  }, [accountType]);

  useEffect(() => {
    if (projects) {
      // as soon as the user has a projects select the first one
      // regardless of account type.
      dispatch(onProjectSelected(projects[0]));
      dispatch(isProjectSelected());
    }
  }, [projects]);

  useEffect(() => {
    if (error) {
      navigate(PATH_AUTH.register);
    }
  }, [error]);

  return <>{isLoading ? <LoadingScreen /> : children}</>;
}
