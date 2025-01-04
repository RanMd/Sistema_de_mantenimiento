import { Router } from 'express';
import { getTotalComponentesUsados } from '../controllers/prueba';

const router = Router();

router.get('/componentes-usados', getTotalComponentesUsados);

export default router;
