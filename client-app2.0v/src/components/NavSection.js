import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import {
  Typography,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon
} from '@mui/material';
// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { matchPath, NavLink as RouterLink, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  flexDirection: 'column',
  color: '#fff',
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  // paddingLeft: theme.spacing(5),
  // paddingRight: theme.spacing(2.5),
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
  color: '#000',
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
  const { title, path, icon, info, children } = item;
  const isActiveRoot = path ? !!matchPath({ path, end: false }, pathname) : false;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>

          {isShow && (
            <>
              <ListItemText sx={{ color: '#fff', typography: 'subtitle2' }} disableTypography primary={title} />
              {info && info}
              <Box
                component={Icon}
                icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                sx={{ width: 16, height: 16, ml: 1 }}
              />
            </>
          )}
        </ListItemStyle>

        {isShow && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((item) => {
                const { title, path, subheader, items } = item;
                const isActiveSub = path ? !!matchPath({ path, end: false }, pathname) : false;
                if (subheader && items) {
                  return (
                    <List key={subheader} disablePadding>
                      {isShow && <ListSubheaderStyle>{subheader}</ListSubheaderStyle>}
                      {items.map((item) => (
                        <NavItem key={item.title} item={item} isShow={isShow} />
                      ))}
                    </List>
                  );
                }
                return (
                  <ListItemStyle
                    key={title}
                    component={RouterLink}
                    to={path}
                    sx={{
                      ...(isActiveSub && activeSubStyle)
                    }}
                  >
                    <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'text.disabled',
                          transition: (theme) => theme.transitions.create('transform'),
                          ...(isActiveSub && {
                            transform: 'scale(2)',
                            bgcolor: 'primary.main'
                          })
                        }}
                      />
                    </ListItemIconStyle>
                    <ListItemText sx={{ color: '#fff', typography: 'subtitle2' }} disableTypography primary={title} />
                  </ListItemStyle>
                );
              })}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      {isShow && (
        <>
          <ListItemText sx={{ color: '#fff', typography: 'subtitle2' }} disableTypography primary={title} />
          {info && info}
        </>
      )}
    </ListItemStyle>
  );
}

export default function NavSection({ navConfig, isShow = true, ...other }) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };
  return (
    <Box sx={{ pt: 8 }} {...other}>
      {navConfig.map((list) => {
        const { subheader, path, icon } = list;
        const isActiveRoot = path ? !!matchPath({ path, end: false }, pathname) : false;
        return (
          <List key={subheader} disablePadding>
            <ListItemStyle
              component={RouterLink}
              to={path}
              sx={{
                ...(isActiveRoot && activeRootStyle),
                ...((subheader === 'Plateforme Questions Réponses' ||
                  subheader === 'Gestion Projet' ||
                  subheader === 'Le Board Room') && {
                  pb: '80px'
                })
              }}
            >
              <ListItemIconStyle sx={{ marginRight: 0 }}>{icon}</ListItemIconStyle>
              <ListItemText
                sx={{
                  fontSize: '10px',
                  fontWeight: '900',
                  marginLeft: '0px',
                  marginBottom: '15px',
                  color: '#000',
                  display: 'flex',
                  transition: (theme) => theme.transitions.create('transform')
                }}
                disableTypography
                primary={subheader}
              />
            </ListItemStyle>
          </List>
        );
      })}
    </Box>
  );
}
