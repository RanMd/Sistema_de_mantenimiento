import { Request, Response } from 'express';
import DetalleMantenimiento from '../models/DetalleMantenimiento';
import Mantenimiento from '../models/Mantenimiento';
import { Activo } from '../models/Activos';

const getDetallesMantenimiento = async (req: Request, res: Response) => {
    try {
        const detalles = await DetalleMantenimiento.findAll({
            attributes: ['num_mant', 'id_act', 'state_act', 'type_mant', 'comentario'],
            include: [
                {
                    association: 'mantenimiento',
                    attributes: ['start_mant', 'end_mant', 'state_mant'], // Atributos relevantes del mantenimiento
                },
                {
                    association: 'activo',
                    attributes: ['name_act', 'code_act'], // Atributos relevantes del activo
                },
            ],
            raw: true,
            nest: true,
        });

        if (detalles.length === 0) throw new Error('No existen detalles de mantenimiento');

        res.status(200).json({ data: detalles });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener detalles de mantenimiento: ${(error as Error).message}` });
    }
};

export { getDetallesMantenimiento };
