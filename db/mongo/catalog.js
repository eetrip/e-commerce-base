import mongodb from "mongodb";
import { Catalog as BaseCatalog } from "../catalog.js";

const { ObjectId } = mongodb;

export class Catalog extends BaseCatalog {
  constructor({ db }) {
    super();
    this.name = "catalogs";
    this.db = db;
  }

  get Collection() {
    return this.db.collection(this.name);
  }

  findOneByUser({ name, userId }) {
    return this.Collection.findOne({ userRef: ObjectId(userId), name });
  }

  findOne({ catalogId, userId }) {
    return this.Collection.findOne({
      userRef: ObjectId(userId),
      _id: ObjectId(catalogId),
    });
  }

  createNewCatalog({ name, userId }) {
    return this.Collection.updateOne(
      { userRef: ObjectId(userId), name },
      { $set: { name, items: [] } },
      { upsert: true }
    );
  }

  addItems({ catalogId, items }) {
    return this.Collection.updateOne(
      { _id: ObjectId(catalogId) },
      { $push: { items: { $each: items } } }
    );
  }
}
export default Catalog;
