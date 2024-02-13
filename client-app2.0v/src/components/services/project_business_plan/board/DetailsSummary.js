import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CloseIcon from '@mui/icons-material/Close';
import videoFill from '@iconify/icons-eva/video-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Icon } from '@iconify/react';
import InfoIcon from '@mui/icons-material/Info';
import { Badge, CardContent, Stack } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import { LinearProgress } from '@mui/joy';
import parse from 'html-react-parser';
import { sentenceCase } from 'change-case';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { LoadingButton } from '@mui/lab';
import { MFab, MIconButton } from '../../../@material-extend';
import NewStakeHolder from './NewStakeHolder';
import StakeHolderList from './StakeHolderList';
import { useDispatch, useSelector } from '../../../../redux/store';
import { fetchProjectStakeholder } from '../../../../redux/slices/project';
import BadgeStatus from '../../../BadgeStatus';
import Label from '../../../Label';
import BusinessPlanPDF from '../../guide/financial-forecasts/BusinessPlanPDF';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
const IconWrapperStyle = styled(MIconButton)(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(4),
  justifyContent: 'center',
  height: theme.spacing(4),
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

const SERVICE_DESCRIPTION = [
  {
    title: 'Board Room Status',
    icon: null,
    onclick: null
  },
  {
    title: 'Conférence entre partenaires',
    icon: videoFill,
    onclick: null
  }
];

BusinessPlanBoardAppBar.propTypes = {
  onClickConference: PropTypes.func.isRequired,
  onClickCall: PropTypes.func.isRequired,
  boardRoomStatus: PropTypes.bool,
  boardRoomSeats: PropTypes.array,
  handleOpenPreview: PropTypes.func,
  document: PropTypes.object.isRequired
};
function BusinessPlanBoardAppBar({
  onClickConference,
  onClickCall,
  boardRoomStatus,
  boardRoomSeats,
  handleOpenPreview,
  document
}) {
  const theme = useTheme();

  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);
  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: 'blur(16px) saturate(180%)',
        backgroundColor: 'rgba(17, 25, 40, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.125)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {SERVICE_DESCRIPTION.map((item) => (
            <Box
              key={item.title}
              sx={{ mt: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}
              onClick={
                item.title === 'Conférence entre partenaires'
                  ? () => {
                      onClickConference();
                    }
                  : null
              }
            >
              {item.title === 'Board Room Status' && (
                <Badge color="info" badgeContent={boardRoomSeats.length}>
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={((boardRoomStatus === 1 || boardRoomSeats.length > 1) && 'success') || 'error'}
                  >
                    {(boardRoomStatus === 1 || boardRoomSeats.length > 1) && sentenceCase('Online')}
                    {(!boardRoomStatus || boardRoomStatus === 0 || boardRoomSeats.length <= 1) &&
                      sentenceCase('Offline')}
                  </Label>
                </Badge>
              )}
              <IconWrapperStyle
                sx={{
                  color:
                    boardRoomStatus === 1 || boardRoomSeats.length > 1
                      ? theme.palette.success.main
                      : theme.palette.primary.main,
                  backgroundColor:
                    boardRoomStatus === 1 || boardRoomSeats.length > 1
                      ? `${alpha(theme.palette.success.main, 0.08)}`
                      : `${alpha(theme.palette.primary.main, 0.08)}`
                }}
              >
                {item.title === 'Board Room Status' ? (
                  <BadgeStatus status={boardRoomStatus === 1 || boardRoomSeats.length > 1 ? 'online' : 'busy'} />
                ) : (
                  <Icon icon={item.icon} />
                )}
              </IconWrapperStyle>
              <Typography variant="subtitle1" gutterBottom>
                {item.title}
              </Typography>
            </Box>
          ))}

          <Button
            color="info"
            size="small"
            variant="contained"
            onClick={handleOpenPreview}
            endIcon={<Icon icon={eyeFill} />}
            sx={{ mx: 1 }}
          >
            Prévisualiser
          </Button>

          <PDFDownloadLink
            document={<BusinessPlanPDF document={document} work={work} account={account} />}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <LoadingButton
                size="small"
                loading={loading}
                variant="contained"
                loadingPosition="end"
                endIcon={<Icon icon={downloadFill} />}
              >
                Download
              </LoadingButton>
            )}
          </PDFDownloadLink>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// ----------------------------------------------------------------------

DetailsSummary.propTypes = {
  documents: PropTypes.array.isRequired,
  currentViewIndex: PropTypes.number.isRequired,
  documentContent: PropTypes.string,
  onClickConference: PropTypes.func.isRequired,
  onClickCall: PropTypes.func.isRequired,
  boardRoomStatus: PropTypes.bool,
  boardRoomSeats: PropTypes.array,
  handleAddStakeholder: PropTypes.func.isRequired,
  onAddStakeholder: PropTypes.bool.isRequired,
  handleOpenPreview: PropTypes.func,
  document: PropTypes.object.isRequired
};

export default function DetailsSummary({
  documents,
  currentViewIndex,
  documentContent,
  onClickConference,
  onClickCall,
  boardRoomStatus,
  boardRoomSeats,
  handleAddStakeholder,
  onAddStakeholder,
  handleOpenPreview,
  document
}) {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { work, createStakeholderSuccess, creatingProjectStakeholder } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    if (createStakeholderSuccess) {
      dispatch(fetchProjectStakeholder(work.id, apiPrefix));
    }
  }, [createStakeholderSuccess]);

  return (
    <Card
      sx={{
        height: '100%',
        backdropFilter: 'blur(16px) saturate(180%)',
        backgroundColor: 'rgba(225, 233, 249, 0.75)',
        borderRadius: '0 !important'
      }}
    >
      <BusinessPlanBoardAppBar
        onClickCall={onClickCall}
        onClickConference={onClickConference}
        boardRoomStatus={boardRoomStatus}
        boardRoomSeats={boardRoomSeats}
        handleOpenPreview={handleOpenPreview}
        document={document}
      />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" spacing={2}>
            <QuizIcon />
            <Typography variant="h6" color="text.secondary">
              {documents[currentViewIndex].question} ?
            </Typography>
          </Box>
          <Box sx={{ mt: 2, width: '100%' }}>
            {documents[currentViewIndex].question !== 'Présentez votre équipe projet' && (
              <Box> {parse(documentContent)}</Box>
            )}
            {documents[currentViewIndex].question === 'Présentez votre équipe projet' &&
              work.business_plan &&
              work.business_plan.project_stakeholders && <StakeHolderList />}

            {documents[currentViewIndex].question === 'Présentez votre équipe projet' && !onAddStakeholder && (
              <MFab
                color="secondary"
                onClick={() => {
                  handleAddStakeholder(true);
                }}
              >
                <GroupAddIcon />
              </MFab>
            )}

            {documents[currentViewIndex].question === 'Présentez votre équipe projet' && onAddStakeholder && (
              <MFab
                color="error"
                onClick={() => {
                  handleAddStakeholder(false);
                }}
              >
                <CloseIcon />
              </MFab>
            )}

            {/* </Card> */}
          </Box>
          {creatingProjectStakeholder && (
            <Box>
              <LinearProgress />
            </Box>
          )}
        </Stack>
      </CardContent>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: 'auto',
          bottom: 0,
          height: '56px !important',
          borderRadius: '0 !important',
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(17, 25, 40, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.125)'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer">
            <InfoIcon />
          </IconButton>
          <Typography sx={{ typography: 'subtitle1' }}>{documents[currentViewIndex].doc_type}</Typography>
        </Toolbar>
      </AppBar>
    </Card>
  );
}
