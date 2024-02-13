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
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import FlagIcon from '@mui/icons-material/Flag';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { varScaleOutX } from '../../../animate';
import { MIconButton } from '../../../@material-extend';
import useInquistWebSocket from '../../../../hooks/useInquistWebSocket';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const flagGuidelines = [
  {
    primary: 'Il contient du harcèlement, du sectarisme ou des abus.',
    secondary: 'Ce commentaire attaque une personne ou un groupe.'
  },
  {
    primary: "C'est hostile ou méchant.",
    secondary: 'Ce commentaire est grossier ou condescendant.'
  },
  {
    primary: "Ce n'est plus nécessaire.",
    secondary: "Ce commentaire est obsolète, conversationnel ou n'est pas pertinent par rapport à ce message."
  },
  {
    primary: 'Autre chose.',
    secondary: "Un problème non répertorié ci-dessus. Essayez d'être aussi précis que possible."
  }
];
// ----------------------------------------------------------------------
InquisitePostCommentFlag.propTypes = {
  comment: PropTypes.object.isRequired
};

export default function InquisitePostCommentFlag({ comment, ...other }) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { flagComment, retractFlagComment } = useInquistWebSocket();
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
      retractFlagComment({
        aggregate_id: comment.id,
        reason: checked,
        details: flagDetails
      });
      enqueueSnackbar('signal supprimé', { variant: 'success' });
      setAlreadyFlaged(false);
      setFlagDetails('');
      setChecked(null);
      handleClose();
      return;
    }
    flagComment({
      aggregate_id: comment.id,
      reason: checked,
      details: flagDetails
    });
    enqueueSnackbar('le commentaire a été signalé avec succès', { variant: 'success' });
    setAlreadyFlaged(true);
    handleClose();
  };

  useEffect(async () => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/comments/${comment.id}/flags`);
      const flags = response.data;
      if (flags && flags.length > 0) {
        const flag = flags[0];
        setChecked(flag.reason);
        setAlreadyFlaged(true);
        if (flag.reason === 'Autre chose.') {
          setFlagDetails(flag.details);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Box display="flex">
      <Tooltip title="signaler ce commentaire">
        <MIconButton onClick={handleClickOpen}>
          <FlagIcon />
        </MIconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Pourquoi signalez-vous ce commentaire ?</DialogTitle>
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
          {checked === 'Autre chose.' && (
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
            <Button onClick={handleFlag} disabled={(checked === 'Autre chose.' && flagDetails === '') || !checked}>
              {AlreadyFlaged ? 'Se rétracter' : 'Signaler ce commentaire'}
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
