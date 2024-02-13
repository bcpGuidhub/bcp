import { useEffect } from 'react';
import useAuth from '../../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProjectFinancialForecast, getProjectLegalStatus } from '../../../../redux/slices/project';
import SocialSecurityStatus from '../financial-forecast/SocialSecurityStatus';

export default function SocialSecurityForm() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);

  useEffect(() => {
    if (work.id) {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
      dispatch(getProjectFinancialForecast(work.id, apiPrefix));
    }
  }, []);
  return <SocialSecurityStatus />;
}
