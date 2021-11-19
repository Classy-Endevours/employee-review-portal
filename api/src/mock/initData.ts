import DB from '../controllers/db';
import { Types } from 'mongoose';

/**
 * Default data inserted into employee table to show some data
 */
export const initData = () => {
  const p1 = DB.Models.Employee.create({
    _id: new Types.ObjectId(),
    name: 'admin',
    username: 'admin',
    password: 'secret',
    role: 'admin'
  });
  const p2 = DB.Models.Employee.create({
    _id: new Types.ObjectId(),
    name: 'employee',
    username: 'employee',
    password: 'secret'
  });
  const p3 = DB.Models.Employee.create({
    _id: new Types.ObjectId(),
    name: 'Tony stark',
    username: 'tony',
    password: 'secret'
  });
  const p4 = DB.Models.Employee.create({
    _id: new Types.ObjectId(),
    name: 'Peter Parker',
    username: 'peter',
    password: 'secret'
  });
  return Promise.all([p1, p2, p3, p4]);
};
