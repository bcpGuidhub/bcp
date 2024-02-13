import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const projectAdvancementStages = [
  "Je n'ai pas encore commencé mon projet",
  'Je travaille sur mon idée de projet',
  'Je fais mon étude de marché',
  'Je fais mon prévisionnel',
  'Je recherche des financements',
  "Je fais mes choix de création d'entreprise (statut juridique, fiscalité...)",
  'Je vais immatriculer mon entreprise',
  'Je vais démarrer mon activité'
];

ProjectAdvancementStage.propTypes = {
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.string
};

export default function ProjectAdvancementStage({ field, handleChange }) {
  return (
    <Select
      label="Sélectionnez"
      onChange={handleChange}
      value={field}
      indicator={<KeyboardArrowDown />}
      sx={{
        width: '100%',
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)'
          }
        }
      }}
    >
      {projectAdvancementStages.map((c) => (
        <Option value={c} key={c}>
          {c}
        </Option>
      ))}
    </Select>
  );
}
