import { useState, useRef, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import peopleFill from '@iconify/icons-eva/people-fill';
import PropTypes from 'prop-types';
import {
  Card,
  Stack,
  IconButton,
  Drawer,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  AvatarGroup,
  Alert,
  Grid,
  Box,
  useMediaQuery
} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import CloseIcon from '@mui/icons-material/Close';

//
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
import { useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Scrollbar from '../../../Scrollbar';
import { MIconButton, MHidden } from '../../../@material-extend';
import { InviteContact, Account, ContactSearch, ConversationList, SearchResults, MessengerWindow } from '..';
// utils
import axios from '../../../../utils/axios';
import useWebSocket from '../../../../hooks/useChatWebSocket';
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

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  width: 140,
  fontSize: 13,
  flexShrink: 0,
  color: theme.palette.text.secondary
}));

EmbeddedMessenger.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default function EmbeddedMessenger({ onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getConversation, joinConversation } = useWebSocket();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSidebar, setOpenSidebar] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCollapse = !isMobile && !openSidebar;

  const displayResults = searchQuery && isSearchFocused;
  const { activeConversationId, conversations, contacts } = useSelector((state) => state.messenger);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleInputContactChange = (event) => {
    setContactDetails({ ...contactDetails, [event.target.name]: event.target.value });
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

  const onConfirm = () => {
    setOpenConfirm(false);
    setSent(true);
  };

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
    if (activeConversationId === null && conversations.allIds.length > 0) {
      const conversationId = conversations.allIds.filter((id) => conversations.byId[id].type === 'ACTIVITY')[0];
      getConversation(conversationId).then(() => {
        handleCloseSidebar();
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

          <MIconButton onClick={handleToggleSidebar}>
            <Icon width={20} height={20} icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill} />
          </MIconButton>

          {/* <MIconButton
            onClick={() => setOpenConfirm(true)}
            sx={{ p: 1, ml: 0.5, border: (theme) => `dashed 1px ${theme.palette.divider}` }}
          >
            <Icon icon={plusFill} width={20} height={20} />
          </MIconButton>
          {!isCollapse && (
            <MIconButton
              // @ts-ignore
              to={PATH_DASHBOARD.chat.new}
              component={RouterLink}
            >
              <Icon icon={editFill} width={20} height={20} />
            </MIconButton>
          )} */}
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
      <div
        style={{
          height: '50vh'
        }}
      >
        <Scrollbar
          sx={{
            height: '50vh'
          }}
        >
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
      </div>

      {/* <Divider />
      <Stack spacing={3} sx={{ px: 2.5, py: 3 }}>
        <Stack direction="row">
          <LabelStyle sx={{ mt: 1.5 }}>Contacts</LabelStyle>
          <Tooltip title="Add contact">
            <MIconButton
              onClick={() => setOpenConfirm(true)}
              sx={{ p: 1, ml: 0.5, border: (theme) => `dashed 1px ${theme.palette.divider}` }}
            >
              <Icon icon={plusFill} width={20} height={20} />
            </MIconButton>
          </Tooltip>
        </Stack>
      </Stack> */}
      {/* <Divider />
      <Stack spacing={3} sx={{ px: 2.5, py: 3 }}>
        <Stack direction="column" alignItems="center">
          {contacts.invite?.map((user) => (
            <Avatar key={user.id} alt={user.name} src={user.avatar} sx={{ m: 0.5, width: 36, height: 36 }} />
          ))}
          {contacts.invite.length === 0 && (
            <Box sx={{ py: 2, px: 3, height: '100%', display: 'flex' }}>
              <Stack direction="row" alignItems="center" justifyContent="center">
                <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
                  No Contacts
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack> */}
    </>
  );

  return (
    <>
      {sent && (
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSent(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
          severity="success"
        >
          demande envoyée
        </Alert>
      )}
      <Drawer
        open
        onClose={onClose}
        anchor="right"
        PaperProps={{ sx: { width: { xs: 1, sm: 720 }, backgroundColor: '#212B37' } }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            justifyContent: 'space-around'
          }}
        >
          <Grid
            item
            xs={openSidebar ? 6 : 2}
            sx={{
              height: '100%'
            }}
          >
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
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH }
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
                    height: '100%',
                    width: DRAWER_WIDTH,
                    transition: theme.transitions.create('width'),
                    '& .MuiDrawer-paper': {
                      position: 'static',
                      width: DRAWER_WIDTH
                    },
                    ...(isCollapse && {
                      width: COLLAPSE_WIDTH,
                      '& .MuiDrawer-paper': {
                        width: COLLAPSE_WIDTH,
                        position: 'static',
                        transform: 'none !important',
                        visibility: 'visible !important'
                      }
                    })
                  }}
                >
                  {renderContent}
                </Drawer>
              </MHidden>
            </>
          </Grid>
          <Grid
            item
            xs={openSidebar ? 6 : 10}
            sx={{
              height: '100%'
            }}
          >
            <Scrollbar
              sx={{
                height: 1,
                '& .simplebar-content': {
                  height: 1
                }
              }}
            >
              <MessengerWindow embedded />
            </Scrollbar>
          </Grid>
        </Grid>
        {/* <InviteContact
          open={openConfirm}
          contactDetails={contactDetails}
          onClose={handleCloseConfirm}
          onChange={handleInputContactChange}
          onConfirm={onConfirm}
        /> */}
      </Drawer>
    </>
  );
}
