import express from 'express';
import bodyParser from 'body-parser';

export class SellerRouter {
  get Router() {
    return this.router;
  }

  constructor({ controller, middleware }) {
    this.router = express.Router();
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.urlencoded({ extended: true }));
    this.router.use(bodyParser.text());
    this.router.use(middleware.authenticate);
    this.router.post('/createCatalog', (req, res, next) => controller.createCatalog(req, res, next));
    this.router.post('/addItems', (req, res, next) => controller.addItemsToCatalog(req, res, next));
    this.router.post('/orders', (req, res, next) => controller.orders(req, res, next));
  }
}
export default SellerRouter;
