import { Request, Response } from 'express';
import Activos from '../models/Activos';

export const saveActivo = async (req: Request, res: Response) => {
    try {
        const activo = await Activos.create(req.body);
        res.status(201).json(activo);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};