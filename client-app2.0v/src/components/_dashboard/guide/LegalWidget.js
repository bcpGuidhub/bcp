import { Box, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker
}));

// ----------------------------------------------------------------------

LegalWidget.propTypes = {
  legal: PropTypes.string
};

export default function LegalWidget({ legal }) {
  return (
    <RootStyle>
      <Box sx={{ ml: 3, color: 'common.white' }}>
        <Typography variant="h4"> {legal}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          Votre statut juridique
        </Typography>
      </Box>
    </RootStyle>
  );
}
