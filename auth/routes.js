import express from 'express';
import bodyParser from 'body-parser';

export class AuthRouter {
  get Router() {
    return this.router;
  }

  constructor({ controller, middleware }) {
    this.router = express.Router();
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.urlencoded({ extended: true }));
    this.router.use(bodyParser.text());
    this.router.post('/register', (req, res, next) => controller.register(req, res, next));
    this.router.post('/login', (req, res, next) => controller.login(req, res, next));
    this.router.use(middleware.authenticate);
  }
}
export default AuthRouter;
