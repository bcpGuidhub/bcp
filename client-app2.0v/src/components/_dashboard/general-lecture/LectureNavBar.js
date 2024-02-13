// material
import { Box, Card, Stack, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Block } from '../../../pages/components-overview/Block';
// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' },
  minHeight: '80px',
  borderRadius: '0px',
  width: '100%'
};

// ----------------------------------------------------------------------

LectureNavBar.propTypes = {
  categories: PropTypes.array,
  filterByCategory: PropTypes.func
};

export default function LectureNavBar({ categories, filterByCategory }) {
  const [valueScrollable, setValueScrollable] = useState('Tous');

  const handleChangeScrollable = (event, newValue) => {
    setValueScrollable(newValue);
  };

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      <Card title="" sx={style}>
        <Box
          sx={{
            flexGrow: 1,
            width: '100%'
          }}
        >
          <Tabs
            allowScrollButtonsMobile
            value={valueScrollable}
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChangeScrollable}
          >
            {categories.map((category) => (
              <Tab
                key={category}
                label={category}
                value={category}
                onClick={(e) => {
                  filterByCategory(e, category);
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Card>
    </Stack>
  );
}
