import AlarmIcon from '@mui/icons-material/Alarm';
import { LoadingButton } from '@mui/lab';
import { Box, Button, ButtonGroup, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import debounce from 'lodash.debounce';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InformationBox } from '..';
import { createDirector, updateDirector } from '../../../../redux/slices/project';
import { useDispatch, useSelector } from '../../../../redux/store';
import { COTISATION_API } from '../../../../utils/axios';
import Label from '../../../Label';
import { sectorsClasifications } from '../sectorsClasifications';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const COMPENSATION_PARTITIONS = ['Mensuelle', 'Personnalisée'];
const DIRECTOR_ACRE = ['oui', 'non'];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// ----------------------------------------------------------------------

function supportedSituation(options) {
  return {
    TNS: {
      IS: {
        year_1: {
          situation: {
            dirigeant: 'oui',
            'entreprise . ACRE': options.acre,
            'entreprise . date de création': '01/2020',
            "entreprise . catégorie d'activité": options.sector,
            'dirigeant . indépendant': 'oui',
            'dirigeant . indépendant . revenu net de cotisations': options.net
          }
        },
        year_x: {
          situation: {
            dirigeant: 'oui',
            'entreprise . ACRE': 'non',
            'entreprise . date de création': '01/2020',
            "entreprise . catégorie d'activité": options.sector,
            'dirigeant . indépendant': 'oui',
            'dirigeant . indépendant . revenu net de cotisations': options.net
          }
        },
        evaluate: 'dirigeant . indépendant . cotisations et contributions'
      },
      IR: {
        SARL: {
          situation: {
            dirigeant: 'oui',
            'entreprise . ACRE': options.acre,
            'entreprise . date de création': '01/2020',
            "entreprise . catégorie d'activité": options.sector,
            'dirigeant . indépendant': 'oui',
            'dirigeant . rémunération totale': options.net || 0
          },
          evaluate: 'dirigeant . indépendant . cotisations et contributions'
        },
        ELSE: {
          situation: {
            dirigeant: 'oui',
            'entreprise . ACRE': options.acre,
            'entreprise . date de création': '01/2020',
            "entreprise . catégorie d'activité": options.sector,
            'dirigeant . indépendant': 'oui',
            'dirigeant . rémunération totale': options.net || 0
          },
          evaluate: 'dirigeant . indépendant . cotisations et contributions'
        }
      }
    },
    'assimilé-salarié': {
      year_1: {
        situation: {
          dirigeant: 'oui',
          'dirigeant . assimilé salarié': 'oui',
          'entreprise . ACRE': options.acre,
          'entreprise . date de création': '01/2020',
          'contrat salarié . statut cadre': 'oui',
          'contrat salarié . chômage': 'non',
          'contrat salarié . rémunération . net': options.net
        }
      },
      year_x: {
        situation: {
          dirigeant: 'oui',
          'dirigeant . assimilé salarié': 'oui',
          'entreprise . ACRE': 'non',
          'entreprise . date de création': '01/2020',
          'contrat salarié . statut cadre': 'oui',
          'contrat salarié . chômage': 'non',
          'contrat salarié . rémunération . net': options.net
        }
      },
      evaluate: {
        sum: ['contrat salarié . cotisations . patronales', 'contrat salarié . cotisations . salariales']
      }
    }
  };
}

function strToIntSum(field, state) {
  const months = [
    'month_1_amount',
    'month_2_amount',
    'month_3_amount',
    'month_4_amount',
    'month_5_amount',
    'month_6_amount',
    'month_7_amount',
    'month_8_amount',
    'month_9_amount',
    'month_10_amount',
    'month_11_amount',
    'month_12_amount'
  ];
  return months.reduce((acc, k) => {
    let v = state[field][k];
    if (v === '') {
      v = '0';
    }
    acc += parseInt(v, 10);
    return acc;
  }, 0);
}

// ----------------------------------------------------------------------

DirectorNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDirector: PropTypes.object,
  setListDirectors: PropTypes.func.isRequired
};

export default function DirectorNewForm({ isEdit, currentDirector, setListDirectors }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { work } = useSelector((state) => state.project);
  const legalStatus = work.project_legal_status;
  const individuelle =
    (legalStatus.legal_status_idea === 'Entreprise individuelle' || legalStatus.legal_status_idea === 'EIRL') &&
    (legalStatus.tax_system === 'IR' || legalStatus.tax_system === 'Micro-entreprise');
  const [missingAcre, setMissingAcre] = useState(true);
  const [selectedYear, setSelectedYear] = useState('year_1');
  const [computingCotisation, setComputingCotisation] = useState(false);
  const [loadingYear, setLoadingYear] = useState({
    year_1: false,
    year_2: false,
    year_3: false
  });
  const [exceededPercentage, setExceededPercentage] = useState(false);
  const [loadingPersonalisedMonthlySSC, setLoadingPersonalisedMonthlySSC] = useState({
    year_1: {
      month_1: false,
      month_2: false,
      month_3: false,
      month_4: false,
      month_5: false,
      month_6: false,
      month_7: false,
      month_8: false,
      month_9: false,
      month_10: false,
      month_11: false,
      month_12: false
    },
    year_2: {
      month_1: false,
      month_2: false,
      month_3: false,
      month_4: false,
      month_5: false,
      month_6: false,
      month_7: false,
      month_8: false,
      month_9: false,
      month_10: false,
      month_11: false,
      month_12: false
    },
    year_3: {
      month_1: false,
      month_2: false,
      month_3: false,
      month_4: false,
      month_5: false,
      month_6: false,
      month_7: false,
      month_8: false,
      month_9: false,
      month_10: false,
      month_11: false,
      month_12: false
    }
  });
  const NewDirectorSchema = Yup.object().shape({
    last_name: Yup.string().required('Nom du dirigeant est requis'),
    first_name: Yup.string().required('Prénom du dirigeant du dirigeant est requis'),
    percentage_equity_capital: Yup.string(),
    director_acre: Yup.string().required("Le dirigeant bénéficie-t-il de l'ACRE est requis"),
    compensation_partition: Yup.string().required(
      individuelle
        ? "Répartition des prélèvements sur l'année est requis"
        : "Répartition de la rémunération sur l'année est requis"
    ),
    net_compensation_year_1: Yup.string().required('Montant des rémunérations nettes en année 1 (en euros)'),
    net_compensation_year_2: Yup.string().required('Montant des rémunérations nettes en année 2 (en euros)'),
    net_compensation_year_3: Yup.string().required('Montant des rémunérations nettes en année 3 (en euros)'),
    year_1: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    year_2: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    year_3: Yup.object().shape({
      month_1_amount: Yup.string().default('0'),
      month_2_amount: Yup.string().default('0'),
      month_3_amount: Yup.string().default('0'),
      month_4_amount: Yup.string().default('0'),
      month_5_amount: Yup.string().default('0'),
      month_6_amount: Yup.string().default('0'),
      month_7_amount: Yup.string().default('0'),
      month_8_amount: Yup.string().default('0'),
      month_9_amount: Yup.string().default('0'),
      month_10_amount: Yup.string().default('0'),
      month_11_amount: Yup.string().default('0'),
      month_12_amount: Yup.string().default('0')
    }),
    year_1_cotisation: Yup.object().shape({
      month_1_cotisation: Yup.string().default('0'),
      month_2_cotisation: Yup.string().default('0'),
      month_3_cotisation: Yup.string().default('0'),
      month_4_cotisation: Yup.string().default('0'),
      month_5_cotisation: Yup.string().default('0'),
      month_6_cotisation: Yup.string().default('0'),
      month_7_cotisation: Yup.string().default('0'),
      month_8_cotisation: Yup.string().default('0'),
      month_9_cotisation: Yup.string().default('0'),
      month_10_cotisation: Yup.string().default('0'),
      month_11_cotisation: Yup.string().default('0'),
      month_12_cotisation: Yup.string().default('0')
    }),
    year_2_cotisation: Yup.object().shape({
      month_1_cotisation: Yup.string().default('0'),
      month_2_cotisation: Yup.string().default('0'),
      month_3_cotisation: Yup.string().default('0'),
      month_4_cotisation: Yup.string().default('0'),
      month_5_cotisation: Yup.string().default('0'),
      month_6_cotisation: Yup.string().default('0'),
      month_7_cotisation: Yup.string().default('0'),
      month_8_cotisation: Yup.string().default('0'),
      month_9_cotisation: Yup.string().default('0'),
      month_10_cotisation: Yup.string().default('0'),
      month_11_cotisation: Yup.string().default('0'),
      month_12_cotisation: Yup.string().default('0')
    }),
    year_3_cotisation: Yup.object().shape({
      month_1_cotisation: Yup.string().default('0'),
      month_2_cotisation: Yup.string().default('0'),
      month_3_cotisation: Yup.string().default('0'),
      month_4_cotisation: Yup.string().default('0'),
      month_5_cotisation: Yup.string().default('0'),
      month_6_cotisation: Yup.string().default('0'),
      month_7_cotisation: Yup.string().default('0'),
      month_8_cotisation: Yup.string().default('0'),
      month_9_cotisation: Yup.string().default('0'),
      month_10_cotisation: Yup.string().default('0'),
      month_11_cotisation: Yup.string().default('0'),
      month_12_cotisation: Yup.string().default('0')
    }),
    cotisations_sociales_year_1: Yup.string().required('Montant des cotisations sociales en année 1 est requis'),
    cotisations_sociales_year_2: Yup.string().required('Montant des cotisations sociales en année 2 est requis'),
    cotisations_sociales_year_3: Yup.string().required('Montant des cotisations sociales en année 3 est requis')
  });

  const filterYear = (collection, year) => collection.filter((ry) => ry.year === year)[0];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_id: currentDirector?.project_id || '',
      last_name: currentDirector?.last_name || '',
      first_name: currentDirector?.first_name || '',
      percentage_equity_capital: currentDirector?.percentage_equity_capital || '0',
      director_acre: currentDirector?.director_acre || '',
      compensation_partition: currentDirector?.compensation_partition || '',
      net_compensation_year_1: currentDirector?.net_compensation_year_1 || '',
      net_compensation_year_2: currentDirector?.net_compensation_year_2 || '',
      net_compensation_year_3: currentDirector?.net_compensation_year_3 || '',
      year_1: {
        month_1_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_1_amount || '',
        month_2_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_2_amount || '',
        month_3_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_3_amount || '',
        month_4_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_4_amount || '',
        month_5_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_5_amount || '',
        month_6_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_6_amount || '',
        month_7_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_7_amount || '',
        month_8_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_8_amount || '',
        month_9_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_9_amount || '',
        month_10_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_10_amount || '',
        month_11_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_11_amount || '',
        month_12_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_1')?.month_12_amount || ''
      },
      year_2: {
        month_1_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_1_amount || '',
        month_2_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_2_amount || '',
        month_3_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_3_amount || '',
        month_4_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_4_amount || '',
        month_5_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_5_amount || '',
        month_6_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_6_amount || '',
        month_7_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_7_amount || '',
        month_8_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_8_amount || '',
        month_9_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_9_amount || '',
        month_10_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_10_amount || '',
        month_11_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_11_amount || '',
        month_12_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_2')?.month_12_amount || ''
      },
      year_3: {
        month_1_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_1_amount || '',
        month_2_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_2_amount || '',
        month_3_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_3_amount || '',
        month_4_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_4_amount || '',
        month_5_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_5_amount || '',
        month_6_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_6_amount || '',
        month_7_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_7_amount || '',
        month_8_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_8_amount || '',
        month_9_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_9_amount || '',
        month_10_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_10_amount || '',
        month_11_amount:
          filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_11_amount || '',
        month_12_amount: filterYear(currentDirector?.director_renumeration_years || [], 'year_3')?.month_12_amount || ''
      },
      year_1_cotisation: {
        month_1_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_1_cotisation || '',
        month_2_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_2_cotisation || '',
        month_3_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_3_cotisation || '',
        month_4_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_4_cotisation || '',
        month_5_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_5_cotisation || '',
        month_6_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_6_cotisation || '',
        month_7_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_7_cotisation || '',
        month_8_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_8_cotisation || '',
        month_9_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_9_cotisation || '',
        month_10_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_10_cotisation || '',
        month_11_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_11_cotisation || '',
        month_12_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_1')?.month_12_cotisation || ''
      },
      year_2_cotisation: {
        month_1_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_1_cotisation || '',
        month_2_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_2_cotisation || '',
        month_3_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_3_cotisation || '',
        month_4_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_4_cotisation || '',
        month_5_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_5_cotisation || '',
        month_6_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_6_cotisation || '',
        month_7_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_7_cotisation || '',
        month_8_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_8_cotisation || '',
        month_9_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_9_cotisation || '',
        month_10_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_10_cotisation || '',
        month_11_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_11_cotisation || '',
        month_12_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_2')?.month_12_cotisation || ''
      },
      year_3_cotisation: {
        month_1_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_1_cotisation || '',
        month_2_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_2_cotisation || '',
        month_3_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_3_cotisation || '',
        month_4_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_4_cotisation || '',
        month_5_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_5_cotisation || '',
        month_6_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_6_cotisation || '',
        month_7_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_7_cotisation || '',
        month_8_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_8_cotisation || '',
        month_9_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_9_cotisation || '',
        month_10_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_10_cotisation || '',
        month_11_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_11_cotisation || '',
        month_12_cotisation:
          filterYear(currentDirector?.director_cotisation_years || [], 'year_3')?.month_12_cotisation || ''
      },
      cotisations_sociales_year_1: currentDirector?.cotisations_sociales_year_1 || '',
      cotisations_sociales_year_2: currentDirector?.cotisations_sociales_year_2 || '',
      cotisations_sociales_year_3: currentDirector?.cotisations_sociales_year_3 || '',
      director_renumeration_years: currentDirector?.director_renumeration_years || [],
      director_cotisation_years: currentDirector?.director_cotisation_years || []
    },
    validationSchema: NewDirectorSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const payload = values;
        payload.project_id = work.id;
        payload.cotisations_sociales_year_1 = payload.cotisations_sociales_year_1.toString();
        payload.cotisations_sociales_year_2 = payload.cotisations_sociales_year_2.toString();
        payload.cotisations_sociales_year_3 = payload.cotisations_sociales_year_3.toString();
        if (
          (legalStatus.legal_status_idea === 'Entreprise individuelle' || legalStatus.legal_status_idea === 'EIRL') &&
          legalStatus.tax_system === 'IR'
        ) {
          if (
            typeof legalStatus.micro_entreprise_accre_exemption !== 'undefined' &&
            legalStatus.micro_entreprise_accre_exemption !== ''
          ) {
            payload.director_acre = legalStatus.micro_entreprise_accre_exemption;
          } else {
            payload.director_acre = 'non';
          }
        }
        if (values.compensation_partition === 'Personnalisée') {
          const years = ['year_1', 'year_2', 'year_3'].map((year) => ({
            year,
            ...filterYear(currentDirector?.director_renumeration_years || [], year),
            ...values[year]
          }));
          payload.director_renumeration_years = years;
          if (legalStatus.social_security_scheme === 'Régime général de la sécurité sociale') {
            const years = ['year_1', 'year_2', 'year_3'].map((year) => ({
              year,
              ...filterYear(currentDirector?.director_cotisation_years || [], year),
              ...values[`${year}_cotisation`]
            }));
            payload.director_cotisation_years = years;
          }
        }

        if (isEdit) {
          payload.id = currentDirector.id;
          dispatch(updateDirector(work.id, payload));
        } else {
          dispatch(createDirector(work.id, payload));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        setListDirectors(true);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const computeNetCompensation = (year) => {
    const key = `net_compensation_${year}`;
    setFieldValue(key, strToIntSum(year, values));
  };

  const computeNetMonthlyCompensation = (year, month, net) => {
    const key = `net_compensation_${year}`;
    setFieldValue(key, strToIntSum(year, values));
    setComputingCotisation(true);
    setLoadingPersonalisedMonthlySSC((_prev) => ({
      ..._prev,
      [year]: { ..._prev[year], [`month_${month}`]: true }
    }));
    debouncedSocialSituationPersonalisedCallback(year, month, net);
  };

  const debouncedSocialSituationCallback = debounce((year) => computeSocialSituation(year), 250);

  const computeSocialSituation = (year) => {
    if (values.director_acre === '' || values[`net_compensation_${year}`] === '') {
      if (values.director_acre === '') {
        setMissingAcre(true);
      }
      setComputingCotisation(false);
      return;
    }
    const legalStatus = work.project_legal_status;
    const sector = work.activity_sector;
    const options = {
      acre: values.director_acre,
      sector: Object.keys(sectorsClasifications).find((key) => sectorsClasifications[key].includes(sector)),
      net: values[`net_compensation_${year}`]
    };
    const situations = supportedSituation(options);
    let situation;
    let evaluate;
    const f = year === 'year_1' ? 'year_1' : 'year_x';
    if (legalStatus.social_security_scheme === 'Sécurité sociale des indépendants') {
      if (legalStatus.tax_system === 'IS') {
        situation = situations.TNS[legalStatus.tax_system][f].situation;
        evaluate = situations.TNS[legalStatus.tax_system].evaluate;
      }
    }
    if (legalStatus.social_security_scheme === 'Régime général de la sécurité sociale') {
      situation = situations['assimilé-salarié'][f].situation;
      evaluate = situations['assimilé-salarié'].evaluate;
    }
    if (typeof evaluate === 'string') {
      COTISATION_API.post('cotisations/directors', { situation, evaluate }).then((response) => {
        const { cotisation } = response.data;
        const v = cotisation === null ? 0 : cotisation;
        setFieldValue(`cotisations_sociales_${year}`, v.toString());
        setLoadingYear({ ...loadingYear, [year]: false });
        setComputingCotisation(false);
      });
    }
    if (typeof evaluate === 'object') {
      const op = Object.keys(evaluate)[0];
      if (op === 'sum') {
        situation['contrat salarié . rémunération . net'] /= 12;
        COTISATION_API.post('cotisations/employees', { situation }).then((response) => {
          const { cotisation } = response.data;
          const v = cotisation === null ? 0 : cotisation;
          setFieldValue(`cotisations_sociales_${year}`, v.toString());
          setLoadingYear({ ...loadingYear, [year]: false });
          setComputingCotisation(false);
        });
      }
    }
    if (typeof evaluate === 'undefined') {
      setLoadingYear({ ...loadingYear, [year]: false });
      setComputingCotisation(false);
    }
  };

  const computeSocialSituationPersonalised = (year, month, net) => {
    const sector = work.activity_sector;
    const options = {
      acre: values.director_acre,
      sector: Object.keys(sectorsClasifications).find((key) => sectorsClasifications[key].includes(sector)),
      net
    };
    const situations = supportedSituation(options);
    const f = year === 'year_1' ? 'year_1' : 'year_x';
    const { situation } = situations['assimilé-salarié'][f];
    COTISATION_API.post('cotisations/directors/employee-cotisation', { situation }).then(async (response) => {
      try {
        const { cotisation } = response.data;
        const v = cotisation === null ? 0 : cotisation;
        setFieldValue(`${year}_cotisation.month_${month}_cotisation`, Math.ceil(v).toString());
        const socialSituationYear = values[`${year}_cotisation`];
        const y = Object.keys(socialSituationYear)
          .filter((e) => e !== 'id')
          .reduce((acc, mon) => {
            if (mon === `month_${month}_cotisation`) {
              acc += Math.ceil(v);
              return acc;
            }
            acc += Number.isNaN(parseInt(socialSituationYear[mon], 10)) ? 0 : parseInt(socialSituationYear[mon], 10);
            return acc;
          }, 0);

        setFieldValue(`cotisations_sociales_${year}`, Math.ceil(y).toString());
        setComputingCotisation(false);
        setLoadingPersonalisedMonthlySSC((_prev) => ({
          ..._prev,
          [year]: { ..._prev[year], [`month_${month}`]: false }
        }));
      } catch (error) {
        setComputingCotisation(false);
        setLoadingPersonalisedMonthlySSC((_prev) => ({
          ..._prev,
          [year]: { ..._prev[year], [`month_${month}`]: false }
        }));
      }
    });
  };

  const debouncedSocialSituationPersonalisedCallback = debounce(
    (year, month, net) => computeSocialSituationPersonalised(year, month, net),
    500
  );

  const percentageEquitycapitalRequired =
    legalStatus.social_security_scheme === 'Sécurité sociale des indépendants' &&
    legalStatus.legal_status_idea === 'SARL';

  const displayComputeContributions =
    !(legalStatus.tax_system === 'IR' && legalStatus.social_security_scheme === 'Sécurité sociale des indépendants') ||
    !(legalStatus.tax_system === 'Micro-entreprise');

  const dependenciesNotSatisfied = legalStatus.legal_status_idea === '' || legalStatus.tax_system === '';

  const handleCompensation = (year) => {
    if (
      !(legalStatus.tax_system === 'IR' && legalStatus.social_security_scheme === 'Sécurité sociale des indépendants')
    ) {
      setLoadingYear({ ...loadingYear, [year]: true });
      setComputingCotisation(true);
      debouncedSocialSituationCallback(year);
    }
  };

  const handlePersonalisedCompensation = (month, net) => {
    if (legalStatus.social_security_scheme !== 'Régime général de la sécurité sociale') {
      return computeNetCompensation(selectedYear);
    }
    return computeNetMonthlyCompensation(selectedYear, month, net);
  };

  const directorPercentageExceeded = (addOwner) => {
    const currentPercent = work.directors.reduce((acc, director) => {
      acc += Number.isNaN(parseInt(director.percentage_equity_capital, 10))
        ? 0
        : parseInt(director.percentage_equity_capital, 10);
      return acc;
    }, 0);
    return parseInt(addOwner + currentPercent, 10) > 100;
  };

  const addDirectorPercentage = (event) => {
    const { value } = event.target;
    const percent = parseInt(value.replace(/\D/, ''), 10);
    const v = Number.isNaN(percent) ? 0 : percent;
    const pV = v > 100 ? v % 100 : v;
    if (directorPercentageExceeded(pV)) {
      setExceededPercentage(true);
      return;
    }
    setExceededPercentage(false);
    setFieldValue('percentage_equity_capital', pV.toString());
  };

  useEffect(() => {
    if (values.net_compensation_year_1 !== '' && values.compensation_partition === 'Mensuelle') {
      handleCompensation('year_1');
    }
  }, [values.net_compensation_year_1]);

  useEffect(() => {
    if (values.net_compensation_year_2 !== '' && values.compensation_partition === 'Mensuelle') {
      handleCompensation('year_2');
    }
  }, [values.net_compensation_year_2]);

  useEffect(() => {
    if (values.net_compensation_year_3 !== '' && values.compensation_partition === 'Mensuelle') {
      handleCompensation('year_3');
    }
  }, [values.net_compensation_year_3]);

  useEffect(() => {
    if (values.director_acre !== '') {
      setMissingAcre(false);
    }
  }, [values.director_acre]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {exceededPercentage && (
            <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color="error">
              <p> Pourcentage de participation au capital ne peut pas dépasser 100</p>
            </Label>
          )}
          {dependenciesNotSatisfied && (
            <Grid item xs={12} md={12}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color="warning">
                    <p>
                      Pour compléter cette partie, vous devez renseigner le statut juridique de votre entreprise .Sans
                      cette information, nous ne pouvons pas calculer les cotisations sociales du chef d'entreprise.
                    </p>
                  </Label>
                </Card>
              </Stack>
            </Grid>
          )}
          {!dependenciesNotSatisfied && (
            <>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Nom du dirigeant"
                        {...getFieldProps('last_name')}
                        error={Boolean(touched.last_name && errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                      />
                    </Stack>
                  </Card>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Prénom du dirigeant"
                        {...getFieldProps('first_name')}
                        error={Boolean(touched.first_name && errors.first_name)}
                        helperText={touched.first_name && errors.first_name}
                      />
                    </Stack>
                  </Card>
                  {percentageEquitycapitalRequired && (
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          placeholder="0.00"
                          label="Pourcentage de participation au capital (en %)"
                          {...getFieldProps('percentage_equity_capital')}
                          type="number"
                          error={Boolean(touched.percentage_equity_capital && errors.percentage_equity_capital)}
                          helperText={touched.percentage_equity_capital && errors.percentage_equity_capital}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            type: 'number'
                          }}
                          onChange={(e) => {
                            setFieldValue('percentage_equity_capital', e.target.value.replace(/\D/, ''));
                            addDirectorPercentage(e);
                          }}
                        />
                      </Stack>
                    </Card>
                  )}
                  {!individuelle && (
                    <>
                      {missingAcre && (
                        <Box sx={{ p: 1 }}>
                          <Label
                            variant="filled"
                            color="error"
                            sx={{ overflowWrap: 'break-word', display: 'inline', whiteSpace: 'break-spaces' }}
                          >
                            L'ACRE est obligatoire pour faire le calcul : Montant des cotisations sociales
                          </Label>
                        </Box>
                      )}
                      <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                          <TextField
                            select
                            fullWidth
                            label=" Le dirigeant bénéficie-t-il de l'ACRE ?"
                            error={Boolean(touched.director_acre && errors.director_acre)}
                            helperText={touched.director_acre && errors.director_acre}
                            value={values.director_acre}
                            onChange={(event) => {
                              event.preventDefault();
                              setFieldValue('director_acre', event.target.value);
                            }}
                          >
                            {DIRECTOR_ACRE.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                          <InformationBox>
                            <p>
                              L'<b>ACRE</b>, Aide à la Création et à la Reprise d'Entreprise, consiste en une
                              exonération partielle de charges sociales en début d'activité (les 12 premiers mois). Vous
                              êtes éligible à l'ACRE si vous créez ou reprenez une activité économique industrielle,
                              commerciale, artisanale, agricole ou libérale, sous forme d'entreprise individuelle ou de
                              société, à condition d'en exercer effectivement le contrôle.
                            </p>
                            <p>
                              Pour plus d'informations à propos de cette aide :{' '}
                              <a
                                href="https://www.service-public.fr/particuliers/vosdroits/F11677"
                                target="_blank"
                                rel="noreferrer"
                              >
                                L'ACRE
                              </a>{' '}
                              (source : service-public.fr)
                            </p>
                          </InformationBox>
                        </Stack>
                      </Card>
                    </>
                  )}
                  <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                      <TextField
                        select
                        fullWidth
                        label={
                          individuelle
                            ? "Répartition des prélèvements sur l'année"
                            : "Répartition de la rémunération sur l'année"
                        }
                        error={Boolean(touched.compensation_partition && errors.compensation_partition)}
                        helperText={touched.compensation_partition && errors.compensation_partition}
                        value={values.compensation_partition}
                        onChange={(event) => {
                          event.preventDefault();
                          setFieldValue('compensation_partition', event.target.value);
                        }}
                      >
                        {COMPENSATION_PARTITIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Card>
                  </Stack>
                  <Stack spacing={3}>
                    {values.compensation_partition === 'Mensuelle' && (
                      <>
                        {['année 1', 'année 2', 'année 3'].map((year, i) => (
                          <Card sx={{ p: 3 }} key={`${year}--${i}`}>
                            <TextField
                              fullWidth
                              placeholder="0.00"
                              label={`Montant des rémunérations nettes en ${year} (en euros)`}
                              {...getFieldProps(`net_compensation_year_${i + 1}`)}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                type: 'number'
                              }}
                              error={Boolean(
                                touched[`net_compensation_year_${i + 1}`] && errors[`net_compensation_year_${i + 1}`]
                              )}
                              helperText={
                                touched[`net_compensation_year_${i + 1}`] && errors[`net_compensation_year_${i + 1}`]
                              }
                              onChange={(e) => {
                                setFieldValue(`net_compensation_year_${i + 1}`, e.target.value.replace(/\D/, ''));
                              }}
                            />
                          </Card>
                        ))}
                      </>
                    )}
                    {values.compensation_partition === 'Personnalisée' && (
                      <>
                        <ButtonGroup fullWidth size="large" variant="contained">
                          {['année 1', 'année 2', 'année 3'].map((year, i) => (
                            <Button
                              key={`btn-${year}-${i}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedYear(`year_${i + 1}`);
                              }}
                            >
                              {year}
                            </Button>
                          ))}
                        </ButtonGroup>
                        <>
                          {MONTHS.map((month) => (
                            <TextField
                              key={`${selectedYear}-month-${month}`}
                              fullWidth
                              placeholder="0.00"
                              label={`Montant Mois ${month}`}
                              {...getFieldProps(values[`${selectedYear}`][`month_${month}_amount`])}
                              value={values[`${selectedYear}`][`month_${month}_amount`]}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                type: 'number'
                              }}
                              name={`${selectedYear}.month_${month}_amount`}
                              onChange={(e) => {
                                setFieldValue(
                                  `${selectedYear}.month_${month}_amount`,
                                  e.target.value.replace(/\D/, '')
                                );
                                handlePersonalisedCompensation(month, e.target.value.replace(/\D/, ''));
                              }}
                            />
                          ))}
                        </>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack spacing={3}>
                  {legalStatus.social_security_scheme === 'Régime général de la sécurité sociale' &&
                    values.compensation_partition === 'Personnalisée' && (
                      <>
                        {MONTHS.map((month) => (
                          <React.Fragment key={`${selectedYear}-month-${month}-cotisations`}>
                            {!loadingPersonalisedMonthlySSC[`month_${month}`] && (
                              <TextField
                                fullWidth
                                disabled
                                label={`Montant des cotisations sociales en Mois ${month}`}
                                {...getFieldProps(values[`${selectedYear}_cotisation`][`month_${month}_cotisation`])}
                                value={values[`${selectedYear}_cotisation`][`month_${month}_cotisation`]}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                  type: 'number'
                                }}
                                name={`${selectedYear}_cotisation.month_${month}_cotisation`}
                              />
                            )}
                            {isCreator && loadingPersonalisedMonthlySSC[`month_${month}`] && (
                              <LoadingButton
                                loading
                                loadingPosition="start"
                                startIcon={<AlarmIcon />}
                                variant="outlined"
                              >
                                loading
                              </LoadingButton>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      {displayComputeContributions && (
                        <>
                          {['année 1', 'année 2', 'année 3'].map((year, i) => (
                            <Card sx={{ p: 3 }} key={`${year}--${i}-cotisation`}>
                              {isCreator && loadingYear[`year_${i + 1}`] && (
                                <LoadingButton
                                  loading
                                  loadingPosition="start"
                                  startIcon={<AlarmIcon />}
                                  variant="outlined"
                                >
                                  loading
                                </LoadingButton>
                              )}
                              {!loadingYear[`year_${i + 1}`] && (
                                <TextField
                                  disabled
                                  fullWidth
                                  label={`Montant des cotisations sociales en ${year} (en euros)`}
                                  {...getFieldProps(`cotisations_sociales_year_${i + 1}`)}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    type: 'number'
                                  }}
                                  error={Boolean(
                                    touched[`cotisations_sociales_year_${i + 1}`] &&
                                      errors[`cotisations_sociales_year_${i + 1}`]
                                  )}
                                  helperText={
                                    touched[`cotisations_sociales_year_${i + 1}`] &&
                                    errors[`cotisations_sociales_year_${i + 1}`]
                                  }
                                />
                              )}
                            </Card>
                          ))}
                        </>
                      )}
                    </Stack>
                  </Card>
                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      type="button"
                      color="inherit"
                      variant="outlined"
                      size="large"
                      onClick={() => setListDirectors(true)}
                      sx={{ mr: 1.5 }}
                      disabled={computingCotisation}
                    >
                      Retour
                    </Button>
                    {isCreator && !exceededPercentage && (
                      <LoadingButton
                        disabled={computingCotisation}
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                      >
                        {!isEdit ? 'Enregistrer' : 'Enregistrer les modifications'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Form>
    </FormikProvider>
  );
}
