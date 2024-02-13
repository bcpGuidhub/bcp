import { Container, Grid, Paper, CardHeader, Box, IconButton, Stack, Collapse, Alert, Button } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { Typography } from '@mui/joy';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import { Icon } from '@iconify/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled, useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Block } from '../../../components-overview/Block';
import { MFab, MHidden } from '../../../../components/@material-extend';
import LoadingScreen from '../../../../components/LoadingScreen';
import API, { COTISATION_API } from '../../../../utils/axios';
import { fNumber } from '../../../../utils/formatNumber';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProjectFinancialForecast, getProjectLegalStatus } from '../../../../redux/slices/project';
import useAuth from '../../../../hooks/useAuth';

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

const seriesMixedChart = [
  {
    name: 'Le montant total du chiffre d’affaires',
    type: 'bar',
    data: [0, 0, 0]
  },
  {
    name: 'Le montant total du résultat net',
    type: 'bar',
    data: [0, 0, 0]
  },
  {
    name: 'Le montant de la trésorerie en fin d’année',
    type: 'bar',
    data: [0, 0, 0]
  }
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const ExpandMore = styled((props) => {
  /* eslint-disable-next-line no-unused-vars */
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

export default function Synthesis() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [expandedFinancial, setExpandedFinancial] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [financialAnalysis, setFinancialAnalysis] = useState({});
  const [financialSynthesis, setFinancialSynthesis] = useState(seriesMixedChart);
  const { work } = useSelector((state) => state.project);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandedFinancialClick = () => {
    setExpandedFinancial(!expandedFinancial);
  };

  useEffect(() => {
    if (work.id) {
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
      dispatch(getProjectFinancialForecast(work.id, apiPrefix));
    }
  }, []);

  useEffect(() => {
    if (work.aggregateFinancialProvisions) {
      const storedSelectedProject = localStorage.getItem('selected_project');
      const payload = {
        ...work.aggregateFinancialProvisions,
        project_details: { ...JSON.parse(storedSelectedProject) },
        project_legal_status: { ...work.project_legal_status }
      };
      COTISATION_API.post(`cotisations/financial-synthesis`, payload).then((response) => {
        setFinancialAnalysis(
          response.data.tables.financial_analysis === null ? {} : response.data.tables.financial_analysis
        );
        setFinancialSynthesis(response.data.tables.financial_analysis.financial_plot);
        setIsInitialized(true);
      });
    }
  }, [work.aggregateFinancialProvisions]);

  return (
    <>
      {isInitialized ? (
        <Grid container direction="row" justifyContent="space-between" spacing={3}>
          <Grid item xs={12} lg={5} sx={{ m: 3 }}>
            <Card variant="outlined">
              <CardHeader
                avatar={
                  <>
                    <MHidden width="smDown">
                      {financialAnalysis.financial_review.score > 7 && (
                        <Icon icon="fa:smile-o" color="#ddd" width={120} height={120} />
                      )}
                      {financialAnalysis.financial_review.score <= 4 && (
                        <Icon icon="iconamoon:frowning-face-duotone" color="#ddd" width={120} height={120} />
                      )}
                      {financialAnalysis.financial_review.score > 4 &&
                        financialAnalysis.financial_review.score <= 7 && (
                          <Icon icon="uil:meh" color="#ddd" width={120} height={120} />
                        )}
                    </MHidden>
                    <MHidden width="smUp">
                      {financialAnalysis.financial_review.score > 7 && (
                        <Icon icon="fa:smile-o" color="#ddd" width={50} height={50} />
                      )}
                      {financialAnalysis.financial_review.score <= 4 && (
                        <Icon icon="iconamoon:frowning-face-duotone" color="#ddd" width={50} height={50} />
                      )}
                      {financialAnalysis.financial_review.score > 4 &&
                        financialAnalysis.financial_review.score <= 7 && (
                          <Icon icon="uil:meh" color="#ddd" width={50} height={50} />
                        )}
                    </MHidden>
                  </>
                }
                action={
                  <MFab
                    color="default"
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: '0.5rem',
                      backgroundColor: '#001E3C',
                      color: '#fff'
                    }}
                  >
                    Analyse globale
                  </MFab>
                }
              />
              <CardContent
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  m: 2
                }}
              >
                <MFab
                  color="default"
                  sx={{ width: 50, height: 50, fontSize: '0.5rem', backgroundColor: '#001E3C', color: '#fff' }}
                >
                  {financialAnalysis.financial_review.score} sur 10{' '}
                </MFab>
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography> {expanded ? 'voir moins' : 'voir plus'}</Typography>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </Box>

                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Stack spacing={5}>
                        <Block title="Liste des points validés:" sx={{ p: 1 }}>
                          <Stack spacing={2}>
                            {financialAnalysis.financial_review.details.result_year_1 === 1 && (
                              <Alert>Résultat positif en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.result_year_2 === 1 && (
                              <Alert>Résultat positif en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.result_year_3 === 1 && (
                              <Alert>Résultat positif en Année 3</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_1 === 1 && (
                              <Alert>Trésorerie positive en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_2 === 1 && (
                              <Alert>Trésorerie positive en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_3 === 1 && (
                              <Alert>Trésorerie positive en Année 3</Alert>
                            )}
                            {financialAnalysis.financial_review.details.personal_deposits === 1 && (
                              <Alert>{'Apports personnels > à 25%'}</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_1 === 1 && (
                              <Alert>Rémunération du dirigeant enregistrée en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_2 === 1 && (
                              <Alert>Rémunération du dirigeant enregistrée en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_3 === 1 && (
                              <Alert>Rémunération du dirigeant enregistrée en Année 3</Alert>
                            )}
                          </Stack>
                        </Block>
                        <Block title="Liste des points non validés:" sx={{ p: 1 }}>
                          <Stack spacing={1}>
                            {financialAnalysis.financial_review.details.result_year_1 === 0 && (
                              <Alert severity="error">Résultat négatif en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.result_year_2 === 0 && (
                              <Alert severity="error">Résultat négatif en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.result_year_3 === 0 && (
                              <Alert severity="error">Résultat négatif en Année 3</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_1 === 0 && (
                              <Alert severity="error">Trésorerie négative en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_2 === 0 && (
                              <Alert severity="error">Trésorerie négative en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.treasury_year_3 === 0 && (
                              <Alert severity="error">Trésorerie négative en Année 3</Alert>
                            )}
                            {financialAnalysis.financial_review.details.personal_deposits === 0 && (
                              <Alert severity="error">{'Apports personnels > à 25%'}</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_1 === 0 && (
                              <Alert severity="error">Rémunération du dirigeant enregistrée en Année 1</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_2 === 0 && (
                              <Alert severity="error">Rémunération du dirigeant enregistrée en Année 2</Alert>
                            )}
                            {financialAnalysis.financial_review.details.director_salary_year_3 === 0 && (
                              <Alert severity="error">Rémunération du dirigeant enregistrée en Année 3</Alert>
                            )}
                          </Stack>
                        </Block>
                      </Stack>
                    </CardContent>
                  </Collapse>
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ m: 3 }}>
            <Card variant="outlined">
              <CardHeader
                avatar={
                  <>
                    <MHidden width="smDown">
                      {financialAnalysis.financial_review.personal_deposits >= 0.25 && (
                        <Icon icon="fa:smile-o" color="#ddd" width={120} height={120} />
                      )}
                      {financialAnalysis.financial_review.personal_deposits < 0.15 && (
                        <Icon icon="iconamoon:frowning-face-duotone" color="#ddd" width={120} height={120} />
                      )}
                      {financialAnalysis.financial_review.personal_deposits > 0.15 &&
                        financialAnalysis.financial_review.personal_deposits < 0.25 && (
                          <Icon icon="uil:meh" color="#ddd" width={120} height={120} />
                        )}
                    </MHidden>
                    <MHidden width="smUp">
                      {financialAnalysis.financial_review.personal_deposits >= 0.25 && (
                        <Icon icon="fa:smile-o" color="#ddd" width={50} height={50} />
                      )}
                      {financialAnalysis.financial_review.personal_deposits < 0.15 && (
                        <Icon icon="iconamoon:frowning-face-duotone" color="#ddd" width={50} height={50} />
                      )}
                      {financialAnalysis.financial_review.personal_deposits > 0.15 &&
                        financialAnalysis.financial_review.personal_deposits < 0.25 && (
                          <Icon icon="uil:meh" color="#ddd" width={50} height={50} />
                        )}
                    </MHidden>
                  </>
                }
                action={
                  <MFab
                    color="default"
                    sx={{ width: 50, height: 50, fontSize: '0.5rem', backgroundColor: '#001E3C', color: '#fff' }}
                  >
                    Montage financier
                  </MFab>
                }
              />
              <CardContent
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  m: 2
                }}
              >
                {financialAnalysis.financial_review.personal_deposits > 0.25 && (
                  <Button variant="outlined" color="success">
                    Équilibré
                  </Button>
                )}
                {financialAnalysis.financial_review.personal_deposits >= 0.15 && (
                  <Button variant="outlined" color="warning">
                    Fragile
                  </Button>
                )}
                {financialAnalysis.financial_review.personal_deposits < 0.15 && (
                  <Button variant="outlined" color="error">
                    Déséquilibré
                  </Button>
                )}
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography> {expandedFinancial ? 'voir moins' : 'voir plus'}</Typography>
                    <ExpandMore
                      expand={expandedFinancial}
                      onClick={handleExpandedFinancialClick}
                      aria-expanded={expandedFinancial}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </Box>

                  <Collapse in={expandedFinancial} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Stack spacing={5}>
                        <Block title="Les Détails:" sx={{ p: 1 }}>
                          <Stack spacing={2}>
                            {financialAnalysis.financial_review.personal_deposits < 0.15 && (
                              <Alert severity="error">Votre pourcentage d’apports personnels est insuffisant</Alert>
                            )}
                            {financialAnalysis.financial_review.personal_deposits >= 0.15 &&
                              financialAnalysis.financial_review.personal_deposits <= 0.25 && (
                                <Alert severity="warning">Votre pourcentage d’apports personnels est limité</Alert>
                              )}
                            {financialAnalysis.financial_review.personal_deposits > 0.25 && (
                              <Alert>Votre pourcentage d’apports personnels est suffisant</Alert>
                            )}
                            {financialAnalysis.financial_review.personal_deposits < 0.15 && (
                              <Alert severity="error">
                                'Votre pourcentage d’apports personnels est inférieur à 15% du financement global de
                                votre projet. Votre montage financier n’est pas correctement équilibré car vos apports
                                personnels sont trop faibles par rapport au financement global de votre projet. En
                                conséquence, vos chances d’obtenir un financement sont faibles. Un montage financier
                                bien équilibré nécessite au moins 25% d’apports personnels sur le financement global du
                                projet.'
                              </Alert>
                            )}
                            {financialAnalysis.financial_review.personal_deposits >= 0.15 &&
                              financialAnalysis.financial_review.personal_deposits <= 0.25 && (
                                <Alert severity="warning">
                                  'Votre pourcentage d’apports personnels est compris entre 15% et 25% du financement
                                  global de votre projet. Votre montage financier est un peu juste. En conséquence, vous
                                  ne parviendrez peut-être pas à obtenir un financement pour votre projet. Dans la
                                  mesure du possible, pour optimiser vos chances d’obtenir un financement, nous vous
                                  conseillons de mobiliser personnellement au moins 25% du financement global du
                                  projet.'
                                </Alert>
                              )}
                            {financialAnalysis.financial_review.personal_deposits > 0.25 && (
                              <Alert>
                                'Votre pourcentage d’apports personnels est supérieur à 25% du financement global de
                                votre projet. Votre montage financier est parfaitement équilibré. En conséquence, vous
                                avez toutes les chances d’obtenir un financement pour votre projet (sauf si vous n’en
                                avez pas besoin).'
                              </Alert>
                            )}
                          </Stack>
                        </Block>
                      </Stack>
                    </CardContent>
                  </Collapse>
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid>
          <Grid item xs={12} lg={10} sx={{ m: 3 }}>
            <Chart options={optionsMixedChart} series={financialSynthesis} type="bar" width="100%" height="420px" />
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '40px 40px',
            padding: '20px 20px'
          }}
        >
          <LoadingScreen />
        </Box>
      )}
    </>
  );
}
