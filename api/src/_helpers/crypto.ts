import bcrypt from 'bcrypt';


export class CryptoUtil {
  private saltRounds = 10;
  public validatePassword = (enteredPassword: string, dbPassword: string): Promise<any> => {
    return bcrypt.compare(enteredPassword, dbPassword);
  }

  public hashPassword = (password: string): Promise<any> => {
    return bcrypt.hash(password, this.saltRounds);
  }

}