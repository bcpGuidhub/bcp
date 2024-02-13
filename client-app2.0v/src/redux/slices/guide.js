import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  guides: [],
  guide: null
};

const slice = createSlice({
  name: 'guide',
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

    getGuides(state, action) {
      state.isLoading = false;
      state.guides = action.payload || [];
    },

    getGuide(state, action) {
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let i = 0; i < action.payload; i++) {
        if (action.payload[i].status === 'running') {
          state.guide = action.payload[i];
          break;
        }
      }
    },

    beginGuide(state, action) {
      state.isLoading = false;
      state.guide = action.payload;
    },

    updateGuide(state, action) {
      state.guides = action.payload;
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let i = 0; i < action.payload; i++) {
        if (action.payload[i].status === 'running') {
          state.guide = action.payload[i];
          break;
        }
      }
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGuides() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/workstation/guides');

      dispatch(slice.actions.getGuides(response.data));
      dispatch(slice.actions.getGuide(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function beginGuide(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/v1/workstation/guides', data);
      dispatch(slice.actions.beginGuide(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateGuide(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/v1/workstation/guides', data);
      dispatch(slice.actions.updateGuide(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
