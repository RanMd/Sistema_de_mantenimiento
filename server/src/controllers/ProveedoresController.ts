import { Request, Response } from 'express';
import Proveedores from '../models/Proveedores'; // Tu modelo de Proveedores

export const getProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await Proveedores.findAll({
            attributes: ['id_pro', 'nom_pro', 'gar_pro'], // Seleccionar solo los campos necesarios
        });
        res.json(proveedores);
    } catch (error: unknown) {
        res.status(500).json({ message: 'Error al obtener proveedores' + error});
    }
};
