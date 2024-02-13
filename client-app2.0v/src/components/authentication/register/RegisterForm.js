import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
// material
import {
  Alert,
  Card,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------
const groupedOptions = [
  {
    label: 'Artisanale',
    options: [
      { value: 'Ambulance', label: 'Ambulance', name: 'activity_sector' },
      {
        value: 'Bijouterie - Joaillerie',
        label: 'Bijouterie - Joaillerie',
        name: 'activity_sector'
      },
      {
        value: 'Biscuiterie',
        label: 'Biscuiterie',
        name: 'activity_sector'
      },
      {
        value: 'Boucherie - Charcuterie',
        label: 'Boucherie - Charcuterie',
        name: 'activity_sector'
      },
      {
        value: 'Boulangerie - Pâtisserie',
        label: 'Boulangerie - Pâtisserie',
        name: 'activity_sector'
      },
      { value: 'Caviste', label: 'Caviste', name: 'activity_sector' },
      {
        value: 'Carrosserie',
        label: 'Carrosserie',
        name: 'activity_sector'
      },
      {
        value: 'Carrelage et sols',
        label: 'Carrelage et sols',
        name: 'activity_sector'
      },
      {
        value: 'Chocolaterie - confiserie',
        label: 'Chocolaterie - confiserie',
        name: 'activity_sector'
      },
      {
        value: 'Cordonnerie',
        label: 'Cordonnerie',
        name: 'activity_sector'
      },
      { value: 'Couverture', label: 'Couverture', name: 'activity_sector' },
      { value: 'Cuisiniste', label: 'Cuisiniste', name: 'activity_sector' },
      {
        value: 'Déménagement',
        label: 'Déménagement',
        name: 'activity_sector'
      },
      { value: 'Démolition', label: 'Démolition', name: 'activity_sector' },
      {
        value: 'Ébénisterie',
        label: 'Ébénisterie',
        name: 'activity_sector'
      },
      {
        value: 'Entretien et réparation de véhicules',
        label: 'Entretien et réparation de véhicules',
        name: 'activity_sector'
      },
      {
        value: 'Électricité',
        label: 'Électricité',
        name: 'activity_sector'
      },
      {
        value: 'Fabrication de boissons alcoolisées',
        label: 'Fabrication de boissons alcoolisées',
        name: 'activity_sector'
      },
      {
        value: 'Fabrication de textiles',
        label: 'Fabrication de textiles',
        name: 'activity_sector'
      },
      {
        value: 'Ferronnerie',
        label: 'Ferronnerie',
        name: 'activity_sector'
      },
      { value: 'Fleuriste', label: 'Fleuriste', name: 'activity_sector' },
      { value: 'Fromagerie', label: 'Fromagerie', name: 'activity_sector' },
      {
        value: 'Institut de beauté',
        label: 'Institut de beauté',
        name: 'activity_sector'
      },
      { value: 'Maçonnerie', label: 'Maçonnerie', name: 'activity_sector' },
      { value: 'Menuiserie', label: 'Menuiserie', name: 'activity_sector' },
      { value: 'Paysagiste', label: 'Paysagiste', name: 'activity_sector' },
      {
        value: 'Peinture en bâtiment',
        label: 'Peinture en bâtiment',
        name: 'activity_sector'
      },
      {
        value: 'Plâtrerie - Isolation',
        label: 'Plâtrerie - Isolation',
        name: 'activity_sector'
      },
      {
        value: 'Plomberie-chauffage',
        label: 'Plomberie-chauffage',
        name: 'activity_sector'
      },
      {
        value: 'Poissonnerie',
        label: 'Poissonnerie',
        name: 'activity_sector'
      },
      {
        value: 'Restauration rapide à livrer ou à emporter',
        label: 'Restauration rapide à livrer ou à emporter',
        name: 'activity_sector'
      },
      {
        value: 'Salon de coiffure',
        label: 'Salon de coiffure',
        name: 'activity_sector'
      },
      { value: 'Traiteur', label: 'Traiteur', name: 'activity_sector' },
      {
        value: 'Travaux publics',
        label: 'Travaux publics',
        name: 'activity_sector'
      },
      { value: 'Verrerie', label: 'Verrerie', name: 'activity_sector' },
      {
        value: 'Autre activité artisanale',
        label: 'Autre activité artisanale',
        name: 'activity_sector'
      }
    ]
  },
  {
    label: 'Commerciale ou industrielle',
    options: [
      {
        value: 'Agence de sécurité',
        label: 'Agence de sécurité',
        name: 'activity_sector'
      },
      {
        value: 'Agence de voyage',
        label: 'Agence de voyage',
        name: 'activity_sector'
      },
      {
        value: 'Agent commercial',
        label: 'Agent commercial',
        name: 'activity_sector'
      },
      {
        value: 'Agence immobilière',
        label: 'Agence immobilière',
        name: 'activity_sector'
      },
      {
        value: 'Bar, café, débit de tabac',
        label: 'Bar, café, débit de tabac',
        name: 'activity_sector'
      },
      {
        value: 'Commerce de détail alimentaire',
        label: 'Commerce de détail alimentaire',
        name: 'activity_sector'
      },
      {
        value: 'Commerce de détail non alimentaire',
        label: 'Commerce de détail non alimentaire',
        name: 'activity_sector'
      },
      {
        value: 'Commerce de gros',
        label: 'Commerce de gros',
        name: 'activity_sector'
      },
      {
        value: 'Commerce de véhiculess',
        label: 'Commerce de véhiculess',
        name: 'activity_sector'
      },
      { value: 'Crèche', label: 'Crèche', name: 'activity_sector' },
      {
        value: 'Diagnostic immobilier',
        label: 'Diagnostic immobilier',
        name: 'activity_sector'
      },
      { value: 'E-commerce', label: 'E-commerce', name: 'activity_sector' },
      {
        value: 'Entretien et réparation de véhicules',
        label: 'Entretien et réparation de véhicules',
        name: 'activity_sector'
      },
      {
        value: "Galerie d'art",
        label: "Galerie d'art",
        name: 'activity_sector'
      },
      { value: 'Hôtellerie', label: 'Hôtellerie', name: 'activity_sector' },
      { value: 'Jardinerie', label: 'Jardinerie', name: 'activity_sector' },
      {
        value: "Location d'équipements et de matériels",
        label: "Location d'équipements et de matériels",
        name: 'activity_sector'
      },
      {
        value: 'Optique et lunetterie',
        label: 'Optique et lunetterie',
        name: 'activity_sector'
      },
      {
        value: 'Presse et médias',
        label: 'Presse et médias',
        name: 'activity_sector'
      },
      {
        value: 'Industrie',
        label: 'Industrie',
        name: 'activity_sector'
      },
      {
        value: 'Restauration traditionnelle',
        label: 'Restauration traditionnelle',
        name: 'activity_sector'
      },
      {
        value: 'Restauration rapide sur place',
        label: 'Restauration rapide sur place',
        name: 'activity_sector'
      },
      {
        value: 'Salle de sport - fitness',
        label: 'Salle de sport - fitness',
        name: 'activity_sector'
      },
      {
        value: 'Services administratifs',
        label: 'Services administratifs',
        name: 'activity_sector'
      },
      {
        value: 'Services à la personne',
        label: 'Services à la personne',
        name: 'activity_sector'
      },
      {
        value: 'Spectacle vivant',
        label: 'Spectacle vivant',
        name: 'activity_sector'
      },
      { value: 'Start-up', label: 'Start-up', name: 'activity_sector' },
      { value: 'Taxi', label: 'Taxi', name: 'activity_sector' },
      {
        value: 'Transport léger de marchandises',
        label: 'Transport léger de marchandises',
        name: 'activity_sector'
      },
      {
        value: 'Transport lourd de marchandises',
        label: 'Transport lourd de marchandises',
        name: 'activity_sector'
      },
      { value: 'VTC', label: 'VTC', name: 'activity_sector' },
      {
        value: 'Autre activité commerciale',
        label: 'Autre activité commerciale',
        name: 'activity_sector'
      }
    ]
  },
  {
    label: 'Libérale',
    options: [
      {
        value: 'Agence de communication ou publicité',
        label: 'Agence de communication ou publicité',
        name: 'activity_sector'
      },
      {
        value: 'Agence marketing',
        label: 'Agence marketing',
        name: 'activity_sector'
      },
      {
        value: 'Agence web',
        label: 'Agence web',
        name: 'activity_sector'
      },
      {
        value: "Agent général d'assurance",
        label: "Agent général d'assurance",
        name: 'activity_sector'
      },
      { value: 'Architecte', label: 'Architecte', name: 'activity_sector' },
      {
        value: "Architecte d'intérieur",
        label: "Architecte d'intérieur",
        name: 'activity_sector'
      },
      { value: 'Auto-école', label: 'Auto-école', name: 'activity_sector' },
      { value: 'Avocat', label: 'Avocat', name: 'activity_sector' },
      {
        value: "Bureau d'études",
        label: "Bureau d'études",
        name: 'activity_sector'
      },
      {
        value: 'Cabinet de diététique',
        label: 'Cabinet de diététique',
        name: 'activity_sector'
      },
      {
        value: 'Coach sportif',
        label: 'Coach sportif',
        name: 'activity_sector'
      },
      {
        value: 'Conseil et activités informatiques',
        label: 'Conseil et activités informatiques',
        name: 'activity_sector'
      },
      {
        value: 'Consulting et conseil',
        label: 'Consulting et conseil',
        name: 'activity_sector'
      },
      {
        value: 'Courtage en assurance',
        label: 'Courtage en assurance',
        name: 'activity_sector'
      },
      {
        value: 'Courtage en financement',
        label: 'Courtage en financement',
        name: 'activity_sector'
      },
      { value: 'Designer', label: 'Designer', name: 'activity_sector' },
      {
        value: "Décoration d'intérieur",
        label: "Décoration d'intérieur",
        name: 'activity_sector'
      },
      {
        value: 'Enseignement privé',
        label: 'Enseignement privé',
        name: 'activity_sector'
      },
      { value: 'Formation', label: 'Formation', name: 'activity_sector' },
      {
        value: 'Géomètre-expert',
        label: 'Géomètre-expert',
        name: 'activity_sector'
      },
      { value: 'Graphiste', label: 'Graphiste', name: 'activity_sector' },
      {
        value: 'Kinésithérapie',
        label: 'Kinésithérapie',
        name: 'activity_sector'
      },
      { value: 'Médecine', label: 'Médecine', name: 'activity_sector' },
      {
        value: 'Médecine douce',
        label: 'Médecine douce',
        name: 'activity_sector'
      },
      {
        value: 'Ostéopathie',
        label: 'Ostéopathie',
        name: 'activity_sector'
      },
      { value: 'Pharmacie', label: 'Pharmacie', name: 'activity_sector' },
      {
        value: 'Vétérinaire',
        label: 'Vétérinaire',
        name: 'activity_sector'
      },
      {
        value: 'Autre activité libérale',
        label: 'Autre activité libérale',
        name: 'activity_sector'
      }
    ]
  }
];

export default function RegisterForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Trop court!').max(50, 'Trop long!').required('Le prénom est requis'),
    lastName: Yup.string().min(2, 'Trop court!').max(50, 'Trop long!').required('Nom est requis'),
    email: Yup.string().email("L'e-mail doit être une adresse e-mail valide").required("L'e-mail est requis"),
    password: Yup.string()
      .min(9, 'Trop court!')
      .required('Mot de passe requis')
      .matches(/[@_!#$%^&*()<>?/|}{~:]/, 'Contient au moins un symbole parmi [@_!#$%^&*()<>?/|}{~:]')
      .matches(/\d+/, 'Contient au moins un chiffre 0 à 9')
      .matches(/[a-zA-Z]/, 'Contient au moins une lettre'),
    telephone: Yup.string()
      .min(10, 'Trop court!')
      .max(10, 'Trop long!')
      .matches(phoneRegExp, "Le numéro de téléphone n'est pas valide")
      .required('le numéro de téléphone est requis'),
    rgdp_consent: Yup.bool()
      .oneOf([true], 'Accepter les conditions générales est requis')
      .required('Accepter les conditions générales est requis'),
    cgu_consent: Yup.bool()
      .oneOf([true], 'Accepter les conditions générales est requis')
      .required('Accepter les conditions générales est requis')
    // sector: Yup.string().required("secteur d'activité est requis")
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      telephone: '',
      rgdp_consent: false,
      cgu_consent: false
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await register(
          values.email,
          values.password,
          values.firstName,
          values.lastName,
          values.telephone,
          'Oui',
          values.cgu_consent
        );
        enqueueSnackbar('enregistré avec succès', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        navigate(PATH_AUTH.verify);
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: 'Non autorisé, version bêta restreinte' });
          setSubmitting(false);
        }
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          <Card sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Votre prénom"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />

              <TextField
                fullWidth
                label="Votre nom"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="username"
                type="email"
                label="Votre adresse e-mail"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                autoComplete="telephone"
                type="tel"
                label="Votre téléphone"
                {...getFieldProps('telephone')}
                error={Boolean(touched.telephone && errors.telephone)}
                helperText={touched.telephone && errors.telephone}
                pattern="^(?:0)[1-79](?:[\.\-\s]?\d\d){4}$"
                name="telephone"
              />
              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Mot de passe"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>
          </Card>

          {/* <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label="L'activité de votre future entreprise"
                error={Boolean(touched.sector && errors.sector)}
                helperText={touched.sector && errors.sector}
                value={values.sector}
                onChange={(event) => {
                  event.preventDefault();
                  setFieldValue('sector', event.target.value);
                }}
              >
                {groupedOptions.map((option) => [
                  <ListSubheader key={option.label}>{option.label}</ListSubheader>,
                  option.options.map((opt) => (
                    <MenuItem key={`${option.label}-${opt.value}`} value={opt.value}>
                      {opt.value}
                    </MenuItem>
                  ))
                ])}
              </TextField>
            </Stack>
          </Card> */}
          <Stack>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('rgdp_consent')} name="rgdp_consent" />}
              label="J’accepte la politique de confidentialité."
            />

            {touched.rgdp_consent && errors.rgdp_consent && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.rgdp_consent}
              </FormHelperText>
            )}
          </Stack>
          <Stack>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('cgu_consent')} name="cgu_consent" />}
              label="J'ai lu et j'accepte les conditions générales d'utilisation du
              site."
            />

            {touched.cgu_consent && errors.cgu_consent && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.cgu_consent}
              </FormHelperText>
            )}
          </Stack>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            S'inscrire
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
