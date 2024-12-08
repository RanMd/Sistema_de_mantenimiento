import { Router } from 'express';
import { getAdmins } from '../controllers/adminController';

const adminRouter = Router();

adminRouter.get('/admins', getAdmins);

export { adminRouter };