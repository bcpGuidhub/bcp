import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import Table from '@mui/joy/Table';
import { Sheet } from '@mui/joy';
import { useMediaQuery } from '@mui/material';

const currency = require('currency.js');

const euro = (value) =>
  currency(value, {
    symbol: '€',
    pattern: `# !`,
    negativePattern: `-# !`,
    separator: ' ',
    decimal: ',',
    precision: 0
  });
const useStyles = makeStyles({
  label: {
    'font-weight': 'bold'
  },
  cell: {
    'font-size': '0.8rem',
    '&:first-child': {
      'font-weight': 'bold'
    }
  }
});
const columns = [
  {
    id: 'field',
    label: 'Elément',
    minWidth: 170,
    align: 'left',
    fontSize: '1.2rem',
    color: '#fff',
    background: '#2578a1'
  },
  {
    id: 'general',
    label: 'Micro-entreprise',
    minWidth: 170,
    align: 'center',
    fontSize: '1.2rem',
    color: '#fff',
    background: '#2578a1'
  },
  {
    id: 'self_employed',
    label: 'Régime réel à l’IR',
    minWidth: 170,
    align: 'center',
    fontSize: '1.2rem',
    color: '#fff',
    background: '#2578a1'
  },
  {
    id: 'ecart',
    label: 'Ecart',
    minWidth: 170,
    align: 'center',
    fontSize: '1.2rem',
    color: '#fff',
    background: '#2578a1'
  }
];

MicroReelComparisonTool.propTypes = {
  runningTestSuite: PropTypes.string.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  microReel: PropTypes.object.isRequired,
  sectorPlacement: PropTypes.string.isRequired
};

export default function MicroReelComparisonTool({ runningTestSuite, selectedOptions, microReel, sectorPlacement }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const classes = useStyles();
  const [values, setValues] = useState({
    amount: ''
  });
  const [taxBenefit, setTaxBenefit] = useState({
    year_1: '',
    year_2: '',
    year_3: ''
  });

  useEffect(() => {
    const response1 = selectedOptions[runningTestSuite][0]['Votre activité est imposée dans la catégorie :'];
    const values = {};
    const years = ['year_1', 'year_2', 'year_3'];
    years.forEach((year) => {
      if (sectorPlacement === 'trader') {
        values[year] = 0.29 * microReel.revenue_collected[year];
      }
      if (sectorPlacement === 'serviceProvider' && response1 === 'des BIC') {
        values[year] = 0.5 * microReel.revenue_collected[year];
      }
      if (sectorPlacement === 'serviceProvider' && response1 === 'des BNC') {
        values[year] = 0.66 * microReel.revenue_collected[year];
      }
    });

    setTaxBenefit(values);
  }, [selectedOptions]);

  useEffect(() => {}, [taxBenefit]);

  return (
    <Sheet
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        [theme.breakpoints.down('lg')]: {
          p: 0
        },
        borderRadius: 'sm',
        transition: '0.3s',
        background: (theme) =>
          `linear-gradient(45deg, ${theme.vars.palette.primary[500]}, ${theme.vars.palette.primary[400]})`,
        '& tr:last-child': {
          '& td:first-child': {
            borderBottomLeftRadius: '8px'
          },
          '& td:last-child': {
            borderBottomRightRadius: '8px'
          }
        }
      }}
    >
      <Table>
        <thead>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            {columns.map((column) => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant des cotisations sociales année 1</td>
            <td>{euro(microReel.cotisation_social_year_1).format()}</td>
            <td>{euro(microReel.reel_cotisation_social_year_1).format()}</td>
            <td>{euro(microReel.cotisation_social_year_1 - microReel.reel_cotisation_social_year_1).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant des cotisations sociales année 2</td>
            <td>{euro(microReel.cotisation_social_year_2).format()}</td>
            <td>{euro(microReel.reel_cotisation_social_year_2).format()}</td>
            <td>{euro(microReel.cotisation_social_year_2 - microReel.reel_cotisation_social_year_2).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant des cotisations sociales année 3</td>
            <td>{euro(microReel.cotisation_social_year_3).format()}</td>
            <td>{euro(microReel.reel_cotisation_social_year_3).format()}</td>
            <td>{euro(microReel.cotisation_social_year_3 - microReel.reel_cotisation_social_year_3).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice fiscal année 1</td>
            <td>{euro(taxBenefit.year_1).format()}</td>
            <td>{euro(microReel.reel_net_result_year_1).format()}</td>
            <td>{euro(taxBenefit.year_1 - microReel.reel_net_result_year_1).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice fiscal année 2</td>
            <td>{euro(taxBenefit.year_2).format()}</td>
            <td>{euro(microReel.reel_net_result_year_2).format()}</td>
            <td>{euro(taxBenefit.year_2 - microReel.reel_net_result_year_2).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice fiscal année 3</td>
            <td>{euro(taxBenefit.year_3).format()}</td>
            <td>{euro(microReel.reel_net_result_year_3).format()}</td>
            <td>{euro(taxBenefit.year_3 - microReel.reel_net_result_year_3).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice réel année 1</td>
            <td>{euro(microReel.net_result_year_1).format()}</td>
            <td>{euro(microReel.reel_net_result_year_1).format()}</td>
            <td>{euro(microReel.net_result_year_1 - microReel.reel_net_result_year_1).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice réel année 2</td>
            <td>{euro(microReel.net_result_year_2).format()}</td>
            <td>{euro(microReel.reel_net_result_year_2).format()}</td>
            <td>{euro(microReel.net_result_year_2 - microReel.reel_net_result_year_2).format()}</td>
          </tr>
          <tr style={{ fontSize: isMobile ? '2vw' : '' }}>
            <td>Montant du bénéfice réel année 3</td>
            <td>{euro(microReel.net_result_year_3).format()}</td>
            <td>{euro(microReel.reel_net_result_year_3).format()}</td>
            <td>{euro(microReel.net_result_year_3 - microReel.reel_net_result_year_3).format()}</td>
          </tr>
        </tbody>
      </Table>
    </Sheet>
  );
}
