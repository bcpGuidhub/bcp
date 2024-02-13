import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
//
import { ConversationItem } from '..';
import useWebSocket from '../../../../hooks/useChatWebSocket';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  background: 'none',
  // border: `1px solid ${theme.palette.divider}`,
  borderRadius: '0 !important',
  boxShadow: 'none !important',
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowRightIcon sx={{ fontSize: '2rem', color: '#637381' }} />} {...props} />
))(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    m: 0,
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0
  // borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

ConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  handleCloseSidebar: PropTypes.func.isRequired
};

export default function ConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  handleCloseSidebar,
  ...other
}) {
  const { getConversation } = useWebSocket();
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleSelectConversation = (conversationId) => {
    getConversation(conversationId);
  };

  const directMessages = conversations?.allIds?.filter(
    (conversationId) => conversations?.byId[conversationId].type === 'ONE_TO_ONE'
  );

  return (
    <>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography sx={{ typography: 'subtitle1', fontWeight: '900', color: '#637381' }}>Conversations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding {...other} sx={{ height: '100%', m: 1 }}>
            {conversations.allIds.map((conversationId) =>
              conversations.byId[conversationId].type === 'ONE_TO_ONE' ? null : (
                <ConversationItem
                  key={conversationId}
                  isOpenSidebar={isOpenSidebar}
                  conversation={conversations.byId[conversationId]}
                  isSelected={activeConversationId === conversationId}
                  onSelectConversation={() => {
                    // handleCloseSidebar();
                    handleSelectConversation(conversationId);
                  }}
                />
              )
            )}
            <ListItemButton to={PATH_DASHBOARD.hub.new} component={RouterLink}>
              <ListItemIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                  <mask id="ipSAdd0">
                    <g fill="none" strokeLinejoin="round" strokeWidth="4">
                      <rect width="36" height="36" x="6" y="6" fill="#fff" stroke="#fff" rx="3" />
                      <path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16" />
                    </g>
                  </mask>
                  <path fill="#637381" d="M0 0h48v48H0z" mask="url(#ipSAdd0)" />
                </svg>
              </ListItemIcon>

              <ListItemText
                primary="Ajouter une conversation"
                primaryTypographyProps={{
                  noWrap: true,
                  variant: 'subtitle1',
                  color: '#637381'
                }}
              />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography sx={{ typography: 'subtitle1', fontWeight: '900', color: '#637381' }}>
            Messages directs
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding {...other} sx={{ height: '100%', m: 1 }}>
            {directMessages.map((conversationId) => (
              <ConversationItem
                key={conversationId}
                isOpenSidebar={isOpenSidebar}
                conversation={conversations.byId[conversationId]}
                isSelected={activeConversationId === conversationId}
                onSelectConversation={() => {
                  // handleCloseSidebar();
                  handleSelectConversation(conversationId);
                }}
              />
            ))}
            {/* <ListItemButton key="direct-messages">
              <ListItemIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                  <mask id="ipSAdd0">
                    <g fill="none" strokeLinejoin="round" strokeWidth="4">
                      <rect width="36" height="36" x="6" y="6" fill="#fff" stroke="#fff" rx="3" />
                      <path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16" />
                    </g>
                  </mask>
                  <path fill="#637381" d="M0 0h48v48H0z" mask="url(#ipSAdd0)" />
                </svg>
              </ListItemIcon>

              <ListItemText
                primary="Ajouter un contact"
                primaryTypographyProps={{
                  noWrap: true,
                  variant: 'subtitle1',
                  color: '#637381'
                }}
              />
            </ListItemButton> */}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
