import { createSlice } from '@reduxjs/toolkit';
// utils
import API from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  roomId: null,
  roomLink: null,
  localStream: null,
  remoteVideoResetTimer: null
};

const slice = createSlice({
  name: 'call',
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
    getRoomIdSuccess(state, action) {
      state.isLoading = false;
      state.roomId = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getRoomIdSuccess } = slice.actions;
