import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { useEffect, useState, useRef } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import Scrollbar from '../../../Scrollbar';
import LightboxModal from '../../../LightboxModal';

import { MotionInView } from '../../../animate';
// import getVariant from 'src/pages/components-overview/extra/animate/getVariant';
import getVariant from '../../../../pages/components-overview/extra/animate/getVariant';
import { getFileFormat } from '../../../../utils/getFileFormat';
import { MessageItem } from '..';
// ----------------------------------------------------------------------
MessageList.propTypes = {
  messages: PropTypes.array,
  seatedPeers: PropTypes.array
};

export default function MessageList({ messages, seatedPeers }) {
  const scrollRef = useRef();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [messages]);

  const images = messages?.reduce((acc, message) => {
    const conversationMessage = JSON.parse(message.conversation);
    if (conversationMessage.content_type === 'image') {
      acc.push(conversationMessage.attachments[0].image_url);
    }

    if (conversationMessage.content_type === 'multi-file') {
      acc.push(
        ...conversationMessage.attachments
          .filter((file) => getFileFormat(file.image_url) === 'image')
          .map((file) => file.image_url)
      );
    }

    return acc;
  }, []);

  const handleOpenLightbox = (url) => {
    const selectedImage = findIndex(images, (index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      {typeof messages !== 'undefined' && messages !== null && (
        <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
          {messages?.map((message) => (
            <MotionInView key={message.UUID} variants={getVariant('slideInUp')}>
              <MessageItem
                key={message.UUID}
                message={message}
                onOpenLightbox={handleOpenLightbox}
                seatedPeers={seatedPeers}
              />
            </MotionInView>
          ))}
        </Scrollbar>
      )}
      {(messages === null || typeof messages === 'undefined') && (
        <Box
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ py: 2, px: 3, height: '100%', display: 'flex' }}
        >
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              Pas de messages
            </Typography>
          </Stack>
        </Box>
      )}
      <LightboxModal
        images={images || []}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onClose={() => setOpenLightbox(false)}
      />
    </>
  );
}
