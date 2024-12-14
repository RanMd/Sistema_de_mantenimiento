import { Request, Response } from "express";
import Responsables from "../models/Responsables"; // Tu modelo de Responsables

export const getResponsables = async (req: Request, res: Response) => {
    try {
        const responsables = await Responsables.findAll({
            attributes: ["id_res", "nom_res"], // Seleccionar solo los campos necesarios
        });
        res.json(responsables);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener responsables" });
    }
};
