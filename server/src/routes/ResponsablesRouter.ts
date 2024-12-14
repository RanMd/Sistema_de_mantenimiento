import { Router } from "express";
import { getResponsables } from "../controllers/ResponsablesController";

const responsablesRouter = Router();

responsablesRouter.get("/", getResponsables);

export default responsablesRouter;
