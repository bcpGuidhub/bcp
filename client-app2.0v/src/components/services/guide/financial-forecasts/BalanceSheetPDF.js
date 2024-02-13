import { floor, sum } from 'lodash';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../../utils/formatNumber';

import RobotoRegular from '../../../../fonts/Roboto-Regular.ttf';
import RobotoBold from '../../../../fonts/Roboto-Bold.ttf';
// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: RobotoRegular }, { src: RobotoBold }]
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 7, fontWeight: 400 },
  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },
  alignCenter: { textAlign: 'center' },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize'
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8'
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8'
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' }
});

// ----------------------------------------------------------------------

BalanceSheetPDF.propTypes = {
  forecast: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired
};

export default function BalanceSheetPDF({ forecast, user, document }) {
  const theme = useTheme();

  const bgColor = theme.palette.primary.main;

  const width =
    `${Math.floor(100 / document?.columns?.length)}%` === 'NaN%'
      ? 0
      : `${Math.floor(100 / document?.columns?.length)}%`;

  const align = (column) => (column.id === 'field' ? styles.alignLeft : styles.alignCenter);

  const renderRow = (row, index) => {
    let rowPdf = null;

    if (row.sub_rows.length > 0) {
      rowPdf = row.sub_rows.map((row, j) => (
        <View
          style={[
            styles.tableRow,
            {
              backgroundColor: row.background
            }
          ]}
          key={j}
        >
          {document?.columns?.map((column, i) => (
            <View key={`${column.id}-${index}-${i}`} style={[{ width }, align(column)]}>
              <Text style={styles.subtitle2}>
                {typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}
              </Text>
            </View>
          ))}
        </View>
      ));
    }
    return rowPdf;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            source={user.profile_image !== '' ? user.profile_image : '/static/brand/logo_guidhub.png'}
            style={{ height: 32 }}
          />
          <View style={{ alignItems: 'right', flexDirection: 'column' }}>
            <Text style={styles.h3}>Bilan</Text>
            <Text>{format(new Date(), 'dd MMM yyyy')}</Text>
          </View>
        </View>

        {forecast.map((year, i) => (
          <View wrap={false} key={Math.random()}>
            <Text style={[styles.overline, styles.mb8]}>Bilan {year.year} Details</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableRow}>
                  <View style={{ width: '5%' }}>
                    <Text style={styles.subtitle2}>#</Text>
                  </View>
                  {document?.columns?.map((column, j) => (
                    <View key={Math.random()} style={[{ width }, align(column)]}>
                      <Text style={styles.subtitle2}>{column.label !== '' && <>{column.label}&nbsp;(€)</>}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.tableBody}>
                {year.rows.map((row, index) => (
                  <div key={Math.random()}>
                    {renderRow(row, index)}
                    <View
                      style={[
                        styles.tableRow,
                        {
                          backgroundColor: bgColor,
                          color: '#fff'
                        }
                      ]}
                    >
                      {document?.columns?.map((column, i) => (
                        <View key={Math.random()} style={[{ width }, align(column)]}>
                          <Text style={styles.subtitle2}>
                            {typeof row[column.id] === 'number' ? Math.round(row[column.id]) : row[column.id]}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </div>
                ))}
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
