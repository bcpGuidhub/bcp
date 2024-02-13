// material
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import {
  LandingAdvertisement,
  LandingDarkMode,
  LandingHero,
  LandingHugePackElements,
  LandingMinimal,
  LandingPricingPlans
} from '../components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <RootStyle title="Guidhub : Communauté des créateurs d'entreprise" id="move_top">
      <LandingHero />
      <ContentStyle>
        <LandingMinimal />
        <LandingHugePackElements />
        <LandingDarkMode />
        {/* <LandingThemeColor />
        <LandingCleanInterfaces /> */}
        <LandingAdvertisement />
        <LandingPricingPlans />
      </ContentStyle>
    </RootStyle>
  );
}
