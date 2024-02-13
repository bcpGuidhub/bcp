import { Box, Container, Grid, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Page from '../../../Page';
import { GuideNavHelperIntegrated, InformationGuide } from '..';
import { Fiscal } from '.';
import useSettings from '../../../../hooks/useSettings';
import { useSelector } from '../../../../redux/store';
import InformationTemplate from './InformationTemplate';
import { taxHelperInformation } from './taxHelperInformation';
import { Block } from '../../../../pages/components-overview/Block';

const landmarkLabel = "Complétez vos choix de création d'entreprise";
const achievementLabel = 'Choisissez votre régime fiscal';

EmbeddedFiscalStatusDecisionTool.propTypes = {
  legalFormalities: PropTypes.object.isRequired,
  activitySector: PropTypes.string.isRequired
};

export default function EmbeddedFiscalStatusDecisionTool({ legalFormalities, activitySector }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { work } = useSelector((state) => state.project);
  const [visualing, setVisualTo] = useState('form');

  return (
    <Box>
      <GuideNavHelperIntegrated formLabel="Régimes fiscaux" helperLabel="comparateur" setVisualTo={setVisualTo} />

      {visualing === 'form' && (
        <Fiscal
          id={work.id}
          legalFormalities={legalFormalities}
          activitySector={activitySector}
          helperInformation={taxHelperInformation.default}
        />
      )}
      {visualing === 'guide' && (
        <Block>
          <InformationGuide content={InformationTemplate[landmarkLabel][achievementLabel].guide} />
        </Block>
      )}
    </Box>
  );
}
