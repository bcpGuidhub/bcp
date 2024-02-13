import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import guideReducer from './slices/guide';
import lectureReducer from './slices/lecture';
import projectReducer from './slices/project';
import userReducer from './slices/user';
import messengerReducer from './slices/messenger';
import financeReducer from './slices/finance';
import inquisiteReducer from './slices/inquisite';
import callReducer from './slices/call';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  lecture: lectureReducer,
  guide: guideReducer,
  messenger: messengerReducer,
  finance: financeReducer,
  inquist: inquisiteReducer,
  call: callReducer
});

export { rootPersistConfig, rootReducer };
