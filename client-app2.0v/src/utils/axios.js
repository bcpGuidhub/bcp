import axios from 'axios';
import { PATH_AUTH } from '../routes/paths';
import { getNewToken } from './getAppToken';
// ----------------------------------------------------------------------

const API = axios.create({
  baseURL: `${process.env.REACT_APP_APP_SERVER}/`,
  withCredentials: true
});
export const COTISATION_API = axios.create({
  baseURL: `${process.env.REACT_APP_COTISATION_APP_SERVER}/`,
  withCredentials: true
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (typeof error.response !== 'undefined' && error.response.status !== 401) ||
      error.config.url === 'v1/user/account/logout'
    ) {
      if (error.config.url === 'v1/user/account/logout') {
        window.location.href = PATH_AUTH.login;
      }
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    if (error.config.url === 'v1/token/refresh' || error.config.url === 'v1/stakeholder/token/refresh') {
      return new Promise((resolve, reject) => {
        const logOutapi =
          error.config.url === 'v1/stakeholder/token/refresh'
            ? 'v1/stakeholder/account/logout'
            : 'v1/user/account/logout';
        API.post(logOutapi, {})
          .then((response) => {
            localStorage.clear();
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    if (
      (error.config.url !== 'v1/user/account/login' || error.config.url !== 'v1/user/account/logout') &&
      typeof error.response !== 'undefined' &&
      error.response.status === 401
    ) {
      // Try request again with new token
      return getNewToken()
        .then((response) => {
          window.localStorage.setItem('refreshToken', response.data.refresh_token);
          const { config } = error;
          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          });
        })
        .catch((error) => {
          console.log('error: ', error);
          window.location.href = PATH_AUTH.login;
        });
    }
    return error;
  }
);

export default API;
