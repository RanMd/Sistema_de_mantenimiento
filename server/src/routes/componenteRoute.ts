import { Router } from 'express';
import { getComponentes } from '../controllers/componenteController';

const componenteRouter = Router();

componenteRouter.get('/', getComponentes);

export default componenteRouter;
