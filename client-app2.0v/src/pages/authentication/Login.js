import { useEffect, useState } from 'react';
import { capitalCase } from 'change-case';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
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
import { Card, Sheet } from '@mui/joy';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { MHidden } from '../../components/@material-extend';
import { LoginForm } from '../../components/authentication/login';
// components
import Page from '../../components/Page';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';

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

function AuthAccountType() {
  const { accountType, setAccountType } = useAuth();

  return (
    <Card
      sx={{
        borderColor: 'rgba(62, 80, 96, 0.3)',
        backgroundColor: 'rgba(0, 30, 60, 0.2)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.10'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '& > div': { p: 2, boxShadow: 'sm', borderRadius: 'xs', display: 'flex' }
        }}
      >
        <Sheet variant="outlined" sx={{ bgcolor: 'background.body' }}>
          <Checkbox
            overlay
            label="Créateur"
            checked={accountType === 'creator'}
            value="creator"
            onChange={(e) => setAccountType(e.target.value)}
          />
        </Sheet>
        <Sheet variant="outlined" sx={{ bgcolor: 'background.body' }}>
          <Checkbox
            overlay
            label="Partenaire"
            checked={accountType === 'stakeholder'}
            value="stakeholder"
            onChange={(e) => setAccountType(e.target.value)}
          />
        </Sheet>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function Login() {
  const theme = useTheme();
  const { accountType, setAccountType } = useAuth();

  useEffect(() => {
    localStorage.removeItem('acc_t');
    localStorage.removeItem('selected_project');
    setAccountType(null);
  }, []);

  return (
    <RootStyle title="Login | Guidhub">
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
          to={PATH_AUTH.register}
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
          Commencer
        </Link>
      </AuthLayout>
      <MHidden width="mdDown">
        <SectionStyle>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Rejoignez le hub des créateurs.
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
              {!accountType && (
                <Box>
                  <Typography variant="h4" gutterBottom>
                    Connectez-vous à Guidhub
                  </Typography>
                </Box>
              )}
              {accountType && (
                <Stack spacing={2}>
                  <Typography variant="h6" gutterBottom>
                    Connectez-vous à Guidhub en tant que{' '}
                    <Chip
                      label={accountType === 'stakeholder' ? 'Partenaire' : 'Créateur'}
                      icon={<PermIdentityIcon />}
                      variant="outlined"
                    />
                  </Typography>
                  <Divider />
                  <Typography variant="h6" gutterBottom>
                    ou
                  </Typography>
                  <Divider />
                  <Button
                    variant="text"
                    onClick={() => setAccountType(null)}
                    sx={{
                      justifyContent: 'flex-start'
                    }}
                  >
                    changer de compte ?
                  </Button>
                </Stack>
              )}
              {!accountType && (
                <Box sx={{ width: '100%' }}>
                  <AuthAccountType />
                </Box>
              )}
              {accountType && (
                <Box sx={{ width: '100%' }}>
                  <Card>
                    <LoginForm />
                  </Card>
                </Box>
              )}
            </Stack>

            <MHidden width="smUp">
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Vous n'avez pas de compte ?&nbsp;
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Commencer
                </Link>
              </Typography>
            </MHidden>
          </ContentStyle>
        </Container>
      </Container>
    </RootStyle>
  );
}
