import 'emoji-mart/css/emoji-mart.css';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import smilingFaceFill from '@iconify/icons-eva/smiling-face-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { IconButton, ClickAwayListener, Box } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  position: 'relative'
});

const PickerStyle = styled('div')(({ theme }) => ({
  bottom: 40,
  overflow: 'hidden',
  position: 'absolute',
  left: theme.spacing(-2),
  boxShadow: theme.customShadows.z20,
  borderRadius: theme.shape.borderRadiusMd,
  '& .emoji-mart': {
    border: 'none',
    backgroundColor: theme.palette.background.paper
  },
  '& .emoji-mart-anchor': {
    color: theme.palette.text.disabled,
    '&:hover, &:focus, &.emoji-mart-anchor-selected': {
      color: theme.palette.text.primary
    }
  },
  '& .emoji-mart-bar': { borderColor: theme.palette.divider },
  '& .emoji-mart-search input': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey[500_32],
    '&::placeholder': {
      ...theme.typography.body2,
      color: theme.palette.text.disabled
    }
  },
  '& .emoji-mart-search-icon svg': {
    opacity: 1,
    fill: theme.palette.text.disabled
  },
  '& .emoji-mart-category-label span': {
    ...theme.typography.subtitle2,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)', // Fix on Mobile
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.paper, 0.8)
  },
  '& .emoji-mart-title-label': { color: theme.palette.text.primary },
  '& .emoji-mart-category .emoji-mart-emoji:hover:before': {
    backgroundColor: theme.palette.action.selected
  },
  '& .emoji-mart-emoji': { outline: 'none' },
  '& .emoji-mart-preview-name': {
    color: theme.palette.text.primary
  },
  '& .emoji-mart-preview-shortname, .emoji-mart-preview-emoticon': {
    color: theme.palette.text.secondary
  }
}));

// ----------------------------------------------------------------------

EmojiPicker.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  setValue: PropTypes.func,
  alignRight: PropTypes.bool
};

export default function EmojiPicker({ disabled, value, setValue, alignRight = false, ...other }) {
  const theme = useTheme();
  const [emojiPickerState, SetEmojiPicker] = useState(false);

  let emojiPicker;
  if (emojiPickerState) {
    emojiPicker = (
      <Picker
        color={theme.palette.primary.main}
        title="Choisissez votre emoji…"
        emoji="point_up"
        onSelect={(emoji) => setValue(value + emoji.native)}
      />
    );
  }

  const triggerPicker = (e) => {
    e.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  const handleClickAway = () => {
    SetEmojiPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <RootStyle {...other}>
        <PickerStyle
          sx={{
            ...(alignRight && {
              right: -2,
              left: 'auto !important'
            })
          }}
        >
          {emojiPicker}
        </PickerStyle>
        <IconButton disabled={disabled} size="small" onClick={triggerPicker}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 10c0 1.38-2.12 2.5-3.5 2.5s-2.75-1.12-2.75-2.5h-1.5c0 1.38-1.37 2.5-2.75 2.5S5 11.38 5 10h-.75c-.16.64-.25 1.31-.25 2a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-.69-.09-1.36-.25-2H19m-7-6C9.04 4 6.45 5.61 5.07 8h13.86C17.55 5.61 14.96 4 12 4m10 8a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10m-10 5.23c-1.75 0-3.29-.73-4.19-1.81L9.23 14c.45.72 1.52 1.23 2.77 1.23s2.32-.51 2.77-1.23l1.42 1.42c-.9 1.08-2.44 1.81-4.19 1.81Z"
            />
          </svg>
        </IconButton>
      </RootStyle>
    </ClickAwayListener>
  );
}
