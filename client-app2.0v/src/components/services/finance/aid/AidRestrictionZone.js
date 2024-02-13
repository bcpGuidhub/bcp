import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Button, ButtonGroup } from '@mui/material';

// ----------------------------------------------------------------------

AidRestrictionZone.propTypes = {
  appendQuery: PropTypes.func.isRequired,
  aidZone: PropTypes.array.isRequired
};

export default function AidRestrictionZone({ appendQuery, aidZone }) {
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
        {aidZone.map((c, j) => (
          <Button
            key={j}
            onKeyPress={(e) => appendQuery(e, 'niveaux', c.geo_nom, c.id_geo)}
            onClick={(e) => appendQuery(e, 'niveaux', c.geo_nom, c.id_geo)}
            sx={{ background: 'none', width: '100%', justifyContent: 'flex-start', color: theme.palette.text.primary }}
          >
            {c.geo_nom}{' '}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
}
