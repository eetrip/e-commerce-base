import express from 'express';
import bodyParser from 'body-parser';

export class BuyerRouter {
  get Router() {
    return this.router;
  }

  constructor({ controller, middleware }) {
    this.router = express.Router();
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.urlencoded({ extended: true }));
    this.router.use(bodyParser.text());
    this.router.use(middleware.authenticate);
    this.router.post('/listSellers', (req, res, next) => controller.listSellers(req, res, next));
    this.router.post('/getCatalog', (req, res, next) => controller.getCatalog(req, res, next));
    this.router.post('/order', (req, res, next) => controller.createBuyOrder(req, res, next));
    this.router.post('/listOrders', (req, res, next) => controller.listOrders(req, res, next));
  }
}
export default BuyerRouter;
