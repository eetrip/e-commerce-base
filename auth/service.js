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
    console.log(passwordVerified);
    if (!passwordVerified) {
      throw new Error('Invalid password');
    }
    return this.jwt.token(userId.toString(), userSecret);
  }

  async createAccount({
    email,
    firstName,
    lastName,
    dob,
    pin,
    mobile,
    imageUrl,
    answers,
    referralCode,
    whatsAppConsent,
    userIp,
    os: newOS,
    appVersion: newAppVersion,
    advertiserId: newAdvertiserId,
    appId: newAppId
  }) {
    const name = lastName ? `${firstName} ${lastName}` : firstName;
    // salt is used to hash pin before storing it
    // pin is in base64 format
    const { salt, hashed: hashedPin } = this.crypto.hash(pin);
    // pinSecret is used to create pinToken
    const pinSecret = this.crypto.secret();
    const user = await this.db.Users.findOne({ mobile });

    const updateObj = {
      firstName,
      lastName,
      name,
      email,
      mobile,
      salt,
      secret: this.crypto.secret(),
      pinSecret,
      coins: {
        totalCoins: 0,
        totalRedemption: 0,
        currentCoins: 0
      },
      lifetimeCoins: 0,
      perfiosRegistered: false,
      pin: hashedPin,
      dob,
      imageUrl,
      answers,
      isEmailVerified: user.isEmailVerified || false,
      permissions: {
        auth: {
          newUser: true
        }
      },
      referralCode,
      whatsAppConsent,
      appId: newAppId
    };
    const { id } = await this.db.Users.update(updateObj);

    const token = this.jwt.token(id.toString(), updateObj.secret);
    const { isEmailVerified } = updateObj;
    return {
      token, imageUrl, isEmailVerified, referralCode
    };
  }

  async pinLogin({
    pin, user, os: newOS, appVersion: newAppVersion, userIp, advertiserId: newAdvertiserId, appId: newAppId
  }) {
    const {
      os, appVersion, advertiserId, appId
    } = user;
    const isPinVerified = this.crypto.verify(
      pin,
      user.pin,
      user.salt
    );

    return this.jwt.token(user._id, user.secret);
  }

  async getToken(user) {
    const { _id, secret } = user;
    return this.jwt.token(_id, secret);
  }
}
export default AuthService;
