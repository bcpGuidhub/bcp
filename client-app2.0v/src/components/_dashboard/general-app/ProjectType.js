import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ----------------------------------------------------------------------

ProjectType.propTypes = {
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
};

export default function ProjectType({ field, handleChange }) {
  return (
    <div>
      <FormControl sx={{ m: 1, width: '100%' }}>
        <InputLabel id="demo-simple-select-helper-label">Sélectionnez votre type de projet</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={field}
          label="Sélectionnez votre type de projet"
          onChange={handleChange}
        >
          <MenuItem value="Un projet de création d'entreprise">Un projet de création d'entreprise</MenuItem>
          <MenuItem value="Un projet de reprise d'entreprise">Un projet de reprise d'entreprise</MenuItem>
        </Select>
        {/* <FormHelperText>With label + helper text</FormHelperText> */}
      </FormControl>
    </div>
  );
}
