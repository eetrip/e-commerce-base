export class BuyerService {
  constructor({ db }) {
    this.db = db;
  }

  async listSellers() {
    return this.db.Users.listSellers();
  }

  async findActiveOrder({ userId, sellerId, productName }) {
    return this.db.Orders.findActiveOrder({ userId, sellerId, productName })
  }

  async getCatalog(sellerId) {
    return this.db.Catalog.getCatalogForBuyer(sellerId)
  }

  async createBuyOrder({
    productName, sellerId, catalogId, userId
  }) {
    return this.db.Orders.createBuyOrder({
      productName, sellerId, catalogId, userId
    });
  }

  async listActiveOrders(userId) {
    return this.db.Orders.listActiveBuyOrders(userId);
  }
}
export default BuyerService;
