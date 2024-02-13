import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BottomNavigation, Box, Card, Stack, Typography, useTheme } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { InformationBox } from '..';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Block } from '../../../../pages/components-overview/Block';
import { MHidden } from '../../../@material-extend';
import { updateProjectLegalStatus } from '../../../../redux/slices/project';
import { useDispatch } from '../../../../redux/store';
import MicroActivityOption from './MicroActivityOption';
import { EIRLTaxSelection, EntrepriseIndividuelleTaxSelection, GeneralTaxSelection } from './TaxOptions';
import TvaSelection from './TvaOptions';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

Tax.propTypes = {
  helperInformation: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};
function Tax({ helperInformation, touched, errors, values, setFieldValue, onBlur }) {
  const navigate = useNavigate();

  const goToSocialSecurity = (e) => {
    e.preventDefault();
    navigate(PATH_DASHBOARD.legal.socialSecurity);
  };
  return (
    <>
      {values.legal_status_idea === 'Entreprise individuelle' && (
        <EntrepriseIndividuelleTaxSelection
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          onBlur={onBlur}
        />
      )}
      {['', 'Je ne sais pas encore', 'EURL', 'SASU', 'SARL', 'SAS'].includes(values.legal_status_idea) && (
        <GeneralTaxSelection
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          onBlur={onBlur}
        />
      )}
      {values.legal_status_idea === 'EIRL' && (
        <EIRLTaxSelection
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          onBlur={onBlur}
        />
      )}
      {(values.legal_status_idea === 'EIRL' || values.legal_status_idea === 'Entreprise individuelle') &&
        (values.tax_system === 'IR' || values.tax_system === 'Micro-entreprise') && (
          <InformationBox
            style={{
              border: 'solid 1px #fe6113ad',
              borderRadius: '4px',
              backgroundColor: '#fe61161a'
            }}
          >
            Pour le calcul de vos cotisations sociales, merci de répondre aux questions relatives à l'ACRE et au
            paiement des cotisations sur la page{' '}
            <a onClick={goToSocialSecurity} href="#">
              la sécurité sociale du dirigeant
            </a>
            .
          </InformationBox>
        )}
      {helperInformation && (
        <InformationBox>
          {helperInformation.header && <p>{helperInformation.header}</p>}
          {helperInformation.list_1 && (
            <ul>
              {helperInformation.list_1.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
          {helperInformation.sub_text && <p>{helperInformation.sub_text}</p>}
          {helperInformation.list_2 && (
            <ul>
              {helperInformation.list_2.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
          {helperInformation.footer && (
            <p>
              {helperInformation.footer.header}
              {helperInformation.footer.link_1 && (
                <a href={helperInformation.footer.link_1.href} target="_blank" rel="noreferrer">
                  {' '}
                  {helperInformation.footer.link_1.text}
                </a>
              )}
              {', '}{' '}
              {helperInformation.footer.link_2 && (
                <a href={helperInformation.footer.link_2.href} target="_blank" rel="noreferrer">
                  {helperInformation.footer.link_2.text}
                </a>
              )}
            </p>
          )}
        </InformationBox>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' }
};

Fiscal.propTypes = {
  id: PropTypes.string.isRequired,
  legalFormalities: PropTypes.object.isRequired,
  activitySector: PropTypes.string.isRequired,
  helperInformation: PropTypes.object.isRequired
};

export default function Fiscal({ id, legalFormalities, helperInformation, activitySector }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const theme = useTheme();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [initialState, setInitialState] = useState({
    legal_status_idea: legalFormalities?.legal_status_idea || '',
    tax_system: legalFormalities?.tax_system || '',
    company_vat_regime: legalFormalities?.company_vat_regime || '',
    micro_entreprise_activity_category: legalFormalities?.micro_entreprise_activity_category || '',
    social_security_scheme: legalFormalities?.social_security_scheme || ''
  });

  const preValidation = (values) => {
    if (values.tax_system === 'Micro-entreprise') {
      values.social_security_scheme = 'Régime micro-social';
    }
  };
  const formik = useFormik({
    initialValues: initialState,
    enableReinitialize: true,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        preValidation(values);
        if (values.tax_system === '') {
          enqueueSnackbar('Aucune valeur sélectionnée', { variant: 'info' });
          return;
        }
        dispatch(updateProjectLegalStatus(id, values));
        enqueueSnackbar('Vos changements ont été enregistrés', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, handleBlur } = formik;

  const largeScreenView = () => (
    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Stack>
        <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw', p: 1 } }}>
          Régime d'imposition des bénéfices{' '}
        </Typography>
        <Tax
          helperInformation={helperInformation}
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          onBlur={handleBlur}
        />
        <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw', p: 1 } }}>Régime de TVA </Typography>
        <TvaSelection
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          onBlur={handleBlur}
        />
        {['EIRL', 'Entreprise individuelle'].includes(legalFormalities?.legal_status_idea || '') &&
          ['Autre activité commerciale', 'Autre activité artisanale', 'Start-up'].includes(activitySector) && (
            <>
              <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw', p: 1 } }}>
                Quelle est la nature de votre catégorie d’activité ?
              </Typography>

              <MicroActivityOption
                touched={touched}
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
                onBlur={handleBlur}
              />
            </>
          )}
      </Stack>
      {isCreator && (
        <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 4 }}>
          valider
        </LoadingButton>
      )}
    </Form>
  );
  const mobileScreenView = () => (
    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
      {value === 0 && (
        <Box sx={{ p: 1 }}>
          <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '3vw' }, p: 1 }}>
            Régime d'imposition des bénéfices{' '}
          </Typography>
          <Tax
            helperInformation={helperInformation}
            touched={touched}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            onBlur={handleBlur}
          />
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 1 }}>
          <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw', p: 1 } }}>{`Régime de TVA de votre ${
            legalFormalities?.legal_status_idea || ''
          }`}</Typography>
          <TvaSelection
            touched={touched}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            onBlur={handleBlur}
          />
        </Box>
      )}

      {value === 2 && (
        <Box sx={{ p: 1 }}>
          {' '}
          {['EIRL', 'Entreprise individuelle'].includes(legalFormalities?.legal_status_idea || '') &&
            ['Autre activité commerciale', 'Autre activité artisanale', 'Start-up'].includes(activitySector) && (
              <>
                <Typography sx={{ [theme.breakpoints.down('md')]: { fontSize: '2.5vw', p: 1 } }}>
                  Quelle est la nature de votre catégorie d’activité ?
                </Typography>

                <MicroActivityOption
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                  onBlur={handleBlur}
                />
              </>
            )}
        </Box>
      )}
      {isCreator && (
        <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 1 }}>
          valider
        </LoadingButton>
      )}
    </Form>
  );

  useEffect(() => {
    setInitialState({ ...initialState, ...legalFormalities });
  }, [legalFormalities]);

  return (
    <FormikProvider value={formik}>
      {/* <MHidden width="smDown">{largeScreenView()}</MHidden> */}
      {mobileScreenView()}
      <Box sx={{ pt: 1 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction value={0} label="IS/IR" />
          <BottomNavigationAction label="TVA" />
          {['EIRL', 'Entreprise individuelle'].includes(legalFormalities?.legal_status_idea || '') &&
            ['Autre activité commerciale', 'Autre activité artisanale', 'Start-up'].includes(activitySector) && (
              <BottomNavigationAction label="Micro" />
            )}
        </BottomNavigation>
      </Box>
    </FormikProvider>
  );
}
