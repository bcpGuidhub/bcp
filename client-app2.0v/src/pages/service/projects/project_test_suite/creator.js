// components
import Page from '../../../../components/Page';
// routes
import { PlayGroundTestUi } from '../../../../components/services/project_test';

export default function Creator() {
  return (
    <Page title="Project: Run test suite playground | Guidhub" sx={{ height: '100%' }}>
      <PlayGroundTestUi />
    </Page>
  );
}
