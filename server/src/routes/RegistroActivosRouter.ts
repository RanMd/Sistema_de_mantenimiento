import { Router } from "express";
import {
    getRegistroActivos,
    createRegistroActivo,
} from "../controllers/RegistroActivosController";

const registroActivosRouter = Router();

registroActivosRouter.get("/", getRegistroActivos);
registroActivosRouter.post("/", createRegistroActivo);

export default registroActivosRouter;
