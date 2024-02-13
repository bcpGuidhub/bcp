import { useState } from 'react';
import { floor, sum } from 'lodash';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { TextField } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { useSelector } from '../../../../redux/store';

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
  subtitle2: { fontSize: 9, fontWeight: 700 },
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
  tableCell_1: { width: '2%' },
  tableCell_2: { width: '20%', paddingRight: 16 },
  tableCell_3: { width: '20%' },
  tableCell_4: { width: '25%' }
});

// ----------------------------------------------------------------------

BusinessPlanPDF.propTypes = {
  document: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  work: PropTypes.object.isRequired
};

export default function BusinessPlanPDF({ document, account, work }) {
  const theme = useTheme();
  // console.log(account);
  // console.log(work);
  // const [companyName, setCompanyName] = useState('Entreprise');
  // const handleChange = (event) => {
  //   setCompanyName(event.target.value);
  // };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            source={account.profile_image !== '' ? account.profile_image : '/static/brand/logo_guidhub.png'}
            style={{ height: 32 }}
          />
          <View style={{ alignItems: 'right', flexDirection: 'column' }}>
            <Text style={styles.h3}>Business Plan</Text>
            <Text>{format(new Date(), 'dd MMM yyyy')}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text>{work.activity_sector || ''}</Text>
            <Text>{work.business_plan?.owner.last_name || ''}</Text>
            <Text>{work.business_plan?.owner.first_name || ''}</Text>
            <Text>{work.business_plan?.owner.telephone || ''}</Text>
            <Text>{work.business_plan?.owner.email || ''}</Text>
            <Text>{work.searchable_address || ''}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text style={styles.h4}>L'idée de projet</Text>
            <Text>{parse(work.business_plan?.project_preparation?.short_description_idea || '')}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text style={styles.h4}>Le marché et la concurrence</Text>
            <Text> Le marché: {parse(work.business_plan?.project_market_research?.market_characteristics || '')}</Text>
            <Text> La clientèle: {parse(work.business_plan?.project_market_research?.target_market || '')}</Text>
            <Text>
              {' '}
              La concurrence: {parse(work.business_plan?.project_market_research?.principal_competition || '')}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text style={styles.h4}>L'offre et les objectifs</Text>
            <Text>
              L’offre de produits et/ou services:{' '}
              {parse(work.business_plan?.project_market_research?.service_description || '')}
            </Text>
            <Text>
              Points forts / points faibles:{' '}
              {parse(work.business_plan?.project_market_research?.product_strong_weak_points || '')}
            </Text>
            <Text>
              Les objectifs commerciaux: {parse(work.business_plan?.project_market_research?.commercial_process || '')}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text style={styles.h4}>La stratégie</Text>
            <Text>
              Le plan d'action opérationnel:{' '}
              {parse(work.business_plan?.project_market_research?.business_placement || '')}
            </Text>
            <Text>
              La distribution des produits et/ou services:{' '}
              {parse(work.business_plan?.project_market_research?.supply_chain || '')}
            </Text>
            <Text>
              La stratégie de communication:{' '}
              {parse(work.business_plan?.project_market_research?.communication_strategy || '')}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View>
            <Text style={styles.h4}>Les choix de création d'entreprise</Text>
            <Text>
              La forme juridique choisie pour l'entreprise est: {work.project_legal_status?.legal_status_idea || ''}
            </Text>
            <Text>Les bénéfices seront imposés à: {work.project_legal_status?.tax_system || ''}</Text>
            <Text>Le régime de tva applicable est: {work.project_legal_status?.company_vat_regime || ''}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>L’équipe projet</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>ID - </Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>ID - Nom </Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text style={styles.subtitle2}>Rôle dans le projet</Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text style={styles.subtitle2}>La présentation du participant</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {work.business_plan?.project_stakeholders?.map((stakeholder, index) => {
              /* eslint-disable camelcase */
              const { id, first_name, last_name, role, profile_image, role_details } = stakeholder;
              const name = `${first_name} ${last_name}`;
              return profile_image && profile_image !== '' ? (
                <View style={styles.tableRow} key={id}>
                  <View style={styles.tableCell_1}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={styles.tableCell_2}>
                    <Image source={profile_image} style={{ height: 25 }} />
                  </View>
                  <View style={styles.tableCell_3}>
                    <Text>{name}</Text>
                  </View>
                  <View style={styles.tableCell_4}>
                    <Text>{role}</Text>
                  </View>
                  <View style={styles.tableCell_4}>
                    <Text>{parse(role_details)}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.tableRow} key={id}>
                  <View style={styles.tableCell_1}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={styles.tableCell_2}>
                    <Text> - </Text>
                  </View>
                  <View style={styles.tableCell_3}>
                    <Text>{name}</Text>
                  </View>
                  <View style={styles.tableCell_4}>
                    <Text>{role}</Text>
                  </View>
                  <View style={styles.tableCell_4}>
                    <Text>{parse(role_details)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
