import config from '../config';
import jwt from 'jsonwebtoken';
import DB from '../controllers/db';
import { IEmployee } from '../models/employee';
import { CryptoUtil } from '../_helpers/crypto';

export class Auth {
  public crypto: CryptoUtil = new CryptoUtil();

  public generateToken = _id => {
    const token = jwt.sign({ _id }, process.env.JWT_KEY || config.secret);
    return token;
  };
}
