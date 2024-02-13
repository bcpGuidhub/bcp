import { Container } from '@mui/material';
import { FiscalHelper } from '../../../../components/services/guide/helper-tools';
import Page from '../../../../components/Page';

export default function TaxStatus() {
  return (
    <Page title="Tax Status | Guidhub" sx={{ height: '100%' }}>
      <FiscalHelper />
    </Page>
  );
}
