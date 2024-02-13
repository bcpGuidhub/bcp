import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Page from '../../../Page';
import { GuideNavHelperIntegrated, InformationGuide } from '..';
import { Legal } from '.';
import useSettings from '../../../../hooks/useSettings';
import { useSelector } from '../../../../redux/store';
import { Block } from '../../../../pages/components-overview/Block';
import InformationTemplate from './InformationTemplate';

const landmarkLabel = "Complétez vos choix de création d'entreprise";
const achievementLabel = 'Choisissez votre statut juridique';

EmbeddedLegalStatusDecisionTool.propTypes = {
  legalFormalities: PropTypes.object.isRequired
};

export default function EmbeddedLegalStatusDecisionTool({ legalFormalities }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { work } = useSelector((state) => state.project);
  const [visualing, setVisualTo] = useState('form');

  return (
    <>
      <GuideNavHelperIntegrated formLabel="statut juridique" helperLabel="comparateur" setVisualTo={setVisualTo} />

      {visualing === 'form' && <Legal legalFormalities={legalFormalities} id={work.id} />}
      {visualing === 'guide' && (
        <Block>
          <InformationGuide content={InformationTemplate[landmarkLabel][achievementLabel].guide} />
        </Block>
      )}
    </>
  );
}
