import { Box, Button, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Page from '../../../../components/Page';
import { GuideNavHelperIntegrated, InformationGuide } from '../../../../components/services/guide';
import { Fiscal } from '../../../../components/services/guide/legal-declarations';
import useSettings from '../../../../hooks/useSettings';
import { useSelector } from '../../../../redux/store';
import { Block } from '../../../components-overview/Block';
import InformationTemplate from './InformationTemplate';
import { taxHelperInformation } from './taxHelperInformation';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// import API from '../../../../utils/axios';

const landmarkLabel = "Complétez vos choix de création d'entreprise";
const achievementLabel = 'Choisissez votre régime fiscal';

export default function FiscalStatus() {
  const { themeStretch } = useSettings();
  const { work } = useSelector((state) => state.project);

  const [visualing, setVisualTo] = useState('form');
  return (
    <Page title="Choisissez votre régime fiscal | Guidhub">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ pt: '112px' }}>
          <GuideNavHelperIntegrated formLabel="Régimes fiscaux" helperLabel="comparateur" setVisualTo={setVisualTo} />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ mt: 4 }}>
            <Grid item md={12}>
              {visualing === 'form' && (
                <Fiscal
                  id={work.id}
                  legalFormalities={work.project_legal_status || {}}
                  activitySector={work.activity_sector}
                  helperInformation={taxHelperInformation.default}
                />
              )}
              {visualing === 'guide' && (
                <Block>
                  <InformationGuide content={InformationTemplate[landmarkLabel][achievementLabel].guide} />
                </Block>
              )}

              <Box sx={{ pt: 3 }}>
                <Box sx={{ textDecoration: 'none' }} component={RouterLink} to={PATH_DASHBOARD.legal.taxes}>
                  <Button
                    color="info"
                    startIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12.91 5.5H1.09c-.56 0-.8-.61-.36-.9L6.64.73a.71.71 0 0 1 .72 0l5.91 3.87c.44.29.2.9-.36.9Z" />
                          <rect width="13" height="2.5" x=".5" y="11" rx=".5" />
                          <path d="M2 5.5V11m2.5-5.5V11M7 5.5V11m2.5-5.5V11M12 5.5V11" />
                        </g>
                      </svg>
                    }
                  >
                    Accéder à l'outil d'aide
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
