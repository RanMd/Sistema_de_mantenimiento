import { Router } from 'express';
import { getAdmins } from '../controllers/adminController';

const userRouter = Router();

userRouter.get('/users', getAdmins);

export { userRouter };