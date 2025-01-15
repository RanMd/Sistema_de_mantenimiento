import { Request, Response } from 'express';
import DetalleMantenimiento from '../models/DetalleMantenimiento';

const createDetalleMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_mant, id_act, state_act, type_mant, comentario } = req.body;

        if (!num_mant || !id_act || !state_act || !type_mant) {
            res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados.' });
            return;
        }

        const nuevoDetalleMantenimiento = await DetalleMantenimiento.create({
            num_mant,
            id_act,
            state_act,
            type_mant,
            comentario,
        });

        res.status(201).json({ message: 'Detalle de mantenimiento creado con éxito.', data: nuevoDetalleMantenimiento });
    } catch (error) {
        res.status(500).json({ message: `Error al crear el detalle de mantenimiento: ${(error as Error).message}` });
    }
};

export { createDetalleMantenimiento };
