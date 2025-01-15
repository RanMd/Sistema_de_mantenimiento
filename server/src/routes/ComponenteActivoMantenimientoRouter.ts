import { Router } from 'express';
import {
    getComponentesActivosMantenimiento,
    createComponenteActivoMantenimiento
} from '../controllers/ComponenteActivoMantenimientoController';

const componenteActivoMantenimientoRouter = Router();

// Ruta para obtener registros
componenteActivoMantenimientoRouter.get('/', getComponentesActivosMantenimiento);

// Ruta para crear un nuevo registro
componenteActivoMantenimientoRouter.post('/compActMant', createComponenteActivoMantenimiento);

export default componenteActivoMantenimientoRouter;
