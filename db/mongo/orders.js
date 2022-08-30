import mongodb from "mongodb";
import { Orders as BaseOrders } from "../catalog.js";

const { ObjectId } = mongodb;

export class Orders extends BaseOrders {
  constructor({ db }) {
    super();
    this.name = "orders";
    this.db = db;
  }

  get Collection() {
    return this.db.collection(this.name);
  }

  listOrdersForSeller({ sellerId }) {
    return this.Collection.find({
      sellerId: ObjectId(sellerId),
      active: true
    }).toArray();
  }
}
export default Catalog;
