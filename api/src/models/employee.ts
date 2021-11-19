import { Document, model, Model, Schema, Types } from 'mongoose';
import { CryptoUtil } from '../_helpers/crypto';
import { Auth } from '../services/Auth';
import DB from '../controllers/db';

export declare interface IEmployee extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  username: string;
  password: string;
  tokens: Types.Array<string>;
  role: Role;
  reviewDocs: Types.Array<IReview>;
  generateAuthToken: () => Promise<string>;
}

export enum Role {
  admin = 'admin',
  user = 'user'
}

export declare interface IReview extends Types.Subdocument {
  revr_id: Schema.Types.ObjectId; // reviewer id
  rating: number;
  fb_status: string;
}

export interface IEmployeeModel extends Model<IEmployee> {
  findByCredentials: (username: string, password: string) => Promise<IEmployee>;
}

export class Employee {
  // tslint:disable-next-line: variable-name
  private _model: Model<IEmployee>;

  constructor() {
    const reviewDocs = new Schema(
      {
        revr_id: { type: Types.ObjectId },
        fb_status: { type: String },
        rating: { type: Number }
      },
      { _id: false }
    );
    const cpto = new CryptoUtil();

    const employeeSchema = new Schema({
      email: { type: String },
      name: { type: String, required: true },
      password: { type: String },
      phone: { type: String },
      username: { type: String, required: true },
      tokens: { type: Array, required: true },
      role: { type: Role },
      reviewDocs: { type: [reviewDocs] }
    });

    employeeSchema.pre<IEmployee>('save', async function(next) {
      const user = this;
      if (user.isModified('password')) {
        user.password = await cpto.hashPassword(user.password);
      }
      next();
    });

    employeeSchema.methods.generateAuthToken = async function() {
      const user = this;
      const auth = new Auth();
      const token = auth.generateToken(user._id);
      user.tokens.push(token);
      if(user.tokens.length > 5) // keep maximum 5 logins for a single user
        user.tokens.shift();
      await user.save();
      return token;
    };

    employeeSchema.statics.findByCredentials = async (username, password) => {
      const user = await DB.Models.Employee.findOne({ username });
      if (!user) throw new Error("{ error: 'Invalid login credentials' }");
      const isPasswordMatch = await cpto.validatePassword(
        password,
        user.password
      );
      if (!isPasswordMatch)
        throw new Error("{ error: 'Invalid login credentials' }");
      return user;
    };

    this._model = model<IEmployee>('Employee', employeeSchema);
  }

  public get model(): Model<IEmployee> {
    return this._model;
  }
}
