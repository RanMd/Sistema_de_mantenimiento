import { Router } from 'express';
import { createMantenimiento, getMantenimientos } from '../controllers/MantenimientoController';

const mantenimientoRouter = Router();

// Ruta para crear un nuevo mantenimiento
mantenimientoRouter.post('/createMant', createMantenimiento);
mantenimientoRouter.get('/allMant', getMantenimientos);

export default mantenimientoRouter;
