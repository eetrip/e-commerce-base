import { Users } from "./users.js";
import { Catalog } from "./catalog.js";
import { Orders } from "./orders.js";

export class DB {
  constructor({
    users = new Users(),
    catalog = new Catalog(),
    orders = new Orders(),
  } = {}) {
    if (this.constructor === DB) {
      throw new Error(
        `Abstract class ${this.constructor.name} cannot be instantiated`
      );
    }
    this.users = users;
    this.catalog = catalog;
    this.orders = orders;
  }

  get Users() {
    return this.users;
  }

  get Catalog() {
    return this.catalog;
  }

  get Orders() {
    return this.orders;
  }
}

export default DB;
