// material
import { Container, Grid } from '@mui/material';
// components
import Page from '../../../components/Page';
import { InviteStakeholder, ProjectBuild } from '../../../components/_dashboard/general-app';
import { GuideThumbnail } from '../../../components/_dashboard/guide';
// hooks
import useSettings from '../../../hooks/useSettings';
import { GUIDELABEL, GUIDES } from '../../../layouts/service/guide/Guide';
import { useSelector } from '../../../redux/store';
// ----------------------------------------------------------------------

export default function GuideDashboard() {
  const { themeStretch } = useSettings();
  const { work } = useSelector((state) => state.project);
  const { guides } = useSelector((state) => state.guide);
  const { user } = work;

  return (
    <Page title="Ecosystem | Guidhub">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ProjectBuild displayName={user.first_name} />
          </Grid>

          {Object.keys(GUIDELABEL).map((label) => (
            <Grid key={label} item xs={12} md={4}>
              <GuideThumbnail
                label={label}
                landmarks={GUIDES[GUIDELABEL[label]].landmarks}
                guides={guides}
                user={user}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
