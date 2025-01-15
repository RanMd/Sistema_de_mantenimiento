import { Request, Response } from 'express';
import ComponenteActivoMantenimiento from '../models/ComponenteActivoMantenimiento';

export const getTotalComponentesUsados = async (_req: Request, res: Response) => {
    try {
        const totalComponentes = await ComponenteActivoMantenimiento.count();
        res.status(200).json({ totalComponentes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total componentes usados', error });
    }
};
