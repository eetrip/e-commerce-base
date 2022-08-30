import jwt from "jsonwebtoken";
import MongoDB from "../db/mongo/db.js";

export class JWT {
  constructor({
    issuer = "eeshan",
    audience = "users",
    expiresIn = "720h",
    db = new MongoDB(),
  } = {}) {
    this.db = db;
    this.issuer = issuer;
    this.audience = audience;
    this.expiresIn = expiresIn;
    this.secret = process.env.SECRET_KEY;
  }

  static get EnvSecret() {
    return process.env.SECRET_KEY;
  }

  async authVerify(token) {
    const { sub } = jwt.decode(token);
    const user = await this.db.Users.findOneById(sub);
    jwt.verify(token, JWT.EnvSecret + (user.secret || ""), this.JWTConst);
    return { token: this.token(sub, user.secret), user };
  }

  get JWTConst() {
    return {
      issuer: this.issuer,
      audience: this.audience,
      expiresIn: this.expiresIn,
    };
  }

  token(sub, ext = "") {
    return jwt.sign({ sub }, JWT.EnvSecret + ext, this.JWTConst);
  }
}

export default JWT;
