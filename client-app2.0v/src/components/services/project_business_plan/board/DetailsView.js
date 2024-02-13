import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { IconButton, Stack, Tooltip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Scrollbar from '../../../Scrollbar';
import { QuillEditor } from '../../../editor';
import { MessageInput, NewStakeHolder, MessageList } from '..';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

DetailsView.propTypes = {
  documents: PropTypes.array.isRequired,
  currentViewIndex: PropTypes.number.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  documentContent: PropTypes.string.isRequired,
  handleDocumentContent: PropTypes.func.isRequired,
  handleNextView: PropTypes.func.isRequired,
  handlePrevView: PropTypes.func.isRequired,
  onAddStakeholder: PropTypes.bool.isRequired,
  handleAddStakeholder: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  conversations: PropTypes.array,
  boardRoomSeats: PropTypes.array,
  onHandleSave: PropTypes.func
};

export default function DetailsView({
  documents,
  currentViewIndex,
  handleViewChange,
  documentContent,
  handleDocumentContent,
  handleNextView,
  handlePrevView,
  onAddStakeholder,
  handleAddStakeholder,
  handleSendMessage,
  conversations,
  boardRoomSeats,
  onHandleSave
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const { accountType } = useAuth();

  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, []);

  return (
    <Stack>
      <Box
        sx={{
          backgroundColor: 'rgb(56,57,61)',
          borderRadius: '10px 0px 0px 0px',
          height: 91
        }}
      >
        <MessageInput disabled={false} onSend={handleSendMessage} />
      </Box>
      <Box
        sx={{
          height: 500,
          transform: 'translate3d(0,0,0)',
          backgroundColor: 'rgb(234,238,249)'
        }}
        ref={ref}
      >
        <MessageList messages={conversations} seatedPeers={boardRoomSeats} sx={{ mb: 'auto' }} />
      </Box>
      <Paper elevation={3} sx={{ borderRadius: '0px' }}>
        {documents[currentViewIndex].question !== 'Présentez votre équipe projet' && (
          <QuillEditor
            sx={{
              border: 'none',
              borderTop: '10px solid orange',
              borderBottom: '10px solid orange',
              borderRadius: 0
            }}
            id="post-content"
            value={documentContent}
            onChange={(val) => {
              handleDocumentContent(val);
            }}
          />
        )}
        {documents[currentViewIndex].question === 'Présentez votre équipe projet' && onAddStakeholder && (
          <NewStakeHolder handleAddStakeholder={handleAddStakeholder} />
        )}
      </Paper>
      <Paper elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            backdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'rgba(17, 25, 40, 0.75)'
          }}
        >
          {currentViewIndex > 0 && (
            <BottomNavigationAction
              sx={{ color: '#fff' }}
              label="Précédent"
              icon={<FirstPageIcon />}
              onClick={handlePrevView}
            />
          )}
          {accountType === 'creator' && (
            <BottomNavigationAction
              sx={{ color: '#fff' }}
              label="Save"
              icon={<AddCircleIcon />}
              onClick={onHandleSave}
            />
          )}
          {currentViewIndex < documents.length && (
            <BottomNavigationAction
              sx={{ color: '#fff' }}
              label="Next"
              icon={<NextPlanIcon />}
              onClick={handleNextView}
            />
          )}
        </BottomNavigation>
      </Paper>
    </Stack>
  );
}
