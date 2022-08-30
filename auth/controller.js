import responder from "../utils/responseHandler.js";

export class AuthController {
  constructor({ validator, authService }) {
    this.validator = validator;
    this.auth = authService;
  }

  register = async (req, res, next) => {
    try {
      await this.validator.register(req.body);
      const {
        body: { name, password, type, mobile },
      } = req;
      const { token } = await this.auth.register({
        name,
        password,
        type,
        mobile,
      });
      return responder(res)(null, {
        message: "Account created successfully",
        token,
      });
    } catch (e) {
      return next(e);
    }
  };

  login = async (req, res, next) => {
    try {
      await this.validator.login(req.body);
      const {
        body: { mobile, password },
      } = req;
      const {
        password: userPassword,
        salt,
        _id: userId,
        secret: userSecret,
      } = await this.auth.getUser(mobile);
      const token = await this.auth.login({
        password,
        userPassword,
        salt,
        userId,
        userSecret,
      });
      return responder(res)(null, {
        message: "Loggedin successfully",
        token,
      });
    } catch (e) {
      return next(e);
    }
  };
}
export default AuthController;
