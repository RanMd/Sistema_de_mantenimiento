import { Router } from 'express';
import { deleteActive, deleteProcess, getActive, getAllActives, getAllActivesFree, getAllActivesPerUbication, getBrandsPerCategory, getCategories, getComponentsPerActive, getComponentsPerType, getLastIdActive, getLastIdProcess, getMantenimientosPerActive, getProcesses, getTypes, getTypesPerCategory, saveActive, saveProcess } from '../controllers/ActivosController';

const routerActivos = Router();

routerActivos.post('/get', getActive);
routerActivos.get('/getAll', getAllActives);
routerActivos.get('/categories', getCategories);
routerActivos.post('/types', getTypesPerCategory);
routerActivos.get('/typesAll', getTypes);
routerActivos.post('/brands', getBrandsPerCategory);
routerActivos.get('/last', getLastIdActive);
routerActivos.get('/lastIdProcess', getLastIdProcess);
routerActivos.post('/save', saveActive);
routerActivos.get('/processes', getProcesses);
routerActivos.delete('/delete', deleteActive);
routerActivos.delete('/deleteProcess', deleteProcess);
routerActivos.post('/saveProcess', saveProcess);
routerActivos.post('/getActivesPerUbication', getAllActivesPerUbication);
routerActivos.post('/getComponentsPerType', getComponentsPerType);
routerActivos.get('/getAllFree', getAllActivesFree);
routerActivos.post('/getComponentsPerActive', getComponentsPerActive);
routerActivos.post('/getMantenimientosPerActive', getMantenimientosPerActive);

export default routerActivos;
