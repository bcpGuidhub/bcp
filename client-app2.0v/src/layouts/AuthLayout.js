import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// components
import Logo from '../components/Logo';
//
import { MHidden } from '../components/@material-extend';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(2, 5, 2, 7)
  },
  backgroundColor: '#252629'
}));

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default function AuthLayout({ children }) {
  const theme = useTheme();
  return (
    <HeaderStyle>
      <RouterLink to="/" style={{ minWidth: '150px' }}>
        <Box sx={{ position: 'relative', height: 20, width: ' 100%' }}>
          <svg
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 767.5 204"
            style={{ enableBackground: 'new 0 0 767.5 204' }}
            width="100%"
            height="100%"
          >
            <g>
              <g>
                <linearGradient
                  id="SVGID_1_"
                  gradientUnits="userSpaceOnUse"
                  x1="30.7031"
                  y1="171.9365"
                  x2="168.7462"
                  y2="36.627"
                >
                  <stop offset="0" style={{ stopColor: '#00EEE5' }} />
                  <stop offset="1" style={{ stopColor: '#009BFF' }} />
                </linearGradient>
                <circle className="st0" cx="102" cy="102" r="25.5" />
                <g>
                  <linearGradient
                    id="SVGID_00000029028759712535864290000018283397685677551003_"
                    gradientUnits="userSpaceOnUse"
                    x1="67.3554"
                    y1="209.3293"
                    x2="205.3984"
                    y2="74.0197"
                  >
                    <stop offset="0" style={{ stopColor: '#00EEE5' }} />
                    <stop offset="1" style={{ stopColor: '#009BFF' }} />
                  </linearGradient>

                  <ellipse
                    style={{ fill: 'url(#SVGID_00000029028759712535864290000018283397685677551003_)' }}
                    cx="102"
                    cy="175.3"
                    rx="57.4"
                    ry="28.7"
                  />
                </g>
                <g>
                  <linearGradient
                    id="SVGID_00000113336801366750655030000018027897747769387924_"
                    gradientUnits="userSpaceOnUse"
                    x1="-5.9597"
                    y1="134.533"
                    x2="132.0833"
                    y2="-0.7765"
                  >
                    <stop offset="0" style={{ stopColor: '#00EEE5' }} />
                    <stop offset="1" style={{ stopColor: '#009BFF' }} />
                  </linearGradient>

                  <ellipse
                    style={{ fill: 'url(#SVGID_00000113336801366750655030000018027897747769387924_)' }}
                    cx="102"
                    cy="28.7"
                    rx="57.4"
                    ry="28.7"
                  />
                </g>
                <g>
                  <linearGradient
                    id="SVGID_00000096021167660022664560000012000153367589537678_"
                    gradientUnits="userSpaceOnUse"
                    x1="66.6227"
                    y1="208.5818"
                    x2="204.6658"
                    y2="73.2722"
                  >
                    <stop offset="0" style={{ stopColor: '#00EEE5' }} />
                    <stop offset="1" style={{ stopColor: '#009BFF' }} />
                  </linearGradient>

                  <ellipse
                    style={{ fill: 'url(#SVGID_00000096021167660022664560000012000153367589537678_)' }}
                    cx="175.3"
                    cy="102"
                    rx="28.7"
                    ry="57.4"
                  />
                </g>
                <g>
                  <linearGradient
                    id="SVGID_00000124142114105096029190000015466222143038581668_"
                    gradientUnits="userSpaceOnUse"
                    x1="-5.2406"
                    y1="135.2667"
                    x2="132.8025"
                    y2="-4.285006e-02"
                  >
                    <stop offset="0" style={{ stopColor: '#00EEE5' }} />
                    <stop offset="1" style={{ stopColor: '#009BFF' }} />
                  </linearGradient>

                  <ellipse
                    style={{ fill: 'url(#SVGID_00000124142114105096029190000015466222143038581668_)' }}
                    cx="28.7"
                    cy="102"
                    rx="28.7"
                    ry="57.4"
                  />
                </g>
              </g>
              <g style={{ fill: '#fff' }}>
                <g>
                  <path
                    className="st5"
                    d="M348.9,95.5c0.2,2.9,0.4,5.3,0.4,7.2c0,12.4-4,22.7-11.9,30.9s-18,12.3-30.3,12.3
				c-12.4,0-22.9-4.2-31.4-12.5c-8.5-8.3-12.8-18.6-12.8-30.9c0-12.2,4.2-22.4,12.6-30.8c8.4-8.4,18.8-12.6,31-12.6
				c9.2,0,17.4,2.1,24.7,6.4c7.3,4.3,12.4,10.5,15.3,18.6l-15.1,5.3c-5-9.7-13.3-14.5-24.8-14.5c-7.4,0-13.7,2.6-18.8,7.9
				s-7.7,11.8-7.7,19.6c0,7.9,2.6,14.4,7.9,19.7c5.3,5.3,11.8,7.9,19.6,7.9c6.3,0,11.7-1.7,16.1-5.1c4.5-3.4,7.4-8.1,8.8-14.1h-29.1
				V95.5H348.9z"
                  />
                  <path
                    className="st5"
                    d="M422.2,144h-16.4v-5.6c-5,5-11.4,7.4-19.5,7.4c-7.4,0-13.4-2.4-18-7.3c-4.5-4.8-6.8-11.1-6.8-18.8V82.1h16.4
				v34.2c0,4.4,1.1,7.9,3.4,10.5c2.3,2.6,5.3,4,9.1,4c10.3,0,15.4-7.1,15.4-21.3V82.1h16.4V144z"
                  />
                  <path
                    className="st5"
                    d="M453.7,56.8c1.9,1.9,2.9,4.2,2.9,6.9c0,2.7-1,5-2.9,6.8s-4.3,2.7-7.1,2.7c-2.9,0-5.3-0.9-7.1-2.7
				c-1.9-1.8-2.8-4.1-2.8-6.8c0-2.6,1-4.9,2.9-6.9s4.3-2.9,7.1-2.9C449.5,53.9,451.8,54.8,453.7,56.8z M438.5,144V82.1h16.4V144
				H438.5z"
                  />
                  <path
                    className="st5"
                    d="M533.8,144h-16.4v-4.8c-5.5,4.5-12.4,6.7-20.5,6.7c-8.2,0-15.3-3.1-21.3-9.3c-6-6.2-9.1-14-9.1-23.4
				c0-9.4,3-17.3,9.1-23.5c6.1-6.2,13.2-9.4,21.3-9.4c8.2,0,15,2.3,20.5,6.8V54.7h16.4V144z M512.1,126.5c3.6-3.4,5.3-7.9,5.3-13.3
				c0-5.5-1.8-9.9-5.3-13.4c-3.6-3.5-7.6-5.2-12.3-5.2c-5,0-9.2,1.7-12.5,5.1c-3.3,3.4-4.9,7.9-4.9,13.5c0,5.6,1.6,10.1,4.9,13.5
				c3.3,3.3,7.4,5,12.5,5C504.4,131.6,508.5,129.9,512.1,126.5z"
                  />
                  <path
                    className="st5"
                    d="M603.4,87.5c4.5,4.8,6.8,11.1,6.8,18.8V144h-16.4v-34.2c0-4.4-1.1-7.9-3.4-10.5c-2.3-2.6-5.3-4-9.1-4
				c-10.2,0-15.4,7.1-15.4,21.3V144h-16.4V54.7H566v33c5-5,11.4-7.4,19.5-7.4C592.9,80.3,598.9,82.7,603.4,87.5z"
                  />
                  <path
                    className="st5"
                    d="M684.6,144h-16.4v-5.6c-5,5-11.4,7.4-19.5,7.4c-7.4,0-13.4-2.4-18-7.3c-4.5-4.8-6.8-11.1-6.8-18.8V82.1h16.4
				v34.2c0,4.4,1.1,7.9,3.4,10.5c2.3,2.6,5.3,4,9.1,4c10.2,0,15.4-7.1,15.4-21.3V82.1h16.4V144z"
                  />
                  <path
                    className="st5"
                    d="M758.4,89.6c6.1,6.2,9.1,14.1,9.1,23.5c0,9.4-3,17.2-9.1,23.4c-6,6.2-13.1,9.3-21.3,9.3
				c-8.1,0-14.9-2.2-20.5-6.7v4.8h-16.4V54.7h16.4v32.4c5.5-4.5,12.3-6.8,20.5-6.8C745.3,80.3,752.3,83.4,758.4,89.6z M746.8,126.6
				c3.3-3.3,4.9-7.8,4.9-13.5c0-5.6-1.6-10.1-4.9-13.5c-3.3-3.4-7.4-5.1-12.5-5.1c-4.6,0-8.7,1.7-12.3,5.2
				c-3.6,3.5-5.3,7.9-5.3,13.4c0,5.5,1.8,9.9,5.3,13.3c3.6,3.4,7.6,5.1,12.3,5.1C739.3,131.6,743.5,129.9,746.8,126.6z"
                  />
                </g>
              </g>
            </g>
          </svg>
          <Typography
            sx={{
              position: 'absolute',
              top: '-11px',
              right: '6px',
              fontSize: '.6rem',
              border: 'solid',
              padding: '3px',
              borderRadius: '5px',
              color: '#fff'
            }}
          >
            Beta
          </Typography>
        </Box>
      </RouterLink>

      <MHidden width="smDown">
        <Box
          sx={{
            // mt: { md: -2 }
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      </MHidden>
      <MHidden width="smUp">
        <Box
          sx={{
            // mt: { md: -2 }
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column'
            }
          }}
        >
          {children}
        </Box>
      </MHidden>
    </HeaderStyle>
  );
}
