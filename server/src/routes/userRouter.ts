import { Router } from 'express';
import { getUser, getUsers, loginUser } from '../controllers/userController';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.post('/user', getUser);
userRouter.post('/login', loginUser);

export { userRouter };