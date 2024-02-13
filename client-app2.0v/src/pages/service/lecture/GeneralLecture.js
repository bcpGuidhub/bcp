// material
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
// components
import Page from '../../../components/Page';
import { LectureNavBar, LectureThumbnail, LectureVideo } from '../../../components/_dashboard/general-lecture';
// hooks
import useSettings from '../../../hooks/useSettings';
import { getLectures, getLecturesStakeholders } from '../../../redux/slices/lecture';
import { useDispatch, useSelector } from '../../../redux/store';
import API from '../../../utils/axios';
import useAuth from '../../../hooks/useAuth';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// ----------------------------------------------------------------------

export default function GeneralLecture() {
  const { themeStretch } = useSettings();
  const { isCollapse } = useCollapseDrawer();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobileSm = useMediaQuery(theme.breakpoints.down('lg'));
  const { accountType } = useAuth();
  const dispatch = useDispatch();
  const { lectures, categories } = useSelector((state) => state.lecture);
  const [openLecture, setOpenLecture] = useState(false);
  const [activatedLike, setActivatedLike] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [microFormations, setMicroFormation] = useState([]);
  const [lecture, setLecture] = useState({
    id: '',
    title: '',
    views: '',
    likes: '',
    url: '',
    category: ''
  });
  const [likes, setLikes] = useState(0);

  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';

  const filterByCategory = (e, category) => {
    e.stopPropagation();
    setSelectedCategory(category);
    if (category === 'Tous') {
      setOpenLecture(false);
    }
  };

  const handleClickOpenLecture = (l) => {
    setSelectedCategory(l.category);
    API.post(`${apiPrefix}/micro_formation/${l.id}/view`)
      .then((response) => {
        const views = response.data;
        setMicroFormation((prevMicroFormation) =>
          prevMicroFormation.map((f) => {
            if (f.title === l.title) {
              return { ...f, views };
            }
            return f;
          })
        );
      })
      .catch((error) => {});

    setLikes(l.likes);
    setLecture({
      id: l.id,
      title: l.title,
      views: l.views,
      likes: l.likes,
      url: l.url,
      category: l.category
    });
    setOpenLecture(true);
  };

  const handleLikes = (e) => {
    e.preventDefault();
    setActivatedLike(!activatedLike);
  };

  useEffect(() => {
    if (accountType === 'stakeholder') {
      dispatch(getLecturesStakeholders());
      return;
    }
    dispatch(getLectures());
  }, [dispatch]);

  useEffect(() => {
    if (lecture.id !== '') {
      if (activatedLike) {
        API.post(`${apiPrefix}/micro_formation/${lecture.id}/like`)
          .then((response) => {
            const likes = response.data;
            setLikes(likes);
          })
          .catch((error) => {});
        return;
      }
      API.post(`${apiPrefix}/micro_formation/${lecture.id}/like_downgrade`)
        .then((response) => {
          const likes = response.data;
          setLikes(likes);
        })
        .catch((error) => {});
    }
  }, [activatedLike, lecture]);

  useEffect(() => {
    setMicroFormation(lectures);
  }, [dispatch, lectures]);
  return (
    <Page title="MinuteFormation | Guidhub">
      <Box sx={{ width: '100%', height: '100%' }}>
        <Grid
          container
          spacing={3}
          sx={{
            marginTop: '0px',
            transition: theme.transitions.create('margin', {
              duration: theme.transitions.duration.complex
            }),
            position: 'fixed',
            // height: '100%',
            // height: 'calc(100% - 110px)',
            // [theme.breakpoints.down('lg')]: {
            //   width: '100% !important'
            // },
            [theme.breakpoints.up('lg')]: {
              height: '100%'
              // right: '240px'
              // ...(!isCollapse && {
              //   left: '280px'
              // })
              // width: 'calc(100% - 560px)'
            },
            // ...(!isCollapse && {
            //   left: '280px'
            // }),
            // ...(isCollapse &&
            //   isMobile && {
            //     left: '0px'
            //   }),
            // [theme.breakpoints.up('md')]: {
            //   width: 'calc(100% - 560px)'
            // },
            [theme.breakpoints.up('lg')]: {
              width: 'calc(100% - 76px)'
            },
            // width: isMobileSm ? '100%' : 'calc(100% - 240px)',
            left: isMobile ? '0' : '100px',
            top: 54,
            backgroundColor: 'rgb(0, 30, 60)',
            borderColor: 'rgba(30, 73, 118, 0.7)',
            backgroundImage: `radial-gradient(at 51% 52%, rgba(19, 47, 76, 0.5) 0px, transparent 50%),
 radial-gradient(at 80% 0%, rgb(19, 47, 76) 0px, transparent 50%),
  radial-gradient(at 0% 95%, rgb(19, 47, 76) 0px, transparent 50%),
 radial-gradient(at 0% 5%, rgb(19, 47, 76) 0px, transparent 25%),
  radial-gradient(at 93% 85%, rgba(30, 73, 118, 0.8) 0px, transparent 50%),
   url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23003A75' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          <Grid item xs={12} md={12} sx={{ pt: '0 !important' }}>
            <LectureNavBar categories={categories} filterByCategory={filterByCategory} />
          </Grid>
          {!openLecture && (
            <Grid item xs={12} md={12}>
              <LectureThumbnail
                lectures={microFormations}
                selectedCategory={selectedCategory}
                handleClickOpenLecture={handleClickOpenLecture}
              />
            </Grid>
          )}
          {openLecture && (
            <Grid item xs={12} md={12}>
              <LectureVideo
                lecture={lecture}
                likes={likes}
                handleLikes={handleLikes}
                lectures={microFormations}
                selectedCategory={selectedCategory}
                handleClickOpenLecture={handleClickOpenLecture}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Page>
  );
}
