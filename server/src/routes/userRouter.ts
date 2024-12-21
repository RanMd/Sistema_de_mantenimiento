import { Router } from 'express';
import { getUser, loginUser } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/user', getUser);
userRouter.post('/login', loginUser);

export { userRouter };