import { createSlice } from '@reduxjs/toolkit';
// utils
import API from '../../utils/axios';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isSearching: false,
  error: false,
  posts: null,
  post: null,
  tags: null,
  answers: null,
  reputation: null,
  answer: null,
  sortBy: null
};

const slice = createSlice({
  name: 'inquist',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state) {
      state.isLoading = false;
    },

    startSearching(state) {
      state.isSearching = true;
    },
    stopSearching(state) {
      state.isSearching = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },
    getPostsPostsBySuccess(state, action) {
      state.isSearching = false;
      state.posts = action.payload;
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },

    getPostTagsSuccess(state, action) {
      state.isLoading = false;
      state.tags = action.payload;
    },

    getPostAnswersSuccess(state, action) {
      state.isLoading = false;
      state.answers = action.payload;
    },

    getPostAnswerSuccess(state, action) {
      state.isLoading = false;
      state.answer = action.payload;
    },

    getInquisiteCommunityReputationSuccess(state, action) {
      state.isLoading = false;
      state.reputation = action.payload;
    },

    sortByAnswers(state, action) {
      state.sortBy = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, stopLoading, sortByAnswers } = slice.actions;

// ----------------------------------------------------------------------
export function getPosts(apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/posts`);
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getPostsBy(title, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startSearching());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/posts/search`, { params: { title } });
      dispatch(slice.actions.getPostsPostsBySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPost(id, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/post`, {
        params: { id }
      });
      dispatch(slice.actions.getPostSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPosTags(id, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/post/tags`, {
        params: { id }
      });
      dispatch(slice.actions.getPostTagsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAnswers(id, apiPrefix) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/post/answers`, {
        params: { id }
      });
      dispatch(slice.actions.getPostAnswersSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAnswer(id, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/inquisite/post/answer`, {
        params: { id }
      });
      dispatch(slice.actions.getPostAnswerSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getInquisiteCommunityReputation(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/community/reputation`, {
        params: { id }
      });
      dispatch(slice.actions.getInquisiteCommunityReputationSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
