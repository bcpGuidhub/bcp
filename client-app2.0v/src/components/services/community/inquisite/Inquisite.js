import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Box, Container, Paper, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getPosts, getPostsBy } from '../../../../redux/slices/inquisite';

// hooks
import useSettings from '../../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Page from '../../../Page';
import { InquisiteSearchBar, InquisitePoseQuestionBar, InquisiteFilter, Inquisitions } from '..';
import LoadingScreen from '../../../LoadingScreen';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'primary.lighter' : 'primary.dark',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

export default function Inquisite() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const { themeStretch } = useSettings();
  const timerIdRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, isSearching } = useSelector((state) => state.inquist);
  const [queryValue, setQueryValue] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [searchByTitle, setSearchByTitle] = useState(false);

  const handleInquistSearch = (e) => {
    setQueryValue(e.target.value);
  };

  useEffect(() => {
    const pollingCallback = () => {
      dispatch(getPosts(apiPrefix));
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, 30000);
    };

    startPolling();
    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    return () => {
      stopPolling();
    };
  }, []);

  useEffect(() => {
    dispatch(getPosts(apiPrefix));
  }, []);

  useEffect(() => {
    if (isSearching) {
      setLoadingSearch(true);
      return;
    }
    setLoadingSearch(false);
  }, [isSearching]);

  useEffect(() => {
    if (searchByTitle) {
      dispatch(getPostsBy(queryValue, apiPrefix));
    }
  }, [searchByTitle]);

  const onPoseQuestion = () => navigate(PATH_DASHBOARD.inquist.new);

  return (
    <Page title="GuidHub Inquist">
      <Container>
        <Box sx={{ width: '100%', pt: '112px' }}>
          <Stack spacing={2}>
            {[
              <InquisiteSearchBar onSearch={handleInquistSearch} query={queryValue} setSearch={setSearchByTitle} />,
              <InquisitePoseQuestionBar onPoseQuestion={onPoseQuestion} />,
              <InquisiteFilter posts={posts} />
            ].map((level, i) => (
              <Item key={i}>{level}</Item>
            ))}
            {!loadingSearch && <Inquisitions posts={posts} />}
          </Stack>
        </Box>
        {loadingSearch && (
          <Box style={{ display: 'flex', height: 320, flexDirection: 'column', marginTop: 40 }}>
            <LoadingScreen />
          </Box>
        )}
      </Container>
    </Page>
  );
}
