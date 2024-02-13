import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbar from '../../Scrollbar';

const SECTIONS = ['primary', 'secondary'];

RenderContent.propTypes = {
  el: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired
};

function RenderContent({ el, i }) {
  const attr = {
    key: i,
    style: {
      textAlign: 'left',
      fontSize: '1.2rem',
      fontWeight: '400',
      color: '#4B4B4B',
      lineHeight: '2.3rem',
      'li:nthChild(odd)': {
        color: '#777'
      },
      'li:nthChild(even)': {
        color: 'blue'
      },
      '@media (maxWidth: 480px)': {
        padding: 0
      }
    }
  };
  if (el.meta_type === 'list') {
    return React.createElement(
      'ul',
      attr,
      el.meta_blob.map((e, j) => (
        <li
          style={{
            // background: j % 2 !== 0 ? "#f1dddd" : "",
            padding: '10px 10px'
          }}
          key={j}
        >
          {e}
        </li>
      ))
    );
  }
  return React.createElement(el.meta_type, attr, el.meta_blob);
}

ContentSection.propTypes = {
  content: PropTypes.object.isRequired
};

function ContentSection({ content }) {
  return (
    <div>
      <Typography variant="h5" component="h5">
        {content.meta_title}
      </Typography>
      <Box display="flex" flexDirection="column" m={2} bgcolor="background.paper">
        {content.meta_content && (
          <>
            {content.meta_content.map((el, i) => (
              <RenderContent key={i} el={el} i={i} />
            ))}
          </>
        )}
      </Box>
    </div>
  );
}

RootSection.propTypes = {
  content: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
};

function RootSection({ category, content }) {
  if (category === 'primary') {
    return <ContentSection content={content[category]} />;
  }
  if (content[category]) {
    return content[category].map((blob, i) => <ContentSection key={i} content={blob} />);
  }
  return null;
}

InformationGuide.propTypes = {
  content: PropTypes.object.isRequired
};

export default function InformationGuide({ content }) {
  return (
    <Scrollbar sx={{ height: 300 }}>
      {SECTIONS.map((category) => (
        <RootSection key={category} category={category} content={content} />
      ))}
    </Scrollbar>
  );
}
