import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { useEffect, useState, useRef } from 'react';

import { Box, Stack, Typography } from '@mui/material';

//
import Scrollbar from '../../../Scrollbar';
import LightboxModal from '../../../LightboxModal';
import { MessageItem } from '..';

// redux
import { useSelector } from '../../../../redux/store';
import { MotionInView } from '../../../animate';
// import getVariant from 'src/pages/components-overview/extra/animate/getVariant';
import getVariant from '../../../../pages/components-overview/extra/animate/getVariant';
import { getFileFormat } from '../../../../utils/getFileFormat';
// ----------------------------------------------------------------------
MessageList.propTypes = {
  messages: PropTypes.array
};

export default function MessageList({ messages }) {
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
    if (message.content_type === 'image') {
      acc.push(message.attachments[0].image_url);
    }

    if (message.content_type === 'multi-file') {
      acc.push(
        ...message.attachments.filter((file) => getFileFormat(file.image_url) === 'image').map((file) => file.image_url)
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
          {messages?.map(
            (message, index) =>
              message.content_type !== 'newCommunityContact' && (
                <MotionInView key={message.id} variants={getVariant('slideInUp')}>
                  <MessageItem message={message} onOpenLightbox={handleOpenLightbox} />
                </MotionInView>
              )
          )}
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
              Aucun message
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
