import { Icon } from '@iconify/react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/joy';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

InviteStakeholder.propTypes = {
  handleClickOpen: PropTypes.func.isRequired
};

export default function InviteStakeholder({ handleClickOpen }) {
  return (
    <Card>
      <CardContent>
        <Box>
          <Typography sx={{ typography: 'h5' }}>Inviter un partenaire </Typography>
        </Box>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between'
          }}
        >
          <Box>collaborer sur le contenu et construire ensemble un beau produit digital </Box>
          <Box>
            <Button
              onClick={() => handleClickOpen(true)}
              variant="outlined"
              color="primary"
              startDecorator={<Icon icon="game-icons:team-idea" />}
            >
              ajouter un partenaire
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
