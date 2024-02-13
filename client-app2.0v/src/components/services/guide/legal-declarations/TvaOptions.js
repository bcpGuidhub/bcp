import { MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const TVA_OPTIONS = ['Franchise en base de TVA', 'Réel simplifié', 'Réel normal'];
TvaSelection.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default function TvaSelection({ touched, errors, values, setFieldValue, onBlur }) {
  return (
    <TextField
      select
      fullWidth
      label="TVA"
      error={Boolean(touched.company_vat_regime && errors.company_vat_regime)}
      helperText={touched.company_vat_regime && errors.company_vat_regime}
      value={values.company_vat_regime}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('company_vat_regime', event.target.value);
      }}
      onBlur={onBlur}
      name="company_vat_regime"
      sx={{ '& .MuiOutlinedInput-input': { color: '#fff' } }}
    >
      {TVA_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
