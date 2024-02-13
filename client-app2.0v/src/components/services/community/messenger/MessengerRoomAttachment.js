import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { uniq, flatten } from 'lodash';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Collapse, Typography } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import { getFileFullName, getFileThumb } from '../../../../utils/getFileFormat';
//
import Scrollbar from '../../../Scrollbar';
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2)
}));

const FileItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
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

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  flexShrink: 0,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled
}));

// ----------------------------------------------------------------------

AttachmentItem.propTypes = {
  file: PropTypes.object,
  fileUrl: PropTypes.string,
  createdAt: PropTypes.string
};

function AttachmentItem({ createdAt, file, fileUrl }) {
  return (
    <FileItemStyle key={fileUrl}>
      <FileThumbStyle>{getFileThumb(fileUrl)}</FileThumbStyle>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {getFileFullName(fileUrl)}
        </Typography>
        <Typography noWrap variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {formatDistanceToNowStrict(new Date(createdAt), {
            addSuffix: true,
            locale: fr
          })}
        </Typography>
      </Box>
    </FileItemStyle>
  );
}

MessengerRoomAttachment.propTypes = {
  conversation: PropTypes.object.isRequired,
  isCollapse: PropTypes.bool,
  onCollapse: PropTypes.func
};

export default function MessengerRoomAttachment({ conversation, isCollapse, onCollapse, ...other }) {
  const { messages } = useSelector((state) => state.messenger);
  const totalAttachment = uniq(
    flatten(messages.map((item) => (item.attachments === null ? [] : item.attachments)))
  ).length;

  return (
    <RootStyle {...other}>
      <CollapseButtonStyle
        fullWidth
        color="inherit"
        onClick={onCollapse}
        endIcon={<Icon icon={isCollapse ? arrowIosDownwardFill : arrowIosForwardFill} width={16} height={16} />}
      >
        attachment ({totalAttachment})
      </CollapseButtonStyle>

      {!isCollapse && <Divider />}

      <Scrollbar>
        <Collapse in={isCollapse}>
          {messages.map((message) => (
            <div key={message.id}>
              {message.attachments?.map((attachment) => (
                <AttachmentItem
                  key={attachment.id}
                  createdAt={message.created_at}
                  file={attachment}
                  fileUrl={attachment.image_url}
                />
              ))}
            </div>
          ))}
        </Collapse>
      </Scrollbar>
    </RootStyle>
  );
}
