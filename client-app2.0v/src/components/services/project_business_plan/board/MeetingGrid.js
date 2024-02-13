import { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import FlagIcon from '@mui/icons-material/Flag';
import {
  Grid,
  Icon,
  Stack,
  ToggleButton,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Avatar,
  Badge,
  Container
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { Modal, Card, CardContent, CardCover } from '@mui/joy';
import { styled } from '@mui/material/styles';
import { MessageInput, NewStakeHolder, MessageList } from '..';
import { useSelector } from '../../../../redux/store';
import Logo from '../../../Logo';

const RootStyle = styled(Box)(({ theme }) => ({
  flexGrow: 1
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  height: '100%',
  backgroundColor: 'rgb(52, 53, 69)',
  padding: theme.spacing(2)
}));

MeetingGrid.propTypes = {
  leave: PropTypes.func,
  toggleMic: PropTypes.func,
  toggleWebcam: PropTypes.func,
  localStreamNode: PropTypes.node,
  remotePeersViewNodes: PropTypes.array,
  openMeetingGrid: PropTypes.bool,
  displayLocalStream: PropTypes.bool,
  handleSendMessage: PropTypes.func.isRequired,
  conversations: PropTypes.array,
  boardRoomSeats: PropTypes.array,
  account: PropTypes.object,
  offlineClient: PropTypes.object,
  setRemotePeersViewNodes: PropTypes.func
};

export default function MeetingGrid({
  leave,
  toggleMic,
  toggleWebcam,
  localStreamNode,
  remotePeersViewNodes,
  openMeetingGrid,
  displayLocalStream,
  handleSendMessage,
  conversations,
  boardRoomSeats,
  account,
  offlineClient,
  setRemotePeersViewNodes
}) {
  const ref = useRef(null);
  const [minutes, setMinutes] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [displayChat, setDisplayChat] = useState(false);
  const { work } = useSelector((state) => state.project);
  const { seatedParticipants } = work;
  const me = seatedParticipants?.find((seat) => seat.id === account.id);
  /* eslint-disable camelcase */
  const { id, first_name, last_name, status, profile_image, cam_on, mic_on } = me || {};
  const otherParticipants = seatedParticipants?.filter((seat) => seat.id !== account.id);

  useEffect(() => {
    if (displayChat) {
      ref.current.ownerDocument.body.scrollTop = 0;
    }
  }, [displayChat]);

  useEffect(() => {
    if (displayLocalStream && minutes === 0) {
      let t = 1;
      const timer = setInterval(() => {
        let minutes = parseInt(t / 60, 10);
        let secondes = parseInt(t % 60, 10);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        secondes = secondes < 10 ? `0${secondes}` : secondes;

        setMinutes(minutes);
        setSecondes(secondes);
        t = t <= 0 ? 0 : t + 1;
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [displayLocalStream]);

  useEffect(() => {
    if (offlineClient && Object.keys(offlineClient).length > 0) {
      const onLineViews = [];
      remotePeersViewNodes.forEach((view) => {
        if (view.clientId in offlineClient) {
          view.current = null;
        } else {
          onLineViews.push(view);
        }
      });
      setRemotePeersViewNodes(onLineViews);
    }
  }, [offlineClient]);

  return (
    <Modal
      open={openMeetingGrid}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgb(38, 38, 53)'
          }
        }
      }}
    >
      <>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgb(38, 38, 53)' }}
        >
          <Toolbar
            sx={{
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minWidth: '200px'
              }}
            >
              <Card sx={{ minWidth: '200px' }}>
                <Logo sx={{ color: '#fff' }} />
              </Card>
            </Box>
            <Stack spacing={2} direction="row">
              <ToggleButton value="null">
                <Typography>
                  {minutes}:{secondes}
                </Typography>
              </ToggleButton>
              <ToggleButton value="null" onClick={toggleMic}>
                <MicIcon />
              </ToggleButton>
              <ToggleButton value="null" onClick={toggleWebcam}>
                <VideocamIcon />
              </ToggleButton>
              <Badge color="success" variant="dot">
                <ToggleButton value="null" onClick={() => setDisplayChat(!displayChat)}>
                  <ChatIcon />
                </ToggleButton>
              </Badge>

              <ToggleButton
                value="null"
                onClick={leave}
                sx={{
                  backgroundColor: 'rgb(182, 73,71)'
                }}
              >
                <CallEndIcon sx={{ color: '#fff' }} />
              </ToggleButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <RootStyle>
          <Toolbar />
          <Grid container>
            <Grid
              item
              xs={12}
              md={8}
              lg={8}
              sx={{
                height: 'calc(100vh - 50px)'
              }}
            >
              <Grid container>
                {displayLocalStream && (
                  <Grid item xs>
                    <Box sx={{ p: 1 }}>{localStreamNode}</Box>
                  </Grid>
                )}
                {remotePeersViewNodes &&
                  remotePeersViewNodes.map((remote) => (
                    <Grid item key={remote.clientId} xs>
                      <Box sx={{ p: 1 }}>{remote.videoNode}</Box>
                    </Grid>
                  ))}
              </Grid>
            </Grid>

            <Grid
              item
              xs={4}
              md={4}
              lg={4}
              sx={{
                height: 'calc(100vh - 50px)'
              }}
            >
              {displayChat && (
                <Box sx={{ p: 1, height: '100%' }}>
                  <ListWrapperStyle elevation={3}>
                    <Stack>
                      <Box>
                        <MessageInput disabled={false} onSend={handleSendMessage} />
                      </Box>
                      <Box sx={{ height: 500, transform: 'translate3d(0,0,0)' }} ref={ref}>
                        <MessageList messages={conversations} seatedPeers={boardRoomSeats} sx={{ mb: 'auto' }} />
                      </Box>
                    </Stack>
                  </ListWrapperStyle>
                </Box>
              )}
              {!displayChat && (
                <Box sx={{ p: 1, height: '100%' }}>
                  <ListWrapperStyle elevation={1}>
                    <Typography sx={{ color: '#fff', typography: 'h6' }}>membres dans la salle</Typography>
                    <List sx={{}}>
                      {me && (
                        <ListItem
                          sx={{ backgroundColor: 'rgb(62, 62, 80)', color: '#fff', borderRadius: '8px', mt: 2, mb: 2 }}
                          secondaryAction={
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{
                                alignItems: 'center'
                              }}
                            >
                              <ToggleButton
                                value={mic_on}
                                sx={{
                                  height: '30px',
                                  width: '30px',
                                  backgroundColor: !mic_on ? 'red' : null
                                }}
                              >
                                {mic_on ? <MicIcon sx={{ color: '#fff' }} /> : <MicOffIcon sx={{ color: '#fff' }} />}
                              </ToggleButton>
                              <ToggleButton
                                value={cam_on}
                                sx={{
                                  height: '30px',
                                  width: '30px',
                                  backgroundColor: !cam_on ? 'red' : null
                                }}
                              >
                                {cam_on ? (
                                  <VideocamIcon sx={{ color: '#fff' }} />
                                ) : (
                                  <VideocamOffIcon sx={{ color: '#fff' }} />
                                )}
                              </ToggleButton>
                            </Stack>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar src={profile_image} />
                          </ListItemAvatar>
                          <ListItemText primary={`${first_name} ${last_name}`} secondary="Vous" />
                        </ListItem>
                      )}
                      {otherParticipants?.map((seat) => {
                        const { id, first_name, last_name, profile_image, cam_on, mic_on } = seat;
                        return (
                          <ListItem
                            key={id}
                            sx={{
                              backgroundColor: 'rgb(62, 62, 80)',
                              color: '#fff',
                              borderRadius: '8px',
                              mt: 2,
                              mb: 2
                            }}
                            secondaryAction={
                              <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                  alignItems: 'center'
                                }}
                              >
                                <ToggleButton
                                  value={mic_on}
                                  sx={{
                                    height: '30px',
                                    width: '30px',
                                    backgroundColor: !mic_on ? 'red' : null
                                  }}
                                >
                                  {mic_on ? <MicIcon sx={{ color: '#fff' }} /> : <MicOffIcon sx={{ color: '#fff' }} />}
                                </ToggleButton>
                                <ToggleButton
                                  value={cam_on}
                                  sx={{
                                    height: '30px',
                                    width: '30px',
                                    backgroundColor: !cam_on ? 'red' : null
                                  }}
                                >
                                  {cam_on ? (
                                    <VideocamIcon sx={{ color: '#fff' }} />
                                  ) : (
                                    <VideocamOffIcon sx={{ color: '#fff' }} />
                                  )}
                                </ToggleButton>
                              </Stack>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar src={profile_image} />
                            </ListItemAvatar>
                            <ListItemText primary={`${first_name} ${last_name}`} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </ListWrapperStyle>
                </Box>
              )}
            </Grid>
          </Grid>
        </RootStyle>
      </>
    </Modal>
  );
}
// ----------------------------------------------------------------------
