import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import { Box, Card, Paper, Button, Typography, CardContent } from '@mui/material';

//
import { varFadeInRight, MotionContainer } from '../../../../animate';
import { CarouselControlsArrowsIndex } from '../../../../carousel/controls';

// ----------------------------------------------------------------------
const rules = [
  {
    title: '',
    description: `<div><b>Comment</b> si vous essayez de répondre à une réponse. <br><br> <b>Modifiez votre question</b> si vous avez besoin d'ajouter plus de détails. <br><br></div>`
  }
];

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
  isActive: PropTypes.bool
};

function CarouselItem({ item, isActive }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        position: 'relative',
        paddingTop: { xs: '100%', md: '50%' },
        minHeight: 500
      }}
    >
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute'
        }}
      />
      <CardContent
        sx={{
          top: 0,
          width: '100%',
          // maxWidth: 480,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white'
        }}
      >
        <MotionContainer open={isActive}>
          <motion.div variants={varFadeInRight}>
            <Typography sx={{ typography: 'h6', color: theme.palette.text.primary }} gutterBottom>
              {item.title}
            </Typography>
          </motion.div>
          <motion.div variants={varFadeInRight}>
            <Typography
              dangerouslySetInnerHTML={{
                __html: item.description
              }}
              style={{
                color: theme.palette.text.primary
              }}
            />
          </motion.div>
        </MotionContainer>
      </CardContent>
    </Paper>
  );
}

export default function InquisitePostAnswerSelfQuestion() {
  const theme = useTheme();
  const carouselRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? rules.length - 1 : 0);

  const settings = {
    // speed: 800,
    dots: false,
    arrows: false,
    // autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current, next) => setCurrentIndex(next)
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <Card>
      <Slider ref={carouselRef} {...settings}>
        {rules.map((item, index) => (
          <CarouselItem key={item.title} item={item} isActive={index === currentIndex} />
        ))}
      </Slider>

      <CarouselControlsArrowsIndex
        index={currentIndex}
        total={rules.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Card>
  );
}
