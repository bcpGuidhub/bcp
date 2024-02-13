import { useEffect } from 'react';
import FiscalStatus from '../financial-forecast/FiscalStatus';
import useAuth from '../../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProjectFinancialForecast, getProjectLegalStatus } from '../../../../redux/slices/project';

export default function TaxForm() {
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
  return <FiscalStatus />;
}
