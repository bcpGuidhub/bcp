import { useEffect } from 'react';
import LegalStatus from '../financial-forecast/LegalStatus';
import useAuth from '../../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProjectFinancialForecast, getProjectLegalStatus } from '../../../../redux/slices/project';

export default function LegalStatusForm() {
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
  return <LegalStatus />;
}
