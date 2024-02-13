import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';
import { varWrapEnter } from '../../animate';

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  margin: theme.spacing(1),
  textAlign: 'justify',
  padding: theme.spacing(1),
  // lineHeight: useMediaQuery(theme.breakpoints.down('lg')) ? '19px' : '29px',
  lineHeight: '29px',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.5)',
  color: '#fff'
}));
export default function InformationBox({ children, ...other }) {
  const theme = useTheme();
  return (
    <RootStyle
      sx={{
        fontSize: '15px',
        [theme.breakpoints.down('lg')]: {
          fontSize: '1.6vw'
        },
        [theme.breakpoints.down('sm')]: {
          fontSize: '2vw'
        }
      }}
      initial="initial"
      animate="animate"
      variants={varWrapEnter}
      {...other}
    >
      {children}
    </RootStyle>
  );
}
InformationBox.propTypes = {
  children: PropTypes.node
};
