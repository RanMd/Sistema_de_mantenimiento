import { Router } from 'express';
import { getLastIdMaintenance } from '../controllers/MantenimientosController';

const routerMantenimientos = Router();

routerMantenimientos.get('/getLastIdMaintenance', getLastIdMaintenance);

export default routerMantenimientos;