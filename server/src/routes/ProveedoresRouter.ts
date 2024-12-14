import { Router } from 'express';
import { getProveedores } from '../controllers/ProveedoresController';

const proveedoresRouter = Router();

proveedoresRouter.get('/', getProveedores);

export default proveedoresRouter;
