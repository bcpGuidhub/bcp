import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import { Icon } from '@iconify/react';

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useMediaQuery
} from '@mui/material';
// material
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// redux
import { useSelector, useDispatch } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import axios from '../../../../utils/axios';
import useWebSocket from '../../../../hooks/useChatWebSocket';
import { MHidden, MIconButton } from '../../../@material-extend';
import Scrollbar from '../../../Scrollbar';
import { InviteContact, Account, ContactSearch, ConversationList, SearchResults, MessengerRoom } from '..';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 320;
const COLLAPSE_WIDTH = 96;

const ToggleButtonStyle = styled((props) => <IconButton disableRipple {...props} />)(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker
  }
}));

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.messenger;
  const conversation = activeConversationId ? conversations.byId[activeConversationId] : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: ''
  };
  return initState;
};

export default function MessengerSidebar() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getConversation, joinConversation } = useWebSocket();

  const [openSidebar, setOpenSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const { activeConversationId, conversations, contacts, participants, recipients } = useSelector(
    (state) => state.messenger
  );
  const { account } = useSelector((state) => state.user);
  const displayResults = searchQuery && isSearchFocused;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCollapse = !isMobile && !openSidebar;
  const conversation = useSelector((state) => conversationSelector(state));

  const mode = activeConversationId !== null ? 'DETAIL' : 'COMPOSE';
  const displayParticipants =
    conversation.type === 'ACTIVITY' ? contacts.sector : participants.filter((item) => item.c_uuid !== account.id);

  useEffect(() => {
    if (isMobile) {
      return handleCloseSidebar();
    }
    return handleOpenSidebar();
  }, [isMobile]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  useEffect(() => {
    if (activeConversationId === null && pathname !== PATH_DASHBOARD.hub.new && conversations.allIds.length === 1) {
      const conversationId = conversations.allIds.filter((id) => conversations.byId[id].type === 'ACTIVITY')[0];
      getConversation(conversationId).then(() => {
        // handleCloseSidebar();
        joinConversation(conversationId);
      });
    }
  }, [conversations]);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const handleClickAwaySearch = () => {
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleChangeSearch = async (event) => {
    try {
      const { value } = event.target;
      setSearchQuery(value);
      if (value) {
        const response = await axios.get('/api/chat/search', {
          params: { query: value }
        });
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchSelect = (username) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigate(`${PATH_DASHBOARD.chat.root}/${username}`);
  };

  const handleSelectContact = (result) => {
    if (handleSearchSelect) {
      handleSearchSelect(result.username);
    }
  };

  const renderContent = (
    <>
      <Box sx={{ py: 2, px: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <Account />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          {/* <MIconButton onClick={handleToggleSidebar}>
            <Icon width={20} height={20} icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill} />
          </MIconButton> */}

          {!isCollapse && (
            <MIconButton
              // @ts-ignore
              to={PATH_DASHBOARD.hub.new}
              component={RouterLink}
              sx={{
                backgroundColor: '#D8E9E7'
              }}
            >
              <Icon icon="jam:write-f" width={20} height={20} />
              {/* <Icon icon={editFill} width={20} height={20} /> */}
            </MIconButton>
          )}
        </Stack>

        {/* {!isCollapse && (
          <ContactSearch
            query={searchQuery}
            onFocus={handleSearchFocus}
            onChange={handleChangeSearch}
            onClickAway={handleClickAwaySearch}
          />
        )} */}
      </Box>
      <Divider />
      <Scrollbar>
        {!displayResults ? (
          <ConversationList
            conversations={conversations}
            isOpenSidebar={openSidebar}
            activeConversationId={activeConversationId}
            handleCloseSidebar={handleCloseSidebar}
            sx={{ ...(isSearchFocused && { display: 'none' }) }}
          />
        ) : (
          <SearchResults query={searchQuery} results={searchResults} onSelectContact={handleSelectContact} />
        )}
      </Scrollbar>

      {/* <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '2px solid',
          borderRadius: '1px'
          // backgroundColor: '#9AB0C1'
        }}
      >
        <List disablePadding sx={{ height: '100%', m: 1 }}>
          <ListItemButton sx={{ mt: 3 }}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="12" cy="21" r="5" fill="#FFA726" />
                <path
                  fill="#455A64"
                  d="M2 34.7s2.8-6.3 10-6.3s10 6.3 10 6.3V38H2v-3.3zm44 0s-2.8-6.3-10-6.3s-10 6.3-10 6.3V38h20v-3.3z"
                />
                <circle cx="24" cy="17" r="6" fill="#9AB0C1" />
                <path fill="#607D8B" d="M36 34.1s-3.3-7.5-12-7.5s-12 7.5-12 7.5V38h24v-3.9z" />
                <circle cx="36" cy="21" r="5" fill="#FFA726" />
                <circle cx="12" cy="21" r="5" fill="#FFF" />
                <circle cx="36" cy="21" r="5" fill="#FFF" />
              </svg>
            </ListItemIcon>
            <ListItemText
              primary="Démarrer une workshop"
              primaryTypographyProps={{
                noWrap: true,
                variant: 'subtitle1',
                color: '#637381',
                fontWeight: '900'
              }}
            />
          </ListItemButton>
        </List>
      </Box> */}
    </>
  );

  return (
    <>
      <MHidden width="mdUp">
        <ToggleButtonStyle onClick={handleToggleSidebar}>
          <Icon width={16} height={16} icon={peopleFill} />
        </ToggleButtonStyle>
      </MHidden>

      {/* Mobile */}
      <MHidden width="mdUp">
        <Drawer
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            position: 'relative',
            '& .MuiDrawer-paper': {
              pt: '112px',
              width: DRAWER_WIDTH,
              // backgroundColor: 'rgb(37,38,41)',
              backgroundColor: '#D8E9E7',
              color: theme.palette.primary.contrastText
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      {/* Desktop */}
      <MHidden width="mdDown">
        <Drawer
          open={openSidebar}
          variant="persistent"
          sx={{
            position: 'relative',
            width: DRAWER_WIDTH,
            transition: theme.transitions.create('width'),
            '& .MuiDrawer-paper': {
              position: 'static',
              width: DRAWER_WIDTH,
              // background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              // backgroundColor: 'rgb(37,38,41)',
              backgroundColor: '#D8E9E7'
            },
            ...(isCollapse && {
              width: COLLAPSE_WIDTH,
              '& .MuiDrawer-paper': {
                width: COLLAPSE_WIDTH,
                position: 'static',
                transform: 'none !important',
                visibility: 'visible !important',
                // background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                // backgroundColor: 'rgb(37,38,41)'
                backgroundColor: '#D8E9E7'
              }
            })
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </>
  );
}
