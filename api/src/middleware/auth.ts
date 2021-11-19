import jwt from 'jsonwebtoken';
import DB from '../controllers/db';
import config from '../config';

export const authenticate = () => {
  return (req, res, next) => {
    if (req.path === '/authenticate') {
      console.log(req.path);
      return next();
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    const data: any = jwt.verify(token, process.env.JWT_KEY || config.secret);
    console.log(data._id);
    DB.Models.Employee.findOne({ _id: data._id, tokens: token })
      .then(user => {
        if (!user) throw new Error('Authentication failure!');
        next();
      })
      .catch(error => {
        console.log(error);
        return res.status(401).send({ error });
      });
  };
};

export const authorize = (roles: any) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data: any = jwt.verify(token, process.env.JWT_KEY || config.secret);
    DB.Models.Employee.findOne({ _id: data._id, tokens: token })
      .then(user => {
        if (!user) throw new Error('User do not exist!');
        if (roles.length && !roles.includes(user.role))
          throw new Error('User not previlaged to the resource!');
        next();
      })
      .catch(error => {
        console.log(error);
        return res.status(401).send({ error });
      });
  };
};
