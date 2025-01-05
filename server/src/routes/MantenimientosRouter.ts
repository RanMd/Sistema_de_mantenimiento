import { Router } from 'express';
import { createMantenimiento, getLastIdMaintenance, getMantenimientos } from '../controllers/MantenimientosController';

const routerMantenimientos = Router();

routerMantenimientos.get('/getLastIdMaintenance', getLastIdMaintenance);
routerMantenimientos.post('/createMant', createMantenimiento);
routerMantenimientos.get('/allMant', getMantenimientos);

export default routerMantenimientos;