import { Router } from 'express';
import { saveActivo } from '../controllers/ActivosController';

const router = Router();

router.post('/', saveActivo);

export default router;
