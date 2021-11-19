// const storage = localStorage;
const storage = sessionStorage;

const saveUser = user => storage.setItem('user', user);

const removeUser = () => storage.removeItem('user');

const getUser = () => {
  const usrString = storage.getItem('user') || '{}';
  const { user } = JSON.parse(usrString);
  return user;
};

const getUserWToken = () => JSON.parse(storage.getItem('user'));
export default { saveUser, removeUser, getUser, getUserWToken };
