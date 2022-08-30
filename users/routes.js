import express from "express";

export class UsersRouter {
  constructor({ controller }) {
    this.router = express.Router();
    this.router.post("/create", (req, res, next) =>
      controller.create(req, res, next)
    );
  }

  get Router() {
    return this.router;
  }
}

export default UsersRouter;
