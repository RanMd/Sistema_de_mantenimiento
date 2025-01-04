import { Router } from 'express';
import { getComponentesActivosMantenimiento } from '../controllers/ComponenteActivoMantenimientoController';

const componenteActivoMantenimientoRouter = Router();

componenteActivoMantenimientoRouter.get('/', getComponentesActivosMantenimiento);

export default componenteActivoMantenimientoRouter;
