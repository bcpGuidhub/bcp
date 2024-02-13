import { Box, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import Searchbar from '../../../../layouts/dashboard/Searchbar';
import InquistReputation from './InquisiteReputation';

// ----------------------------------------------------------------------

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

const InquistLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));
// ----------------------------------------------------------------------
InquisiteSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  query: PropTypes.string
};

export default function InquisiteSearchBar({ onSearch, setSearch, query }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 4 }}
      divider={<Divider orientation="vertical" flexItem />}
      justifyContent="space-between"
    >
      <Item>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path
            fill="#D8E9E7"
            d="M13 3c3.88 0 7 3.14 7 7c0 2.8-1.63 5.19-4 6.31V21H9v-3H8c-1.11 0-2-.89-2-2v-3H4.5c-.42 0-.66-.5-.42-.81L6 9.66A7.003 7.003 0 0 1 13 3m-2.68 4.39h1.93c.01-.3.1-.53.28-.69a1 1 0 0 1 .66-.23c.31 0 .57.1.75.28c.18.19.26.45.26.75c0 .32-.07.59-.23.82c-.14.23-.35.43-.61.59c-.51.34-.86.64-1.05.91c-.2.26-.31.68-.31 1.18h2c0-.31.04-.56.13-.74c.09-.19.26-.36.51-.52c.45-.24.82-.53 1.11-.93c.29-.4.44-.81.44-1.31c0-.76-.27-1.37-.81-1.82c-.53-.45-1.26-.68-2.19-.68c-.87 0-1.57.2-2.11.59c-.52.41-.78.98-.77 1.77l.01.03M12 14h2v-2h-2v2m1-13C8.41 1 4.61 4.42 4.06 8.9L2.5 11h-.03l-.02.03c-.55.76-.62 1.76-.19 2.59c.36.69 1 1.17 1.74 1.32V16c0 1.85 1.28 3.42 3 3.87V23h11v-5.5c2.5-1.67 4-4.44 4-7.5c0-4.97-4.04-9-9-9Z"
          />
        </svg>
        {/* <Icon icon="mdi:head-question-outline" width={48} height={48} sx={{ fill: '#D8E9E7' }} /> */}
      </Item>
      {/* <Item sx={{ width: '80%' }}>
        <Searchbar onSearch={onSearch} query={query} setSearch={setSearch} />
      </Item> */}
      <Item>
        <InquistReputation />
      </Item>
    </Stack>
  );
}
