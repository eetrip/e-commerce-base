import responder from "../utils/responseHandler.js";

export class BuyerController {
  constructor({ validator, service }) {
    this.validator = validator;
    this.service = service;
  }

  listSellers = async (req, res, next) => {
    try {
      const {
        user: { type },
      } = req;
      if (type !== "buyer") {
        throw new Error("Buyer account required to list sellers");
      }
      const sellers = await this.service.listSellers();
      return responder(res)(null, { sellers });
    } catch (e) {
      return next(e);
    }
  };

  getCatalog = async (req, res, next) => {
    try {
      await this.validator.getCatalog(req.body);
      const {
        body: { sellerId },
      } = req;
      const catalog = await this.service.getCatalog(sellerId);
      return responder(res)(null, { catalog, sellerId });
    } catch (e) {
      return next(e);
    }
  };

  createBuyOrder = async (req, res, next) => {
    try {
      await this.validator.createBuyOrder(req.body);
      const {
        body: { productName, sellerId, catalogId },
        user: { _id: userId, type },
      } = req;
      if (type !== "buyer") {
        throw new Error("Buyer account required to create a buy order");
      }
      const activeOrder = await this.service.findActiveOrder({
        productName,
        sellerId,
        userId,
      });
      if (activeOrder) {
        throw new Error("An active order for this product already exists");
      }
      const orderId = await this.service.createBuyOrder({
        productName,
        sellerId,
        catalogId,
        userId,
      });
      return responder(res)(null, {
        message: "Order placed successfully",
        orderId,
      });
    } catch (e) {
      return next(e);
    }
  };

  listOrders = async (req, res, next) => {
    try {
      const {
        user: { _id: userId },
      } = req;
      const orders = await this.service.listActiveOrders(userId);
      return responder(res)(null, { orders });
    } catch (e) {
      return next(e);
    }
  };
}
export default BuyerController;
