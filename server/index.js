import express from 'express';
import { usersRouter } from '../users/index.js'
import { authRouter } from '../auth/index.js';

const router = express.Router();

router.use(authRouter);
router.use(usersRouter);

export default router;