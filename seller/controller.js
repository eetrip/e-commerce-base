import responder from "../utils/responseHandler.js";

export class SellerController {
  constructor({ validator, service }) {
    this.validator = validator;
    this.service = service;
  }

  createCatalog = async (req, res, next) => {
    try {
      await this.validator.createCatalog(req.body);
      const {
        body: { name },
        user: { _id: userId, type },
      } = req;
      if (type !== 'seller') {
        throw new Error('Catalog creation failed, user is not registered as a seller');
      }
    const { catalogId } = await this.service.createCatalog({ name, userId });
      return responder(res)(null, {
        message: "Catalog created successfully",
        name,
        catalogId
      });
    } catch (e) {
      return next(e);
    }
  };

  addItemsToCatalog = async(req, res, next) => {
    try {
      await this.validator.addItems(req.body);
      const {
        body: { items, catalogId },
        user: { _id: userId, type }
      } = req;
      const catalog = await this.service.findOneById({ catalogId, userId });
      if (!catalog || type !== 'seller') {
        throw new Error('Failed to add items to catalog')
      }
      await this.service.addItemsToCatalog({ catalogId, items });
      return responder(res)(null, {
        message: 'Items added successfully'
      });
    } catch (e) {
      return next(e);
    }
  }

  orders = async(req, res, next) => {
    try {
      await this.validator.orders(req.body);
      const { user: { _id: userId, type } } = req;
      const orders = await this.service.listOrders(userId);
      return responder(res)(null, { orders });
    } catch (e) {
      return next(e);
    }
  }
}
export default SellerController;
