import { JWT } from '../jwt/index.js';

export class AuthMiddleWare {
  authenticate = async (req, res, next) => {
    try {
      const { headers: { authorization } } = req;
      const inputToken = (authorization && authorization.split(' ')[1]) || '';
      const { user, token } = await this.jwt.authVerify(inputToken);
      req.user = user;
      res.set('Authorization', `Bearer ${token}`);
      next();
    } catch (err) {
      console.log('Invalid Token')
      next();
    }
  };

  constructor({ jwt = new JWT() } = {}) {
    this.jwt = jwt;
  }
}

export default AuthMiddleWare;
