import express from "express";
import { mongo } from "../db/mongo/connection.js";
import { SellerRouter } from "./routes.js";
import { SellerController } from "./controller.js";
import { SellerService } from "./service.js";
import { AuthMiddleWare } from "../auth/middleware.js";
import validator from "./validation.js";
import { JWT } from "../jwt/index.js";

export const sellerRouter = express.Router();
const db = mongo();
const jwt = new JWT({ db });
const middleware = new AuthMiddleWare({ db, jwt });
const seller = new SellerRouter({
  middleware,
  controller: new SellerController({
    validator,
    service: new SellerService({
      db,
    }),
  }),
});

sellerRouter.use(middleware.authenticate);
sellerRouter.use("/seller", seller.Router);
export default { sellerRouter };
