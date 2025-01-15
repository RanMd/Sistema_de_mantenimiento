import { Router } from 'express';
import { createMantenimiento, getActivesPerMant, getDetailsReport, getDetailsUpdate, getLastIdMaintenance, getMaintenance, getMantenimientos, updateMantenimiento } from '../controllers/MantenimientosController';

const routerMantenimientos = Router();

routerMantenimientos.get('/getLastIdMaintenance', getLastIdMaintenance);
routerMantenimientos.post('/save', createMantenimiento);
routerMantenimientos.post('/update', updateMantenimiento);
routerMantenimientos.get('/allMant', getMantenimientos);
routerMantenimientos.post('/getOne', getMaintenance);
routerMantenimientos.post('/getDetailsReport', getDetailsReport);
routerMantenimientos.post('/getDetailsUpdate', getDetailsUpdate);
routerMantenimientos.post('/getActivesPerMant', getActivesPerMant);

export default routerMantenimientos;