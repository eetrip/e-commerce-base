import { DB } from "../db.js";
import { Users } from "./users.js";
import { Catalog } from './catalog.js';
import { Orders } from './orders.js';

export class MongoDB extends DB {
  constructor({ db }) {
    super({
      users: new Users({ db }),
      catalog: new Catalog({ db }),
      orders: new Orders({ db })
    });
  }
}

export default MongoDB;
