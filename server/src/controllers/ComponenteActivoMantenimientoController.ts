import { Request, Response } from 'express';
import ComponenteActivoMantenimiento from '../models/ComponenteActivoMantenimiento';


const getComponentesActivosMantenimiento = async (req: Request, res: Response) => {
    try {
        const detalles = await ComponenteActivoMantenimiento.findAll({
            attributes: ['id_com_per', 'activo_per', 'num_mant_per'],
            include: [
                {
                    association: 'componente',
                    attributes: ['name_comp'], // Atributos relevantes de la tabla componente
                },
                {
                    association: 'activo',
                    attributes: ['name_act', 'code_act'], // Atributos relevantes de la tabla activo
                },
                {
                    association: 'mantenimiento',
                    attributes: ['start_mant', 'end_mant', 'state_mant'], // Atributos relevantes de la tabla mantenimiento
                }
            ],
            raw: true,
            nest: true,
        });

        if (detalles.length === 0) throw new Error('No existen componentes asociados a activos en mantenimiento');

        res.status(200).json({ data: detalles });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener componentes activos en mantenimiento: ${(error as Error).message}` });
    }
};

export { getComponentesActivosMantenimiento };
