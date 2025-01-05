import { Request, Response } from 'express';
import ComponenteActivoMantenimiento from '../models/ComponenteActivoMantenimiento';

// Obtener datos
const getComponentesActivosMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const detalles = await ComponenteActivoMantenimiento.findAll({
            attributes: ['id_com_per', 'activo_per', 'num_mant_per'],
            include: [
                {
                    association: 'componente',
                    attributes: ['name_comp'],
                },
                {
                    association: 'activo',
                    attributes: ['name_act', 'code_act'],
                },
                {
                    association: 'mantenimiento',
                    attributes: ['start_mant', 'end_mant', 'state_mant'],
                },
            ],
            raw: true,
            nest: true,
        });

        if (detalles.length === 0) {
            res.status(404).json({ message: 'No existen componentes asociados a activos en mantenimiento' });
            return;
        }

        res.status(200).json({ data: detalles });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener datos: ${(error as Error).message}` });
    }
};

// Crear un nuevo registro
const createComponenteActivoMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_com_per, activo_per, num_mant_per } = req.body;

        if (!id_com_per || !activo_per || !num_mant_per) {
            res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            return;
        }

        const nuevoRegistro = await ComponenteActivoMantenimiento.create({
            id_com_per,
            activo_per,
            num_mant_per,
        });

        res.status(201).json({ message: 'Registro creado con éxito.', data: nuevoRegistro });
    } catch (error) {
        res.status(500).json({ message: `Error al guardar datos: ${(error as Error).message}` });
    }
};

export { getComponentesActivosMantenimiento, createComponenteActivoMantenimiento };
