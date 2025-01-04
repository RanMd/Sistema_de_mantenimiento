import { Router } from 'express';
import { getDetallesMantenimiento } from '../controllers/DetalleMantenimientoController';

const detalleMantenimientoRouter = Router();

detalleMantenimientoRouter.get('/', getDetallesMantenimiento);

export default detalleMantenimientoRouter;
