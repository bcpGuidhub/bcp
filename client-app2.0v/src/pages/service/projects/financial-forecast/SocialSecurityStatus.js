import { Box, Button, Container, Grid } from '@mui/material';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Page from '../../../../components/Page';
import { GuideNavHelperIntegrated, InformationGuide } from '../../../../components/services/guide';
import { SocialSecurityHelper } from '../../../../components/services/guide/helper-tools';
import { SocialSecurity } from '../../../../components/services/guide/legal-declarations';
import useSettings from '../../../../hooks/useSettings';
import { useSelector } from '../../../../redux/store';
import { Block } from '../../../components-overview/Block';
import InformationTemplate from './InformationTemplate';
import { socialSecurityHelperInformation } from './socialSecurityHelperInformation';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const landmarkLabel = "Complétez vos choix de création d'entreprise";
const achievementLabel = 'Choisissez votre régime de sécurité sociale';

export default function SocialSecurityStatus() {
  const { themeStretch } = useSettings();
  const { work } = useSelector((state) => state.project);

  const [visualing, setVisualTo] = useState('form');

  const legalStatus = work.project_legal_status?.legal_status_idea;
  const socialSecurityScheme = work.project_legal_status?.social_security_scheme || '';
  const managementStake = work.project_legal_status?.management_stake;
  const microEntrepriseAccreExemption = work.project_legal_status?.micro_entreprise_accre_exemption;
  const microEntrepriseDeclarePayCotisations = work.project_legal_status?.micro_entreprise_declare_pay_cotisations;
  const sector = work.activity_sector;
  const { id } = work;

  return (
    <Page title={`${achievementLabel} | Guidhub`}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ pt: '112px' }}>
          <GuideNavHelperIntegrated
            formLabel="Régime de sécurité sociale"
            helperLabel="comparateur"
            setVisualTo={setVisualTo}
          />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ mt: 4 }}>
            <Grid item md={12}>
              {visualing === 'form' && (
                <SocialSecurity
                  id={id}
                  legalStatus={legalStatus}
                  socialSecurityScheme={socialSecurityScheme}
                  managementStake={managementStake}
                  microEntrepriseAccreExemption={microEntrepriseAccreExemption}
                  microEntrepriseDeclarePayCotisations={microEntrepriseDeclarePayCotisations}
                  helperInformation={socialSecurityHelperInformation}
                />
              )}
              {visualing === 'helper' && (
                <Block title="">
                  <SocialSecurityHelper sector={sector} />
                </Block>
              )}
              {visualing === 'guide' && (
                <Block>
                  <InformationGuide content={InformationTemplate[landmarkLabel][achievementLabel].guide} />
                </Block>
              )}
              <Box sx={{ pt: 3 }}>
                <Box sx={{ textDecoration: 'none' }} component={RouterLink} to={PATH_DASHBOARD.legal.socialSecurity}>
                  <Button
                    color="info"
                    startIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
                        <path
                          fill="currentColor"
                          d="M55.568.649H8.997C4.433.649.721 4.361.721 8.927v46.566c0 4.566 3.712 8.28 8.276 8.28h46.571c4.563 0 8.277-3.714 8.277-8.28V8.927c0-4.565-3.714-8.278-8.277-8.278zM44.017 17.05a1.518 1.518 0 1 1-.002 3.036a1.518 1.518 0 0 1 .002-3.036zM33.27 7.396a2.164 2.164 0 0 1 0 4.327a2.164 2.164 0 0 1 0-4.327zM21.536 7.38c1.212 0 2.197.974 2.197 2.176a2.186 2.186 0 0 1-2.197 2.178a2.185 2.185 0 0 1-2.194-2.178c0-1.202.981-2.176 2.194-2.176zm6.916 45.245l-.01 3.851H19.33v-1.618c0-1.049-.203-1.742-1.034-2.524l-8.372-8.89a7.775 7.775 0 0 1-1.867-5.05V24.969a2.523 2.523 0 0 1 2.522-2.523a2.534 2.534 0 0 1 2.538 2.523v9.803c-1.341.611-2.151 1.85-2.151 3.198c0 .897.358 1.751 1.012 2.41l5.2 5.707c.242.3.563.766.724 1.285c.089.277.117.576.123.948h1.649c-.009-.522-.051-.977-.202-1.444c-.279-.899-.841-1.632-1.173-2.022l-5.123-5.488a2.015 2.015 0 0 1 2.935-2.758l10.622 10.666c1.835 1.923 1.715 3.883 1.715 5.349zm5.573-19.993v-9.769h-.938v9.769c0 .702-.568 1.269-1.269 1.269c-.7 0-1.274-.567-1.274-1.269v-17.17l-.755.002l-1.656 5.781a.792.792 0 0 1-.142.3a.864.864 0 0 1-.762.368a.865.865 0 0 1-.764-.373a.81.81 0 0 1-.13-.269l-1.664-5.807l-.817-.002l2.431 10.161h-2.134v7.218a1.08 1.08 0 0 1-1.082 1.078a1.076 1.076 0 0 1-1.074-1.078v-7.218h-.911v7.218c0 .594-.486 1.078-1.08 1.078a1.076 1.076 0 0 1-1.075-1.078v-7.218h-2.172l2.457-10.161l-.82.002l-1.684 5.868c-.127.449-.63.697-1.122.556c-.493-.142-.801-.57-.637-1.134l1.728-6.021c.69-2.406 2.707-2.332 2.707-2.332h4.293s2.012-.074 2.706 2.332l.844 2.942l.846-2.942c.69-2.406 2.706-2.332 2.706-2.332h5.548s2.017-.074 2.707 2.332l1.714 5.974s1.351.123 1.37.123h4.093c1.074 0 2.019.871 2.019 1.945v3.834c0 .37-.289.668-.656.668a.666.666 0 0 1-.664-.668v-3.37h-.685v9.947c0 .492-.404.89-.895.89s-.89-.399-.89-.89v-5.32h-.699v5.32a.893.893 0 0 1-1.785 0V22.537c-.87-.248-2.053-.584-2.31-.642c-.011-.003-.017-.009-.029-.012c-.289-.074-.531-.264-.618-.553l-1.611-5.868l-.821-.002v17.17c0 .702-.575 1.269-1.277 1.269a1.268 1.268 0 0 1-1.267-1.269zm22.54 5.762a7.77 7.77 0 0 1-1.867 5.05l-8.371 8.89c-.831.782-1.034 1.475-1.034 2.524v1.618h-9.112l-.01-3.851c0-1.467-.12-3.427 1.715-5.349L48.508 36.61a2.015 2.015 0 0 1 2.936 2.758l-5.123 5.488c-.332.389-.894 1.123-1.173 2.022c-.151.467-.193.922-.202 1.444h1.649c.006-.372.034-.671.123-.948c.161-.518.483-.985.724-1.285l5.2-5.708a3.406 3.406 0 0 0 1.012-2.41c-.001-1.347-.81-2.587-2.151-3.198V24.97a2.534 2.534 0 0 1 2.538-2.523a2.523 2.523 0 0 1 2.522 2.523v13.425z"
                        />
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
