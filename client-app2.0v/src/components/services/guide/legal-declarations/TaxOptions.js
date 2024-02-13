// material
import { MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const TAX_OPTIONS_INCLUDING_MICRO = ['IR', 'IS', 'Micro-entreprise'];
const TAX_OPTIONS = ['IR', 'IS'];
const TAX_OPTIONS_INDIVIDUAL = ['IR', 'Micro-entreprise'];

// ----------------------------------------------------------------------

GeneralTaxSelection.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};
export function GeneralTaxSelection({ touched, errors, values, setFieldValue, onBlur }) {
  return (
    <TextField
      select
      fullWidth
      label="Régime d'imposition des bénéfices"
      error={Boolean(touched.tax_system && errors.tax_system)}
      helperText={touched.tax_system && errors.tax_system}
      value={values.tax_system}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('tax_system', event.target.value);
      }}
      onBlur={onBlur}
      name="tax_system"
    >
      {TAX_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ----------------------------------------------------------------------

EIRLTaxSelection.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export function EIRLTaxSelection({ touched, errors, values, setFieldValue, onBlur }) {
  return (
    <TextField
      select
      fullWidth
      label="Régime d'imposition des bénéfices"
      error={Boolean(touched.tax_system && errors.tax_system)}
      helperText={touched.tax_system && errors.tax_system}
      value={values.tax_system}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('tax_system', event.target.value);
      }}
      onBlur={onBlur}
      name="tax_system"
    >
      {TAX_OPTIONS_INCLUDING_MICRO.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ----------------------------------------------------------------------

EntrepriseIndividuelleTaxSelection.propTypes = {
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};
export function EntrepriseIndividuelleTaxSelection({ touched, errors, values, setFieldValue, onBlur }) {
  return (
    <TextField
      select
      fullWidth
      label="Régime d'imposition des bénéfices"
      error={Boolean(touched.tax_system && errors.tax_system)}
      helperText={touched.tax_system && errors.tax_system}
      value={values.tax_system}
      onChange={(event) => {
        event.preventDefault();
        setFieldValue('tax_system', event.target.value);
      }}
      onBlur={onBlur}
      name="tax_system"
    >
      {TAX_OPTIONS_INDIVIDUAL.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
