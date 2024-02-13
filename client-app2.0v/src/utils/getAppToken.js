import axios from './axios';

export function getNewToken() {
  const storedRole = localStorage.getItem('acc_t');
  const selectedRole = storedRole !== null ? JSON.parse(storedRole) : null;
  let tokenRenewUrl = null;
  if (selectedRole) {
    tokenRenewUrl = selectedRole === 'stakeholder' ? 'v1/stakeholder/token/refresh' : 'v1/token/refresh';
  }

  const refreshToken = localStorage.getItem('refreshToken');

  return new Promise((resolve, reject) => {
    axios
      .post(tokenRenewUrl, {
        refresh_token: refreshToken
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
