import express from "express";
import { mongo } from "../db/mongo/connection.js";
import { BuyerRouter } from "./routes.js";
import { BuyerController } from "./controller.js";
import { BuyerService } from "./service.js";
import { AuthMiddleWare } from "../auth/middleware.js";
import validator from "./validation.js";
import { JWT } from "../jwt/index.js";

export const buyerRouter = express.Router();
const db = mongo();
const jwt = new JWT({ db });
const middleware = new AuthMiddleWare({ db, jwt });
const buyer = new BuyerRouter({
  middleware,
  controller: new BuyerController({
    validator,
    service: new BuyerService({
      db,
    }),
  }),
});

buyerRouter.use(middleware.authenticate);
buyerRouter.use("/buyer", buyer.Router);
export default { buyerRouter };
