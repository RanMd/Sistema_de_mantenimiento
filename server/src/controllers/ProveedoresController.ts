import { Request, Response } from 'express';
import Proveedores from '../models/Proveedores';

const getProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await Proveedores.findAll();
        res.status(200).json({ data: proveedores });
    } catch (error: unknown) {
        res.status(500).json({ message: 'Error al obtener proveedores' + error});
    }
};

export { getProveedores};
