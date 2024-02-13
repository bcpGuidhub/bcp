import { Box, Grid, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Thumbnail from './Thumbnail';
import Scrollbar from '../../Scrollbar';

const ContainerStyle = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadiusSm,
  border: `solid 1px ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800]
}));

// ----------------------------------------------------------------------

LectureThumbnail.propTypes = {
  lectures: PropTypes.array,
  selectedCategory: PropTypes.string,
  handleClickOpenLecture: PropTypes.func
};

export default function LectureThumbnail({ lectures, selectedCategory, handleClickOpenLecture }) {
  const theme = useTheme();
  return (
    <Box
      sx={
        {
          // pt: 6,
          // pb: 1,
          // mb: 10
        }
      }
    >
      <Scrollbar
        sx={{
          height: 118 * 10
          // [theme.breakpoints.down('sm')]: { height: 44 * 10 }
        }}
      >
        <Grid container spacing={3}>
          {lectures
            .filter((f) => (selectedCategory === 'Tous' ? true : f.category === selectedCategory))
            .map((value, i) => (
              <Grid key={`${value.title}-${i}`} item xs={12} md={3}>
                <Thumbnail handleClickOpenLecture={handleClickOpenLecture} lecture={value} />
              </Grid>
            ))}
        </Grid>
      </Scrollbar>
    </Box>
  );
}
