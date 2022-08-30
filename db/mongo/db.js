import { DB } from "../db.js";
import { Users } from "./users.js";

export class MongoDB extends DB {
  constructor({ db }) {
    super({
      users: new Users({ db }),
    });
  }
}

export default MongoDB;
