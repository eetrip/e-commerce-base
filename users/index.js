import 'dotenv/config';
import express from "express";
import { mongo } from "../db/mongo/connection.js";
import { UsersRouter } from "./routes.js";
import { UsersController } from "./controller.js";
import { UsersService } from "./service.js";

export const usersRouter = express.Router();

const db = mongo();

const users = new UsersRouter({
  controller: new UsersController({
    usersService: new UsersService({
      db
    })
  }),
});

usersRouter.use("/users", users.Router);

export default { usersRouter };
