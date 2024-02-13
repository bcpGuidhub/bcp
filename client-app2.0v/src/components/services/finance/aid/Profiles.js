import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Button, ButtonGroup } from '@mui/material';

// ----------------------------------------------------------------------

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired,
  appendQuery: PropTypes.func.isRequired
};

export default function Profiles({ profiles, appendQuery }) {
  const theme = useTheme();
  return (
    <Grid item xs={12}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        sx={{
          alignItems: 'flex-start',
          width: '100%'
        }}
      >
        {profiles.map((c, j) => (
          <Button
            key={j}
            onClick={(e) => appendQuery(e, 'profils', c.tut_libelle, c.id_tut)}
            sx={{ background: 'none', width: '100%', justifyContent: 'flex-start', color: theme.palette.text.primary }}
          >
            {c.tut_libelle}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
}
