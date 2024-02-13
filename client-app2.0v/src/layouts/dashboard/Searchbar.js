import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled, alpha } from '@mui/material/styles';
import { Box, Input, Slide, Button, InputAdornment, ClickAwayListener } from '@mui/material';
// components
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

// const APPBAR_MOBILE = 64;
// const APPBAR_DESKTOP = 92;
const APPBAR_MOBILE = 48;
const APPBAR_DESKTOP = 48;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  // zIndex: 99,
  width: '100%',
  display: 'flex',
  // position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  // padding: theme.spacing(0, 3),
  // boxShadow: theme.customShadows.z8,
  // backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  },
  backgroundColor: '#f1f3f4',
  border: '1px solid #80868b',
  borderRadius: '4px',
  marginTop: '1px'
}));

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  query: PropTypes.string
};

export default function Searchbar({ onSearch, setSearch, query }) {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    // setSearch(true);
  };

  return (
    <SearchbarStyle>
      <Input
        autoFocus
        fullWidth
        disableUnderline
        placeholder="Recherche par titre..."
        onChange={onSearch}
        value={query}
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
        sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
      />
      <Button variant="contained" onClick={handleClose}>
        Rechercher
      </Button>
    </SearchbarStyle>
  );
}
