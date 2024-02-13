import { Container } from '@mui/material';
import { Aggregate } from '../../../../components/services/business-activity';
import Page from '../../../../components/Page';

export default function ActivitySector() {
  return (
    <Page title="Activity Sector | Guidhub">
      <Container maxWidth="xlg" sx={{ backgroundColor: '#D8E9E7', p: 2, minHeight: '90vh', height: '100vh' }}>
        <Aggregate />
      </Container>
    </Page>
  );
}
