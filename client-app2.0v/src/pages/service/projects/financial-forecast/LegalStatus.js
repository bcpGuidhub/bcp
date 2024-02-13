import { Box, Button, Container, Grid } from '@mui/material';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Page from '../../../../components/Page';
import { GuideNavHelperIntegrated, InformationGuide } from '../../../../components/services/guide';
import { Legal } from '../../../../components/services/guide/legal-declarations';
import useSettings from '../../../../hooks/useSettings';
import { useSelector } from '../../../../redux/store';
import { Block } from '../../../components-overview/Block';
import InformationTemplate from './InformationTemplate';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' }
};

const landmarkLabel = "Complétez vos choix de création d'entreprise";
const achievementLabel = 'Choisissez votre statut juridique';

export default function LegalStatus() {
  const { themeStretch } = useSettings();
  const { work } = useSelector((state) => state.project);

  const [visualing, setVisualTo] = useState('form');

  return (
    <Page title="Choisissez votre statut juridique | Guidhub">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ pt: '112px' }}>
          <GuideNavHelperIntegrated formLabel="statut juridique" helperLabel="comparateur" setVisualTo={setVisualTo} />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ mt: 4 }}>
            <Grid item md={12}>
              {visualing === 'form' && (
                <Block title="Quel est le statut juridique de votre entreprise ?" sx={{ style }}>
                  <Legal id={work.id} legalFormalities={work.project_legal_status || {}} />
                </Block>
              )}
              {visualing === 'guide' && (
                <Block>
                  <InformationGuide content={InformationTemplate[landmarkLabel][achievementLabel].guide} />
                </Block>
              )}
              <Box sx={{ pt: 3 }}>
                <Block title="Pour utiliser cet outil, vous devez tout d'abord préciser si vous êtes le seul participant, ou si vous êtes plusieurs. Puis, vous devez sélectionner vos critères de choix dans la liste proposée. Vous obtiendrez enfin une suggestion de statut juridique.">
                  <Box sx={{ textDecoration: 'none' }} component={RouterLink} to={PATH_DASHBOARD.legal.status}>
                    <Button
                      color="info"
                      startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                          <path
                            fill="currentColor"
                            d="M.295 27.581a6.457 6.457 0 0 0 12.805 0H.295zM35.182 40.58a1 1 0 0 1-.998 1.003H15.528c-.548 0-1-.45-1-1.003a.998.998 0 0 1 1-.993h18.655c.552 0 .999.444.999.993zm-20.545 1.514h20.437v2.887H14.637zM36.9 27.581a6.457 6.457 0 0 0 6.402 5.626a6.452 6.452 0 0 0 6.399-5.626H36.9zm12.449-2.009l-5.243-7.222h2.803c.682 0 1.231-.559 1.231-1.25c0-.685-.55-1.238-1.231-1.238H32.061a7.353 7.353 0 0 0-5.634-4.732V7.233c0-.693-.556-1.246-1.245-1.246L25.066 6l-.116-.013a1.24 1.24 0 0 0-1.243 1.246v3.895a7.348 7.348 0 0 0-5.632 4.732H3.224c-.677 0-1.229.553-1.229 1.238c0 .692.552 1.25 1.229 1.25h2.675L.655 25.57H0v1.334h13.398V25.57h-.658l-5.242-7.22h12.169c0-.282.031-.559.073-.824c.043-.125.072-.252.072-.383a5.316 5.316 0 0 1 3.895-3.933v13.697h-.052c-.107 5.152-2.558 9.645-6.194 12.17h15.214c-3.637-2.525-6.086-7.018-6.199-12.17h-.048V13.21a5.315 5.315 0 0 1 3.894 3.933c.004.131.031.258.075.383c.04.266.065.542.065.824h12.042l-5.244 7.222h-.654v1.334H50v-1.334h-.651zm-43.184 0H1.98l4.185-5.765v5.765zm1.071 0v-5.765l4.185 5.765H7.236zm35.532 0h-4.187l4.187-5.765v5.765zm1.066 0v-5.765l4.19 5.765h-4.19zM7.941 14.124a1.243 1.243 0 0 1-2.485 0c0-.686.558-1.246 1.245-1.246c.684-.001 1.24.56 1.24 1.246zm36.604-.066c0 .691-.556 1.239-1.242 1.239a1.234 1.234 0 0 1-1.242-1.239a1.243 1.243 0 1 1 2.484 0z"
                          />
                        </svg>
                      }
                    >
                      Accéder à l'outil d'aide
                    </Button>
                  </Box>
                </Block>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
