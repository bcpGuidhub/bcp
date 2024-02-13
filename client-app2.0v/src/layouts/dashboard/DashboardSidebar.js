import {
  Box,
  Button,
  CardActionArea,
  Drawer,
  Link,
  List,
  Stack,
  Tooltip,
  Typography,
  Divider,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { alpha, styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { matchPath, Link as RouterLink, useLocation } from 'react-router-dom';
import { DocIllustration } from '../../assets';
import { MHidden } from '../../components/@material-extend';
// components
import Logo from '../../components/Logo';
import MyAvatar from '../../components/MyAvatar';
import NavSection from '../../components/NavSection';
import Scrollbar from '../../components/Scrollbar';
import SvgIconStyle from '../../components/SvgIconStyle';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import { useSelector } from '../../redux/store';
//
import sidebarSolutionsDisplay from './SidebarSolutionsDisplay';
import SelectProject from './SelectProject';
import API from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

// const DRAWER_WIDTH = 280;
const DRAWER_WIDTH = 76;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  flexDirection: 'column',
  paddingLeft: 0,
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#D8E9E7'
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    // paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);
// ----------------------------------------------------------------------

IconCollapse.propTypes = {
  onToggleCollapse: PropTypes.func,
  collapseClick: PropTypes.bool
};

function IconCollapse({ onToggleCollapse, collapseClick }) {
  return (
    <Tooltip title="toggle">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '50%',
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          border: 'solid 1px currentColor',
          ...(collapseClick && {
            borderWidth: 2
          })
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            transition: (theme) => theme.transitions.create('all'),
            ...(collapseClick && {
              width: 0,
              height: 0
            })
          }}
        />
      </CardActionArea>
    </Tooltip>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { accountType } = useAuth();
  const { pathname } = useLocation();
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [possibleImprovements, setPossibleImprovements] = useState('');
  const { account, projects } = useSelector((state) => state.user);
  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  const isActiveRoot = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  const activeRootStyle = {
    color: '#D8E9E7',
    fontWeight: 'fontWeightMedium',
    backgroundColor: '#D8E9E7',
    '&:before': { display: 'block', backgroundColor: '#D8E9E7 !important' }
  };

  const handleClick = () => {
    const feedback = {
      question: 'Avez-vous quelque chose à nous dire ?',
      answer: possibleImprovements,
      meta_type: 'bcp',
      label: 'bcp'
    };

    API.post('v1/workstation/user_feedback', feedback)
      .then((response) => {
        enqueueSnackbar('Votre commentaire a été envoyé', { variant: 'success' });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addFeedback = () => setOpenFeedbackDialog(true);
  const handleClose = () => setOpenFeedbackDialog(false);
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* <Stack
        spacing={3}
        sx={{
          mt: 6,
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        {isCollapse ? (
          <MyAvatar sx={{ mx: 'auto', mb: 2 }} />
        ) : (
          <Link underline="none" component={RouterLink} to="#">
            <AccountStyle>
              <MyAvatar />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {account?.first_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {account?.role}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        )}
      </Stack> */}
      {/* <MHidden width="lgUp">
        <SelectProject projects={projects} />
      </MHidden> */}
      <NavSection navConfig={sidebarSolutionsDisplay} isShow={!isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
      <Divider
        sx={{
          mt: '30px',
          mb: '30px'
        }}
      />
      <List disablePadding>
        {/* {!isCollapse && <ListSubheaderStyle>Feedback</ListSubheaderStyle>} */}
        <ListItemStyle component={RouterLink} to="/outils">
          <ListItemIconStyle sx={{ marginRight: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6.206 2.632a10.938 10.938 0 0 0-2.412 0A1.309 1.309 0 0 0 2.64 3.776a10.538 10.538 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0A1.309 1.309 0 0 0 7.36 6.224a10.55 10.55 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.937 10.937 0 0 0-2.412 0A1.309 1.309 0 0 0 9.64 3.776a10.538 10.538 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.55 10.55 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.937 10.937 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.53 10.53 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.55 10.55 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm-14 7a10.938 10.938 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.537 10.537 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.55 10.55 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.937 10.937 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.537 10.537 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.54 10.54 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.937 10.937 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.53 10.53 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.54 10.54 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm-14 7a10.932 10.932 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.537 10.537 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.55 10.55 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.931 10.931 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.537 10.537 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.54 10.54 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Zm7 0a10.931 10.931 0 0 0-2.412 0a1.309 1.309 0 0 0-1.154 1.144a10.53 10.53 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.309 1.309 0 0 0 1.154-1.144a10.54 10.54 0 0 0 0-2.448a1.309 1.309 0 0 0-1.154-1.144Z"
              />
            </svg>
          </ListItemIconStyle>
          <ListItemText
            sx={{
              fontSize: '10px',
              fontWeight: '900',
              marginLeft: '0px',
              // marginTop: '15px',
              marginBottom: '15px',
              color: '#000',
              // typography: 'subtitle1',
              display: 'flex',
              // bgcolor: 'text.disabled',
              transition: (theme) => theme.transitions.create('transform')
            }}
            disableTypography
            primary="Outils"
          />
        </ListItemStyle>
        <ListItemStyle
          component={RouterLink}
          to="/conseils"
          sx={{
            ...(isActiveRoot('') && activeRootStyle)
          }}
        >
          <ListItemIconStyle sx={{ marginRight: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <g fill="none">
                <g clipPath="url(#healthiconsITrainingClassNegative0)">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M48 0H0v48h48V0ZM7 6H6v27h23.387v-2H8V8h27v3h2V6H7Zm32 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm2.03 6.496c-.672-.902-1.7-1.485-2.999-1.485h-6a1.72 1.72 0 0 0-.926.283c-.155.1-.284.212-.376.298a6.286 6.286 0 0 0-.543.602a24.45 24.45 0 0 0-1.08 1.475c-.336.49-.655.978-.898 1.354h-4.177a1.5 1.5 0 0 0 0 3h5c.518 0 1-.267 1.274-.707v-.002l.006-.007l.02-.032l.077-.123a61.361 61.361 0 0 1 .592-.92V40.5a1.5 1.5 0 0 0 2.974.276L35.432 33h.297l1.291 7.747A1.5 1.5 0 0 0 40 40.5v-9.842c.782-.617 1.288-1.517 1.59-2.388a7.64 7.64 0 0 0 .396-2.92c-.06-.964-.326-2.01-.956-2.854Z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="healthiconsITrainingClassNegative0">
                    <path d="M0 0h48v48H0z" />
                  </clipPath>
                </defs>
              </g>
            </svg>
          </ListItemIconStyle>
          <ListItemText
            sx={{
              fontSize: '10px',
              fontWeight: '900',
              marginLeft: '0px',
              // marginTop: '15px',
              marginBottom: '15px',
              color: '#000',
              // typography: 'subtitle1',
              display: 'flex',
              // bgcolor: 'text.disabled',
              transition: (theme) => theme.transitions.create('transform')
            }}
            disableTypography
            primary="Conseils"
          />
        </ListItemStyle>
        <ListItemStyle
          component={RouterLink}
          to=""
          onClick={addFeedback}
          sx={{
            ...(isActiveRoot('') && activeRootStyle)
          }}
        >
          <ListItemIconStyle sx={{ marginRight: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M14.77 12.4c.15.07.32.1.48.1c.33 0 .64-.13.88-.36L18.31 10h.94C20.77 10 22 8.77 22 7.25v-2.5C22 3.23 20.77 2 19.25 2h-4.5C13.23 2 12 3.23 12 4.75v2.5c0 1.26.85 2.32 2 2.65v1.35c0 .5.31.95.77 1.15ZM8 13.5c-1.93 0-3.5-1.57-3.5-3.5S6.07 6.5 8 6.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5ZM8 22c-2.06 0-3.64-.56-4.7-1.67c-1.336-1.404-1.303-3.174-1.3-3.357v-.013C2 15.89 2.9 15 4 15h8c1.1 0 2 .9 2 2l.001.006c.003.127.045 1.91-1.3 3.324C11.64 21.44 10.06 22 8 22Z"
              />
            </svg>
          </ListItemIconStyle>
          <ListItemText
            sx={{
              fontSize: '10px',
              fontWeight: '900',
              marginLeft: '0px',
              // marginTop: '15px',
              marginBottom: '15px',
              color: '#000',
              // typography: 'subtitle1',
              display: 'flex',
              // bgcolor: 'text.disabled',
              transition: (theme) => theme.transitions.create('transform')
            }}
            disableTypography
            primary="Avis"
          />
        </ListItemStyle>
      </List>
    </Scrollbar>
  );

  return (
    <>
      <Dialog open={openFeedbackDialog} onClose={handleClose}>
        <DialogTitle>Avez-vous quelque chose à nous dire ?</DialogTitle>
        <DialogContent>
          <DialogContentText>commentaire, retour d’expérience, suggestion d’amélioration…</DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={4}
            margin="dense"
            id="feedback"
            type="feedback"
            fullWidth
            variant="standard"
            value={possibleImprovements}
            onChange={(e) => setPossibleImprovements(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleClick}>Envoyer</Button>
        </DialogActions>
      </Dialog>
      <RootStyle
        sx={{
          width: {
            lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
          },
          ...(collapseClick && {
            position: 'absolute'
          })
        }}
      >
        <MHidden width="lgUp">
          <Drawer
            open={isOpenSidebar}
            onClose={onCloseSidebar}
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                backdropFilter: 'blur(16px) saturate(180%)',
                // backgroundColor: 'rgba(213, 226, 242, 0.75)'
                backgroundColor: '#D8E9E7'
              }
            }}
          >
            {renderContent}
          </Drawer>
        </MHidden>

        <MHidden width="lgDown">
          <Drawer
            open
            variant="persistent"
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: 'background.default',
                ...(isCollapse && {
                  width: COLLAPSE_WIDTH
                }),
                ...(collapseHover && {
                  borderRight: 0,
                  backdropFilter: 'blur(6px)',
                  boxShadow: (theme) => theme.customShadows.z20,
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
                }),
                backdropFilter: 'blur(16px) saturate(180%)',
                // backgroundColor: 'rgba(213, 226, 242, 0.75)'
                backgroundColor: '#D8E9E7'
              }
            }}
          >
            {renderContent}
          </Drawer>
        </MHidden>
      </RootStyle>
    </>
  );
}
