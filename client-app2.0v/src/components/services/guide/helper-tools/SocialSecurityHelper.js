import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Loader from 'react-loaders';
import { COTISATION_API } from '../../../../utils/axios';
// import { euro } from '../../../../utils/formatNumber';
import { sectorsClasifications } from '../sectorsClasifications';
import { MAvatar } from '../../../@material-extend';
import useAuth from '../../../../hooks/useAuth';

const FieldItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2)
}));
// ----------------------------------------------------------------------

const currency = require('currency.js');

const euro = (value) =>
  currency(value, {
    symbol: '€',
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: ' ',
    decimal: ',',
    precision: 0
  });

// ----------------------------------------------------------------------

function computeCotisationRevenueCompare(data) {
  return new Promise((resolve, reject) =>
    COTISATION_API.post(`cotisations/legal-status`, data)
      .then((response) => {
        const { cotisation } = response.data;
        resolve(cotisation);
      })
      .catch((error) => {
        reject(error);
      })
  );
}

// ----------------------------------------------------------------------

AnnualRevenueNet.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

function AnnualRevenueNet({ values, handleChange }) {
  const handleRevenue = (props) => (event) => {
    handleChange(props, event.target.value);
  };
  return (
    <Grid item xs={12}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box p={1}>
          <Card sx={{ mt: 4, mb: 4, minWidth: 320 }}>
            <CardHeader
              sx={{ p: 2 }}
              title="Revenu net annuel"
              avatar={
                <MAvatar color="primary" aria-label="Revenu net annuel">
                  <Icon icon="mdi:cash-register" />
                </MAvatar>
              }
            />
            <Divider />
            <CardContent>
              <FormControl fullWidth>
                <Input
                  placeholder="Revenu net annuel..."
                  id="standard-adornment-amount"
                  value={values.amount}
                  onChange={handleRevenue('amount')}
                  endAdornment={<InputAdornment position="end">€</InputAdornment>}
                  style={{ textAlign: 'center' }}
                />
              </FormControl>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Grid>
  );
}

// ----------------------------------------------------------------------

EmployeeBenefits.propTypes = {
  cotisationsGeneral: PropTypes.number.isRequired,
  companyCostGeneral: PropTypes.number.isRequired,
  pensionGeneral: PropTypes.number.isRequired,
  dailyAllowanceGeneral: PropTypes.number.isRequired
};

function EmployeeBenefits({ cotisationsGeneral, companyCostGeneral, pensionGeneral, dailyAllowanceGeneral }) {
  return (
    <Grid item xs={12} md={12} lg={5}>
      <Card sx={{ mt: 4, mb: 4, minWidth: 320, minHeight: 520 }}>
        <CardHeader
          sx={{ p: 2 }}
          title="Régime général de la sécurité sociale"
          avatar={
            <MAvatar color="primary" aria-label="Régime général de la sécurité sociale">
              <Icon icon="clarity:employee-group-solid" />
            </MAvatar>
          }
          action={
            <Tooltip
              title="Fonctionnement des cotisations sociales : Déclaration au mois ou au trimestre Paiement effectué avec la
            déclaration"
              placement="top-start"
            >
              <IconButton>
                <Icon icon="uil:folder-info" />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">SAS, SASU et SARL sans gérance majoritaire</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Formes juridiques" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(cotisationsGeneral).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Montant des cotisations sociales" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(companyCostGeneral).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Coût total pour l’entreprise" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(pensionGeneral).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Pension de retraite brute annuelle" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(dailyAllowanceGeneral).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Montant de l'indemnité journalière" />
          </FieldItem>
          <Divider />
        </CardContent>
        <CardActions>
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">Aucun délai de carence</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Couverture accidents du travail" />
          </FieldItem>
        </CardActions>
      </Card>
    </Grid>
  );
}

// ----------------------------------------------------------------------

DirectorBenefits.propTypes = {
  cotisationsSelfEmployed: PropTypes.number.isRequired,
  companyCostSelfEmployed: PropTypes.number.isRequired,
  pensionSelfEmployed: PropTypes.number.isRequired,
  dailyAllowanceSelfEmployed: PropTypes.number.isRequired
};

function DirectorBenefits({
  cotisationsSelfEmployed,
  companyCostSelfEmployed,
  pensionSelfEmployed,
  dailyAllowanceSelfEmployed
}) {
  return (
    <Grid item xs={12} md={12} lg={5}>
      <Card sx={{ mt: 4, mb: 4, minWidth: 320, minHeight: 520 }}>
        <CardHeader
          sx={{ p: 2 }}
          title="Sécurité sociale des indépendants"
          avatar={
            <MAvatar color="primary" aria-label="Sécurité sociale des indépendants">
              <Icon icon="raphael:employee" />
            </MAvatar>
          }
          action={
            <Tooltip
              title="Calcul provisoire et régularisation l'année suivante Paiment au mois ou au trimestre"
              placement="top-start"
            >
              <IconButton>
                <Icon icon="uil:folder-info" />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">EI, EIRL, EURL, SARL avec gérance majoritaire</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Formes juridiques" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(cotisationsSelfEmployed).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Montant des cotisations sociales" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(companyCostSelfEmployed).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Coût total pour l’entreprise" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(pensionSelfEmployed).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Pension de retraite brute annuelle" />
          </FieldItem>
          <Divider />
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">{euro(dailyAllowanceSelfEmployed).format()}</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Montant de l'indemnité journalière" />
          </FieldItem>
          <Divider />
        </CardContent>
        <CardActions>
          <FieldItem
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'column' },
              '& .MuiListItemSecondaryAction-root': {
                position: { xs: 'static', md: 'static', sm: 'static' },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              },
              '& .MuiListItemText-root': {
                mb: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                },
                mt: {
                  xs: '14px',
                  md: '14px',
                  sm: '14px'
                }
              }
            }}
            secondaryAction={<Typography variant="subtitle1">Délai de carence de 3 jours</Typography>}
          >
            <ListItemIcon>
              <Icon icon="ph:info-thin" />
            </ListItemIcon>
            <ListItemText primary="Couverture accidents du travail" />
          </FieldItem>
        </CardActions>
      </Card>
    </Grid>
  );
}

// ----------------------------------------------------------------------

SocialSecurrityHelper.propTypes = {
  sector: PropTypes.string.isRequired
};
export default function SocialSecurrityHelper({ sector }) {
  const { accountType } = useAuth();
  const isCreator = accountType !== 'stakeholder';
  const [values, setValues] = useState({
    amount: ''
  });
  const [loader, setLoader] = useState(false);
  const [cotisationsGeneral, setCotisationsGeneral] = useState(0);
  const [companyCostGeneral, setCompanyCostGeneral] = useState(0);
  const [pensionGeneral, setPensionGeneral] = useState(0);
  const [dailyAllowanceGeneral, setDailyAllowanceGeneral] = useState(0);

  const [cotisationsSelfEmployed, setCotisationsSelfEmployed] = useState(0);
  const [companyCostSelfEmployed, setCompanyCostSelfEmployed] = useState(0);
  const [pensionSelfEmployed, setPensionSelfEmployed] = useState(0);
  const [dailyAllowanceSelfEmployed, setDailyAllowanceSelfEmployed] = useState(0);

  const debouncedCotisationApi = useMemo(
    () =>
      debounce((val) => {
        const computeCotisation = (v) => {
          const options = {
            sector: Object.keys(sectorsClasifications).find((key) => sectorsClasifications[key].includes(sector)),
            net: v
          };
          computeCotisationRevenueCompare(options)
            .then((c) => {
              setCotisationsGeneral(c.general);
              setCompanyCostGeneral(c.general + v);
              setCotisationsSelfEmployed(c.self_employed);
              setCompanyCostSelfEmployed(c.self_employed + v);
              setPensionGeneral(c.pension_general);
              setDailyAllowanceGeneral(c.daily_allowance_general);
              setPensionSelfEmployed(c.pension_self_employed);
              setDailyAllowanceSelfEmployed(c.daily_allowance_self_employed);
              setLoader(false);
            })
            .catch((error) => {
              setLoader(false);
            });
        };
        computeCotisation(val);
      }, 750),
    [sector]
  );

  const handleChange = (field, value) => {
    const c = Number.isNaN(parseInt(value.replace(/\D/, ''), 10)) ? 0 : parseInt(value.replace(/\D/, ''), 10);

    setValues({ ...values, [field]: c });
    if (c > 0) {
      setLoader(true);
      debouncedCotisationApi(c);
    }
  };

  return (
    <Box sx={{ pt: '112px', backgroundColor: '#D8E9E7' }}>
      <Grid container justifyContent="space-around">
        <AnnualRevenueNet values={values} handleChange={handleChange} />
        <EmployeeBenefits
          cotisationsGeneral={cotisationsGeneral}
          companyCostGeneral={companyCostGeneral}
          pensionGeneral={pensionGeneral}
          dailyAllowanceGeneral={dailyAllowanceGeneral}
        />
        <Grid
          item
          xs={1}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          {loader && (
            <Box sx>
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeatDelay: 1,
                  repeat: Infinity
                }}
              >
                <Icon icon="bi:x-diamond-fill" />
              </motion.div>
            </Box>
          )}
          {!loader && <Icon icon="bi:x-diamond-fill" />}
        </Grid>
        <DirectorBenefits
          cotisationsSelfEmployed={cotisationsSelfEmployed}
          companyCostSelfEmployed={companyCostSelfEmployed}
          pensionSelfEmployed={pensionSelfEmployed}
          dailyAllowanceSelfEmployed={dailyAllowanceSelfEmployed}
        />
      </Grid>
    </Box>
  );
}
