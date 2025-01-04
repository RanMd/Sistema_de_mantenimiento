import { Request, Response } from 'express';
import Componente from '../models/componente';
import { Activo } from '../models/Activos';

const getComponentes = async (req: Request, res: Response) => {
    try {
        const componentes = await Componente.findAll({
            attributes: ['id_comp', 'name_comp'],
            include: [
                {
                    association: 'activo',
                    attributes: ['name_act', 'code_act', 'state_act'],
                }
            ],
            raw: true,
            nest: true,
        });

        if (componentes.length === 0) throw new Error('No existen componentes');

        res.status(200).json({ data: componentes });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener componentes: ${(error as Error).message}` });
    }
};

export { getComponentes };
