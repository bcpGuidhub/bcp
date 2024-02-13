import { sentenceCase } from 'change-case';
import {
  Sheet,
  Stack,
  Box,
  Card,
  CardContent,
  CardCover,
  Typography,
  Avatar,
  Modal,
  ModalDialog,
  Button,
  LinearProgress
} from '@mui/joy';
import BottomNavigation from '@mui/material/BottomNavigation';
import {
  AppBar,
  BottomNavigationAction,
  Chip,
  Collapse,
  Container,
  DialogActions,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import videoFill from '@iconify/icons-eva/video-fill';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CloseIcon from '@mui/icons-material/Close';
import parse from 'html-react-parser';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { styled } from '@mui/joy/styles';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import MenuIcon from '@mui/icons-material/Menu';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import EditIcon from '@mui/icons-material/Edit';
import closeFill from '@iconify/icons-eva/close-fill';
import EditOffIcon from '@mui/icons-material/EditOff';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { LoadingButton } from '@mui/lab';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
// material
import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
// components
import Page from '../../../../components/Page';
import {
  MeetingGrid,
  NewStakeHolder,
  StakeHolderList,
  MessageInput,
  MessageList
} from '../../../../components/services/project_business_plan';
// hooks
import useSettings from '../../../../hooks/useSettings';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import {
  getProjectBusinessPlan,
  getProjectLegalStatus,
  setSeatedBoardRoomParticipants,
  updateProjectMarketResearch,
  updateProjectPreparation
} from '../../../../redux/slices/project';
import { RTC } from '../../../../modules';
import Label from '../../../../components/Label';
import useAuth from '../../../../hooks/useAuth';
import BusinessPlanPDF from '../../../../components/services/guide/financial-forecasts/BusinessPlanPDF';
import { DialogAnimate } from '../../../../components/animate';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { MFab } from '../../../../components/@material-extend';
import { QuillEditor } from '../../../../components/editor';
import { PATH_AUTH } from '../../../../routes/paths';

// ----------------------------------------------------------------------

/* eslint-disable camelcase */
const documents = [
  // ---------------- "Présentation" ------------
  {
    doc_type: 'Présentation',
    question: 'Présentez votre équipe projet',
    label: 'Les participants',
    field_labels: ['La présentation du participant', 'Rôle dans le projet'],
    fields: ['identity', 'role']
  },
  {
    doc_type: 'Présentation',
    question: 'Présentez votre idée de projet',
    label: "L'idée de projet en quelques mots",
    fields: ['short_description_idea']
  },
  // ---------------- "Le marché et la concurrence" ------------
  {
    doc_type: 'Le marché et la concurrence',
    question: 'Présentez votre marché',
    label: 'Le marché',
    fields: ['market_characteristics']
  },
  {
    doc_type: 'Le marché et la concurrence',
    question: 'Présentez vos concurrents',
    label: 'La concurrence',
    fields: ['principal_competition']
  },
  {
    doc_type: 'Le marché et la concurrence',
    question: 'Présentez votre segment de clientèle',
    label: 'La clientèle',
    fields: ['target_market']
  },
  // ---------------- "L'offre et les objectifs" ------------

  {
    doc_type: "L'offre et les objectifs",
    question: 'Présentez votre offre',
    label: 'L’offre de produits et/ou services',
    fields: ['service_description']
  },
  {
    doc_type: "L'offre et les objectifs",
    question: 'Présentez vos points forts / points faibles',
    label: 'Points forts / points faibles',
    fields: ['product_strong_weak_points']
  },
  {
    doc_type: "L'offre et les objectifs",
    question: 'Présentez votre stratégie et vos objectifs',
    label: 'Les objectifs commerciaux',
    fields: ['commercial_process']
  },
  // ---------------- "La stratégie" ------------
  {
    doc_type: 'La stratégie',
    question: 'Présentez vos circuits de distribution',
    label: 'La distribution des produits et/ou services',
    fields: ['supply_chain']
  },
  {
    doc_type: 'La stratégie',
    question: 'Présentez votre plan de communication',
    label: 'La stratégie de communication',
    fields: ['communication_strategy']
  },
  {
    doc_type: 'La stratégie',
    question: "Présentez votre plan d'action",
    label: "Le plan d'action opérationnel",
    fields: ['business_placement']
  }
];

const documentsOutline = [
  // ---------------- "Présentation" ------------
  {
    doc_type: 'Présentation',
    field_labels: ['Les participants', "L'idée de projet en quelques mots"]
  },
  // ---------------- "Le marché et la concurrence" ------------
  {
    doc_type: 'Le marché et la concurrence',
    field_labels: ['Le marché', 'La concurrence', 'La clientèle']
  },
  // ---------------- "L'offre et les objectifs" ------------
  {
    doc_type: "L'offre et les objectifs",
    field_labels: ['L’offre de produits et/ou services', 'Points forts / points faibles', 'Les objectifs commerciaux']
  },
  // ---------------- "La stratégie" ------------
  {
    doc_type: 'La stratégie',
    field_labels: [
      'La distribution des produits et/ou services',
      'La stratégie de communication',
      "Le plan d'action opérationnel"
    ]
  }
];

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={7}>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={6} lg={5}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" height={240} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
    </Grid>
  </Grid>
);

const LocalView = forwardRef((props, ref) => (
  <div
    style={{
      borderRadius: '8px'
    }}
  >
    <div
      style={{
        position: 'relative',
        color: 'white'
      }}
    >
      <Chip
        sx={{
          position: 'absolute',
          bottom: '26px',
          left: '16px',
          color: 'white',
          borderColor: 'white'
        }}
        label={`${props?.account?.first_name}.${props?.account?.last_name}`}
        variant="outlined"
      />
      {/* eslint-disable jsx-a11y/media-has-caption */}
      {/* <video ref={ref} height="100%" width="100%" playsInline autoPlay /> */}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted
        poster={props?.account?.profile_image}
        style={{
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'cover',
          width: '100%'
        }}
      />
    </div>

    {/* <span>
      Mic:{true ? 'Yes' : 'No'}, Camera: {true ? 'Yes' : 'No'}
    </span> */}
  </div>
));

const RemoteView = forwardRef((props, ref) => {
  const { work } = useSelector((state) => state.project);
  const { seatedParticipants } = work;
  const account = seatedParticipants.filter((seat) => seat.id === props.clientId)[0];

  return (
    <div
      style={{
        borderRadius: '8px'
      }}
    >
      <div
        style={{
          position: 'relative',
          color: 'white'
        }}
      >
        <Chip
          sx={{
            position: 'absolute',
            bottom: '26px',
            left: '16px',
            color: 'white',
            borderColor: 'white'
          }}
          label={`${account?.first_name}.${account?.last_name}`}
          variant="outlined"
        />
        {/* eslint-disable jsx-a11y/media-has-caption */}
        {/* <video ref={ref} height="100%" width="100%" playsInline autoPlay /> */}
        <video
          ref={ref}
          autoPlay
          playsInline
          poster={account?.profile_image}
          style={{
            display: 'block',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'cover' /* no letterboxing */,
            width: '100%'
          }}
        />
      </div>

      {/* <span>
      Mic:{true ? 'Yes' : 'No'}, Camera: {true ? 'Yes' : 'No'}
    </span> */}
    </div>
  );
});

OnlinePeersList.propTypes = {
  boardRoomSeats: PropTypes.array,
  handleTogglePeersJoin: PropTypes.func,
  checkedPeer: PropTypes.array
};

function OnlinePeersList({ boardRoomSeats, handleTogglePeersJoin, checkedPeer }) {
  const theme = useTheme();
  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);
  return (
    <Box>
      <Box>
        <Typography mb={1} sx={{ typography: 'h6' }}>
          Ajouter des partenaires en ligne à l'appel
        </Typography>
        <Stack spacing={2}>
          {boardRoomSeats.map((seat) => {
            const { id, first_name, last_name, status, profile_image } = seat;
            const labelId = `checkbox-list-secondary-label-${id}`;
            const name = `${first_name} ${last_name}`;
            return (
              <Chip
                key={id}
                sx={{ width: '100%' }}
                avatar={<Avatar src={profile_image} />}
                label={
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ typography: 'h6', pr: 2 }}>{name}</Typography>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(status === 0 && 'error') || 'success'}
                    >
                      {status === 0 && sentenceCase('pending password')}
                      {status === 1 && sentenceCase('seated')}
                    </Label>
                    {status === 1 && seat.id !== account.id && (
                      <Checkbox
                        edge="end"
                        onChange={handleTogglePeersJoin(id)}
                        checked={checkedPeer.indexOf(id) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    )}
                  </Box>
                }
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

OnlinePeersLayoutModalDialog.propTypes = {
  boardRoomSeats: PropTypes.array,
  addStakeholdersPeers: PropTypes.bool,
  setAddStakeholdersPeers: PropTypes.func,
  handleTogglePeersJoin: PropTypes.func,
  checkedPeer: PropTypes.array,
  startBoardRoomConferenceCall: PropTypes.func
};

function OnlinePeersLayoutModalDialog({
  boardRoomSeats,
  addStakeholdersPeers,
  setAddStakeholdersPeers,
  handleTogglePeersJoin,
  checkedPeer,
  startBoardRoomConferenceCall
}) {
  return (
    <Modal open={addStakeholdersPeers} onClose={() => setAddStakeholdersPeers(false)}>
      <ModalDialog aria-labelledby="layout-modal-title" aria-describedby="layout-modal-description" layout="center">
        <OnlinePeersList
          boardRoomSeats={boardRoomSeats}
          handleTogglePeersJoin={handleTogglePeersJoin}
          checkedPeer={checkedPeer}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          {checkedPeer.length > 0 && (
            <Button startDecorator={<VideoCallIcon />} color="success" onClick={() => startBoardRoomConferenceCall()}>
              continuer
            </Button>
          )}
          <Button variant="solid" color="danger" onClick={() => setAddStakeholdersPeers(false)}>
            terminer
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

export default function BusinessPlanBoard() {
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(1);
  const ref = useRef(null);
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const isCreator = accountType !== 'stakeholder';
  const isMountedRef = useIsMountedRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const localStreamRefNode = useRef(null);
  const remotePeersViewRefNodes = useRef({});
  const [isEditStakeholder, setIsEditStakeholder] = useState(false);
  const [currentStakeholderModify, setCurrentStakeholderModify] = useState({});
  const [remotePeersViewNodes, setRemotePeersViewNodes] = useState([]);
  const [displayLocalStream, setDisplayLocalStream] = useState(false);
  let localStream = null;
  const [rtc, setRtc] = useState(null);
  const [boardRoomSeats, setBoardRoomSeats] = useState([]);
  const [boardRoomSession, setBoardRoomSession] = useState(null);
  const [boardRoomMessages, setBoardRoomMessages] = useState(null);
  const [boardRoomStatus, setBoardRoomStatus] = useState(null);
  const [checked, setChecked] = useState([]);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [addStakeholdersPeers, setAddStakeholdersPeers] = useState(false);
  const [onAddStakeholder, setAddStakeholder] = useState(false);
  const [content, setFieldContent] = useState('');
  const [openMeetingGrid, setOpenMeetingGrid] = useState(false);
  const [offlineClient, setOfflineClient] = useState({});
  const [businessPlanFields, setBusinessPlanFields] = useState({});
  const [openPDF, setOpenPDF] = useState(false);
  const [editingDocument, setEditingDocument] = useState(true);
  const [messagingOff, setMessagingOff] = useState(true);
  const [contentDrawer, setContentDrawer] = useState(false);
  const { work, error, businessPlanFieldUpdated, createStakeholderSuccess, creatingProjectStakeholder } = useSelector(
    (state) => state.project
  );
  const { seatedParticipants } = work;
  const { account } = useSelector((state) => state.user);

  const [openDocOutlineExpansion, setOpenDocOutlineExpansion] = useState(true);
  const getLocalStreamNode = () => <LocalView ref={localStreamRefNode} clientId={account.id} account={account} />;
  const handleDocOutlineExpansion = () => {
    setOpenDocOutlineExpansion(!openDocOutlineExpansion);
  };

  const maxSteps = documents.length;

  const handleDrawerToggle = () => {
    setContentDrawer(!contentDrawer);
  };

  const handleSelectedDocView = (label) => {
    documents.forEach((document, index) => {
      if (document.label === label) {
        setCurrentViewIndex(index);
      }
    });
  };

  const handleOpenPreview = () => {
    setOpenPDF(true);
  };

  const handleClosePreview = () => {
    setOpenPDF(false);
  };

  const handleTogglePeersJoin = (id) => () => {
    const currentIndex = checked.indexOf(id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleOnClickConference = async (e) => {
    if (rtc) {
      if (rtc.channel_ && rtc.channel_.websocket_) {
        if (rtc.channel_.websocket_.readyState === 2 || rtc.channel_.websocket_.readyState === 3) {
          try {
            await rtc.openSignalingChannel();
          } catch (error) {
            console.log('error == ', error);
          }
        }
      } else {
        try {
          await rtc.openSignalingChannel();
        } catch (error) {
          console.log('error == ', error);
        }
      }
    } else if (work && work.id) {
      const signalingApi =
        accountType === 'stakeholder'
          ? 'stakeholder/workstation/projects/wsWebRtc/'
          : 'workstation/projects/:id/wsWebRtc/'.replace(':id', work.id);
      try {
        setRtc(
          new RTC(
            peerLeft,
            peerJoined,
            sessionMessageCallback,
            statusMessageCallback,
            errorMessageCallback,
            work.id,
            account.id,
            signalingApi,
            onlocalstream,
            onpeercreated,
            onboardRoomConversationMessage
          )
        );
      } catch (error) {
        console.log('error == ', error);
      }
    } else {
      window.location.href = PATH_AUTH.login;
    }

    setAddStakeholdersPeers(true);
  };

  const startBoardRoomConferenceCall = () => {
    setAddStakeholdersPeers(false);
    setOpenMeetingGrid(true);
    setDisplayLocalStream(true);
    rtc.setPeers(checked);
    getMedia();
  };

  const getMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    rtc
      .getLocalMediaStream()
      .then(gotStream)
      .catch((err) => {
        console.log(err);
      });
  };

  const gotStream = (mediaStream) => {
    localStream = mediaStream;
    localStreamRefNode.current.srcObject = mediaStream;
    rtc.setLocalStream(mediaStream);
    callPeersWithVideo();
    setSeatMediaStatus(account.id);
  };

  const callPeersWithVideo = () => rtc.createRtcPeers(boardRoomSession);

  const onlocalstream = (mediaStream) => {
    setOpenMeetingGrid(true);
    setDisplayLocalStream(true);
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    localStream = mediaStream;
    localStreamRefNode.current.srcObject = mediaStream;
    // setSeatMediaStatus(account.id);
  };

  const onpeercreated = (peer) => {
    setRemotePeersViewNodes([
      ...remotePeersViewNodes,
      {
        clientId: peer,
        videoNode: (
          <RemoteView key={peer} clientId={peer} ref={(node) => (remotePeersViewRefNodes.current[peer] = node)} />
        )
      }
    ]);
    return remotePeersViewRefNodes.current[peer];
  };

  const setSeatMediaStatus = (peer) => {
    const seats = seatedParticipants.map((seat) => {
      if (seat.id === peer) {
        seat = { ...seat, cam_on: true, mic_on: true };
      }
      return seat;
    });
    dispatch(setSeatedBoardRoomParticipants(seats));
  };

  const handleDocumentContent = (text) => {
    if (text !== '' && text !== '<p><br></p>') {
      if (documents[currentViewIndex].question !== 'Présentez votre équipe projet') {
        const field = documents[currentViewIndex].fields[0];
        setBusinessPlanFields({ ...businessPlanFields, [field]: text });
      }
      setFieldContent(text);
    }
  };

  const handleNextView = () => {
    if (currentViewIndex === documents.length - 1) {
      setCurrentViewIndex(0);
      return;
    }
    setCurrentViewIndex(currentViewIndex + 1);
  };

  const handlePrevView = () => {
    if (currentViewIndex === 0) {
      setCurrentViewIndex(0);
      return;
    }
    setCurrentViewIndex(currentViewIndex - 1);
  };

  const onSave = () => {
    if (documents[currentViewIndex].question !== 'Présentez votre équipe projet') {
      const field = documents[currentViewIndex].fields[0];
      const data = businessPlanFields[field];
      switch (documents[currentViewIndex].label) {
        case "L'idée de projet en quelques mots":
          dispatch(updateProjectPreparation({ [field]: data }, work.id));
          break;
        case 'Le marché':
        case 'La concurrence':
        case 'La clientèle':
        case 'L’offre de produits et/ou services':
        case 'Points forts / points faibles':
        case 'Les objectifs commerciaux':
        case 'La distribution des produits et/ou services':
        case 'La stratégie de communication':
        case "Le plan d'action opérationnel":
          dispatch(updateProjectMarketResearch({ [field]: data }, work.id));
          break;
        default:
          enqueueSnackbar('champ inconnu', { variant: 'error' });
      }
    }
  };

  const errorMessageCallback = (msg) => {
    enqueueSnackbar("Salle de conférence fermée en raison d'une erreur", { variant: 'error' });
  };

  const statusMessageCallback = (status) => {
    setBoardRoomStatus(status);
  };

  const sessionMessageCallback = (sessionId) => {
    setBoardRoomSession(sessionId);
  };

  const peerJoined = (seatsOnline) => {
    if (seatsOnline && typeof seatsOnline !== 'undefined') {
      if (isMountedRef.current) {
        setBoardRoomSeats(seatsOnline);
      }
    }
  };

  const peerLeft = (clientId) => {
    const seat = window.rtc.boardRoomSeats.find((seat) => seat.id === clientId);
    setOfflineClient({ ...offlineClient, [clientId]: true });
    enqueueSnackbar(`${seat.first_name} ${seat.last_name} a quitté la salle`, { variant: 'info' });
  };

  const onboardRoomConversationMessage = (messages) => {
    setBoardRoomMessages(messages);
  };

  const handleSendMessage = async (value) => {
    try {
      rtc.sendBoardRoomConversationMessage(value, boardRoomSession);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveBoardRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    rtc.stopMediaStream();
    rtc.closePeerClient(boardRoomSession);
    setOpenMeetingGrid(false);
  };

  const handleToggleMic = () => {
    if (rtc) {
      rtc.toggleAudioMute();
    }
    const peer = account.id;
    const seats = seatedParticipants.map((seat) => {
      if (seat.id === peer) {
        const c_ = seat.mic_on;
        seat.mic_on = !c_;
      }
      return seat;
    });
    dispatch(setSeatedBoardRoomParticipants(seats));
  };

  const handleToggleCam = () => {
    if (rtc) {
      rtc.toggleVideoMute();
    }
    const peer = account.id;
    const seats = seatedParticipants.map((seat) => {
      if (seat.id === peer) {
        const c_ = seat.cam_on;
        seat.cam_on = !c_;
      }
      return seat;
    });

    dispatch(setSeatedBoardRoomParticipants(seats));
  };
  const handleModifyStakeholder = (stakeholder) => {
    setAddStakeholder(true);
    setIsEditStakeholder(true);
    setCurrentStakeholderModify(stakeholder);
  };

  const renderDrawer = () => (
    <Box>
      <IconButton aria-label="back" size="large" onClick={handleDrawerToggle}>
        <ArrowBackIcon fontSize="inherit" />
      </IconButton>
      <List component="nav">
        {documentsOutline.map((item, index) => {
          const sub_ = index + 1;
          const currDoc = documents[currentViewIndex];
          return (
            <Fragment key={item.doc_type}>
              <ListItemButton key={item.doc_type} onClick={handleDocOutlineExpansion}>
                <ListItemIcon sx={{ color: 'inherit' }}>{index + 1}</ListItemIcon>
                <ListItemText primary={item.doc_type} primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
                {sub_ === 1 && (openDocOutlineExpansion ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openDocOutlineExpansion} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.field_labels.map((label, i) => (
                    <>
                      <ListItemButton
                        onClick={() => handleSelectedDocView(label)}
                        key={label}
                        sx={{
                          pl: 4,
                          color: currDoc.label === label ? { background: '#001E3C', color: '#fff' } : ''
                        }}
                      >
                        <ListItemIcon>
                          {sub_}.{i + 1}
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </>
                  ))}
                </List>
              </Collapse>
            </Fragment>
          );
        })}
      </List>
    </Box>
  );

  useEffect(() => {
    if (work) {
      dispatch(getProjectBusinessPlan(work.id, apiPrefix));
      dispatch(getProjectLegalStatus(work.id, apiPrefix));
    }
  }, [work.id]);

  useEffect(() => {
    if (work && work.id) {
      let signalingApi = 'workstation/projects/:id/wsWebRtc/'.replace(':id', work.id);
      if (accountType === 'stakeholder') {
        signalingApi = 'stakeholder/workstation/projects/wsWebRtc/';
      }
      try {
        setRtc(
          new RTC(
            peerLeft,
            peerJoined,
            sessionMessageCallback,
            statusMessageCallback,
            errorMessageCallback,
            work.id,
            account.id,
            signalingApi,
            onlocalstream,
            onpeercreated,
            onboardRoomConversationMessage
          )
        );
      } catch (error) {
        console.log('error == ', error);
      }
    }
  }, [work.id]);

  useEffect(async () => {
    if (rtc) {
      try {
        await rtc.openSignalingChannel();
      } catch (error) {
        console.log('error == ', error);
      }
    }
  }, [rtc]);

  useEffect(() => {
    if (rtc && boardRoomSession && boardRoomSeats.length > 0) {
      rtc.boardRoomSeats = boardRoomSeats;
      rtc.loadBoardRroomMessage();
      const seated = boardRoomSeats.reduce((acc, boardSeat) => {
        const seated = {
          ...boardSeat
        };
        acc.push(seated);
        return acc;
      }, []);
      dispatch(setSeatedBoardRoomParticipants(seated));
    }
  }, [boardRoomSession, boardRoomSeats]);

  useEffect(() => {
    if (error && businessPlanFieldUpdated) {
      enqueueSnackbar('failed to save. something went wrong', { variant: 'error' });
    }
  }, [error, businessPlanFieldUpdated]);

  useEffect(() => {
    if (work.business_plan) {
      const data = {};
      documents.forEach((document) => {
        if (document.question !== 'Présentez votre équipe projet') {
          const field = document.fields[0];
          if (document.question === 'Présentez votre idée de projet') {
            data[field] = work.business_plan.project_preparation[field];
          } else {
            data[field] = work.business_plan.project_market_research[field];
          }
        }
      });
      setBusinessPlanFields(data);
    }
  }, [work.business_plan]);

  useEffect(() => {
    if (documents[currentViewIndex].question !== 'Présentez votre équipe projet') {
      const field = documents[currentViewIndex].fields[0];
      setFieldContent(businessPlanFields[field]);
    }
  }, [currentViewIndex]);

  return (
    <Box sx={{ height: '100%' }}>
      {openMeetingGrid && (
        <MeetingGrid
          remotePeersViewNodes={remotePeersViewNodes}
          localStreamNode={getLocalStreamNode()}
          displayLocalStream={displayLocalStream}
          leave={handleLeaveBoardRoom}
          toggleMic={handleToggleMic}
          toggleWebcam={handleToggleCam}
          openMeetingGrid={openMeetingGrid}
          handleSendMessage={handleSendMessage}
          account={account}
          conversations={boardRoomMessages}
          boardRoomSeats={boardRoomSeats}
          offlineClient={offlineClient}
          setRemotePeersViewNodes={setRemotePeersViewNodes}
        />
      )}
      <OnlinePeersLayoutModalDialog
        boardRoomSeats={boardRoomSeats}
        addStakeholdersPeers={addStakeholdersPeers}
        setAddStakeholdersPeers={setAddStakeholdersPeers}
        handleTogglePeersJoin={handleTogglePeersJoin}
        checkedPeer={checked}
        startBoardRoomConferenceCall={startBoardRoomConferenceCall}
      />
      <DialogAnimate fullScreen open={openPDF} onClose={handleClosePreview}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={handleClosePreview}>
                <Icon icon={closeFill} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <BusinessPlanPDF document={businessPlanFields} work={work} account={account} />
            </PDFViewer>
          </Box>
        </Box>
      </DialogAnimate>
      <Box
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          height: 'calc(100% - 50px)',
          pt: '54px',
          backgroundColor: '#fff',
          borderColor: 'rgba(30, 73, 118, 0.7)'
        }}
      >
        <Box
          flexDirection="row"
          sx={{
            height: '100%',
            flexGrow: 1,
            [theme.breakpoints.down('lg')]: {
              width: '100%'
            },
            display: 'flex'
          }}
        >
          <Box sx={{ width: '100%', flexGrow: 1 }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 50,
                pl: 2,
                bgcolor: '#001E3C'
              }}
            >
              <Typography
                sx={{ typography: 'h4', color: '#fff', [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}
              >
                {documents[currentViewIndex].question}
              </Typography>
              {/* <Typography
                sx={{ typography: 'h4', color: '#fff', [theme.breakpoints.down('md')]: { fontSize: '2.5vw' } }}
              >
                {currentViewIndex + 1} / {maxSteps}
              </Typography> */}
              <ToggleButtonGroup
                aria-label="business plan"
                sx={{ height: '30px', backgroundColor: '#252629', marginRight: '10px' }}
              >
                <ToggleButton value="preview" aria-label="preview" onClick={handleOpenPreview}>
                  <PreviewIcon sx={{ color: '#fff' }} />
                </ToggleButton>
                <ToggleButton value="download" aria-label="download">
                  <PDFDownloadLink
                    document={<BusinessPlanPDF document={document} work={work} account={account} />}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => <CloudDownloadIcon sx={{ color: '#fff' }} />}
                  </PDFDownloadLink>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
            <Box
              sx={{
                width: '100%',
                height: '100%'
                // [theme.breakpoints.down('md')]: { p: 0, height: 'calc(100% - 50px)' }
              }}
            >
              {messagingOff && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%'
                    // [theme.breakpoints.down('md')]: { p: 0, height: 'calc(100% - 50px)' }
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    {documents[currentViewIndex].question !== 'Présentez votre équipe projet' &&
                      !editingDocument &&
                      content !== '' && (
                        <Sheet
                          sx={{
                            mt: 1,
                            borderRadius: '12px',
                            backgroundColor: '#001E3C',
                            padding: '10px 10px',
                            borderColor: '#132F4C',
                            color: 'rgb(248, 248, 242)'
                          }}
                        >
                          <Box sx={{ height: '100%' }}> {parse(content)}</Box>
                        </Sheet>
                      )}
                    {documents[currentViewIndex].question === 'Présentez votre équipe projet' &&
                      work.business_plan &&
                      work.business_plan.project_stakeholders && (
                        <StakeHolderList handleModifyStakeholder={handleModifyStakeholder} />
                      )}
                    {documents[currentViewIndex].question === 'Présentez votre équipe projet' &&
                      !onAddStakeholder &&
                      isCreator && (
                        <MFab
                          color="secondary"
                          onClick={() => {
                            setAddStakeholder(true);
                          }}
                        >
                          <GroupAddIcon />
                        </MFab>
                      )}
                    {documents[currentViewIndex].question === 'Présentez votre équipe projet' && onAddStakeholder && (
                      <IconButton
                        aria-label="Annuler"
                        color="error"
                        onClick={() => {
                          setAddStakeholder(false);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                    {documents[currentViewIndex].question !== 'Présentez votre équipe projet' && editingDocument && (
                      <QuillEditor
                        sx={{
                          border: 'none',
                          backgroundColor: '#fff',
                          borderRadius: 0,
                          height: '100%',
                          // [theme.breakpoints.down('md')]: { p: 0, height: 'calc(100% - 50px)' }
                          '& .ql-toolbar.ql-snow': {
                            border: 'none !important'
                          }
                        }}
                        id="post-content"
                        value={content}
                        readOnly={!isCreator}
                        onChange={(val) => {
                          handleDocumentContent(val);
                        }}
                      />
                    )}
                    {documents[currentViewIndex].question === 'Présentez votre équipe projet' &&
                      onAddStakeholder &&
                      isCreator && (
                        <NewStakeHolder
                          isEdit={isEditStakeholder}
                          currentUser={currentStakeholderModify}
                          handleAddStakeholder={setAddStakeholder}
                        />
                      )}
                  </Box>
                  <Box>
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                      onClick={handleDrawerToggle}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
              {!messagingOff && (
                <Box sx={{ height: '100%', pb: '112px' }}>
                  <Box
                    sx={{
                      height: '100%',
                      transform: 'translate3d(0,0,0)',
                      backgroundColor: 'rgb(234,238,249)'
                    }}
                    ref={ref}
                  >
                    <MessageList
                      messages={boardRoomMessages}
                      seatedPeers={rtc && rtc.boardRoomSeats ? rtc.boardRoomSeats : []}
                      sx={{ mb: 'auto' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: '#252629',
                      height: 56
                    }}
                  >
                    <MessageInput disabled={false} onSend={handleSendMessage} />
                  </Box>
                </Box>
              )}
            </Box>
            {creatingProjectStakeholder && (
              <Box>
                <LinearProgress />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {!work.business_plan && SkeletonLoad}
      {contentDrawer && (
        <Drawer
          anchor="right"
          variant="permanent"
          open={contentDrawer}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              marginTop: '54px',
              height: 'calc(100% - 54px)',
              backgroundColor: '#D8E9E7'
            }
          }}
        >
          {renderDrawer()}
        </Drawer>
      )}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#D8E9E7' }} elevation={3}>
        <BottomNavigation sx={{ backgroundColor: '#D8E9E7', color: '#252629' }}>
          {documents[currentViewIndex].question !== 'Présentez votre équipe projet' && (
            <BottomNavigationAction
              sx={{ color: '#252629' }}
              icon={<SaveIcon sx={{ color: '#252629' }} />}
              onClick={onSave}
            />
          )}

          <BottomNavigationAction
            sx={{ color: '#252629' }}
            onClick={handlePrevView}
            icon={<KeyboardArrowLeft sx={{ color: '#252629' }} />}
          />
          <BottomNavigationAction
            sx={{ color: '#252629' }}
            onClick={handleNextView}
            icon={<KeyboardArrowRight sx={{ color: '#252629' }} />}
          />
          <BottomNavigationAction
            sx={{ color: '#252629' }}
            icon={
              messagingOff ? (
                <InsertCommentIcon sx={{ color: '#252629' }} />
              ) : (
                <SpeakerNotesOffIcon sx={{ color: '#252629' }} />
              )
            }
            onClick={() => setMessagingOff(!messagingOff)}
          />
          <BottomNavigationAction
            sx={{ color: '#252629' }}
            // icon={<VideoCallIcon sx={{ color: '#252629' }} onClick={handleOnClickConference} />}
            icon={
              <Icon
                icon={videoFill}
                width={20}
                height={20}
                sx={{ color: '#252629' }}
                onClick={handleOnClickConference}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
