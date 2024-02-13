import PropTypes from 'prop-types';

// material
import {
  Box,
  DialogActions,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  TextField,
  Input,
  Alert,
  Icon,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// ----------------------------------------------------------------------

function InputField({ detail, name, label, onChange, icon, sx, ...other }) {
  return (
    <Stack direction="row" spacing={1} sx={sx}>
      {/* <Typography component="div" variant="h5">
        {label}:
      </Typography> */}
      {/* <Input
        startAdornment={
          <Typography variant="subtitle2">
            {label}
            <Icon icon="octicon:smiley-16" color="red" />
          </Typography>
        }
        name={name}
        size="large"
        value={detail}
        onChange={onChange}
        sx={{
          typography: 'h6',
          '& input': {
            p: 0,
            textAlign: 'center'
          }
        }}
        {...other}
      /> */}
      <FormControl sx={{ m: 1 }} variant="outlined">
        <InputLabel>{label}</InputLabel>
        <OutlinedInput
          type="text"
          name={name}
          value={detail}
          onChange={onChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton>{icon}</IconButton>
            </InputAdornment>
          }
          label={label}
        />
      </FormControl>
    </Stack>
  );
}

InviteContact.propTypes = {
  contactDetails: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string
  }),
  onConfirm: PropTypes.func,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default function InviteContact({ open, contactDetails, onClose, onChange, onConfirm }) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
        <Stack direction="row">
          <InputField onChange={onChange} label="Nom" name="name" detail={contactDetails?.name} icon={<BadgeIcon />} />

          <InputField
            onChange={onChange}
            label="Email"
            name="email"
            detail={contactDetails?.email}
            icon={<AlternateEmailIcon />}
          />
        </Stack>

        <TextField fullWidth multiline rows={2} placeholder="Write a message..." />
      </Stack>
      <DialogActions>
        <Button
          variant="contained"
          disabled={contactDetails.name === '' || contactDetails.email === ''}
          onClick={onConfirm}
        >
          Confirm & Send
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
