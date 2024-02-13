import { LoadingButton } from '@mui/lab';
// material
import { FormHelperText, OutlinedInput, Stack } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../../../hooks/useAuth';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

// eslint-disable-next-line consistent-return
function maxLength(object) {
  if (object.target.value.length > object.target.maxLength) {
    return (object.target.value = object.target.value.slice(0, object.target.maxLength));
  }
}

export default function VerifyStakeholderCodeForm() {
  const refCodes = {
    phoneCodeRef1: useRef(null),
    phoneCodeRef2: useRef(null),
    phoneCodeRef3: useRef(null),
    phoneCodeRef4: useRef(null),
    phoneCodeRef5: useRef(null),
    phoneCodeRef6: useRef(null)
  };
  const [inputFocus, setInputFocus] = useState(1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { validateStakeholderAccount, setAccountType } = useAuth();
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.number().required('Le code est requis'),
    code2: Yup.number().required('Le code est requis'),
    code3: Yup.number().required('Le code est requis'),
    code4: Yup.number().required('Le code est requis'),
    code5: Yup.number().required('Le code est requis'),
    code6: Yup.number().required('Le code est requis')
  });

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await validateStakeholderAccount(
          [values.code1, values.code2, values.code3, values.code4, values.code5, values.code6].join('')
        );
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('E-mail validé', { variant: 'success' });
        setAccountType('stakeholder');
        navigate(PATH_AUTH.login);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
        if (error.response.status === 401) {
          enqueueSnackbar("cette demande a expiré en raison de l'inaction .", { variant: 'error' });
          // navigate(PATH_AUTH.register);
        } else {
          enqueueSnackbar("le code que vous avez entré n'est pas valide", { variant: 'error' });
        }
      }
    }
  });

  const { values, errors, isValid, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  useEffect(() => {
    if (inputFocus <= 6) {
      refCodes[`phoneCodeRef${inputFocus}`].current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFocus]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {Object.keys(values).map((item, i) => (
            <OutlinedInput
              key={item}
              {...getFieldProps(item)}
              type="number"
              placeholder="-"
              onInput={maxLength}
              error={Boolean(touched[item] && errors[item])}
              inputProps={{
                maxLength: 1,
                sx: {
                  p: 0,
                  textAlign: 'center',
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 }
                },
                ref: refCodes[`phoneCodeRef${i + 1}`]
              }}
              onChange={(e) => {
                e.preventDefault();
                setFieldValue(item, e.target.value);
                setInputFocus(i + 2);
              }}
            />
          ))}
        </Stack>

        <FormHelperText error={!isValid} style={{ textAlign: 'right' }}>
          {!isValid && 'Le code est requis'}
        </FormHelperText>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          Valider
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
