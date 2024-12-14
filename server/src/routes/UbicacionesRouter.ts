import { Router } from "express";
import { getUbicaciones } from "../controllers/UbicacionesController";

const ubicacionesRouter = Router();

ubicacionesRouter.get("/", getUbicaciones);

export default ubicacionesRouter;
