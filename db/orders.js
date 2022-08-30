export class Orders {
  constructor() {
    if (this.constructor === Orders) {
      throw new Error(
        `Abstract class ${this.constructor.name} cannot be instantiated`
      );
    }
  }
}

export default Orders;
