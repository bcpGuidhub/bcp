import { Button, ButtonGroup, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

GuideNavHelperIntegrated.propTypes = {
  formLabel: PropTypes.string.isRequired,
  helperLabel: PropTypes.string.isRequired,
  setVisualTo: PropTypes.func.isRequired
};

export default function GuideNavHelperIntegrated({ formLabel, helperLabel, setVisualTo }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item xs={12} md={12}>
        <ButtonGroup size="large" variant="contained">
          <Button
            onClick={(e) => {
              e.preventDefault();
              setVisualTo('form');
            }}
          >
            {formLabel}
          </Button>
          {/* <Button
            onClick={(e) => {
              e.preventDefault();
              setVisualTo('helper');
            }}
          >
            {helperLabel}
          </Button> */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              setVisualTo('guide');
            }}
            style={{
              minWidth: isDesktop ? 150 : ''
            }}
          >
            Guide
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
