import { Router } from 'express';
import { createDetalleMantenimiento } from '../controllers/DetalleMantenimientoController';

const detalleMantenimientoRouter = Router();

// Ruta para crear un nuevo detalle de mantenimiento
detalleMantenimientoRouter.post('/createDet', createDetalleMantenimiento);

export default detalleMantenimientoRouter;
