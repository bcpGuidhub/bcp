import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  CardActionArea,
  Tooltip,
  Divider,
  Chip,
  Fab,
  useMediaQuery,
  Badge
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// components
import { MHidden } from '../../components/@material-extend';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import SelectProject from './SelectProject';
import Searchbar from './Searchbar';
import ContactsPopover from './ContactsPopover';
import LanguagePopover from './LanguagePopover';
import Logo from '../../components/Logo';
import SearchBarMobile from './SearchBarMobile';
import SelectProjectMobile from './SelectProjectMobile';
import { useSelector } from '../../redux/store';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

// const APPBAR_MOBILE = 64;
const APPBAR_MOBILE = 54;
// const APPBAR_DESKTOP = 92;
const APPBAR_DESKTOP = 54;

const RootStyle = styled(AppBar)(({ theme }) => ({
  zIndex: 1300,
  height: '54px',
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: '#D8E9E7'
  // [theme.breakpoints.up('lg')]: {
  //   width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  // }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: `${APPBAR_DESKTOP}px !important`,
  borderBottom: '1px solid #dadce0',

  maxHeight: `${APPBAR_DESKTOP}px !important`,
  justifyContent: 'space-between'
}));

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
          marginRight: 4,
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
// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const onProjectSearch = () => {};

  const { projects } = useSelector((state) => state.user);
  const { work } = useSelector((state) => state.project);

  return (
    <RootStyle
    // sx={{
    //   ...(isCollapse &&
    //     {
    //       width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
    //     })
    // }}
    >
      <ToolbarStyle>
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '80vw',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ width: '26vw', flex: '1 0 auto', display: 'flex', alignItems: 'center' }}>
            <MHidden width="lgDown">
              <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
              <Divider orientation="vertical" sx={{ mr: '10px', width: 2, height: 54, borderColor: '#80868b' }} />
            </MHidden>
            <MHidden width="lgUp" style={{ marginRight: '40px', marginTop: '1px' }}>
              <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Icon icon={menu2Fill} />
              </IconButton>
            </MHidden>
            <Box
              sx={{
                minWidth: '150px',
                // backgroundColor: '#f1f3f4',
                // border: '1px solid #80868b',
                // borderRadius: '4px',
                marginTop: '1px',
                marginRight: '10px !important',
                // padding: '4px 4px',
                display: 'inline-flex'
              }}
              component={RouterLink}
              to={PATH_DASHBOARD.hub.root}
            >
              <Logo />
            </Box>
            {/* {!work.id && (
              <>
                <MHidden width="lgDown">
                  <SelectProject projects={projects} />
                </MHidden>
                <MHidden width="lgUp">
                  <SelectProjectMobile projects={projects} />
                </MHidden>
              </>
            )} */}
            {/* {work.id && (
              <>
                <Chip
                  label={isMobile ? `${work.project_name.substring(0, 5)}...` : work.project_name}
                  variant="outlined"
                  color="info"
                  icon={<CorporateFareIcon />}
                />
              </>
            )} */}
            {/* <MHidden width="lgUp">
              <SearchBarMobile />
            </MHidden> */}
          </Box>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Box
            sx={{
              // backgroundColor: '#f1f3f4',
              // border: '1px solid #80868b',
              // borderRadius: '4px',
              marginTop: '1px',
              marginRight: '10px',
              // padding: '4px 4px',
              display: 'inline-flex'
            }}
            component={RouterLink}
            to={PATH_DASHBOARD.hub.root}
          >
            <Badge variant="dot" color="secondary">
              <GroupsIcon sx={{ color: '#252629' }} />
            </Badge>
          </Box>
          <Box
            sx={{
              // backgroundColor: '#f1f3f4',
              // border: '1px solid #80868b',
              // borderRadius: '4px',
              marginTop: '1px',
              marginRight: '10px !important',
              // padding: '4px 4px',
              display: 'inline-flex'
            }}
            component={RouterLink}
            to={PATH_DASHBOARD.inquist.browse}
          >
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              color="secondary"
              badgeContent="?"
            >
              <QuestionAnswerIcon color="primary" />
            </Badge>
          </Box>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
