import { Request, Response } from "express";
import Ubicaciones from "../models/Ubicaciones"; // Tu modelo de Ubicaciones

export const getUbicaciones = async (req: Request, res: Response) => {
    try {
        const ubicaciones = await Ubicaciones.findAll({
            attributes: ["id_ubi", "edi_ubi", "piso_ubi", "num_lab_ubi"], // Seleccionar los campos necesarios
        });
        res.json(ubicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener ubicaciones" });
    }
};
