import Box from '@mui/material/Box';
import { Card, CardContent, Stack, Typography } from '@mui/joy';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import LoadingScreen from '../../LoadingScreen';
import FiscalWidget from '../guide/FiscalWidget';
import LegalWidget from '../guide/LegalWidget';
import NetResult from '../guide/NetResult';
import useSettings from '../../../hooks/useSettings';
import { useSelector } from '../../../redux/store';
import { fNumber } from '../../../utils/formatNumber';

const optionsMixedChart = {
  chart: {
    height: 350,
    type: 'bar',
    stacked: false,
    width: '100%'
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#333']
    }
  },
  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100]
    }
  },
  labels: ['Année 1', 'Année 2', 'Année 3'],
  markers: {
    size: 0
  },
  xaxis: {
    type: 'category',
    labels: {
      style: {
        colors: ['#2578a1', '#fe6113', '#2578a1'],
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 900,
        cssClass: 'apexcharts-xaxis-label'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Montant(€)',
      style: {
        color: '#2578a1',
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 900,
        cssClass: 'apexcharts-xaxis-label'
      }
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (seriesName) => fNumber(seriesName),
      title: {
        formatter: () => ''
      }
    }
  },
  legend: {
    fontSize: '14px',
    fontFamily: 'Helvetica, Arial',
    fontWeight: 700
  },
  title: {
    text: "Résultat / Chiffre d'affaires",
    align: 'center',
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#2578a1'
    }
  }
};

ProjectFinancialForecast.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  netResult: PropTypes.object.isRequired,
  percent: PropTypes.object.isRequired
};

export default function ProjectFinancialForecast({ isLoading, netResult, percent }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { work } = useSelector((state) => state.project);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <Stack spacing={2}>
          {work.project_legal_status &&
            work.project_legal_status.legal_status_idea &&
            work.project_legal_status.tax_system && (
              <Box display="flex" justifyContent="space-evenly">
                <LegalWidget legal={work.project_legal_status.legal_status_idea} />
                <FiscalWidget taxSystem={work.project_legal_status.tax_system} />
              </Box>
            )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
              }
            }}
          >
            {Object.keys(netResult).map((year, i) => (
              <Box key={year} sx={{ m: 1 }}>
                <NetResult year={`Année ${i + 1}`} netResult={netResult[year]} percent={percent[year]} />
              </Box>
            ))}
          </Box>
        </Stack>
      )}
    </>
  );
}
