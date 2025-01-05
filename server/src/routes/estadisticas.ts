import { Router } from 'express';
import {
    getTotalMantenimientos,
    getTotalMantenimientosByState,
    getTotalMantenimientosByUser,
    getTotalActivos,
    getTotalActivosPorEstado,
    getTotalActivosPorTipo,
    getTotalMantenimientosPorTipo,
    getTotalComponentesUsados,
    getAverageMaintenanceDuration,
} from '../controllers/estadisticas';


const router = Router();

router.get('/total', getTotalMantenimientos);
router.get('/estado', getTotalMantenimientosByState);
router.get('/usuario', getTotalMantenimientosByUser);
router.get('/total-activos', getTotalActivos);
router.get('/por-estado', getTotalActivosPorEstado);
router.get('/tipos', getTotalActivosPorTipo);
router.get('/mantenimientos-por-tipo', getTotalMantenimientosPorTipo);
router.get('/componentes-usados', getTotalComponentesUsados);
router.get('/time', getAverageMaintenanceDuration);

export default router;
