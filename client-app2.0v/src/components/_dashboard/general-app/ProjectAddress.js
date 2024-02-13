import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { Autocomplete } from '@mui/material';

ProjectAddress.propTypes = {
  autoCompletePlace: PropTypes.array,
  handleChangePlace: PropTypes.func,
  onSelectPlace: PropTypes.func,
  projectSearchableAddress: PropTypes.string
};

export default function ProjectAddress({
  handleChangePlace,
  onSelectPlace,
  autoCompletePlace,
  projectSearchableAddress
}) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <AddLocationIcon />
      <Autocomplete
        options={autoCompletePlace}
        onChange={onSelectPlace}
        onInputChange={handleChangePlace}
        value={projectSearchableAddress}
        renderInput={(params) => <TextField {...params} label="Lieu" />}
        freeSolo
        forcePopupIcon
      />
    </Box>
  );
}
