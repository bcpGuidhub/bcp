import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import { Icon } from '@iconify/react';
import { Box, Button, Container, Link, Typography } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { VerifyStakeholderCodeForm } from '../../components/authentication/verify-code';
// components
import Page from '../../components/Page';
import useAuth from '../../hooks/useAuth';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function VerifyStakeholderCode() {
  const { resendStakeholderValidationCode } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  // const navigate = useNavigate();

  const resend = async (e) => {
    e.preventDefault();
    try {
      await resendStakeholderValidationCode();
      enqueueSnackbar('le code a été envoyé', { variant: 'success' });
    } catch (error) {
      // navigate(PATH_AUTH.register);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };
  return (
    <RootStyle title="Vérifier | Guidhub">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Button
            size="small"
            component={RouterLink}
            to={PATH_AUTH.login}
            startIcon={<Icon icon={arrowIosBackFill} width={20} height={20} />}
            sx={{ mb: 3 }}
          >
            envoyer
          </Button>

          <Typography variant="h3" paragraph>
            Votre code de confirmation vous attend dans votre boîte E-mail
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Saisissez le code à 6 chiffres que nous vous avons envoyé sur ------@----.--- et 0xxxxxxxxx pour confirmer
            votre e-mail.
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyStakeholderCodeForm />
          </Box>

          <Typography variant="body2" align="center">
            Vous n'avez pas reçu de SMS&nbsp;?{' '}
            <Link variant="subtitle2" underline="none" onClick={resend}>
              Renvoyer
            </Link>
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}
