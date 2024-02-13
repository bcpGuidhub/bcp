import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

ProjectName.propTypes = {
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
};

export default function ProjectName({ field, handleChange }) {
  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField onChange={handleChange} value={field} label="Nom du projet" variant="outlined" />
    </Box>
  );
}
