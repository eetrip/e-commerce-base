import express from 'express';
import { mongo } from '../db/mongo/connection.js';
import { AuthRouter } from './routes.js';
import { AuthController } from './controller.js';
import { AuthService } from './service.js';
import { AuthMiddleWare } from './middleware.js';
import authValidator from './validation.js';
import { JWT } from '../jwt/index.js';

export const authRouter = express.Router();
const db = mongo();
const jwt = new JWT({ db });
const middleware = new AuthMiddleWare({ db, jwt });
const auth = new AuthRouter({
  middleware,
  controller: new AuthController({
    validator: authValidator,
    authService: new AuthService({
      db,
      jwt
    })
  })
});

// no authentication
authRouter.use('/auth', auth.Router);
authRouter.use(middleware.authenticate);
// TODO: add permissions later.
// authRouter.use(attachPermissions);
// authRouter.use(verifyMiddleware);
export default { authRouter };
