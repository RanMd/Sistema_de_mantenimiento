import { Request, Response } from 'express';
import Componente from '../models/componente';

const getComponentesPorActivo = async (req: Request, res: Response) => {
    try {
        console.log("Solicitud recibida con id_act:", req.body.id_act);  // Log para depurar
        const { id_act } = req.body;
        if (!id_act) {
            throw new Error('El ID del activo es obligatorio');
        }

        const componentes = await Componente.findAll({
            where: { id_act_per: id_act },
            attributes: ['id_comp', 'name_comp'],
            include: [
                {
                    association: 'activo',
                    attributes: ['name_act', 'code_act'],
                },
            ],
            raw: true,
            nest: true,
        });

        if (componentes.length === 0) {
            throw new Error('No existen componentes para este activo');
        }

        res.status(200).json({ data: componentes });
    } catch (error) {
        res.status(500).json({
            message: `Error al obtener componentes: ${(error as Error).message}`,
        });
    }
};

export default getComponentesPorActivo;
