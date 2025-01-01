import { Request, Response } from 'express';
import Ubicaciones from '../models/Ubicaciones';

const getUbicaciones = async (req: Request, res: Response) => {
    try {
        const ubicaciones = await Ubicaciones.findAll({
            attributes: ['id_ubi', 'name_ubi', 'floor_ubi'],
            include: [
                {
                    association: 'edificio',
                    attributes: ['name_edi'],
                }
            ],
            raw: true,
            nest: true,
        });

        if (ubicaciones.length === 0) throw new Error('No existen ubicaciones');

        res.status(200).json({ data: ubicaciones });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener ubicaciones: ${(error as Error).message}` });
    }
};

export { getUbicaciones };

