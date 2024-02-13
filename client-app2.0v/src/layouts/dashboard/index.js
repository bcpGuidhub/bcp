import { useEffect, useState } from 'react';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
// material
import { useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import { Box, ListItem, List, ListItemContent, ListItemButton, ListItemDecorator, Link } from '@mui/joy';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';

//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { useSelector } from '../../redux/store';
import useChatWebSocket from '../../hooks/useChatWebSocket';
import useInquistWebSocket from '../../hooks/useInquistWebSocket';
import ProjectSidebar from './ProjectSidebar';

// ----------------------------------------------------------------------

// const APP_BAR_MOBILE = 64;
// const APP_BAR_DESKTOP = 92;
const APP_BAR_MOBILE = 48;
const APP_BAR_DESKTOP = 48;

const RootStyle = styled('div')({
  backgroundColor: '#D8E9E7',
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
  // backgroundColor: '#252629'
  // backdropFilter: 'blur(16px) saturate(180%)',
  // backgroundColor: 'rgba(243, 246, 250, 0.75)',
  // borderRadius: '12px',
  // border: '1px solid rgba(255, 255, 255, 0.125)'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  // backgroundColor: '#252629',
  // backdropFilter: 'blur(16px) saturate(180%)',
  // backgroundColor: 'rgba(243, 246, 250, 0.75)',
  // paddingTop: APP_BAR_MOBILE + 44,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    // paddingTop: 54
    // paddingTop: APP_BAR_DESKTOP + 64,
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2)
  },
  [theme.breakpoints.down('lg')]: {
    // paddingTop: 54
    // paddingTop: APP_BAR_DESKTOP + 64,
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2)
    padding: 0
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick, setOnMenuFillClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { work } = useSelector((state) => state.project);
  const renderProjectSidebar = pathname.split('/').includes('project') && pathname !== '/project/finance/aid';
  const isProjectRequired =
    pathname !== '/project/new' && pathname !== '/project' && pathname.split('/').includes('project');
  const isAppDashboard = pathname === '/outils';
  const { webSocket: activitySectorChatWebsocket, connectToSocket: connectChatWebsocket } = useChatWebSocket();
  const { webSocket: inquisiteQAWebsocket, connectToSocket: connectQAWebsocket } = useInquistWebSocket();
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const handleOnOpenMenuClick = () => {
    setOpen(true);
    setOnMenuFillClick(true);
  };
  const handleOnCloseMenuClick = () => {
    setOpen(false);
    setOnMenuFillClick(false);
  };

  const connectToMessenger = () => {
    if (!activitySectorChatWebsocket) {
      connectChatWebsocket();
    } else if (
      activitySectorChatWebsocket &&
      activitySectorChatWebsocket.readyState !== 0 &&
      activitySectorChatWebsocket.readyState !== 1
    ) {
      connectChatWebsocket();
    }
  };

  const connectToInquist = () => {
    if (!inquisiteQAWebsocket) {
      connectQAWebsocket();
    } else if (inquisiteQAWebsocket && inquisiteQAWebsocket.readyState !== 0 && inquisiteQAWebsocket.readyState !== 1) {
      connectQAWebsocket();
    }
  };

  useEffect(() => {
    if (work.id) {
      connectToMessenger();
      connectToInquist();
    }
  }, [work]);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={handleOnOpenMenuClick} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={handleOnCloseMenuClick} />
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          }),
          ...((renderProjectSidebar || isAppDashboard) &&
            isNotMobile && {
              ml: '255px'
            }),
          backgroundColor: '#D8E9E7'
        }}
      >
        {!work.id && isProjectRequired && (
          <Box>
            <List>
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <InfoIcon />
                  </ListItemDecorator>
                  <ListItemContent>Pour afficher cette page, sélectionnez un projet.</ListItemContent>
                  <Link component={RouterLink} to="/projet">
                    Créer un projet
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
        {(work.id || !isProjectRequired) && <Outlet />}
      </MainStyle>
    </RootStyle>
  );
}
