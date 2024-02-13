// material
import { Box, Card, Container, Link, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink, useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import ProjectStakeholderAuthNewForm from '../components/authentication/ProjectStakeholderAuthNewForm';
import { MHidden } from '../components/@material-extend';
// hooks
import useSettings from '../hooks/useSettings';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// routes
import { PATH_AUTH } from '../routes/paths';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function AuthStakeholder() {
  const theme = useTheme();
  const c = window.location.search;
  const params = new URLSearchParams(c);
  const token = params.get('activation_t');

  return (
    <RootStyle title="Auth a new Project stakeholder | Guidhub">
      <AuthLayout>
        <Typography
          sx={{
            [theme.breakpoints.down('sm')]: {
              fontSize: '2.1vw'
            },
            [theme.breakpoints.up('sm')]: {
              fontSize: '0.7vw'
            },
            color: '#fff'
          }}
        >
          Vous n'avez pas de compte ?&nbsp;
        </Typography>
        <Link
          underline="none"
          variant="subtitle2"
          component={RouterLink}
          to={PATH_AUTH.login}
          sx={{
            font: 'bold 11px Arial',
            textDecoration: 'none',
            backgroundColor: '#EEEEEE',
            color: '#333333',
            padding: '2px 6px 2px 6px',
            borderTop: '1px solid #CCCCCC',
            borderRight: '1px solid #333333',
            borderBottom: '1px solid #333333',
            borderLeft: '1px solid #CCCCCC'
          }}
        >
          Connexion
        </Link>
      </AuthLayout>

      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Un écosystème pour vous guider dans votre création !
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_register.png" />
        </SectionStyle>
      </MHidden> */}

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Valider ton compte de stakeholder.
              </Typography>
            </Box>
          </Box>

          <ProjectStakeholderAuthNewForm token={token} />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            En vous inscrivant, vous acceptez Guidhub&nbsp;
            <Link underline="always" color={theme.palette.text.primary} href="#">
              Conditions d'utilisation
            </Link>
            &nbsp;et&nbsp;
            <Link underline="always" color={theme.palette.text.primary} href="#">
              Politique de confidentialité
            </Link>
            .
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
