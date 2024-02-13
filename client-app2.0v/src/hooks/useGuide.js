import { useContext } from 'react';
import { GuideContext } from '../contexts/services/Guide';
// ----------------------------------------------------------------------

const useGuide = () => useContext(GuideContext);

export default useGuide;
