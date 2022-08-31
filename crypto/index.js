import crypto from 'crypto';

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
}

export default Crypto;
