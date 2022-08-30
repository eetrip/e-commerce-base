import { Users } from "./users.js";

export class DB {
  get Users() {
    return this.users;
  }

  constructor({ users = new Users() } = {}) {
    if (this.constructor === DB) {
      throw new Error(
        `Abstract class ${this.constructor.name} cannot be instantiated`
      );
    }
    this.users = users;
  }
}

export default DB;
