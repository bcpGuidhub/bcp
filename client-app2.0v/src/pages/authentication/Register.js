import {
  Box,
  Card,
  Container,
  Link,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import { useEffect } from 'react';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { MHidden } from '../../components/@material-extend';
import { RegisterForm } from '../../components/authentication/register';
// components
import Page from '../../components/Page';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  postion: 'relative',
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  // maxWidth: 760,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // margin: theme.spacing(2, 0, 2, 2)
  borderRadius: '0px',
  // backgroundSize: 'cover',
  // backgroundPosition: 'center',
  backgroundRepeat: 'repeat',
  backgroundImage: `url("/static/illustrations/stars-pattern.jpg")`
}));

const ContentStyle = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  const theme = useTheme();

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <RootStyle title="Inscription | Guidhub">
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
          Vous avez déjà un compte ?&nbsp;
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
      <MHidden width="mdDown">
        <SectionStyle>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Rejoignez le hub des créateurs partout en France.
            </Typography>
          </Box>
          <Typography variant="h1" sx={{ px: 5, mt: 1, mb: 15, color: '#fff' }}>
            Le moyen le plus rapide de naviguer votre idée d'entreprise!
          </Typography>
          <List
            sx={{
              color: '#fff'
            }}
          >
            <ListItem>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Rejoignez une communauté de créateurs et de pros" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <QuestionAnswerIcon />
              </ListItemIcon>
              <ListItemText primary="Plateforme Q/A pour trouver la meilleure réponse à votre question et aider les autres à répondre aux leurs" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="Intégrer tous les partenaires du projet" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ConnectWithoutContactIcon />
              </ListItemIcon>
              <ListItemText primary="VisioConférence et message avec tous les partenaires du projet" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ConstructionIcon />
              </ListItemIcon>
              <ListItemText primary="Construisez, testez et simulez vos idées business" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Trouvez l'aide financière pour démarrer votre entreprise" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MultilineChartIcon />
              </ListItemIcon>
              <ListItemText primary="Construire des prévisions financières" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessCenterIcon />
              </ListItemIcon>
              <ListItemText primary="Business Planning board pour vos idées business." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MilitaryTechIcon />
              </ListItemIcon>
              <ListItemText primary="Bâtissez une réputation dans votre communauté." />
            </ListItem>
          </List>
          <Box>
            <Box
              component="img"
              src="/static/illustrations/rocket-illustration.png"
              sx={{
                width: 200,
                height: 200,
                position: 'absolute',
                left: '20%',
                bottom: '2%'
              }}
            />
          </Box>
        </SectionStyle>
      </MHidden>
      <Container
        sx={{
          backgroundColor: 'rgb(216, 233, 231)'
        }}
      >
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack alignItems="center" sx={{ mb: 5 }} spacing={4}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '4.5vw',
                      p: 2
                    },
                    [theme.breakpoints.up('sm')]: {
                      fontSize: '3vw'
                    }
                  }}
                >
                  Copilotez votre entreprise avec Guidhub !
                </Typography>
              </Box>

              <RegisterForm />

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
            </Stack>
          </ContentStyle>
        </Container>
      </Container>
    </RootStyle>
  );
}
