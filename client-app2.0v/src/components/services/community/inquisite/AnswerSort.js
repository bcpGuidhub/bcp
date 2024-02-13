import { Icon } from '@iconify/react';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';

import { sortByAnswers } from '../../../../redux/slices/inquisite';
// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'scoredesc', label: 'Highest score (default)' },
  { value: 'trending', label: 'Trending (recent votes count more)' },
  { value: 'modifieddesc', label: 'Date modified (newest first)' },
  { value: 'createdasc', label: 'Date created (oldest first)' }
];

function renderLabel(label) {
  if (label === 'trending') {
    return 'Trending (recent votes count more)';
  }
  if (label === 'modifieddesc') {
    return 'Date modified (newest first)';
  }
  if (label === 'createdasc') {
    return 'Date created (oldest first)';
  }

  return 'Highest score (default)';
}

export default function AnswerSort() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const { sortBy } = useSelector((state) => state.inquist);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    dispatch(sortByAnswers(value));
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {renderLabel(sortBy)}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleSortBy(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
