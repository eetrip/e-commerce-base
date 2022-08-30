import mongodb from "mongodb";
import { Orders as BaseOrders } from "../orders.js";

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

  listOrdersForSeller(sellerId) {
    return this.Collection.find({
      sellerId: ObjectId(sellerId),
      active: true,
    }).toArray();
  }

  findActiveOrder({ userId, sellerId, productName }) {
    return this.Collection.findOne({
      userRef: ObjectId(userId),
      sellerId: ObjectId(sellerId),
      productName,
      active: true,
    });
  }

  listActiveBuyOrders(userId) {
    return this.Collection.find({
      userRef: ObjectId(userId),
      active: true,
    }).toArray();
  }

  createBuyOrder({ productName, sellerId, catalogId, userId }) {
    return this.Collection.updateOne(
      {
        productName,
        sellerId: ObjectId(sellerId),
        catalogId: ObjectId(catalogId),
        userRef: ObjectId(userId),
        type: "buy",
      },
      {
        $set: {
          productName,
          sellerId: ObjectId(sellerId),
          catalogId: ObjectId(catalogId),
          userRef: ObjectId(userId),
          type: "buy",
          createdAt: new Date(),
          updatedAt: new Date(),
          active: true,
        },
      },
      { upsert: true }
    );
  }
}
export default Orders;
