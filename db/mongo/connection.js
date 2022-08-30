import MongoDbDriver from "mongodb";
import { MongoDB } from "./db.js";

const { MongoClient } = MongoDbDriver;

let mdb;

const mongoDb = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (!mdb) {
  console.log("connecting to db");
  await mongoDb.connect();
  console.log("connected to db");
  mdb = mongoDb.db("hybrid");
}

const error = (e) => {
  throw e;
};

export const mongo = () =>
  (mdb &&
    new MongoDB({
      db: mdb,
    })) ||
  error(new Error("Not connected to db"));

export const db = mdb;
