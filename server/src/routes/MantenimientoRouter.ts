import { Router } from 'express';
import {
    getAllMantenimientos,
    getMantenimientosByFilter,
    getTotalMantenimientos,
    getTotalMantenimientosByState,
    getTotalMantenimientosByUser,
} from '../controllers/MantenimientoController';

const router = Router();

router.get('/todos', getAllMantenimientos);
router.get('/filtro', getMantenimientosByFilter);
router.get('/total', getTotalMantenimientos);
router.get('/estado', getTotalMantenimientosByState);
router.get('/usuario', getTotalMantenimientosByUser);

export default router;
