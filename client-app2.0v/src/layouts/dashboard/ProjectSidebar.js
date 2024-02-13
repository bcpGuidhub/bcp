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
  TextField,
  Toolbar
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
import NavSectionProject from '../../components/NavSectionProject';
import Scrollbar from '../../components/Scrollbar';
import SvgIconStyle from '../../components/SvgIconStyle';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import { useSelector } from '../../redux/store';
//
import { sidebarProjectDisplay } from './SidebarSolutionsDisplay';
import SelectProject from './SelectProject';
import API from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

// const DRAWER_WIDTH = 280;
const DRAWER_WIDTH = 255;
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

export default function ProjectSidebar() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { accountType } = useAuth();
  const { pathname } = useLocation();
  const { account, projects } = useSelector((state) => state.user);
  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave,
    onMenuFillClick,
    setOnMenuFillClick
  } = useCollapseDrawer();
  const handleOnCloseMenuClick = () => {
    setOnMenuFillClick(false);
  };

  const show = pathname !== '/project/finance/aid';
  // useEffect(() => {
  //   if (isOpenSidebar) {
  //     onCloseSidebar();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

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
      <Toolbar />
      <NavSectionProject navConfig={sidebarProjectDisplay} isShow={!isCollapse} />
    </Scrollbar>
  );

  return show ? (
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
          open={onMenuFillClick}
          onClose={handleOnCloseMenuClick}
          PaperProps={{
            sx: {
              left: '76px',
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
              left: '76px',
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
  ) : null;
}
