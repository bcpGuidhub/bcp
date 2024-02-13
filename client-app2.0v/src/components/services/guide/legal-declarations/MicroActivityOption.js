import { MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const ACTIVITY_OPTIONS = ['Vente de marchandises', 'Prestation de services et autre'];
MicroActivityOption.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default function MicroActivityOption({ touched, errors, values, setFieldValue, onBlur }) {
  return (
    <TextField
      select
      fullWidth
      label="TVA"
      error={Boolean(touched.micro_entreprise_activity_category && errors.micro_entreprise_activity_category)}
      helperText={touched.micro_entreprise_activity_category && errors.micro_entreprise_activity_category}
      value={values.micro_entreprise_activity_category}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('micro_entreprise_activity_category', event.target.value);
      }}
      onBlur={onBlur}
    >
      {ACTIVITY_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
