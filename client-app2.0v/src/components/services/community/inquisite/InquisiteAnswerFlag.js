import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useInquistWebSocket from '../../../../hooks/useInquistWebSocket';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    color: '#fff',
    background: '#212B36'
  }
});

// ----------------------------------------------------------------------
const flagGuidelines = [
  {
    primary: 'Spam',
    secondary: 'Existe uniquement pour promouvoir un produit ou un service.'
  },
  {
    primary: 'grossier ou injurieux',
    secondary: 'Une personne raisonnable pourrait trouver ce contenu inapproprié pour un discours respectueux.'
  },
  {
    primary: "n'est pas une réponse",
    secondary:
      "Ceci a été publié comme réponse, mais il ne tente pas de répondre à la question. Il devrait éventuellement s'agir d'une modification, d'un commentaire, d'une autre question ou complètement supprimé."
  },
  {
    primary: "nécessitant l'intervention d'un modérateur",
    secondary: "Un problème non répertorié ci-dessus qui nécessite l'action d'un modérateur. Soyez précis et détaillé !"
  }
];
// ----------------------------------------------------------------------
InquisiteAnswerFlag.propTypes = {
  answer: PropTypes.object.isRequired
};

export default function InquisiteAnswerFlag({ answer, ...other }) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { flagAnswer, retractFlagAnswer } = useInquistWebSocket();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(null);
  const [flagDetails, setFlagDetails] = useState('');
  const [AlreadyFlaged, setAlreadyFlaged] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setFlagDetails(event.target.value);
  };

  const handleCheck = (value) => () => {
    setChecked(value);
  };

  const handleFlag = () => {
    if (AlreadyFlaged) {
      retractFlagAnswer({
        aggregate_id: answer.id
      });
      enqueueSnackbar('votre remarque a été retirée', { variant: 'success' });
      setAlreadyFlaged(false);
      setFlagDetails('');
      setChecked(null);
      handleClose();
      return;
    }
    flagAnswer({
      aggregate_id: answer.id,
      reason: checked,
      details: flagDetails
    });
    enqueueSnackbar('la réponse a été signalée', { variant: 'success' });
    setAlreadyFlaged(true);
    handleClose();
  };

  const getFlags = async () => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/answers/${answer.id}/flags`);
      const flags = response.data;
      if (flags && flags.length > 0) {
        const flag = flags[0];
        setChecked(flag.reason);
        setAlreadyFlaged(true);
        if (flag.reason === "nécessitant l'intervention d'un modérateur") {
          setFlagDetails(flag.details);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFlags();
  }, []);

  return (
    <Box display="flex">
      <Button color="info" size="small" onClick={handleClickOpen}>
        Signaler
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Je signale cette question...</DialogTitle>
        <DialogContent>
          <List>
            {flagGuidelines.map((value) => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                <ListItemButton key={value.primary} role={undefined} dense onClick={handleCheck(value.primary)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked === value.primary}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={<Typography sx={{ typography: 'h6' }}>{value.primary}</Typography>}
                    secondary={
                      <Typography sx={{ typography: 'subtitle1', width: '80%' }}>{value.secondary}</Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
          {checked === "nécessitant l'intervention d'un modérateur" && (
            <Box>
              <TextField
                fullWidth
                value={flagDetails}
                onChange={handleChange}
                helperText="Entrez au moins 10 caractères"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-around' }}>
          <Box>
            <Button
              onClick={handleFlag}
              disabled={(checked === "nécessitant l'intervention d'un modérateur" && flagDetails === '') || !checked}
            >
              {AlreadyFlaged ? 'Se rétracter' : 'Signaler'}
            </Button>
            <Button
              autoFocus
              onClick={() => {
                handleClose();
              }}
            >
              Annuler
            </Button>
          </Box>
          <Box>
            <Button disabled>Il vous reste 10 signalements aujourd’hui</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
