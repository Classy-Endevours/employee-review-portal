import storage from './Storage';

export function authHeader() {
  // return authorization header with jwt token
  let user = storage.getUserWToken();

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
