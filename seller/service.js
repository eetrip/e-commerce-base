export class SellerService {
  constructor({ db }) {
    this.db = db;
  }

  async findOneByUser({ name, userId }) {
    return this.db.Catalog.findOneByUser({ name, userId });
  }

  async findOneById({ catalogId, userId }) {
    return this.db.Catalog.findOne({ catalogId, userId })
  }

  async createCatalog({ name, userId }) {
    const catalog = await this.findOneByUser({ name, userId });
    if (catalog) {
        throw new Error('Catalog creation failed, catalog with same name exists');
    }
    const { upsertedId: id } = await this.db.Catalog.createNewCatalog({ name, userId });
    return { catalogId: id };
  }

  async addItemsToCatalog({ catalogId, items }) {
    return this.db.Catalog.addItems({ catalogId, items });
  }

  async listOrders(userId) {
    return this.db.Orders.listOrdersForSeller(userId);
  }
}
export default SellerService;
