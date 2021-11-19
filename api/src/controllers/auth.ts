import { Request, Response } from 'express';
import { Auth } from '../services/Auth';
import DB from './db';

export class AuthController {
  public auth: Auth = new Auth();
  public Authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const getAll = await DB.Models.Employee.find({}, { tokens: 0 });
      const user = await DB.Models.Employee.findByCredentials(username, password);
  console.log({getAll})
    if (!user) {
      return res
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' });
    }
    const token = await user.generateAuthToken();
    user.password = '';
    res.send({ user, token });
    } catch (error) {
      return res
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' });
    }
  };

  public Logout = async (req: Request, res: Response) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const _id = req.body._id;
    DB.Models.Employee.update(
      { _id, tokens: token },
      { $pull: { tokens: { $eq: token } } },
      (err, data) => {
        if(err) {
          throw new Error('Issue while logout!')
        }
        if(data) {
          res.send();
        }
      }
    );
  };
}
