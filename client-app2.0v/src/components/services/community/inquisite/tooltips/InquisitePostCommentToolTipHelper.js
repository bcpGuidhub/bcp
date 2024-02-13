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
    title: 'Que sont les commentaires?',
    description: `<p style={{mb: '10px'}}>Les commentaires sont des post-it temporaires laissés sur une question ou une réponse. Ils peuvent être votés positivement (mais pas négativement) et signalés, mais ne génèrent pas de réputation. Il n'y a pas d'historique des révisions et lorsqu'elles sont supprimées, elles disparaissent définitivement.</p>`
  },
  {
    title: '',
    description: `<p style={{mb: '10px'}}>Veuillez noter que vous pouvez <em>toujours</em> commentez vos propres messages et toute partie de vos questions. Cependant, en commentant <em>Autres personnes</em> les postes sont un privilège acquis en gagnant de la réputation - si vous ne l'avez pas encore mérité, essayez d'abord de vous familiariser avec la rédaction des réponses.</p>`
  },
  {
    title: 'Comment commenter?',
    description: `<p>Cliquez sur le lien «Ajouter un commentaire» sous chaque message. Les commentaires ne peuvent pas être multilignes, alors appuyez simplement sur Entrée pour soumettre votre commentaire.</p>`
  },
  {
    title: 'Que se passe-t-il lorsque je commente?',
    description: `<p>Les membres de la communauté suivants seront automatiquement informés de votre commentaire:</p>
    <ul>
    <li>le propriétaire du message sur lequel vous commentez</li>
    <li><strong>un</strong> utilisateur supplémentaire lorsque votre commentaire contient une réponse @username<sup>1</sup></li>
    </ul>
    <p><sup>1</sup> Vous ne pouvez @répondre qu'aux utilisateurs qui ont déjà laissé un commentaire ou modifié le message. Les trois premiers caractères autres que des espaces dans @username sont utilisés pour la correspondance de nom, en commençant par le commentaire ou la modification la plus récente.</p>
`
  },
  {
    title: 'Quand dois-je commenter ?',
    description: `<p>Vous devez soumettre un commentaire si vous souhaitez:</p>
    <ul>
    <li>Demander des <strong>clarifications</strong> à l'auteur;</li>
    <li>Laissez des <strong>critiques constructives</strong> qui guident l'auteur dans l'amélioration du message;</li>
    <li>Ajoutez des informations pertinentes mais <strong>mineures ou transitoires</strong> à un message (par exemple, un lien vers une question connexe ou une alerte à l'auteur indiquant que la question a été mise à jour).</li>
    </ul>
    `
  },
  {
    title: 'Quand ne devrais-je pas commenter?',
    description: `
    <p>Les commentaires ne sont pas recommandés pour les éléments suivants:</p>
    <ul>
<li><p><strong>Suggérer des corrections</strong> qui ne changent pas <em>fondamentalement</em> le sens du message; à la place</p></li>
<li><p><strong>Répondre à une question</strong> ou proposer une solution alternative à une réponse existante; à la place, publiez une réponse réelle (ou modifiez-la pour en développer une existante);</p></li>
<li><p><strong>Compliments</strong> qui n'ajoutent pas de nouvelles informations ("+1, excellente réponse!"); à la place, votez pour et payez au suivant</a>;</p></li>
<li><p><strong>Critiques</strong> qui n'apportent rien de constructif ("-1, voir les commentaires précédents, espèce de scallywag!"); à la place, votez contre (et fournissez ou votez pour une meilleure réponse, le cas échéant);</p></li>
<li><p><strong>Discussion secondaire</strong> ou débat sur un point controversé; Messenger à la place;</p></li>
</ul>
    `
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

export default function InquisitePostCommentToolTipHelper() {
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
