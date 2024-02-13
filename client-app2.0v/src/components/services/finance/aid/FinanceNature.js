import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Button, ButtonGroup } from '@mui/material';
// ----------------------------------------------------------------------

FinanceNature.propTypes = {
  natureOfFinancing: PropTypes.array.isRequired,
  appendQuery: PropTypes.func.isRequired
};

export default function FinanceNature({ natureOfFinancing, appendQuery }) {
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
        {natureOfFinancing.map((c, j) => (
          <Button
            key={j}
            onClick={(e) => appendQuery(e, 'natures', c.typ_libelle, c.id_typ)}
            sx={{ background: 'none', width: '100%', justifyContent: 'flex-start', color: theme.palette.text.primary }}
          >
            {c.typ_libelle}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
}
