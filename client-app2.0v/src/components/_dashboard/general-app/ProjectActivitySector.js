import * as React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/joy/Select';
import Option, { optionClasses } from '@mui/joy/Option';
import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListItemDecorator, { listItemDecoratorClasses } from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import { FormControl, FormLabel } from '@mui/joy';

// ----------------------------------------------------------------------

const groupedOptions = {
  Artisanale: [
    'Ambulance',
    'Bijouterie - Joaillerie',
    'Biscuiterie',
    'Boucherie - Charcuterie',
    'Boulangerie - Pâtisserie',
    'Caviste',
    'Carrosserie',
    'Carrelage et sols',
    'Chocolaterie - confiserie',
    'Cordonnerie',
    'Couverture',
    'Cuisiniste',
    'Déménagement',
    'Démolition',
    'Ébénisterie',
    'Entretien et réparation de véhicules',
    'Électricité',
    'Fabrication de boissons alcoolisées',
    'Fabrication de textiles',
    'Ferronnerie',
    'Fleuriste',
    'Fromagerie',
    'Institut de beauté',
    'Maçonnerie',
    'Menuiserie',
    'Paysagiste',
    'Peinture en bâtiment',
    'Plâtrerie - Isolation',
    'Plomberie-chauffage',
    'Poissonnerie',
    'Restauration rapide à livrer ou à emporter',
    'Salon de coiffure',
    'Traiteur',
    'Travaux publics',
    'Verrerie',
    'Autre activité artisanale'
  ],
  'Commerciale ou industrielle': [
    'Agence de sécurité',
    'Agence de voyage',
    'Agent commercial',
    'Agence immobilière',
    'Bar, café, débit de tabac',
    'Commerce de détail alimentaire',
    'Commerce de détail non alimentaire',
    'Commerce de gros',
    'Commerce de véhiculess',
    'Crèche',
    'Diagnostic immobilier',
    'E-commerce',
    'Entretien et réparation de véhicules',
    "Galerie d'art",
    'Hôtellerie',
    'Jardinerie',
    "Location d'équipements et de matériels",
    'Optique et lunetterie',
    'Presse et médias',
    'Industrie',
    'Restauration traditionnelle',
    'Restauration rapide sur place',
    'Salle de sport - fitness',
    'Services administratifs',
    'Services à la personne',
    'Spectacle vivant',
    'Start-up',
    'Taxi',
    'Transport léger de marchandises',
    'Transport lourd de marchandises',
    'VTC',
    'Autre activité commerciale'
  ],
  Libérale: [
    'Agence de communication ou publicité',
    'Agence marketing',
    'Agence web',
    "Agent général d'assurance",
    'Architecte',
    "Architecte d'intérieur",
    'Auto-école',
    'Avocat',
    "Bureau d'études",
    'Cabinet de diététique',
    'Coach sportif',
    'Conseil et activités informatiques',
    'Consulting et conseil',
    'Courtage en assurance',
    'Courtage en financement',
    'Designer',
    "Décoration d'intérieur",
    'Enseignement privé',
    'Formation',
    'Géomètre-expert',
    'Graphiste',
    'Kinésithérapie',
    'Médecine',
    'Médecine douce',
    'Ostéopathie',
    'Pharmacie',
    'Vétérinaire',
    'Autre activité libérale'
  ]
};

const colors = {
  Artisanale: 'neutral',
  'Commerciale ou industrielle': 'primary',
  Libérale: 'success'
};
// ----------------------------------------------------------------------

ProjectActivitySector.propTypes = {
  handleChange: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
};

export default function ProjectActivitySector({ field, handleChange }) {
  return (
    <FormControl sx={{ m: 1, width: '100%' }}>
      <Select
        slotProps={{
          listbox: {
            component: 'div',
            sx: {
              maxHeight: 240,
              overflow: 'auto',
              '--List-padding': '0px',
              '--ListItem-radius': '0px'
            }
          }
        }}
        sx={{ width: '100%' }}
        onChange={handleChange}
      >
        {Object.entries(groupedOptions).map(([activityGroup, activities], index) => (
          <React.Fragment key={activityGroup}>
            {index !== 0 && <ListDivider role="none" />}
            <List aria-labelledby={`select-group-${activityGroup}`} sx={{ '--ListItemDecorator-size': '28px' }}>
              <ListItem id={`select-group-${activityGroup}`} sticky>
                <Typography level="body3" textTransform="uppercase" letterSpacing="md">
                  {activityGroup} ({activities.length})
                </Typography>
              </ListItem>
              {activities.map((activity) => (
                <Option
                  key={activity}
                  value={activity}
                  label={
                    <>
                      <Chip size="sm" color={colors[activityGroup]} sx={{ borderRadius: 'xs', mr: 1 }}>
                        {activityGroup}
                      </Chip>
                      {activity}
                    </>
                  }
                  sx={{
                    [`&.${optionClasses.selected} .${listItemDecoratorClasses.root}`]: {
                      opacity: 1
                    }
                  }}
                >
                  <ListItemDecorator sx={{ opacity: 0 }}>
                    <Check />
                  </ListItemDecorator>
                  {activity}
                </Option>
              ))}
            </List>
          </React.Fragment>
        ))}
      </Select>
    </FormControl>
  );
}
