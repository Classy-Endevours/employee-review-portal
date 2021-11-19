import { LOAD_EMPS } from '../actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_EMPS:
      return action.payload.employees || state;
    default:
      return state;
  }
};
