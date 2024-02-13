import { createSlice } from '@reduxjs/toolkit';
import { videos } from '../../layouts/service/lecture/Lecture';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  lectures: [],
  categories: []
};

const slice = createSlice({
  name: 'lecture',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getLectures(state, action) {
      state.isLoading = false;
      state.lectures = action.payload.map((f) => ({
        id: f.id,
        title: f.title,
        category: f.category,
        likes: f.likes,
        views: f.views,
        url: videos[f.title]
      }));
    },

    getCategories(state, action) {
      const categories = action.payload.map((f) => f.category);
      const uSet = new Set(categories);
      state.categories = ['Tous', ...uSet];
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getLectures() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/workstation/micro_formation');

      dispatch(slice.actions.getLectures(response.data));
      dispatch(slice.actions.getCategories(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getLecturesStakeholders() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/stakeholder/workstation/micro_formation');

      dispatch(slice.actions.getLectures(response.data));
      dispatch(slice.actions.getCategories(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
