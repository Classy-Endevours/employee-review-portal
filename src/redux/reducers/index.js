import { combineReducers } from 'redux';
import employees from './employees';
import user from './user';

export default combineReducers({ employees, user });
