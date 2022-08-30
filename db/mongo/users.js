import mongodb from "mongodb";
import { Users as BaseUsers } from "../users.js";

const { ObjectId } = mongodb;

export class Users extends BaseUsers {
  constructor({ db }) {
    super();
    this.name = "users";
    this.db = db;
  }

  get Collection() {
    return this.db.collection(this.name);
  }

  findByMobile(mobile) {
    return this.Collection.findOne({ mobile });
  }

  findOneById(id) {
    return this.Collection.findOne({ _id: new ObjectId(id) });
  }

  register({ name, salt, password, mobile, type, secret }) {
    return this.Collection.updateOne(
      { mobile },
      {
        $set: {
          name,
          salt,
          password,
          mobile,
          type,
          secret,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      },
      { upsert: true, returnNewDocument: true }
    );
  }

  listSellers() {
    return this.Collection.find({ type: "seller" })
      .project({ _id: 0, name: 1, sellerId: "$_id" })
      .toArray();
  }
}
export default Users;
