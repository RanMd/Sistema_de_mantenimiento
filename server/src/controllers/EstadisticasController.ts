import { Request, Response } from 'express';
import Mantenimiento from '../models/Mantenimiento';
import { Activo } from '../models/Activos';
import DetalleMantenimiento from '../models/DetalleMantenimiento';
import ComponenteActivoMantenimiento from '../models/ComponenteActivoMantenimiento';

export const getTotalMantenimientos = async (_req: Request, res: Response) => {
    try {
        const total = await Mantenimiento.count();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos', error });
    }
};

export const getTotalMantenimientosByState = async (_req: Request, res: Response) => {
    try {
        const totals = await Mantenimiento.findAll({
            attributes: ['state_mant', [Mantenimiento.sequelize!.fn('COUNT', Mantenimiento.sequelize!.col('state_mant')), 'count']],
            group: ['state_mant'],
        });

        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos by state', error });
    }
};

export const getTotalMantenimientosByUser = async (_req: Request, res: Response) => {
    try {
        const totals = await Mantenimiento.findAll({
            attributes: ['user_mant', [Mantenimiento.sequelize!.fn('COUNT', Mantenimiento.sequelize!.col('user_mant')), 'count']],
            group: ['user_mant'],
        });

        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos by user', error });
    }
};

export const getTotalActivos = async (_req: Request, res: Response) => {
    try {
        const total = await Activo.count();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total activos', error });
    }
};

// Obtener el total de activos por estado
export const getTotalActivosPorEstado = async (_req: Request, res: Response) => {
    try {
        const totals = await Activo.findAll({
            attributes: [
                'state_act',
                [Activo.sequelize!.fn('COUNT', Activo.sequelize!.col('state_act')), 'count'],
            ],
            group: ['state_act'],
        });
        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activos by state', error });
    }
};

// Obtener el total de activos por tipo
export const getTotalActivosPorTipo = async (_req: Request, res: Response) => {
    try {
        if (!Activo.sequelize) {
            throw new Error('Sequelize instance is undefined');
        }
        const activosPorTipo = await Activo.findAll({
            attributes: ['type_act', [Activo.sequelize.fn('COUNT', '*'), 'count']],
            group: ['type_act'],
        });

        res.status(200).json(activosPorTipo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activos por tipo', error });
    }
};

export const getTotalMantenimientosPorTipo = async (_req: Request, res: Response) => {
    try {
        if (!DetalleMantenimiento.sequelize) {
            throw new Error('Sequelize instance is undefined');
        }
        const mantenimientosPorTipo = await DetalleMantenimiento.findAll({
            attributes: [
                'type_mant',
                [DetalleMantenimiento.sequelize.fn('COUNT', '*'), 'count'],
            ],
            group: ['type_mant'],
        });

        res.status(200).json(mantenimientosPorTipo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mantenimientos por tipo', error });
    }
};

export const getTotalComponentesUsados = async (_req: Request, res: Response) => {
    try {
        const totalComponentes = await ComponenteActivoMantenimiento.count();
        res.status(200).json({ totalComponentes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total componentes usados', error });
        console.log(error);
    }
};

export const getAverageMaintenanceDuration = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Obtener los datos de los mantenimientos con fechas de inicio y fin válidas
        const mantenimientos = await Mantenimiento.findAll({
            attributes: ['start_mant', 'end_mant'],
            where: {
                end_mant: { $ne: null }, // Asegurar que el mantenimiento tiene una fecha de fin
            },
        });

        if (mantenimientos.length === 0) {
            res.status(200).json({
                message: 'No se encontraron mantenimientos con fechas válidas.',
                averageDuration: 0,
            });
            return;
        }

        // Calcular la duración total en días
        const totalDuration = mantenimientos.reduce((sum, mant) => {
            const startDate = mant.get('start_mant') as Date;
            const endDate = mant.get('end_mant') as Date;

            // Calcular la diferencia en días
            const durationInMs = endDate.getTime() - startDate.getTime();
            const durationInDays = durationInMs / (1000 * 60 * 60 * 24);

            return sum + durationInDays;
        }, 0);

        // Calcular el promedio
        const averageDuration = totalDuration / mantenimientos.length;

        res.status(200).json({
            message: 'Promedio calculado con éxito.',
            averageDuration: Number(averageDuration.toFixed(2)), // Redondear a 2 decimales
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error calculando el promedio de duración de los mantenimientos',
            error,
        });
    }
};