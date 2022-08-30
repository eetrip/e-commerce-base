export class Users {
  constructor() {
    if (this.constructor === Users) {
      throw new Error(
        `Abstract class ${this.constructor.name} cannot be instantiated`
      );
    }
  }
}

export default Users;
