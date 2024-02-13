import { Container } from '@mui/material';
import { LegalHelper } from '../../../../components/services/guide/helper-tools';
import Page from '../../../../components/Page';

export default function LegalStatus() {
  return (
    <Page title="Legal Status | Guidhub" sx={{ height: '100%' }}>
      <LegalHelper />
    </Page>
  );
}
