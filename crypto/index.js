import crypto from 'crypto';
import { promisify } from 'util';

export class Crypto {
  constructor({
    iteration = 1000,
    hashKeyLen = 64,
    secretKeyLen = 200,
    saltLen = 16,
    digest = 'sha512',
    size = 16
  } = {}) {
    this.iteration = iteration;
    this.hashKeyLen = hashKeyLen;
    this.digest = digest;
    this.secretKeyLen = secretKeyLen;
    this.saltLen = saltLen;
    this.size = size;
  }

  salt() {
    return crypto.randomBytes(this.saltLen).toString('hex');
  }

  secret() {
    return crypto.randomBytes(this.secretKeyLen).toString('hex');
  }

  hash(data, saltString) {
    const salt = saltString || this.salt();
    const hashed = crypto.pbkdf2Sync(
      data,
      salt,
      this.iteration,
      this.hashKeyLen,
      this.digest
    ).toString('hex');
    return { hashed, salt };
  }

  verify(input, password, salt) {
    const hashed = crypto.pbkdf2Sync(
      input,
      salt,
      this.iteration,
      this.hashKeyLen,
      this.digest
    ).toString('hex');
    return hashed === password;
  }

  fivePaisaLeadGenerationToken(secret, salt, clientCode) {
    const length = 32 + 16;
    const hashedData = crypto.pbkdf2Sync(secret, salt, this.iteration, length, this.digest);
    const key = hashedData.slice(0, 32);
    const iv = hashedData.slice(32, length);
    const inputEncoding = 'utf16le';
    const outputEncoding = 'base64';
    const algorithm = 'aes-256-cbc';
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(clientCode, inputEncoding, outputEncoding);
    encrypted += cipher.final(outputEncoding);
    return encrypted;
  }

  generateRandomBytes(size) {
    return promisify(crypto.randomBytes)(size || this.size);
  }
}

export default Crypto;
