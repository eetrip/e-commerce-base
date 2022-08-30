export class Catalog {
  constructor() {
    if (this.constructor === Catalog) {
      throw new Error(
        `Abstract class ${this.constructor.name} cannot be instantiated`
      );
    }
  }
}

export default Catalog;
