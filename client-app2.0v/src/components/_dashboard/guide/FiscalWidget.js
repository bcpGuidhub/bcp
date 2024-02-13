import { Box, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.warning.darker
}));

// ----------------------------------------------------------------------
FiscalWidget.propTypes = {
  taxSystem: PropTypes.string
};
export default function FiscalWidget({ taxSystem }) {
  return (
    <RootStyle>
      <Box sx={{ ml: 3, color: 'common.white' }}>
        <Typography variant="h4"> {taxSystem}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          Régime d'imposition
        </Typography>
      </Box>
    </RootStyle>
  );
}
