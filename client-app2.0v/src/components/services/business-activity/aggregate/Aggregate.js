import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { makeStyles, withStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  Typography,
  Paper,
  Card,
  Stack,
  ButtonGroup,
  Button,
  Grid,
  CardHeader,
  CardContent,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { useTheme, styled } from '@mui/material/styles';
import { MotionInView } from '../../../animate';
import { useSelector } from '../../../../redux/store';
import { MAvatar } from '../../../@material-extend';
import activityResource from './activity-blob';
import getVariant from '../../../../pages/components-overview/extra/animate/getVariant';

const FieldItem = styled(ListItem)(({ theme }) => ({
  // padding: theme.spacing(2)
  fontSize: '0.6rem'
}));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8)
  },
  title: {
    'font-size': '1.4rem',
    color: '#2478A1',
    'font-weight': 'bold',
    textAlign: 'left'
  },
  meta_description: {
    textAlign: 'left',
    'font-size': '1.2rem',
    'font-weight': '400',
    color: '#4B4B4B'
  },
  general_info_text: {
    textAlign: 'left',
    'font-size': '1.2rem',
    'font-weight': '500',
    color: '#fff'
  },
  table: {
    minWidth: 700
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#d9edf7',
    color: '#181818',
    'font-weight': '700',
    'font-size': '1.1rem'
  },
  body: {
    fontSize: '1.1rem',
    fontWeight: '400',
    color: '#4B4B4B'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const defaultCategories = [
  'Informations générales',
  'Informations sectorielles',
  'Diplôme, qualifications et autorisations nécessaires',
  'Aide pour préparer votre business plan',
  "Formalités pour créer l'entreprise et lancer l'activité",
  "Principales réglementations à connaître pour exercer l'activité",
  'Textes de loi, informations utiles et organisations professionnelles​'
];

// ----------------------------------------------------------------------

SidebarInfo.propType = {
  categories: PropTypes.array.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired
};

function SidebarInfo({ categories, setSelectedCategory, selectedCategory }) {
  const theme = useTheme();
  return (
    <Card sx={{ mt: 4, mb: 4 }}>
      <Stack>
        <ButtonGroup orientation="vertical" sx={{ minHeight: 500 }}>
          {categories.map((category) => (
            <Button
              key={category}
              sx={{
                backgroundColor: selectedCategory === category ? theme.palette.action.selected : '',
                justifyContent: 'space-between',
                pl: 1,
                pr: 4,
                pt: 4,
                pb: 4
              }}
              onClick={() => setSelectedCategory(category)}
              endIcon={selectedCategory === category ? <Icon icon="material-symbols:line-end-diamond" /> : ''}
            >
              {category}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

GeneralInfo.propType = {
  label: PropTypes.string.isRequired,
  codeApe: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired
};

function GeneralInfo({ label, codeApe, info }) {
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4 }}>
          <CardHeader
            sx={{ p: 2 }}
            title={`${label}: ${codeApe}`}
            avatar={
              <MAvatar color="primary" aria-label={label}>
                <Icon icon="mdi:cash-register" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <FieldItem>
              <ListItemIcon>
                <Icon icon="ph:info-thin" />
              </ListItemIcon>
              <ListItemText primary={info} />
            </FieldItem>
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------

SectorInfo.propType = {
  info: PropTypes.array.isRequired
};

function SectorInfo({ info }) {
  if (typeof info === 'undefined') {
    return (
      <MotionInView variants={getVariant('slideInUp')}>
        <Box p={1}>
          <Card sx={{ mt: 4, mb: 4, p: 2 }}>No data</Card>
        </Box>
      </MotionInView>
    );
  }
  const metaInfo = info.reduce((acc, field) => {
    acc.push(...field.meta_description);
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="arcticons:mindustry" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {metaInfo.map((field) => (
              <Accordion key={field.label} expanded>
                <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                  <Typography variant="subtitle1">{field.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{field.message}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------

EducationInfo.propType = {
  info: PropTypes.array.isRequired
};

function EducationInfo({ info }) {
  const metaInfo = info.reduce((acc, field) => {
    if (field === null) {
      return acc;
    }
    if (typeof field === 'object') {
      if (field.length === undefined) {
        if (field.message !== null) {
          acc.push(field.message);
        }
      } else {
        return acc.concat(
          field
            .reduce((acc_, f) => {
              acc_.push(...f.meta_description);
              return acc_;
            }, [])
            .map((f) => f.label)
        );
      }
    }
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="medical-icon:i-health-education" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {metaInfo.map((field) => (
              <FieldItem key={field}>
                <ListItemIcon>
                  <Icon icon="ph:info-thin" />
                </ListItemIcon>
                <ListItemText primary={field} />
              </FieldItem>
            ))}
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------
AidInfo.propType = {
  info: PropTypes.array.isRequired
};

function AidInfo({ info }) {
  if (typeof info === 'undefined') {
    return (
      <MotionInView variants={getVariant('slideInUp')}>
        <Box p={1}>
          <Card sx={{ mt: 4, mb: 4, p: 2 }}>No data</Card>
        </Box>
      </MotionInView>
    );
  }
  const metaInfo = info.reduce((acc, field) => {
    acc.push(...field.meta_description);
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="eos-icons:service-plan-outlined" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {metaInfo.map((field) => (
              <Accordion key={field.label} expanded>
                <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                  <Typography variant="subtitle1">{field.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{field.message}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------
FormalitiesInfo.propType = {
  info: PropTypes.array.isRequired
};

function FormalitiesInfo({ info }) {
  if (typeof info === 'undefined') {
    return (
      <MotionInView variants={getVariant('slideInUp')}>
        <Box p={1}>
          <Card sx={{ mt: 4, mb: 4, p: 2 }}>No data</Card>
        </Box>
      </MotionInView>
    );
  }
  const metaInfo = info.reduce((acc, field) => {
    acc.push(...field.meta_description);
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="icon-park:guide-board" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <Timeline position="alternate">
              {metaInfo.map((field) => (
                <TimelineItem key={field.label}>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                      <Icon icon="mdi:file-document-box-check" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      {field.label}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}
// ----------------------------------------------------------------------
RegulationsInfo.propType = {
  info: PropTypes.array.isRequired
};

function RegulationsInfo({ info }) {
  const metaInfo = info.reduce((acc, field) => {
    acc.push(...field.meta_description);
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="flat-color-icons:rules" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {metaInfo.map((field) => (
              <FieldItem key={field.label}>
                <ListItemIcon>
                  <Icon icon="flat-color-icons:rules" />
                </ListItemIcon>
                <ListItemText primary={field.label} />
              </FieldItem>
            ))}
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------
GeneralLegalInfo.propType = {
  info: PropTypes.array.isRequired
};

function GeneralLegalInfo({ info }) {
  const metaInfo = info.reduce((acc, field) => {
    acc.push(...field.meta_description);
    return acc;
  }, []);
  return (
    <MotionInView variants={getVariant('slideInUp')}>
      <Box p={1}>
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardHeader
            sx={{ p: 2 }}
            avatar={
              <MAvatar color="primary">
                <Icon icon="flat-color-icons:rules" />
              </MAvatar>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {metaInfo.map((field) => (
              <FieldItem
                key={field.message}
                secondaryAction={
                  <Link href={field.message} target="_blank">
                    link
                  </Link>
                }
              >
                <ListItemIcon>
                  <Icon icon="flat-color-icons:rules" />
                </ListItemIcon>
                <ListItemText primary={field.label} />
              </FieldItem>
            ))}
          </CardContent>
        </Card>
      </Box>
    </MotionInView>
  );
}

// ----------------------------------------------------------------------

export default function Aggregate() {
  const { work } = useSelector((state) => state.project);
  const [selectedCategory, setSelectedCategory] = useState('Informations générales');
  const sector = work.activity_sector;

  return (
    <>
      <Grid container>
        {!activityResource[selectedCategory][sector] && (
          <Grid item xs={3}>
            <Card sx={{ p: 4 }}>
              <Box display="flex" flexDirection="column">
                <Box p={4}>
                  <Typography variant="subtitle1">
                    Les informations de cette page ne sont pas encore disponibles, nous mettons tout en oeuvre pour vous
                    les fournir rapidement
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        )}
        {activityResource[selectedCategory][sector] && (
          <Grid item xs={12} md={12} lg={12}>
            <Grid container>
              <Grid item xs={4}>
                <SidebarInfo
                  categories={defaultCategories}
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </Grid>
              <Grid item xs={8}>
                {selectedCategory === 'Informations générales' && (
                  <GeneralInfo
                    label={activityResource[selectedCategory][sector].supplimentary[0].meta_description[0].label}
                    codeApe={activityResource[selectedCategory][sector].supplimentary[0].meta_description[0].message}
                    info={activityResource[selectedCategory][sector].principle.message}
                  />
                )}
                {selectedCategory === 'Informations sectorielles' && (
                  <SectorInfo info={activityResource[selectedCategory][sector]?.supplimentary} />
                )}
                {selectedCategory === 'Diplôme, qualifications et autorisations nécessaires' && (
                  <EducationInfo
                    info={[
                      { label: '', message: activityResource[selectedCategory][sector].principle?.message },
                      activityResource[selectedCategory][sector]?.supplimentary
                    ]}
                  />
                )}
                {selectedCategory === 'Aide pour préparer votre business plan' && (
                  <AidInfo info={activityResource[selectedCategory][sector]?.supplimentary} />
                )}
                {selectedCategory === "Formalités pour créer l'entreprise et lancer l'activité" && (
                  <FormalitiesInfo info={activityResource[selectedCategory][sector]?.supplimentary} />
                )}
                {selectedCategory === "Principales réglementations à connaître pour exercer l'activité" && (
                  <RegulationsInfo info={activityResource[selectedCategory][sector]?.supplimentary} />
                )}
                {selectedCategory === 'Textes de loi, informations utiles et organisations professionnelles​' && (
                  <GeneralLegalInfo info={activityResource[selectedCategory][sector]?.supplimentary} />
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
