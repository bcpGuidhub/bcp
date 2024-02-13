import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Stack, Typography } from '@mui/material';

import { getFileThumb, getFileFullName, getFileFormat } from '../../../../utils/getFileFormat';

// redux
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  wordWrap: 'break-word'
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('md')]: {
    height: 200,
    minWidth: 296
  }
}));

const FileItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
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

AttachmentItem.propTypes = {
  file: PropTypes.object
};

function AttachmentItem({ fileUrl }) {
  return (
    <FileItemStyle key={fileUrl}>
      <FileThumbStyle>{getFileThumb(fileUrl)}</FileThumbStyle>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <a href={fileUrl} rel="noreferrer" target="_blank">
          <Typography variant="body2" noWrap>
            {getFileFullName(fileUrl)}
          </Typography>
        </a>
      </Box>
    </FileItemStyle>
  );
}

// ----------------------------------------------------------------------

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
  seatedPeers: PropTypes.array
};

export default function MessageItem({ message, onOpenLightbox, seatedPeers }) {
  const theme = useTheme();
  const { work } = useSelector((state) => state.project);
  const { account } = useSelector((state) => state.user);
  const [audioFileRender, setAudioFileRender] = useState(null);
  const conversationMessage = JSON.parse(message.conversation);
  const users = [...(work.business_plan.project_stakeholders || []), work.business_plan.owner];
  const sender = users.find((s_) => s_.id === conversationMessage.sender_id);
  const senderDetails =
    conversationMessage.sender_id === account.id
      ? { type: 'me' }
      : { avatar: sender?.profile_image, name: `${sender?.first_name} ${sender?.last_name}` };

  const isMe = senderDetails.type === 'me';
  const isImage = conversationMessage.content_type === 'image';
  const isAudio = conversationMessage.content_type === 'audio';
  const isMultiFile = conversationMessage.content_type === 'multi-file';
  const isText = conversationMessage.content_type === 'text';
  const renderAudioFile = async () => {
    const audioFile = conversationMessage.attachments[0];
    return (
      <figure>
        <figcaption>{audioFile.text}</figcaption>
        <audio controls src={audioFile.image_url}>
          <source src={audioFile.image_url} type="audio/ogg" />
          <track kind="captions" />
        </audio>
      </figure>
    );
  };

  useEffect(async () => {
    if (isAudio) {
      const audioMessageItem = await renderAudioFile();
      setAudioFileRender(audioMessageItem);
    }
  }, []);

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${senderDetails.name},`}&nbsp;
            {formatDistanceToNowStrict(new Date(conversationMessage.created_at), {
              addSuffix: true,
              locale: fr
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              ...(isImage && { p: 0 }),
              ...(isMultiFile && { p: 0 })
            }}
          >
            {isImage && (
              <figure>
                <figcaption>{conversationMessage.attachments[0].text}</figcaption>
                <MessageImgStyle
                  alt="attachment"
                  src={conversationMessage.attachments[0].image_url}
                  onClick={() => onOpenLightbox(conversationMessage.attachments[0].image_url)}
                />
              </figure>
            )}
            {isAudio && audioFileRender}
            {isMultiFile && (
              <Stack spacing={2} sx={{ width: 1 }}>
                {conversationMessage.attachments.map((file) => (
                  <Stack
                    key={file.id}
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      borderRadius: getFileFormat(file.image_url) !== 'image' ? theme.shape.borderRadius : '',
                      backgroundColor: getFileFormat(file.image_url) !== 'image' ? theme.palette.grey[500_16] : ''
                    }}
                  >
                    {getFileFormat(file.image_url) === 'image' ? (
                      <MessageImgStyle
                        alt="attachment"
                        src={file.image_url}
                        onClick={() => onOpenLightbox(file.image_url)}
                      />
                    ) : (
                      <AttachmentItem key={file.id} fileUrl={file.image_url} />
                    )}
                  </Stack>
                ))}
              </Stack>
            )}
            {isText && <Typography variant="body2">{conversationMessage.body}</Typography>}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
