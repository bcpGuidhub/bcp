import { useEffect, useState } from 'react';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function Room() {
  const dispatch = useDispatch();

  useEffect(() => {});

  return (
    <Box>
      <Call />
    </Box>
  );
}
