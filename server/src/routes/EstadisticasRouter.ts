import { Router } from 'express';
import { getActivos, getMantenimientos } from '../controllers/EstadisticasController';  // Asegúrate de tener este archivo controlando la lógica

const router = Router();

// Ruta para obtener todos los activos
router.get('/activos', getActivos);
router.get('/mantenimientos', getMantenimientos);

export default router;
