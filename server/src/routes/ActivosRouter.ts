import { Router } from 'express';
import { deleteActive, getActivo, getAllActives, getBrandsPerCategory, getCategories, getLastId, getProcesses, getTypes, getTypesPerCategory, saveActive } from '../controllers/ActivosController';

const routerActivos = Router();

routerActivos.post('/get', getActivo);
routerActivos.get('/getAll', getAllActives);
routerActivos.get('/categories', getCategories);
routerActivos.post('/types', getTypesPerCategory);
routerActivos.get('/typesAll', getTypes);
routerActivos.post('/brands', getBrandsPerCategory);
routerActivos.get('/last', getLastId);
routerActivos.post('/save', saveActive);
routerActivos.get('/processes', getProcesses);
routerActivos.delete('/delete', deleteActive);

export default routerActivos;
