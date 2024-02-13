import { Box, Button, Container, Typography } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
//
import { PageNotFoundIllustration } from '../../assets';
import RenewStakeholderPasswordForm from '../../components/authentication/reset-password/RenewStakeholderPasswordForm';
// components
import Page from '../../components/Page';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import { tokenStakeholderValidity } from '../../redux/slices/user';
import { useDispatch } from '../../redux/store';
// routes
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function RenewStakeholderPassword() {
  const dispatch = useDispatch();
  const { invalidToken } = useSelector((state) => state.user);

  useEffect(() => {
    const c = window.location.search;
    const params = new URLSearchParams(c);
    dispatch(tokenStakeholderValidity(params.get('reset_password_token')));
  }, [dispatch]);
  return (
    <RootStyle title="Réinitialiser le mot de passe | Guidhub">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {!invalidToken ? (
            <>
              <Typography variant="h3" paragraph>
                Votre nouveau mot de passe
              </Typography>
              <RenewStakeholderPasswordForm />
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <PageNotFoundIllustration sx={{ mb: 5, mx: 'auto', height: 160 }} />

              <Typography variant="h3" gutterBottom>
                La page à laquelle vous essayez d'accéder
              </Typography>
              <Typography>n'est plus disponible</Typography>

              <Button size="large" variant="contained" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 5 }}>
                Retour
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </RootStyle>
  );
}
