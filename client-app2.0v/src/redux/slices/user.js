import { createSlice } from '@reduxjs/toolkit';
import { filter, map } from 'lodash';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: null,
  error: false,
  account: null,
  notifications: null,
  invalidToken: false,
  projects: null,
  profileUpdateSuccess: null,
  profileUpdateError: null
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PROFILE
    getUserAccountSuccess(state, action) {
      state.account = action.payload;
    },
    updateUserAccountSuccess(state, action) {
      state.profileUpdateSuccess = true;
      state.profileUpdateError = null;
      state.error = null;
    },
    updateUserAccountError(state, action) {
      state.profileUpdateError = true;
      state.profileUpdateSuccess = null;
      state.error = action.payload;
    },
    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },

    invalidToken(state, action) {
      state.invalidToken = action.payload;
    },

    getStakeholderProjectSuccess(state, action) {
      state.projects = [action.payload];
      const storedSelectedProject = localStorage.getItem('selected_project');
      const selectedProject = storedSelectedProject !== null ? JSON.parse(storedSelectedProject) : null;
      if (state.projects && selectedProject) {
        if (!state.projects.some((p) => p.id === selectedProject.id)) {
          localStorage.removeItem('selected_project');
        }
      }
    },
    getUserProjectsSuccess(state, action) {
      state.projects = action.payload;
      const storedSelectedProject = localStorage.getItem('selected_project');
      const selectedProject = storedSelectedProject !== null ? JSON.parse(storedSelectedProject) : null;
      if (state.projects && selectedProject) {
        if (!state.projects.some((p) => p.id === selectedProject.id)) {
          localStorage.removeItem('selected_project');
        }
      }
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function getUserAccount() {
  return async (dispatch) => {
    try {
      const response = await axios.get('v1/user/account/auth');
      Promise.resolve(dispatch(slice.actions.getUserAccountSuccess(response.data)));
    } catch (error) {
      Promise.reject(dispatch(slice.actions.hasError(error)));
    }
  };
}

// ----------------------------------------------------------------------

export function getStakeholderAccount() {
  return async (dispatch) => {
    try {
      const response = await axios.get('v1/stakeholder/account/auth');
      Promise.resolve(dispatch(slice.actions.getUserAccountSuccess(response.data)));
    } catch (error) {
      Promise.reject(dispatch(slice.actions.hasError(error)));
    }
  };
}

// ----------------------------------------------------------------------
export function updateProfile(data) {
  return async (dispatch) => {
    try {
      const response = await axios.put('v1/user/account', data);
      dispatch(slice.actions.updateUserAccountSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.updateUserAccountError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function stakeholderProject() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('v1/stakeholder/account/projects');
      dispatch(slice.actions.getStakeholderProjectSuccess(response.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.stopLoading());
    }
  };
}

// ----------------------------------------------------------------------
export function hasProjects() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('v1/user/account/projects');
      dispatch(slice.actions.getUserProjectsSuccess(response.data));
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.stopLoading());
    }
  };
}

// ----------------------------------------------------------------------
export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('v1/user/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function tokenValidity(token) {
  return async (dispatch) => {
    try {
      await axios.get(`v1/renew_password_token/${token}`);
      dispatch(slice.actions.invalidToken(false));
    } catch (error) {
      dispatch(slice.actions.invalidToken(true));
    }
  };
}

// ----------------------------------------------------------------------

export function tokenStakeholderValidity(token) {
  return async (dispatch) => {
    try {
      await axios.get(`v1/stakeholder/renew_password_token/${token}`);
      dispatch(slice.actions.invalidToken(false));
    } catch (error) {
      dispatch(slice.actions.invalidToken(true));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {
    //   const response = await axios.get('v1/user/account');
    //   dispatch(slice.actions.getUserAccountSuccess(response.data.profile));
    // } catch (error) {
    //   dispatch(slice.actions.hasError(error));
    // }
  };
}
