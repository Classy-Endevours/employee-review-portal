import { ADD_EMP, LOAD_EMPS, SET_USER } from './actionTypes';

export const addEmp = emp => ({
  type: ADD_EMP,
  payload: {
    emp
  }
});

export const loadEmps = employees => ({
  type: LOAD_EMPS,
  payload: {
    employees
  }
});

export const setCurrentUser = user => ({
  type: SET_USER,
  payload: {
    user
  }
});
