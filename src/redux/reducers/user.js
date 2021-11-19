import { SET_USER } from '../actionTypes';

export default (state = '', action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload.user || state;
    default:
      return state;
  }
};
