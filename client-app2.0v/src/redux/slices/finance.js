import { createSlice } from '@reduxjs/toolkit';
// utils
import API from '../../utils/axios';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  isFiltering: false,
  aid: {
    aidResources: [],
    aidCount: 0,
    geographicalDepartments: [],
    aid: null
  }
};

const slice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    startFiltering(state) {
      state.isFiltering = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // UPDATE SEARCH
    updateAid(state, action) {
      state.aid.aidCount = action.payload.aidCount;
      state.aid.aidResources = action.payload.aidResources;
      state.isLoading = false;
    },

    filterAid(state, action) {
      state.aid.aidCount = action.payload.aidCount;
      state.aid.aidResources = action.payload.aidResources;
      state.isFiltering = false;
    },
    // CLEAR SEARCH
    clearFinancialAid(state, action) {
      state.aid.aidResources = [];
      state.aid.aidCount = 0;
      state.isLoading = false;
    },

    updateGeographicalDepartments(state, action) {
      state.aid.geographicalDepartments = action.payload || [];
    },

    fetchedAid(state, action) {
      state.aid.aid = action.payload;
      state.isLoading = false;
    }
  }
});

// Actions
export const { startLoading, clearFinancialAid } = slice.actions;

// Reducer
export default slice.reducer;

export function getFinancialAid(id, data, page, zone, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/aid`, {
        params: { query: data, page, zone }
      });
      const res = JSON.parse(response.data);
      const aid = res.data;
      const { total } = res.meta;
      dispatch(slice.actions.updateAid({ aidResources: aid, aidCount: total }));
    } catch (error) {
      console.log(error);
    }
  };
}
export function filterFinancialAid(id, data, page, zone, apiPrefix) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startFiltering());
      const response = await API.get(`${apiPrefix}/projects/${id}/aid`, {
        params: { query: data, page, zone }
      });
      const res = JSON.parse(response.data);
      const aid = res.data;
      const { total } = res.meta;
      dispatch(slice.actions.filterAid({ aidResources: aid, aidCount: total }));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getGeographicalDepartments(id, data, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/aid-geo-meta/${data}`);
      const res = JSON.parse(response.data);
      const ter = res.data;
      dispatch(slice.actions.updateGeographicalDepartments(ter));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getAid(projectId, id, apiPrefix) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await API.get(`${apiPrefix}/projects/${projectId}/aid/${id}`);
      dispatch(slice.actions.fetchedAid(JSON.parse(response.data)[0]));
    } catch (error) {
      console.log(error);
    }
  };
}
