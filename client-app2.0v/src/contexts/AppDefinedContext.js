import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
// material
import { Navigate } from 'react-router-dom';
// utils
import axios from '../utils/axios';
import { setSession } from '../utils/jwt';
import useLocalStorage from '../hooks/useLocalStorage';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------
const storedRole = localStorage.getItem('acc_t');
const selectedRole = storedRole !== null ? JSON.parse(storedRole) : null;

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  stakeholder: null,
  userAccountExists: false,
  userAccountDeleted: false,
  accountType: selectedRole
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state) => ({
    ...state,
    isAuthenticated: true
  }),
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      userAccountExists: false,
      userAccountDeleted: false,
      user
    };
  },
  REGISTER_STAKEHOLDER: (state, action) => {
    const { stakeholder } = action.payload;

    return {
      ...state,
      userAccountExists: false,
      userAccountDeleted: false,
      stakeholder
    };
  },
  USER_ACCOUNT_EXISTS: (state) => ({
    ...state,
    isAuthenticated: false,
    userAccountExists: true
  }),
  USER_ACCOUNT_DELETED: (state) => ({
    ...state,
    isAuthenticated: false,
    userAccountDeleted: true
  }),
  USER_PROJECTS_EXIST: (state, action) => ({
    ...state,
    userProjectsExist: action.payload.count > 0
  }),
  USER_ACCOUNT_TYPE: (state, action) => ({
    ...state,
    accountType: action.payload.accountType
  }),
  FAILED_AUTH: (state) => ({
    ...state,
    isAuthenticated: false
  })
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'app',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  validateAccount: () => Promise.resolve(),
  resendValidationCode: () => Promise.resolve(),
  authStakeholder: () => Promise.resolve(),
  resendStakeholderValidationCode: () => Promise.resolve(),
  renewStakeholderPassword: () => Promise.resolve(),
  resetStakeholderPassword: () => Promise.resolve(),
  validateStakeholderAccount: () => Promise.resolve(),
  setAccountType: () => {},
  getAccountType: () => {}
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [account, setAccountTypeLocalStorage] = useLocalStorage('acc_t', selectedRole);
  // console.log('account  setAccountTypeLocalStorage == ', account);
  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
  }, []);

  const login = async (email, password) => {
    try {
      const loginApi = state.accountType === 'stakeholder' ? 'v1/stakeholder/account/login' : 'v1/user/account/login';
      const response = await axios.post(loginApi, {
        email,
        password
      });
      window.localStorage.setItem('refreshToken', response.data.refresh_token.refresh_token);
      dispatch({
        type: 'LOGIN'
      });
    } catch (err) {
      const { response = {} } = err;
      const { data = {} } = response;
      const { error = '' } = data;
      if (error === 'user pending') {
        dispatch({
          type: 'FAILED_AUTH'
        });
        window.location.href = PATH_AUTH.register;
        throw new Error(err);
      }
      dispatch({
        type: 'FAILED_AUTH'
      });
      throw new Error(err);
    }
  };

  const register = async (email, password, firstName, lastName, telephone, rgdpConsent, cguConsent) => {
    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      telephone,
      rgdp_consent: rgdpConsent ? 'Oui' : 'Non',
      cgu_consent: cguConsent
    };

    const response = await axios.post('v1/user', payload);
    const json = response.data;
    const user = { id: json.id, email: json.email };
    switch (json.path) {
      case 'login':
        dispatch({ type: 'USER_ACCOUNT_EXISTS' });
        break;
      case 'user_delete':
        dispatch({ type: 'USER_ACCOUNT_DELETED' });
        break;
      default:
        dispatch({
          type: 'REGISTER',
          payload: {
            user
          }
        });
    }
  };

  const authStakeholder = async (password, token) => {
    const response = await axios.post('v1/stakeholder/account/invite/auth', {
      password,
      token
    });
    const json = response.data;
    const stakeholder = { id: json.id, email: json.email };
    switch (json.path) {
      case 'login':
        dispatch({ type: 'USER_ACCOUNT_EXISTS' });
        break;
      case 'user_delete':
        dispatch({ type: 'USER_ACCOUNT_DELETED' });
        break;
      default:
        dispatch({
          type: 'REGISTER_STAKEHOLDER',
          payload: {
            stakeholder
          }
        });
    }
  };

  const logout = async () => {
    try {
      const logoutApi =
        state.accountType === 'stakeholder' ? 'v1/stakeholder/account/logout' : 'v1/user/account/logout';
      await axios.post(logoutApi);
      setSession(null);
      localStorage.clear();
      dispatch({ type: 'LOGOUT' });
    } catch (err) {
      dispatch({
        type: 'LOGOUT'
      });
      throw new Error(err);
    }
  };

  const resendValidationCode = async () => {
    await axios.post('v1/user/resend-validation-code');
  };

  const validateAccount = async (vCode) => {
    const data = new FormData();
    data.append('otp', vCode);
    await axios.post('v1/user/account/confirm', data);
  };

  const resetPassword = async (email) => {
    await axios.post('v1/user/account/password/recover', { email });
  };

  const renewPassword = async (password) => {
    try {
      await axios.post('v1/user/account/password', { password });
    } catch (err) {
      throw new Error(err);
    }
  };

  const resendStakeholderValidationCode = async () => {
    await axios.post('v1/stakeholder/resend-validation-code');
  };

  const validateStakeholderAccount = async (vCode) => {
    const data = new FormData();
    data.append('otp', vCode);
    await axios.post('v1/stakeholder/account/confirm', data);
  };

  const resetStakeholderPassword = async (email) => {
    await axios.post('v1/stakeholder/account/password/recover', { email });
  };

  const renewStakeholderPassword = async (password) => {
    await axios.post('v1/stakeholder/account/password', { password });
  };

  const setAccountType = (accountType) => {
    setAccountTypeLocalStorage(accountType);
    dispatch({
      type: 'USER_ACCOUNT_TYPE',
      payload: {
        accountType
      }
    });
  };

  const getAccountType = () => {
    dispatch({
      type: 'USER_ACCOUNT_TYPE',
      payload: {
        accountType: account
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'app',
        login,
        logout,
        register,
        resetPassword,
        validateAccount,
        renewPassword,
        resendValidationCode,
        authStakeholder,
        resendStakeholderValidationCode,
        renewStakeholderPassword,
        resetStakeholderPassword,
        validateStakeholderAccount,
        setAccountType,
        getAccountType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
