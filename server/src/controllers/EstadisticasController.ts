import { Request, Response } from 'express';
import { ProcesoCompra, MarcaActivo, TypeActive } from '../models/Activos';
import { Activo } from '../models/Activo'
import Ubicaciones from '../models/Ubicaciones'
import Mantenimiento from '../models/Mantenimientos';
import moment from 'moment';

// En tu controlador del backend:
export const getActivos = async (req: Request, res: Response) => {
    try {
        const activos = await Activo.findAll({
            attributes: ['id_act', 'name_act', 'code_act', 'state_act', 'in_maintenance'],
            include: [
                {
                    model: Ubicaciones,
                    as: 'ubication',
                    attributes: ['name_ubi'],
                },
                {
                    model: MarcaActivo,
                    as: 'marca',
                    attributes: ['name_fab'],
                },
                {
                    model: TypeActive,
                    as: 'category',
                    attributes: ['name_type'],
                },
                {
                    model: ProcesoCompra,
                    as: 'buy_process',
                    attributes: ['date_proc'],
                },
            ],
        });

        // Mapear los resultados para formatear la fecha
        const activosFormateados = activos.map((activo) => {
            return {
                id_act: activo.id_act,
                name_act: activo.name_act,
                code_act: activo.code_act,
                ubication_act: activo.ubication.name_ubi,
                state_act: activo.state_act,
                brand_act: activo.marca.name_fab,
                type_act: activo.category.name_type,
                buy_process_act: moment(activo.buy_process.date_proc).format('YYYY-MM-DD'), // Formato de fecha
                in_maintenance: activo.in_maintenance,
            };
        });

        res.json(activosFormateados); // Devolver los datos formateados
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los activos', error });
    }
};


export const getMantenimientos = async (req: Request, res: Response) => {
    try {
        const mantenimientos = await Mantenimiento.findAll({
            attributes: [
                'num_mant',
                'code_mant',
                'type_attendant_mant',
                'attendant_mant',
                'date_start_mant',
                'date_end_mant',
                'state_mant',
            ],
        });

        // Mapear los resultados para transformarlos
        const mantenimientosFormateados = mantenimientos.map((mant) => {
            // Convertir state_mant a número usando Number()
            const estadoFormateado = Number(mant.state_mant) === 1 ? 'Abierto' : 'Cerrado';

            // Loguear el estado de cada mantenimiento
            console.log(`Mantenimiento ${mant.num_mant} - Estado: ${estadoFormateado}`);

            return {
                num_mant: mant.num_mant,
                code_mant: mant.code_mant,
                type_attendant_mant: mant.type_attendant_mant,
                attendant_mant: mant.attendant_mant, // Nombre del atendiente
                date_start_mant: mant.date_start_mant,
                date_end_mant: mant.date_end_mant,
                state_mant: estadoFormateado, // Transformación del estado
            };
        });

        res.json(mantenimientosFormateados); // Devolver los datos formateados
    } catch (error) {
        console.error('Error al obtener mantenimientos:', error);
        res.status(500).json({ message: 'Error al obtener los mantenimientos', error });
    }
};