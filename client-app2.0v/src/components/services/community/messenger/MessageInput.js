import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import micFill from '@iconify/icons-eva/mic-fill';
import micOffFill from '@iconify/icons-eva/mic-off-fill';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
import Slider from 'react-slick';
import CloseIcon from '@mui/icons-material/Close';
import { positions } from '@mui/system';
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// material
import { styled, useTheme } from '@mui/material/styles';
import {
  Input,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  FormGroup,
  FormControlLabel,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Drawer,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Box,
  TextField,
  Typography,
  CardHeader
} from '@mui/material';
//
import { useSnackbar } from 'notistack';
import { getFileFullName, getFileThumb } from '../../../../utils/getFileFormat';
import EmojiPicker from '../../../EmojiPicker';
import { ButtonAnimate } from '../../../animate';
import Scrollbar from '../../../Scrollbar';
import { CarouselControlsArrowsIndex } from '../../../carousel/controls';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { DraftEditor } from '../../../editor';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  padding: theme.spacing(2)
}));

// ----------------------------------------------------------------------

const AudioRootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column'
});

// ----------------------------------------------------------------------
const AudioRootItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center'
  },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 }
  }
}));

// ----------------------------------------------------------------------

const CamRootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column'
});

// ----------------------------------------------------------------------
const CamRootItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center'
  },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 }
  }
}));

// ----------------------------------------------------------------------
const FileItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // marginTop: theme.spacing(2),
  padding: theme.spacing(0, 2.5)
}));

const FileThumbStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[500_16]
}));

// ----------------------------------------------------------------------

const ActionsRootStyle = styled('div')(({ theme }) => ({
  height: 40,
  zIndex: 99,
  opacity: 0,
  margin: 'auto',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(1),
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  justifyContent: 'center',
  padding: theme.spacing(0, 0.75),
  boxShadow: theme.customShadows.z12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('opacity')
}));

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
  onChangeImageMessage: PropTypes.func,
  index: PropTypes.number
};

function CarouselItem({ item, onChangeImageMessage, index }) {
  const { file, name, message } = item;
  return (
    <Stack>
      <Box component="img" alt={name} src={file} sx={{ width: '100%', height: 480, objectFit: 'cover' }} />
      <TextField
        sx={{
          mt: 1,
          mb: 1
        }}
        id="outlined-multiline-static"
        label="message"
        multiline
        rows={4}
        value={message}
        onChange={onChangeImageMessage('message', index)}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

FileItem.propTypes = {
  file: PropTypes.object
};

function FileItem(file) {
  const fileObj = file.file;
  return (
    <FileItemStyle key={fileObj.name}>
      <FileThumbStyle>{getFileThumb(fileObj.name, fileObj.file)}</FileThumbStyle>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {getFileFullName(fileObj.name)}
        </Typography>
        <Typography noWrap variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          size: {fileObj.size} MB
        </Typography>
      </Box>
    </FileItemStyle>
  );
}

// ----------------------------------------------------------------------

let audioCtx;
let mediaStream;
const MULTI_FILES_TOTAL_SIZE = 5.12;

// ----------------------------------------------------------------------

MessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func.isRequired,
  recipientsSelectionRef: PropTypes.object
};

export default function MessageInput({ recipientsSelectionRef, disabled, conversationId, onSend, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { conversations, recipients } = useSelector((state) => state.messenger);
  const { account } = useSelector((state) => state.user);
  const recipientsIds = recipients.map((f) => f.c_uuid);
  const [messageType, setMessageType] = useState('text');
  // Text messages
  const [message, setMessage] = useState('');
  const [draftSimple, setDraftSimple] = useState(EditorState.createEmpty());
  // Cam and Audio messages
  const recordAudioRef = useRef(null);
  const stopAudioRef = useRef(null);
  const recordCamRef = useRef(null);
  const stopCamRef = useRef(null);
  const canvasRef = useRef(null);
  const camRef = useRef(null);
  const [audioAddMessage, setAudioAddMessage] = useState([]);
  const [camAddMessage, setCamAddMessage] = useState([]);
  const [displayMicControls, setDisplayMicControls] = useState(false);
  const [displayCamControls, setDisplayCamControls] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [camRecordings, setCamRecordings] = useState([]);

  // Photos and Files
  const fileInputRef = useRef(null);
  const filesInputRef = useRef(null);
  const carouselRef = useRef();
  const [imageFile, setImageFile] = useState([]);
  const [multiFiles, setMultiFiles] = useState([]);
  const [multiFilesTotalSize, setMultiFilesTotalSize] = useState(0);
  const [multiFilesTotalSizeExceeded, setMultiFilesTotalSizeExceeded] = useState(false);

  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current, next) => setCurrentIndex(next)
  };
  // const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? imageFile.length - 1 : 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAttach = (type) => (event) => {
    setMessageType(type);
    if (type === 'image') {
      fileInputRef.current.click();
      return;
    }
    filesInputRef.current.click();
  };

  // const handleChangeMessage = (event) => {
  //   setMessage(event.target.value);
  // };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const getConversationType = () => {
    if (pathname === PATH_DASHBOARD.hub.new && !conversationId && recipients.length > 0) {
      return recipients.length === 1 ? 'ONE_TO_ONE' : 'GROUP';
    }
    return conversations.byId[conversationId].type;
  };

  const handleSend = async () => {
    if (!conversationId) {
      if (!recipientsIds || recipientsIds.length === 0) {
        enqueueSnackbar('Destinataires manquants', { variant: 'error' });
        if (recipientsSelectionRef.current) {
          recipientsSelectionRef.current.focus();
          return;
        }
      }
    }
    const conversationType = getConversationType();
    if (messageType === 'text') {
      const message = draftToHtml(convertToRaw(draftSimple.getCurrentContent()));
      if (!message) {
        return '';
      }
      if (onSend) {
        onSend({
          conversationId,
          type: conversationType,
          message,
          contentType: messageType,
          attachments: [],
          senderId: account.id,
          recipients: recipientsIds
        });
        setDraftSimple(EditorState.createEmpty());
        setMessage('');
      }
    }

    if (messageType === 'image') {
      if (imageFile.length === 0) {
        return;
      }
      const sendImagesPromise = imageFile.map((file) => sendImageFile(file));
      Promise.all(sendImagesPromise).then(() => {
        setImageFile([]);
        setMessageType('text');
      });
    }

    if (messageType === 'multi-file') {
      if (multiFiles.length === 0) {
        return;
      }
      sendMultiFiles(multiFiles).then((files) => {
        onSend({
          conversationId,
          contentType: messageType,
          attachments: [...files],
          type: conversationType,
          recipients: recipientsIds
        });
        setMultiFiles([]);
        setMultiFilesTotalSize(0);
        setMultiFilesTotalSizeExceeded(false);
        setMessageType('text');
      });
    }
  };

  const sendImageFile = (imageFile) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const conversationType = getConversationType();
        onSend({
          conversationId,
          contentType: messageType,
          attachments: [
            {
              file: event.target.result.split(',')[1],
              name: imageFile.name,
              message: imageFile.message
            }
          ],
          type: conversationType,
          recipients: recipientsIds
        }).then(() => resolve('sent'));
      };
      reader.readAsDataURL(imageFile.blob);
    });

  const sendMultiFiles = (files) =>
    new Promise((resolve) => {
      const filesBlob = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = function (event) {
              resolve({
                file: event.target.result.split(',')[1],
                name: file.name,
                type: file.type,
                message: ''
              });
            };

            reader.readAsDataURL(file.blob);
          })
      );
      resolve(Promise.all(filesBlob));
    });

  const stopStream = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  };

  const handleMic = () => {
    setDisplayCamControls(false);
    let chunks = [];
    setMessageType('audio');
    if (displayMicControls) {
      chunks = [];
      setDisplayMicControls(false);
      setAudioRecordings([]);
      setMessage('');
      setAudioAddMessage([]);
      if (stopAudioRef.current !== null && typeof stopAudioRef.current !== 'undefined') {
        stopAudioRef.current.click();
      }
      stopStream(mediaStream);
      setMessageType('text');
      return;
    }

    if (navigator.mediaDevices.getUserMedia) {
      setDisplayMicControls(true);

      const constraints = { audio: true };

      const onSuccess = function (stream) {
        const mediaRecorder = new MediaRecorder(stream);

        mediaStream = mediaRecorder.stream;

        visualize(stream);

        recordAudioRef.current.onclick = function () {
          mediaRecorder.start();

          enqueueSnackbar('commencer à enregistrer le message', { variant: 'info' });

          stopAudioRef.current.disabled = false;
          recordAudioRef.current.disabled = true;
        };

        stopAudioRef.current.onclick = function () {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
          enqueueSnackbar('enregistrement terminé', { variant: 'info' });

          stopAudioRef.current.disabled = true;
          recordAudioRef.current.disabled = false;
        };

        mediaRecorder.onstop = function (e) {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
          chunks = [];

          setAudioRecordings((recordings) => [
            ...recordings,
            {
              url: window.URL.createObjectURL(blob),
              blob,
              name: 'untitled',
              message: ''
            }
          ]);
        };

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
      };

      const onError = (err) => {
        console.log('The following error occured: ', err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  };

  const handleVid = () => {
    setDisplayMicControls(false);
    let chunks = [];
    setMessageType('cam');
    if (displayCamControls) {
      chunks = [];
      setDisplayCamControls(false);
      setCamRecordings([]);
      setMessage('');
      setCamAddMessage([]);
      if (stopCamRef.current !== null && typeof stopCamRef.current !== 'undefined') {
        stopCamRef.current.click();
      }
      stopStream(mediaStream);
      setMessageType('text');
      return;
    }

    if (navigator.mediaDevices.getUserMedia) {
      setDisplayCamControls(true);
      console.log('getUserMedia supported.');

      const constraints = { video: true, audio: true };

      const onSuccess = function (stream) {
        const mediaRecorder = new MediaRecorder(stream);

        mediaStream = mediaRecorder.stream;

        // visualize(stream);
        if (typeof camRef !== 'undefined' && camRef.current !== null) {
          camRef.current.srcObject = stream;
        }

        recordCamRef.current.onclick = function () {
          mediaRecorder.start();

          enqueueSnackbar('commencer à enregistrer le message', { variant: 'info' });

          stopCamRef.current.disabled = false;
          recordCamRef.current.disabled = true;
        };

        stopCamRef.current.onclick = function () {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
          enqueueSnackbar('enregistrement terminé', { variant: 'info' });

          stopCamRef.current.disabled = true;
          recordCamRef.current.disabled = false;
        };

        mediaRecorder.onstop = function (e) {
          const blob = new Blob(chunks, {
            type: 'video/webm'
          });
          chunks = [];

          setCamRecordings((recordings) => [
            ...recordings,
            {
              url: window.URL.createObjectURL(blob),
              blob,
              name: 'untitled',
              message: ''
            }
          ]);
        };

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
      };

      const onError = (err) => {
        console.log('The following error occured: ', err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  };
  const visualize = (stream) => {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    if (typeof canvasRef !== 'undefined' && canvasRef.current !== null) {
      (function draw() {
        if (typeof canvasRef !== 'undefined' && canvasRef.current !== null) {
          const WIDTH = canvasRef.current.width;
          const HEIGHT = canvasRef.current.height;
          const canvasCtx = canvasRef.current.getContext('2d');

          requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(dataArray);

          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

          canvasCtx.beginPath();

          const sliceWidth = (WIDTH * 1.0) / bufferLength;
          let x = 0;

          /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * HEIGHT) / 2;

            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
          canvasCtx.stroke();
        }
      })();
    }
  };

  const filterOutAudioFile = (index) => {
    setAudioRecordings((audioRecordings) => {
      const a = [...audioRecordings];
      window.URL.revokeObjectURL(a.splice(index, 1)[0].url);
      return a;
    });
  };

  const filterOutCamFile = (index) => {
    setCamRecordings((camRecordings) => {
      const a = [...camRecordings];
      window.URL.revokeObjectURL(a.splice(index, 1)[0].url);
      return a;
    });
  };

  const sendAudioFile = (audioFile) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const conversationType = getConversationType();
        onSend({
          conversationId,
          contentType: messageType,
          attachments: [
            {
              file: event.target.result.split(',')[1],
              name: audioFile.name === '' ? 'untitled' : audioFile.name,
              message: audioFile.message
            }
          ],
          type: conversationType,
          recipients: recipientsIds
        }).then(() => resolve('sent'));
      };
      reader.readAsDataURL(audioFile.blob);
    });

  const sendCamFile = (camFile) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const conversationType = getConversationType();
        onSend({
          conversationId,
          contentType: messageType,
          attachments: [
            {
              file: event.target.result.split(',')[1],
              name: camFile.name === '' ? 'untitled' : camFile.name,
              message: camFile.message
            }
          ],
          type: conversationType,
          recipients: recipientsIds
        }).then(() => resolve('sent'));
      };
      reader.readAsDataURL(camFile.blob);
    });

  const CAM_COMMANDS = [
    {
      name: 'TextMessage',
      icon: edit2Fill,
      exec: (index) => {
        if (camAddMessage[index]) {
          setCamAddMessage((msgs) => {
            const o = [...msgs];
            o[index] = false;
            return o;
          });
          return;
        }
        setCamAddMessage((msgs) => {
          const o = [...msgs];
          o[index] = true;
          return o;
        });
      }
    },
    {
      name: 'Delete',
      icon: trash2Fill,
      exec: filterOutCamFile
    },
    {
      name: 'Send',
      icon: roundSend,
      exec: (index) => {
        if (stopCamRef.current !== null) {
          stopCamRef.current.click();
        }
        const camFile = camRecordings[index];
        sendCamFile(camFile).then(() => {
          if (camRecordings.length === 1) {
            setDisplayCamControls(false);
            stopStream(mediaStream);
            setMessageType('text');
          }

          filterOutCamFile(index);
        });
      }
    }
  ];

  const AUDIO_COMMANDS = [
    {
      name: 'TextMessage',
      icon: edit2Fill,
      exec: (index) => {
        if (audioAddMessage[index]) {
          setAudioAddMessage((msgs) => {
            const o = [...msgs];
            o[index] = false;
            return o;
          });
          return;
        }
        setAudioAddMessage((msgs) => {
          const o = [...msgs];
          o[index] = true;
          return o;
        });
      }
    },
    {
      name: 'Delete',
      icon: trash2Fill,
      exec: filterOutAudioFile
    },
    {
      name: 'Send',
      icon: roundSend,
      exec: (index) => {
        if (stopAudioRef.current !== null) {
          stopAudioRef.current.click();
        }
        const audioFile = audioRecordings[index];
        sendAudioFile(audioFile).then(() => {
          if (audioRecordings.length === 1) {
            setDisplayMicControls(false);
            stopStream(mediaStream);
            setMessageType('text');
          }

          filterOutAudioFile(index);
        });
      }
    }
  ];

  const handleAudioFileChange = (key, index) => (event) => {
    setAudioRecordings((audioRecordings) => {
      const newk = audioRecordings.map((file, i) =>
        i === index
          ? {
              ...file,
              [key]: event.target.value
            }
          : file
      );
      return newk;
    });
  };

  const handleCamFileChange = (key, index) => (event) => {
    setCamRecordings((camRecordings) => {
      const newk = camRecordings.map((file, i) =>
        i === index
          ? {
              ...file,
              [key]: event.target.value
            }
          : file
      );
      return newk;
    });
  };

  const imageHandler = (e) => {
    setImageFile([
      {
        name: e.target.files[0].name,
        type: e.target.files[0].type,
        file: URL.createObjectURL(e.target.files[0]),
        blob: e.target.files[0]
      }
    ]);
  };

  const fileHandler = (e) => {
    const files = new Array(e.target.files.length).fill({}).map((file, i) => ({
      ...file,
      name: e.target.files[i].name,
      type: e.target.files[i].type,
      file: URL.createObjectURL(e.target.files[i]),
      blob: e.target.files[i],
      size: parseFloat((e.target.files[i].size / (1024 * 1024)).toFixed(2))
    }));

    setMultiFiles((mFiles) => mFiles.concat(files));
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  const handleFileChange = (key, index) => (event) => {
    setImageFile((files) => {
      const newk = files.map((file, i) =>
        i === index
          ? {
              ...file,
              [key]: event.target.value
            }
          : file
      );
      return newk;
    });
  };

  const handleFileDelete = (index) => (event) => {
    setMultiFiles((files) => files.filter((_, i) => i !== index));
  };

  // const handleDocumentContent = (text) => {
  //   debugger; // eslint-disable-line no-debugger
  //   if (text !== '' && text !== '<p><br></p>') {
  //     setMessage(text);
  //   }
  // };
  const handleEmoji = (text) => {
    const blocksFromHTML = convertFromHTML(text);
    const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    setDraftSimple(EditorState.createWithContent(content));
  };

  useEffect(() => {
    const totalSize = multiFiles.reduce((acc, file) => acc + file.size, 0);
    setMultiFilesTotalSize(totalSize);
    if (multiFiles.length === 0) {
      setMessageType('text');
    }
  }, [multiFiles]);

  useEffect(() => {
    if (multiFilesTotalSize > MULTI_FILES_TOTAL_SIZE) {
      setMultiFilesTotalSizeExceeded(true);
      return;
    }
    setMultiFilesTotalSizeExceeded(false);
  }, [multiFilesTotalSize]);

  return (
    <div
      style={{
        borderRadius: '8px',
        borderColor: '#565856',
        backgroundColor: '#D8E9E7',
        borderStyle: 'solid',
        borderWidth: '1px',
        margin: '8px 8px'
      }}
    >
      {displayMicControls && !displayCamControls && (
        <div style={{ marginTop: 'auto', color: '#fff' }}>
          <Card>
            <CardContent>
              <Scrollbar sx={{ height: '300px' }}>
                <FormGroup>
                  <>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <canvas ref={canvasRef} className="visualizer" height="60px" />
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: '10px', mb: '10px' }}>
                      <ButtonAnimate>
                        <Fab size="small" ref={recordAudioRef}>
                          <Icon icon="ci:play-arrow" width={20} height={20} />
                        </Fab>
                      </ButtonAnimate>
                      <ButtonAnimate>
                        <IconButton color="primary" ref={stopAudioRef}>
                          <Icon icon="bx:stop" width={20} height={20} />
                        </IconButton>
                      </ButtonAnimate>
                    </Stack>
                  </>
                </FormGroup>
                {audioRecordings.length > 0 && (
                  <AudioRootStyle>
                    {audioRecordings.map((file, i) => (
                      <div key={`file-${i}`}>
                        {file.url !== '' && (
                          <div key={i}>
                            <AudioRootItemStyle key={`audio-file-${i}`}>
                              <audio controls src={file.url}>
                                <source src={file.url} type="audio/ogg" />
                                <track kind="captions" />
                              </audio>

                              <ActionsRootStyle className="showActions" {...other}>
                                {AUDIO_COMMANDS.map((cmd) => (
                                  <Tooltip key={`${cmd.name}-${i}`} title={cmd.name}>
                                    <IconButton
                                      size="small"
                                      onClick={() => cmd.exec(i)}
                                      sx={{
                                        mx: 0.75,
                                        '&:hover': {
                                          color: 'text.primary'
                                        }
                                      }}
                                    >
                                      <Icon icon={cmd.icon} width={24} height={24} />
                                    </IconButton>
                                  </Tooltip>
                                ))}
                              </ActionsRootStyle>
                            </AudioRootItemStyle>
                            <Box key={`audio-file-name-${i}`} mt={1}>
                              <FormControl sx={{ width: '100%' }} variant="outlined">
                                <TextField
                                  id="filled-basic"
                                  label="nom de fichier"
                                  variant="filled"
                                  value={file.name}
                                  onChange={handleAudioFileChange('name', i)}
                                  sx={{
                                    mb: 1
                                  }}
                                />

                                {audioAddMessage[i] && (
                                  <TextField
                                    sx={{
                                      mt: 1,
                                      mb: 1
                                    }}
                                    id="outlined-multiline-static"
                                    label="message"
                                    multiline
                                    rows={4}
                                    value={file.message}
                                    onChange={handleAudioFileChange('message', i)}
                                  />
                                )}
                              </FormControl>
                            </Box>
                          </div>
                        )}
                      </div>
                    ))}
                  </AudioRootStyle>
                )}
              </Scrollbar>
            </CardContent>
          </Card>
        </div>
      )}
      {displayCamControls && !displayMicControls && (
        <div style={{ marginTop: 'auto', color: '#fff' }}>
          <Card>
            <CardContent>
              <Scrollbar>
                <FormGroup>
                  <>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <video
                        id="localVideo"
                        ref={camRef}
                        playsInline
                        autoPlay
                        muted
                        poster="https://assets.codepen.io/6093409/river.jpg"
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: '10px', mb: '10px' }}>
                      <ButtonAnimate>
                        <Fab size="small" ref={recordCamRef}>
                          <Icon icon="ci:play-arrow" width={20} height={20} />
                        </Fab>
                      </ButtonAnimate>
                      <ButtonAnimate>
                        <IconButton color="primary" ref={stopCamRef}>
                          <Icon icon="bx:stop" width={20} height={20} />
                        </IconButton>
                      </ButtonAnimate>
                    </Stack>
                  </>
                </FormGroup>
                {camRecordings.length > 0 && (
                  <CamRootStyle>
                    {camRecordings.map((file, i) => (
                      <div key={`file-${i}`}>
                        {file.url !== '' && (
                          <div key={i}>
                            <CamRootItemStyle key={`audio-file-${i}`}>
                              <video controls src={file.url}>
                                <source src={file.url} type="video/webm" />
                                <track kind="captions" />
                              </video>

                              <ActionsRootStyle className="showActions" {...other}>
                                {CAM_COMMANDS.map((cmd) => (
                                  <Tooltip key={`${cmd.name}-${i}`} title={cmd.name}>
                                    <IconButton
                                      size="small"
                                      onClick={() => cmd.exec(i)}
                                      sx={{
                                        mx: 0.75,
                                        '&:hover': {
                                          color: 'text.primary'
                                        }
                                      }}
                                    >
                                      <Icon icon={cmd.icon} width={24} height={24} />
                                    </IconButton>
                                  </Tooltip>
                                ))}
                              </ActionsRootStyle>
                            </CamRootItemStyle>
                            <Box key={`audio-file-name-${i}`} mt={1}>
                              <FormControl sx={{ width: '100%' }} variant="outlined">
                                <TextField
                                  id="filled-basic"
                                  label="nom de fichier"
                                  variant="filled"
                                  value={file.name}
                                  onChange={handleCamFileChange('name', i)}
                                  sx={{
                                    mb: 1
                                  }}
                                />

                                {camAddMessage[i] && (
                                  <TextField
                                    sx={{
                                      mt: 1,
                                      mb: 1
                                    }}
                                    id="outlined-multiline-static"
                                    label="message"
                                    multiline
                                    rows={4}
                                    value={file.message}
                                    onChange={handleCamFileChange('message', i)}
                                  />
                                )}
                              </FormControl>
                            </Box>
                          </div>
                        )}
                      </div>
                    ))}
                  </CamRootStyle>
                )}
              </Scrollbar>
            </CardContent>
          </Card>
        </div>
      )}
      <RootStyle {...other}>
        <DraftEditor
          sx={{
            maxHeight: 'calc(60vh - 80px)',
            border: 'none',
            backgroundColor: '#D8E9E7',
            '& .rdw-editor-toolbar': {
              borderBottom: 'none'
            },
            '& .rdw-editor-main': {
              minHeight: 'initial'
            },
            '& .rdw-dropdown-selectedtext': {
              color: '#fff'
            },
            '& .DraftEditor-editorContainer': {
              zIndex: 0
            }
            // borderRadius: 0,
            // height: '100%',
            // [theme.breakpoints.down('md')]: { p: 0, height: 'calc(100% - 50px)' }
            // '& .ql-toolbar.ql-snow': {
            //   border: 'none !important'
            // }
          }}
          placeholder="Ecrire un message"
          simple
          editorState={draftSimple}
          onEditorStateChange={(value) => setDraftSimple(value)}
          // sx={{
          //   border: 'none',
          //   backgroundColor: '#D8E9E7'
          //   // borderRadius: 0,
          //   // height: '100%',
          //   // [theme.breakpoints.down('md')]: { p: 0, height: 'calc(100% - 50px)' }
          //   // '& .ql-toolbar.ql-snow': {
          //   //   border: 'none !important'
          //   // }
          // }}
          // id="post-content"
          // value={message}
          // onChange={(val) => {
          //   handleDocumentContent(val);
          // }}
          // placeholder="Ecrire un message"
        />
        {/* <Input
          sx={{
            // color: 'grey.800',
            // color: 'primary.lighter'
            color: '#fff'
          }}
          disabled={disabled}
          fullWidth
          value={message}
          disableUnderline
          onKeyUp={handleKeyUp}
          onChange={handleChangeMessage}
          placeholder="Ecrire un message"
          endAdornment={
            <Stack direction="row" spacing={0.5} mr={1.5}>
              <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
              <IconButton disabled={disabled} size="small" onClick={handleAttach('image')}>
                <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
              </IconButton>
              <IconButton disabled={disabled} size="small" onClick={handleAttach('multi-file')}>
                <Icon icon={attach2Fill} width={24} height={24} />
              </IconButton>
              <IconButton disabled={disabled} size="small" onClick={handleMic}>
                <Icon icon={micFill} width={24} height={24} />
              </IconButton>
            </Stack>
          }
        /> */}
        <Stack direction="row" spacing={0.5} mr={1.5} sx={{ alignItems: 'center' }}>
          <EmojiPicker
            disabled={disabled}
            value={draftToHtml(convertToRaw(draftSimple.getCurrentContent()))}
            setValue={handleEmoji}
          />
          <Divider orientation="vertical" flexItem />
          <IconButton disabled={disabled} size="small" onClick={handleAttach('image')}>
            <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
          </IconButton>
          <IconButton disabled={disabled} size="small" onClick={handleAttach('multi-file')}>
            <Icon icon={attach2Fill} width={24} height={24} />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton disabled={disabled} size="small" onClick={handleMic}>
            <Icon icon={displayMicControls ? micOffFill : micFill} width={24} height={24} />
          </IconButton>
          <IconButton disabled={disabled} size="small" onClick={handleVid}>
            {displayCamControls ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g id="evaVideoOffFill0">
                  <g id="evaVideoOffFill1">
                    <path
                      id="evaVideoOffFill2"
                      fill="currentColor"
                      d="M14.22 17.05L4.88 7.71L3.12 6L3 5.8A3 3 0 0 0 2 8v8a3 3 0 0 0 3 3h9a2.94 2.94 0 0 0 1.66-.51ZM21 7.15a1.7 1.7 0 0 0-1.85.3l-2.15 2V8a3 3 0 0 0-3-3H7.83l1.29 1.29l6.59 6.59l2 2l2 2a1.73 1.73 0 0 0 .6.11a1.68 1.68 0 0 0 .69-.15a1.6 1.6 0 0 0 1-1.48V8.63a1.6 1.6 0 0 0-1-1.48Zm-4 8.44l-2-2L8.41 7l-2-2l-1.7-1.71a1 1 0 0 0-1.42 1.42l.54.53L5.59 7l9.34 9.34l1.46 1.46l2.9 2.91a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
                    />
                  </g>
                </g>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"
                />
              </svg>
            )}
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
            {!displayMicControls && !displayCamControls && (
              <IconButton
                disabled={
                  (messageType === 'multi-file' && multiFilesTotalSizeExceeded) ||
                  (messageType === 'text' && !draftSimple) ||
                  (messageType === 'image' && imageFile.length === 0)
                }
                onClick={() => handleSend()}
                sx={{ mx: 1 }}
              >
                <Icon icon={roundSend} width={24} height={24} />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* <Divider orientation="vertical" flexItem /> */}

        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={imageHandler} />
        <input
          type="file"
          name="files[]"
          ref={filesInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={fileHandler}
        />
      </RootStyle>
      {imageFile.length > 0 && messageType === 'image' && (
        <Scrollbar sx={{ height: '300px' }}>
          <Card sx={{ p: 3, mr: 3 }}>
            <Slider ref={carouselRef} {...settings}>
              {imageFile.map((item, i) => (
                <CarouselItem key={item.name} item={item} onChangeImageMessage={handleFileChange} index={i} />
              ))}
            </Slider>

            <CarouselControlsArrowsIndex
              index={currentIndex}
              total={imageFile.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </Card>
        </Scrollbar>
      )}
      {multiFiles.length > 0 && messageType === 'multi-file' && (
        <Scrollbar sx={{ height: '180px' }}>
          <Card sx={{ p: 3, mr: 3, backgroundColor: multiFilesTotalSizeExceeded ? theme.palette.error.light : '' }}>
            {multiFilesTotalSizeExceeded && (
              <CardHeader title="Exceeded Max Size : 5MB" sx={{ opacity: 0.72, color: theme.palette.error.dark }} />
            )}
            {multiFiles.map((file, i) => (
              <div key={file.file} style={{ display: 'flex' }}>
                <FileItem file={file} />
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleFileDelete(i)}
                  sx={{ padding: theme.spacing(2.5, 2.5) }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </div>
            ))}
          </Card>
        </Scrollbar>
      )}
    </div>
  );
}
