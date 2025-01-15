import { Router } from 'express';
import { closeMaintenance, createMantenimiento, getActivesPerMant, getDetailsReport, getDetailsUpdate, getLastIdMaintenance, getMaintenance, getMantenimientos, reOpenMaintenance, updateMantenimiento } from '../controllers/MantenimientosController';

const routerMantenimientos = Router();

routerMantenimientos.get('/getLastIdMaintenance', getLastIdMaintenance);
routerMantenimientos.post('/save', createMantenimiento);
routerMantenimientos.post('/update', updateMantenimiento);
routerMantenimientos.post('/close', closeMaintenance);
routerMantenimientos.post('/reOpen', reOpenMaintenance);
routerMantenimientos.get('/allMant', getMantenimientos);
routerMantenimientos.post('/getOne', getMaintenance);
routerMantenimientos.post('/getDetailsReport', getDetailsReport);
routerMantenimientos.post('/getDetailsUpdate', getDetailsUpdate);
routerMantenimientos.post('/getActivesPerMant', getActivesPerMant);

export default routerMantenimientos;