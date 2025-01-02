import { Router } from 'express';
import { deleteActive, deleteProcess, getActivo, getAllActives, getAllActivesPerUbication, getBrandsPerCategory, getCategories, getLastId, getLastIdProcess, getProcesses, getTypes, getTypesPerCategory, saveActive, saveProcess } from '../controllers/ActivosController';

const routerActivos = Router();

routerActivos.post('/get', getActivo);
routerActivos.get('/getAll', getAllActives);
routerActivos.get('/categories', getCategories);
routerActivos.post('/types', getTypesPerCategory);
routerActivos.get('/typesAll', getTypes);
routerActivos.post('/brands', getBrandsPerCategory);
routerActivos.get('/last', getLastId);
routerActivos.get('/lastIdProcess', getLastIdProcess);
routerActivos.post('/save', saveActive);
routerActivos.get('/processes', getProcesses);
routerActivos.delete('/delete', deleteActive);
routerActivos.delete('/deleteProcess', deleteProcess);
routerActivos.post('/saveProcess', saveProcess);
routerActivos.post('/getActivesPerUbication', getAllActivesPerUbication);

export default routerActivos;
