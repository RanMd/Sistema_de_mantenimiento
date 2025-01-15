import { Router } from 'express';
import getComponentesPorActivo from '../controllers/componenteController';

const componentesRouter = Router();

componentesRouter.post('/componentes', getComponentesPorActivo);

export default componentesRouter;
