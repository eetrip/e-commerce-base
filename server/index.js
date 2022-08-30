import express from 'express';
import { usersRouter } from '../users/index.js'
import { authRouter } from '../auth/index.js';
import { sellerRouter } from '../seller/index.js';
import { buyerRouter } from '../buyer/index.js';

const router = express.Router();

router.use(authRouter);
router.use(usersRouter);
router.use(sellerRouter);
router.use(buyerRouter);

export default router;