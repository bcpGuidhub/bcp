import PropTypes from 'prop-types';

// material
import { styled } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';

// ----------------------------------------------------------------------
const TitleStyle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: '2.07692308rem'
}));

// ----------------------------------------------------------------------

InquistPostHero.propTypes = {
  post: PropTypes.object.isRequired
};

export default function InquistPostHero({ post, ...other }) {
  const { title } = post;

  return <TitleStyle component="h1">{title}</TitleStyle>;
}
