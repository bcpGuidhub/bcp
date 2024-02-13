import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import { Icon } from '@iconify/react';
import { Divider } from '@mui/joy';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// material
import { Container, Stack, Tab, Tabs } from '@mui/material';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';
import {
  AccountBilling,
  AccountChangePassword,
  AccountGeneral,
  AccountNotifications,
  AccountSocialLinks
} from '../../components/_dashboard/user/account';
// hooks
import useSettings from '../../hooks/useSettings';
import {
  getAddressBook
  //  getCards,
  //   getInvoices,
  //   getNotifications,
  //   getProfile
} from '../../redux/slices/user';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function UserAdmin() {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getCards());
    // dispatch(getAddressBook());
    // dispatch(getInvoices());
    // dispatch(getNotifications());
    // dispatch(getProfile());
  }, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    }
    // {
    //   value: 'billing',
    //   icon: <Icon icon={roundReceipt} width={20} height={20} />,
    //   component: <AccountBilling />
    // },
    // {
    //   value: 'notifications',
    //   icon: <Icon icon={bellFill} width={20} height={20} />,
    //   component: <AccountNotifications />
    // },
    // {
    //   value: 'social_links',
    //   icon: <Icon icon={shareFill} width={20} height={20} />,
    //   component: <AccountSocialLinks />
    // },
    // {
    //   value: 'change_password',
    //   icon: <Icon icon={roundVpnKey} width={20} height={20} />,
    //   component: <AccountChangePassword />
    // }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="User: Account Settings | Guidhub">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: '#fff' }} elevation={0} color="secondary">
          <Toolbar>
            <HeaderBreadcrumbs
              heading=""
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'home', href: PATH_DASHBOARD.root },
                { name: 'Account Settings' }
              ]}
              sx={{
                mb: 0
              }}
            />
          </Toolbar>
        </AppBar>
        <Divider />
      </Box>
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ pt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
            orientation="vertical"
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
                sx={{ p: 2 }}
              />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Box>
      </Container>
    </Page>
  );
}
