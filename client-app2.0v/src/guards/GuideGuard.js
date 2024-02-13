import PropTypes from 'prop-types';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { getGuides } from '../redux/slices/guide';
import { useDispatch, useSelector } from '../redux/store';

// ----------------------------------------------------------------------

GuideGuard.propTypes = {
  children: PropTypes.node
};

export default function GuideGuard({ children }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(getGuides());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
