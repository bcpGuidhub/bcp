import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListSubheader, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.subtitle1,
    fontWeight: '900',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    // paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
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
    backgroundColor: theme.palette.primary.main
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  isShow: PropTypes.bool,
  item: PropTypes.object
};

function NavItem({ item, isShow }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { children } = item;
  const isAppDashboard = pathname === '/outils';
  const activeRootStyle = {
    color: '#3367d6',
    fontWeight: 'bold',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  return (
    <>
      {children.map((item) => {
        const { title, path, icon } = item;
        const isActiveRoot = path ? matchPath({ path, exact: true }, pathname) : false;
        return (
          <ListItemStyle
            component={RouterLink}
            to={path}
            sx={{
              color: '#000',
              ...(isActiveRoot && activeRootStyle),
              padding: '0 8px',
              fontSize: '13px',
              fontWeight: '900'
            }}
          >
            {!isAppDashboard && <ListItemIconStyle>{icon && icon}</ListItemIconStyle>}
            {isShow && (
              <>
                <ListItemText disableTypography primary={title} sx={{ typography: 'subtitle2' }} />
              </>
            )}
          </ListItemStyle>
        );
      })}
    </>
  );
}

NavSectionAppsSidebar.propTypes = {
  isShow: PropTypes.bool,
  navConfig: PropTypes.array
};

export default function NavSectionAppsSidebar({ navConfig, isShow = true, ...other }) {
  const { pathname } = useLocation();
  const isAppDashboard = pathname === '/outils';
  return (
    <Box {...other}>
      {navConfig.map((list) => {
        const { subheader, items } = list;
        return (
          <List key={subheader} disablePadding>
            {isAppDashboard && <ListSubheaderStyle>{subheader}</ListSubheaderStyle>}
            {items.map((item) => (
              <NavItem key={item.title} item={item} isShow={isShow} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
