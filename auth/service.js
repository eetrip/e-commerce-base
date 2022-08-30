import moment from 'moment';
import { JWT } from '../jwt/index.js';
import { DB } from '../db/db.js';
import { Crypto } from '../crypto/index.js';

export class AuthService {
  constructor({
    db = new DB(),
    crypto = new Crypto(),
    jwt = new JWT()
  }) {
    this.db = db;
    this.crypto = crypto;
    this.jwt = jwt;
  }

  async getUser(mobile) {
    return this.db.Users.findByMobile(mobile);
  }

  async register({
    name, password, type, mobile
  }) {
    const user = await this.getUser(mobile);
    if (user) {
      throw new Error('User already exists');
    }
    const secret = this.crypto.secret();
    const { salt, hashed: hashedPassword } = this.crypto.hash(password);
    const { upsertedId: id } = await this.db.Users.register({
      name, salt, password: hashedPassword, mobile, type, secret
    });
    const token = this.jwt.token(id.toString(), secret)
    return { token };
  }

  async login({
    userPassword, salt, password, userId, userSecret
  }) {
    const passwordVerified = this.crypto.verify(password, userPassword, salt);
    if (!passwordVerified) {
      throw new Error('Invalid password');
    }
    return this.jwt.token(userId.toString(), userSecret);
  }
}
export default AuthService;
